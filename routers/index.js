const express = require('express');// 引入express
const router = express();// 创建实例

// 首页
router.get('/',(req,res)=>{
    /*
    // 获取cookie信息进行验证
    let userInfo = {};// 存cookie信息的空对象
    if(req.cookies.get('userInfo')){// 登录成功
        userInfo = JSON.parse(req.cookies.get('userInfo'));// 赋值 对象
    }
    */
    res.render('main/index',{
        userInfo:req.userInfo,// 把保存的信息携带到前台
    });
})
// 详情页
router.get('/detail',(req,res)=>{
    res.render('main/detail',{
        userInfo:req.userInfo,
    });
})
// 列表页
router.get('/list',(req,res)=>{
    res.render('main/list',{
        userInfo:req.userInfo,
    });
})


// 导出
module.exports = router;