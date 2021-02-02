(function($){
    $('.del').on('click',function(){
        // 删除操作的提示信息
        if(!window.confirm('您确定要删除吗?')){
            return false;
        }
    })
})(jQuery);