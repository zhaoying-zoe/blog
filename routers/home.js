const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');// 引入user注册文档模型
const hmac = require('../util/hmac');

const CommentModel = require('../models/comment');// 引入comment注册文档模型

//权限的验证
router.use((req, res, next) => {
    if (req.userInfo._id) {
        next();
    } else {
        return res.send('<h1>请登录</h1>');
    }
})

//显示普通用户后台首页
router.get("/", async (req, res) => {
    res.render('home/index', {
        userInfo: req.userInfo,
    })
})

//渲染评论列表
router.get('/comment', async (req, res) => {
    const result = await CommentModel.findPaginationComments(req, { user: req.userInfo._id })
    res.render('home/comment_list', {
        userInfo: req.userInfo,
        comments: result.docs,
        list: result.list,
        pages: result.pages,
        page: result.page,
        url: '/home/comment'
    })
})

//删除评论
router.get('/comment/delete/:id', async (req, res) => {
    const { id } = req.params
    try {
        // user: req.userInfo._id : 确保是本人删除了评论
        const result = await CommentModel.deleteOne({ _id: id, user: req.userInfo._id });
        // 判断是否能删除
        if (result.deletedCount == 0) {
            res.render('home/error', {
                userInfo: req.userInfo,
                message: '你无法删除该条评论',
                url: '/home/comment'
            })
        } else {
            res.render('home/success', {
                userInfo: req.userInfo,
                message: '删除评论成功',
                url: '/home/comment'
            })
        }
    } catch (e) {
        res.render('home/error', {
            userInfo: req.userInfo,
            message: '服务器端错误',
            url: '/home/comment'
        })
    }
})

//显示修改密码页面
router.get("/updataPwd", async (req, res) => {
    res.render('home/updataPwd', {
        userInfo: req.userInfo,
    })
})

//处理修改密码
router.post("/updataPwd", async (req, res) => {
    const { password } = req.body
    try {
        //修改密码
        await UserModel.updateOne({ _id: req.userInfo._id }, { password: hmac(password) })
        //退出登录
        req.session.destroy()
        res.render('home/success', {
            userInfo: req.userInfo,
            message: '修改密码成功,请重新登录',
            url: '/'
        })
    } catch (e) {
        res.render('home/error', {
            userInfo: req.userInfo,
            message: '服务器端错误',
            url: '/homes/password'
        })
    }
})

module.exports = router;