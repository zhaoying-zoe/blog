const express = require('express');// 引入express
const router = express();// 创建实例


const Comment = require('../models/comment');// 引入comment注册文档模型

// 引入处理时间的moment
const moment = require('moment');

const CategoryModel = require('../models/category');// 引入user注册文档模型
const ArticleModel = require('../models/article');// 引入user注册文档模型

// 获取共通数据
const getCommonData = async () => {
    // 分类数据
    const categoriesPromise = CategoryModel.find({}, "category_name");
    // 排行榜数据
    const topArticlesPromise = ArticleModel.find({}, "title click").sort({ click: -1 }).limit(10);
    const categories = await categoriesPromise;
    const topArticles = await topArticlesPromise;
    // return 一个对象(所有的共通数据)
    return {
        categories,
        topArticles,
    }
}

// 显示首页
router.get('/', async (req, res) => {
    /*
    // 获取cookie信息进行验证
    let userInfo = {};// 存cookie信息的空对象
    if(req.cookies.get('userInfo')){// 登录成功
        userInfo = JSON.parse(req.cookies.get('userInfo'));// 赋值 对象
    }
    */
    // 结构赋值接收返回的对象数据
    const { categories, topArticles, } = await getCommonData();
    // 获取首页分页数据
    const result = await ArticleModel.findArticles(req);
    res.render('main/index', {
        userInfo: req.userInfo,// 把保存的信息携带到前台
        categories,
        topArticles,
        articles: result.docs,
        list: result.list,
        pages: result.pages,
        page: result.page,
    });
})

// 处理首页分页数据
router.get("/articlesList", async (req, res) => {
    let query = {};
    let id = req.query.id;
    if (id) {
        query.category = id;
    }
    // 获取分类
    const result = await ArticleModel.findArticles(req, query);
    const docs = result.docs.map(item => {
        // 先把json对象转字符串,再转为json对象
        const obj = JSON.parse(JSON.stringify(item));
        // 重新设置时间格式,使前台能够正常显示时间
        obj.createdTime = moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss');
        return obj;
    })
    result.docs = docs;

    res.json({
        code: 0,
        message: '获取分页数据成功',
        data: result,
    })
})


//获取前台评论分页数据
router.get("/commentsList", async (req, res) => {
    let query = {}
    let id = req.query.id
    if (id) {
        query.article = id
    }
    //获取分类
    const result = await Comment.findPaginationComments(req, query)
    res.json({
        code: 0,
        message: '获取分页数据成功',
        data: result
    })
})


// 显示列表页
router.get('/list/:id', async (req, res) => {
    const { id } = req.params;//id是一个对象 id = {id:6023d2376be6fc4668f06ec1};
    const commonDataPromise = getCommonData();
    const articlesPromise = ArticleModel.findArticles(req, { category: id });
    const { categories, topArticles, } = await commonDataPromise;
    const result = await articlesPromise;
    res.render('main/list', {
        userInfo: req.userInfo,// 把保存的信息携带到前台
        categories,
        currentCategory: id,
        topArticles,
        articles: result.docs,
        list: result.list,
        pages: result.pages,
        page: result.page,
    });
})


// 显示详情页
router.get('/detail/:id', async (req, res) => {
    let { id } = req.params;
    const commonDataPromise = getCommonData();
    // { new: true } :返回更新后的数据   { $inc: { click: 1 } }的意思是,"click"的原有数值上面 +1
    const articlesPromise = ArticleModel.findOneAndUpdate({ _id: id }, { $inc: { click: 1 } }, { new: true })
        .populate({ path: 'user', select: 'username' })
        .populate({ path: 'category', select: 'category_name' })
    const { categories, topArticles, } = await commonDataPromise;
    const article = await articlesPromise;
    res.render('main/detail', {
        userInfo: req.userInfo,
        categories,
        currentCategory: article.category._id,
        topArticles,
        article,
    });
})



// 导出路由
module.exports = router;