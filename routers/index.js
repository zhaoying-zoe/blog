const express = require('express');// 引入express
const router = express();// 创建实例
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
    res.render('main/index', {
        userInfo: req.userInfo,// 把保存的信息携带到前台
        categories,
        topArticles,
    });
})


// 显示列表页
router.get('/list/:id', async (req, res) => {
    const id = req.params;//id是一个对象 id = {id:6023d2376be6fc4668f06ec1}
    const { categories, topArticles, } = await getCommonData();
    res.render('main/list', {
        userInfo: req.userInfo,// 把保存的信息携带到前台
        categories,
        currentCategory: id,
        topArticles,
    });
})


// 显示详情页
router.get('/detail', (req, res) => {
    res.render('main/detail', {
        userInfo: req.userInfo,
    });
})



// 导出路由
module.exports = router;