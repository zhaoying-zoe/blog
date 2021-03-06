const mongoose = require('mongoose');
const moment = require('moment');

// 引入共通分页函数
const pagination = require('../util/pagination');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'article'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
//定义虚拟字段
commentSchema.virtual('createdTime').get(function () {
    return moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss')
})

//静态方法
commentSchema.statics.findPaginationComments = async function (req, query) {
    const options = {
        page: req.query.page,
        projection: '-__v',
        model: this,
        query: query,
        populates: [{ path: 'user', select: 'username' }, { path: 'article', select: 'title' }]
    }
    const result = await pagination(options)
    //格式化时间,解决ajax请求格式化的时间获取不到的问题
    const docs = result.docs.map(item => {
        const obj = JSON.parse(JSON.stringify(item))
        obj.createdTime = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
        return obj
    })
    result.docs = docs
    return result
}

const CommentModel = mongoose.model('comment', commentSchema)

module.exports = CommentModel;