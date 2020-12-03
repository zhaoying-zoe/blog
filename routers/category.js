const express = require('express');// 引入express
const router = express();// 创建实例
const CategoryModel = require('../models/category');// 引入user注册文档模型
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

// 显示分类管理页面
router.get('/', (req,res) => {
    // 分类管理页面
    res.render('admin/category_list',{
        userInfo:req.userInfo,
    });
})

// 显示新增分类页面
router.get('/add', (req,res) => {
    // 新增分类页面
    res.render('admin/category_add',{
        userInfo:req.userInfo,
    });
})

// 处理新增分类
router.post('/add', (req,res) => {
    // 1.前台传递的获取参数
    const { name,order } = req.body;
    // 2.查找同名分类
    CategoryModel.findOne({name:name})
    .then(category => {
        // 2.1 如果存在同名,则返回错误页面
        if(category){
            res.render('admin/category_err',{
                message:'分类已经存在',
                url:'/category'
            })
        }
        // 2.2 如果不存在同名,则添加分类
        else{
            CategoryModel.insertMany({name:name,order:order})
            .then(categories => {
                res.render('admin/category_ok',{
                    message:'添加分类成功',
                    url:'/category'
                })
            })
            .catch(err => {
                let message = '分类名称不能为空';
                if(err.errors['name'].message){
                    message = err.errors['name'].message;
                }
                res.render('admin/category_err',{
                    message:message,
                    url:'/category'
                })
            })
        }
    })
    .catch(err => {
        res.render('admin/category_err',{
            message:'数据库操作失败',
            url:'/category'
        })
    })
})

// 导出路由
module.exports = router;