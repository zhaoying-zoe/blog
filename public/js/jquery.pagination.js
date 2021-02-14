; (function ($) {
    $.fn.extend({
        // 首页分页共同逻辑
        pagination: function (options) {
            return this.each(function () {
                // 1. 获取当前jq对象
                var $this = $(this);
                // 2. 点击事件
                $this.on('click', 'a', function () {
                    // 0. 获取当前页码 并 转为数字类型
                    var currentPage = $this.find('li.active a').html();
                    currentPage = parseInt(currentPage);
                    // 1. 获取当前jq对象
                    var $elem = $(this);
                    // 2. 获取上一页和下一页的文本
                    var labelText = $elem.attr('aria-label');
                    // 3. 需要请求的页码
                    var page = $elem.html();
                    // 4. 上一页
                    if (labelText == 'Previous') {
                        // 如果当前页码是0,则不能继续执行
                        if (currentPage == 1) {
                            return false;
                        }
                        page = currentPage - 1;
                    }
                    // 5. 下一页
                    else if (labelText == 'Next') {
                        // 获取最大页码,限制下一页(获取jq对象倒数第二个的html的值)
                        var pages = $this.find('a').eq(-2).html();
                        // 如果当前页码是最大页码,则停止继续执行
                        if (currentPage == pages) {
                            return false;
                        }
                        page = currentPage + 1;
                    }

                    // 6. 如果当前页是点击页的话,停止执行
                    if (currentPage == page) {
                        return false;
                    }
                    // 7. 发送ajax请求获取数据
                    $.ajax({
                        url: options.url,
                        data: {
                            page: page,
                        },
                        dataType: 'json',
                        success: function (result) {
                            $this.trigger('get-data', result.data);
                        }
                    })
                })
            })
        }
    })
})(jQuery)