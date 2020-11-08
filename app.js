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
// 引入express第三方插件body-parser
const bodyParser = require('body-parser');
// 引入cookie 保存用户状态信息
const Cookies = require('cookies');

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

/*------------------------配置body-parser中间件开始-------------------------*/
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
// post和put请求传递的参数都保存在req.body上
/*------------------------配置body-parser中间件结束-------------------------*/

/*------------------------利用中间件来生成cookie开始--------------------------*/
app.use('',(req,res,next) => {
	// 在req上生成cookie实例,这样所有的路由都可以通过req.cookie操作cookie
	req.cookies = new Cookies(req,res);
	// console.log(req.cookies); // 非常大的一个对象

	// 在中间件中 获取cookie信息进行验证
	let userInfo = {};// 存cookie信息的空对象
	if(req.cookies.get('userInfo')){// 登录成功
		userInfo = JSON.parse(req.cookies.get('userInfo'));// 赋值 对象
	}
	// 把cookie信息保存到req.userInfo上,这样的话所有的路由都能通过req.userInfo拿到用户状态信息
	req.userInfo = userInfo;
	
	next();
})


/*------------------------利用中间件来生成cookie结束--------------------------*/

// 用app.use(PATH,router对象)来使用导出的router对象
// 处理主页路由
app.use('/',require('./routers/index.js'));
// 处理注册、登陆路由
app.use('/user',require('./routers/user.js'));
// 
app.listen(port, () => {
    console.log(`server is running at http://127.0.0.1:${port}`);
})