// 引入mongoose
const mongoose = require('mongoose');

// 引入共通分页函数
const pagination = require('../util/pagination');

// 引入处理时间的moment
const moment = require('moment');

// 4.1生成文档模型
const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    intro: {
        type: String,
        default: '',
    },
    content: {
        type: String,
        default: '',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',// 关联集合
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    click: {
        type: Number,
        default: 0,
    }
})

//定义虚拟字段
ArticleSchema.virtual('createdTime').get(function () {
    // return new Date(this.createdAt).toLocaleString()
    return moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss')
})

// 静态方法
ArticleSchema.statics.findArticles = function (req, query) {
    const options = {
        page: req.query.page,
        projection: '-__v',
        sort: ({ category_order: 1 }),
        model: this,
        populates: [{ path: 'user', select: 'username' }, { path: 'category', select: 'category_name' }],
    }
    return pagination(options)
}


//2.根据文档模型生成集合
//2.1第一个参数代表着生成集合的名称(mongoose会自动将集合名称变成复数)
//2.2第二个参数就是传入定义的文档模型ArticleSchema
const ArticleModel = mongoose.model('article', ArticleSchema);

module.exports = ArticleModel;