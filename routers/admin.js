const express = require('express');// 引入express
const router = express();// 创建实例
const userModel = require('../models/user');// 引入user注册文档模型
const hmac = require('../util/hmac');

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

// 处理管理员页面
router.get('/', async (req,res) => {
    //获取用户总算
    const userCount = await userModel.estimatedDocumentCount();

    // 管理员页面
    res.render('admin/index',{
        userInfo:req.userInfo,
        userCount:userCount, // 用户总数
    });
})

// 处理管理员用户管理路由
router.get('/users',(req,res) => {
    // 
    userModel.find({},'-password')
    .then(data=>{
        // console.log(data);
        const users = data;
        res.render('admin/user_list',{
            userInfo:req.userInfo,
            users:users, // 返回用户列表
        })
    })
    .catch(err=>{
        console.log('get users err',err);
    })
})



// 导出路由
module.exports = router;