const express = require('express');// 引入express
const router = express();// 创建实例

// 处理注册路由
router.post('/register',(req,res)=>{
    console.log(req.body);
    // 1.获取参数信息
    // 2.数据库同名验证
    // 3.验证通过,插入数据

    res.json({
        code:0
    });
})


// 导出
module.exports = router;