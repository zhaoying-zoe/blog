
/* 传入的变量参数 */
/*
    page:当前页
    model:需要处理的模型
    query:查询条件
    sort:排序
    projection:投影
*/

async function pagination(options){
    // 分页分析:
    // 前提条件:得知道获取第几页,前台发送参数    page = req.query.page
    // 约定:每一页显示多少条数据                limit = 2
    // 
    // 第1页 显示 第 1 2 跳过 0 条 skip(0)
    // 第2页 显示 第 3 4 跳过 2 条 skip(0)
    // 第3页 显示 第 5 6 跳过 4 条 skip(0)
    // 第n页 跳过 skip =  (page - 1) * limit 条

    // 获取前台传送的页码(前台传过来的是字符串,需转为数字) 如果前台不传参数或者传的参数不是数字,则需要容错处理
    let { page, limit: limit = 3, query: query = {}, projection: projection = "", sort: sort={_id:-1}, model } = options

    page = parseInt(page)

    if (isNaN(page)) {
        page = 1
    }
    if (page < 0) {
        page = 1
    }

    //计算总页数
    const total = await model.countDocuments(query)
    const pages = Math.ceil(total / limit)
    //没有数据的处理
    if (pages == 0){
        return {
            docs:[],
            list:[],
            pages:0,
            page:0
        }
    }
    if (page > pages) {
        page = pages
    }
    //根据请求的页码计算需要显示的数据
    /*
        假设有6条数据,每页显示2条,limit = 2
        page=1 需要显示第1,2, skip(0) limit(2)
        page=2 需要显示第3,4, skip(2) limit(2)
        page=3 需要显示第5,6, skip(4) limit(2)
        通过观察:
        skip((page-1)*limit)
    */
    //计算需要跳过的条数
    const skip = (page - 1) * limit

    //页码列表
    const list = []
    for (let i = 1; i <= pages; i++) {
        list.push(i)
    }
    //获取当前页码的用户数据
    const docs = await model.find(query, projection).sort(sort).skip(skip).limit(limit)    

    return {
        docs,
        list,
        pages,
        page
    }
}


module.exports = pagination;