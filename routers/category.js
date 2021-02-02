const express = require('express');// 引入express
const router = express();// 创建实例
const CategoryModel = require('../models/category');// 引入user注册文档模型
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
router.get('/', (req,res) => {
    const options = {
        page:req.query.page,
        model:CategoryModel,
        query:{},
        sort:({category_order:1}),
        projection:'-password -__v',
    }
    pagination(options)
    .then(data => {
        // 新增分类页面
        res.render('admin/category_list',{
            userInfo:req.userInfo,
            categories:data.docs, // 返回用户列表
            page:data.page,// 返回当前页
            list:data.list,// 返回分页个数
            pages:data.pages,// 返回总页数
            url:'/category'
        });
    })
    .catch(err=>{
        console.log('get users err',err);
    })
})

// 显示新增分类页面
router.get('/add', (req,res) => {
    // 新增分类页面
    /*
    res.render('admin/category_add',{
        userInfo:req.userInfo,
    });
    */
    res.render('admin/category_add_edit',{
        userInfo:req.userInfo,
    });
})


// 处理新增分类
router.post('/add', (req,res) => {
    // 1.前台传递的获取参数
    let { category_name,category_order } = req.body;
    // 如果前台参数没有值,则给前台的参数一个默认的值
    if(!category_order){
        category_order = 0;
    }
    // 2.查找同名分类
    CategoryModel.findOne({category_name:category_name})
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
            CategoryModel.insertMany({category_name:category_name,category_order:category_order})
            .then(categories => {
                res.render('admin/category_ok',{
                    userInfo:req.userInfo,
                    message:'添加分类成功',
                    url:'/category'
                })
            })
            .catch(err => {
                let message = '分类名称不能为空';
                if(err.errors['category_name'].message){
                    message = err.errors['category_name'].message;
                }
                res.render('admin/category_err',{
                    userInfo:req.userInfo,
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


// 显示编辑分类页面
router.get('/edit/:id', async (req,res) => {
    // 获取分类名称id
    const { id } = req.params;
    const category = await CategoryModel.findOne({_id:id},"-__v");
    // 新增分类页面
    /*
    res.render('admin/category_edit',{
        userInfo:req.userInfo,
        category:category,
    });
    */
    res.render('admin/category_add_edit',{
        userInfo:req.userInfo,
        category:category,
    });
})

// 显示编辑分类页面
router.post('/edit', async (req,res) => {
    // 获取分类名称、排序、id
    const { category_name,category_order,category_id } = req.body;
    try {
        // 1 判断名称和排序是否都有更改
        const category1 = await CategoryModel.findOne({_id:category_id},"-__v");
        if(category1.category_name == category_name && category1.category_order == category_order){
            return res.render('admin/category_err',{
                userInfo:req.userInfo,
                message:'请求修改内容后台再提交',
                url:'/category'
            })
        }
        // 2 判断更新后的名称是否存在
        // 先判断是否有同名的数据,再判断排序是否更改
        const category2 = await CategoryModel.findOne({category_name:category_name,_id:{$ne:category_id}});
        if(category2){
            return res.render('admin/category_err',{
                userInfo:req.userInfo,
                message:'该分类名称已存在',
                url:'/category'
            })
        }
        // 3 更新编辑
        await CategoryModel.updateOne({_id:category_id},{category_name,category_order})
        res.render('admin/category_ok',{
            userInfo:req.userInfo,
            message:'修改分类成功',
            url:'/category'
        })
    } catch (e) {
        res.render('admin/category_err', {
            userInfo: req.userInfo,
            message: '服务器端错误',
            url: '/category'
        })
    }

})

// 处理删除分类
router.get('/delete/:id', async (req,res) => {
    const { category_id } = req.params;
    try {
        await CategoryModel.deleteOne({_id:category_id});
        res.render('admin/category_ok',{
            userInfo:req.userInfo,
            message:'删除分类成功',
            url:'/category'
        })
    } catch (error) {
        res.render('admin/category_err', {
            userInfo: req.userInfo,
            message: '服务器端错误',
            url: '/category'
        })
    }
})

// 导出路由
module.exports = router;