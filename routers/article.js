const express = require('express');// 引入express
const router = express();// 创建实例

const multer = require('multer');//富文本相关
const upload = multer({ dest: 'public/uploads/' });

const ArticleModel = require('../models/article');// 引入article注册文档模型
const CategoryModel = require('../models/category');// 引入category注册文档模型
const pagination = require('../util/pagination');// 引入共通分页函数

// 利用中间件验证管理员权限
router.use('/', (req, res, next) => {
    // 验证管理员权限
    if (req.userInfo.isAdmin) {
        next();
    } else {
        // res.send('request err ');
        res.render('admin/err', {
            // 把保存的信息携带到前台
        });
    }
})

//显示文章列表
router.get("/", async (req, res) => {
    /*
        const options = {
        page: req.query.page,
        projection: '-__v',
        sort: { order: 1 },
        model: ArticleModel
        }
        const data = await pagination(options)
    */
    const data = await ArticleModel.findArticles(req);
    res.render('admin/article_list', {
        userInfo: req.userInfo,
        articles: data.docs,
        list: data.list,
        pages: data.pages,
        page: data.page,
        url: '/article'
    })
})

//显示添加文章页面
router.get("/add", async (req, res) => {
    const categories = await CategoryModel.find({}, "-__v -order").sort({ order: -1 })
    res.render('admin/article_add_edit', {
        userInfo: req.userInfo,
        categories
    })
})

//处理上传图片
router.post("/uploadImage", upload.single('upload'), async (req, res) => {
    // req.file is the `upload` file
    const filename = "/uploads/" + req.file.filename;
    res.json({
        uploaded: true,
        url: filename
    })
})

//处理新增文章
router.post("/add", async (req, res) => {
    const { title, category, intro, content } = req.body
    const user = req.userInfo._id
    try {
        await ArticleModel.insertMany({
            title,
            category,
            intro,
            content,
            user
        })
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '添加文章成功',
            url: '/article'
        })
    } catch (e) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '服务器端错误',
            url: '/article'
        })
    }
})

//显示编辑文章页面
router.get("/edit/:id", async (req, res) => {
    const { id } = req.params
    // 继发关系 更高效一点
    const categoriesPromise = CategoryModel.find({}, "-__v -order").sort({ order: 1 })
    const articlePromise = ArticleModel.findOne({ _id: id }, "title category intro content")
    const categories = await categoriesPromise
    const article = await articlePromise
    res.render('admin/article_add_edit', {
        userInfo: req.userInfo,
        categories,
        article
    })
})

//处理编辑文章
router.post("/edit", async (req, res) => {
    const { title, intro, category, content, id } = req.body
    try {
        //更新
        await ArticleModel.updateOne({ _id: id }, { title, intro, category, content })
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改文章成功',
            url: '/article'
        })
    } catch (e) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '服务器端错误',
            url: '/article'
        })
    }
})

// 处理删除文章
router.get('/delete/:id', async (req, res) => {
    // 这里的定量id与 路由里的/delete/:id 那个id的名称应一样 否则无法删除
    const { id } = req.params;
    try {
        await ArticleModel.deleteOne({ _id: id });
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除分类成功',
            url: '/article'
        })
    } catch (error) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '服务器端错误',
            url: '/article'
        })
    }
})


// 导出路由
module.exports = router;