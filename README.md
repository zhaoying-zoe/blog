# blog
blog for ZY

## Technology stack
### nodejs 充当后台服务
### express 用来搭建后台 (路由模块化)
### body-parser (express第三方插件,处理post和put请求 传递的参数)
### mongoose 
### Bootstrap@3 前台UI框架
### jquery@3
### swig模板引擎
### 保存用户状态信息:利用中间件插件生成cookies并存到req.cookies上
### moment:格式化日期(能把日期正常显示)

## Folder description
### views: 模板
### routers: 处理路由
### models: 定义文档模型
### db: 数据库
### public: 静态资源文件夹




## 处理编辑分类|文章：
### 1. 给后台传相应的id(某篇文章的id或者分类的id)
### 2. 后台接收id然后返回此id的相关数据给前台
### 3. 前台修改后进行提交
### 4. 后台根据相关

## 分页相关
### 前台分页:ajax请求
### 后台(管理员页面)分页:路由article?page=2;

## 删除评论
### 1. 确实是使用本人账号删除评论
###     // user: req.userInfo._id : 确保是本人删除了评论
###     const result = await CommentModel.deleteOne({ _id: id, user: req.userInfo._id });