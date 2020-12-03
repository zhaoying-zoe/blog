
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
        let { page,model,query,sort,projection } = options;
        page = parseInt(page)
        if(isNaN(page)){ // 容错处理
            page = 1
        }
        //上一页边界控制
        if(page == 0){
            page = 1
        }
        // 限制条数
        const limit = 3;
    
        let counts = await model.countDocuments();
    
        // 下一页边界控制
        const pages = Math.ceil(counts / limit);// 统计共有多少页数据 向上取整
        
        if(page >= pages){
            page = pages;
        }

        // 定义跳过条数
        const skip = (page - 1) * limit;
        // 定义前台显示多少页按钮
        let list = [];
        for(let i = 1;i<=pages;i++){
            list.push(i);
        }
        
        // 显示用户信息
        let docs = await model.find(query,projection).sort(sort).limit(limit).skip(skip);

        // 返回数据
        return {
            docs:docs, // 返回查询的数据(如:用户列表数据,分类列表数据)
            page:page,// 返回当前页
            list:list,// 返回分页个数
            pages:pages,// 返回总页数
        }
}


module.exports = pagination;