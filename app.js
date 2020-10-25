// 引入express
const express = require('express');
// 创建express实例
const app = express();
// 引入mongoose(数据库相关)
const mongoose = require('mongoose');
// 引入jq
const jQuery = require('jQuery');
// 引入bootstrap
// const bootstrap = require('bootstrap');
// 定义端口号
const port = 3000;

// 处理静态资源
app.use(express.static('public'));


// 处理主页路由
// app.use('/',require('./routers/index.js'))

// 
app.listen(port, () => console.log('server is running in http://127.0.0.1:3000'))