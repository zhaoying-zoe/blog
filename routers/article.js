const express = require('express');// 引入express
const router = express();// 创建实例
const ArticleModel = require('../models/article');// 引入user注册文档模型
const pagination = require('../util/pagination');// 引入共通分页函数

// 利用中间件验证管理员权限
router.use('/',(req,res,next) => {
    // 验证管理员权限
    if(req.userInfo.isAdmin){
        next();
    }else{
        // res.send('request err ');
        res.render('admin/err',{
            // 把保存的信息携带到前台
        });
    }
})

// 显示分类管理页面
//显示文章列表
router.get("/", async (req, res) => {
    const options = {
        page: req.query.page,
        projection: '-__v',
        sort: { order: 1 },
        model: ArticleModel
    }
    const data = await pagination(options)
    res.render('admin/article_list', {
        userInfo: req.userInfo,
        articles: data.docs,
        list: data.list,
        pages: data.pages,
        page: data.page,
        url: '/article'
    })
})



// 导出路由
module.exports = router;