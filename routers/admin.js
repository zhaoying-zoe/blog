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

// 处理用户管理路由
router.get('/users',(req,res) => {
    // 分页分析:
    // 前提条件:得知道获取第几页,前台发送参数    page = req.query.page
    // 约定:每一页显示多少条数据                limit = 2
    // 
    // 第1页 显示 第 1 2 跳过 0 条 skip(0)
    // 第2页 显示 第 3 4 跳过 2 条 skip(0)
    // 第3页 显示 第 5 6 跳过 4 条 skip(0)
    // 第n页 跳过 skip =  (page - 1) * limit 条

    // 获取前台传送的页码(前台传过来的是字符串,需转为数字) 如果前台不传参数或者传的参数不是数字,则需要容错处理
    let page = req.query.page;
    page = parseInt(page)
    if(isNaN(page)){ // 容错处理
        page = 1
    }
    //上一页边界控制
	if(page == 0){
		page = 1
	}
    // 限制条数
    const limit = 2;



    // 下一页边界控制
    userModel.countDocuments((err,counts) => {
        const pages = Math.ceil(counts / limit);// 统计共有多少页数据 向上取整
        
        if(page >= pages){
            page = pages;
        }

        // 定义跳过条数
        const skip = (page - 1) * limit;
        // 定义前台显示多少页按钮
        let list = [];
        for(let i = 1;i<=pages;i++){
            list.push(i);
        }
        
        // 显示用户信息
        userModel.find({},'-password')
        .limit(limit)
        .skip(skip)
        .then(data=>{
            // console.log(data);
            const users = data;
            res.render('admin/user_list',{
                userInfo:req.userInfo,
                users:users, // 返回用户列表
                page:page,// 返回当前页
                list:list,// 返回分页个数
            })
        })
        .catch(err=>{
            console.log('get users err',err);
        })
    })



})



// 导出路由
module.exports = router;