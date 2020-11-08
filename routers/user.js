const express = require('express');// 引入express
const router = express();// 创建实例
const userModel = require('../models/user');// 引入user注册文档模型
const hmac = require('../util/hmac');

// 处理注册路由
router.post('/register',(req,res) => {
    // 1.获取参数信息
    const { username,password } = req.body;
    // 2.数据库同名验证
    userModel.findOne({username:username})
    .then(user=>{
        // 数据库查找成功
        if(user){ // 数据库有该用户
            res.json({
                code:10,
                message:'该用户已被注册,请重新输入用户名'
            })
        }else{ // 数据库没有该用户
            // 3.验证通过,插入数据
            userModel.insertMany({
                username:username,
                password:hmac(password)
            })
            .then(result=>{
                res.json({
                    code:0,
                    message:'注册成功.',
                    user:result,
                })
            })
            .catch(err=>{
                console.log(err);
                res.json({
                    code:10,
                    message:'数据库操作失败,请稍后再试'
                })
            })
        }
    })
    .catch(err=>{ // 数据库查找失败
        console.log(err);
        res.json({
            code:10, // 无论成功还是失败,都返回状态码
            message:'数据库操作失败,请稍后再试.'
        })
    })
})

// 处理登陆路由
router.post('/login',(req,res) => {
    // 1.获取参数信息
    const { username,password } = req.body;
    // 2.查询数据库是否有该用户
    userModel.findOne({username,password:hmac(password)},'-password')
    .then(result => { // 数据库有该用户
        if(result){
            // 用户登录成功时生成cookie 
            // set是设置:set(键,值) 需要把值从对象转化为字符串
            req.cookies.set('userInfo',JSON.stringify(result));

            
            res.json({
                code:0,
                message:'用户登录成功',
                user:result // 把用户信息返回前台
            })
        }else{
            res.json({
                code:10,
                message:'用户名或密码错误,请重新输入'
            })
        }
    })
    .catch(err => { // 数据库没有该用户
        console.log(err);
        res.json({
            code:10, // 无论成功还是失败,都返回状态码
            message:'数据库操作失败,请稍后再试.'
        })
    })
})

// 导出
module.exports = router;