// 引入express
const express = require('express');
// 创建express实例
const app = express();
// 引入mongoose(数据库相关)
const mongoose = require('mongoose');
// 引入swig模板引擎
const swig = require('swig')
// 定义端口号
const port = 3000;

// express处理静态资源①
app.use(express.static('public'));
// express处理静态资源②
// 'static' 是指虚拟路径  在前台访问时应输入 '/static/index' 
// app.use('static',express.static('public'));

/* -----------------------连接数据库开始------------------------ */
// 连接到数据库
mongoose.connect('mongodb://127.0.0.1:27017/blog', {useNewUrlParser: true,useUnifiedTopology: true});
//生成db
// mongoose.set('useFindAndModify', false);
const db = mongoose.connection;
//连接数据库失败
db.on('error', (err)=>{
	console.log('connect mongodb err::',err)
	throw err;
});
//连接数据库成功
db.once('open', function() {
  	console.log('connect mongodb success !!');
})
/* -----------------------连接数据库结束------------------------ */

/* -----------------------配置模板引擎开始-------------------------- */
// 1.设置缓存
//开发阶段设置不走缓存
swig.setDefaults({
	cache: false
})
//2.配置应用模板
// 第一个参数是模板名称,同时也是模板文件的扩展名
// 第二个参数是解析模板的方法
app.engine('html', swig.renderFile);
//3.配置模板的存放目录
// 第一参数必须是views
// 第二个参数是模板存放的目录
app.set('views', './views')
//4.注册模板引擎
// 第一个参数必须是view engine
// 第二个参数是模板名称,也就是app.engine的第一个参数
app.set('view engine', 'html')
/* -----------------------配置模板引擎结束-------------------------- */

// 用app.use(PATH,router对象)来使用导出的router对象
// 处理主页路由
app.use('/',require('./routers/index.js'));

// 
app.listen(port, () => {
    console.log(`server is running at http://127.0.0.1:${port}`);
})