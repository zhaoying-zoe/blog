const express = require('express');
const router = express();

// 首页
router.get('/',(req,res)=>{
    res.render('main/index',{

    });
})
// 详情页
router.get('/detail',(req,res)=>{
    res.render('main/detail',{

    });
})
// 列表页
router.get('/list',(req,res)=>{
    res.render('main/list',{

    });
})


// 导出
module.exports = router;