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
router.use('/',(req,res) => {
    // 管理员页面
    res.send('this is admin page');
})


// 导出路由
module.exports = router;