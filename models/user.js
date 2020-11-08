// 引入mongoose
const mongoose = require('mongoose');
// 4.1生成文档模型
const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'用户名数据不能为空'],
        minlength:[2,'用户名的长度最少为3个字符'],
        maxlength:[10,'用户名的长度最多为10个字符']
    },
    password:{
        type:String,
        required:[true,'密码数据不能为空'],
        minlength:[2,'用户名的长度最少为3个字符'],
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
})

//2.根据文档模型生成集合
//2.1第一个参数代表着生成集合的名称(mongoose会自动将集合名称变成复数)
//2.2第二个参数就是传入定义的文档模型UserSchema
const UserModel = mongoose.model('user',UserSchema);

module.exports = UserModel;