; (function ($) {
    // 1. 登录注册面板切换
    const $userLogin = $('#form-login');// 登陆面板
    const $userInfo = $('#user-info');// 用户面板
    const $userRegister = $('#form-registered');// 注册面板
    // 1.1 登陆 > 注册
    $('#register').on('click', function () {
        // 登陆面板隐藏
        $userLogin.hide();
        // 注册面板显示
        $userRegister.show();
    })
    // 1.2 注册 > 登陆
    $('#login').on('click', function () {
        // 登陆面板隐藏
        $userRegister.hide();
        // 注册面板显示
        $userLogin.show();
    })

    // 2. 用户注册逻辑
    // 用户名是以字母开头3-10位字符(包括下划线,字母,数字);
    const usernameReg = /^[a-z][a-z0-9_]{2,9}$/i;
    // 密码是3-6位任意字符
    const passwordReg = /^\w{3,6}$/i;
    $('#submit-register').on('click', function () {
        // 2.1 获取注册信息
        let username = $userRegister.find('[id="username"]').val();// 用户名
        let password = $userRegister.find('[id="password1"]').val();// 密码
        let rePassword = $userRegister.find('[id="password2"]').val();// 重复密码
        let $errMsg = $userRegister.find('.err');
        let err = '';
        // 2.2 验证数据合法性
        // 提示文本的对齐方式为center
        $errMsg.css('text-align', 'center');
        //验证用户名
        if (!usernameReg.test(username)) {
            err = '用户名是字母开头3-10位字符(下划线,字母,数字)';
            // 验证密码
        } else if (!passwordReg.test(password)) {
            err = '密码是3-6位任意字符';
            // 验证重复密码
        } else if (password != rePassword) {
            err = '两次密码输入的不一致,请核对';
            // 验证通过
        } else {
            err = '';
            $errMsg.css('text-align', 'center');
            $errMsg.html(err);
        }
        // 2.3 验证通过发送ajax请求
        if (err) {
            $errMsg.html(err);
        } else {
            $.ajax({
                url: '/user/register',
                type: 'POST',
                data: {
                    username: username,
                    password: password
                },
                success(data) {
                    if (data.code == 0) { // 注册成功
                        $errMsg.html(''); // 清空err的内容
                        // 提示信息
                        alert('注册成功,请登录');
                        // 转到登陆界面
                        $('#login').trigger('click');
                    } else {
                        $errMsg.html(data.message)
                    }
                },
                error(err) {
                    $errMsg.html('请求数据失败,请稍后再试。');
                }
            })
        }
    })


    // 3. 用户登陆逻辑
    $('#submit-login').on('click', function () {
        // 3.1 获取注册信息
        let username = $userLogin.find('[id="exampleInputEmail1"]').val();// 用户名
        let password = $userLogin.find('[id="exampleInputPassword1"]').val();// 密码
        let $errMsg = $userLogin.find('.err');
        let err = '';
        // 3.2 验证数据合法性
        // 提示文本的对齐方式为center
        $errMsg.css('text-align', 'center');
        //验证用户名
        if (!usernameReg.test(username)) {
            err = '用户名是字母开头3-10位字符(下划线,字母,数字)';
            // 验证密码
        } else if (!passwordReg.test(password)) {
            err = '密码是3-6位任意字符';
        }
        // 验证通过
        else {
            err = '';
            $errMsg.css('text-align', 'center');
            $errMsg.html(err);
        }
        // 3.3 验证通过发送ajax请求
        if (err) {
            $errMsg.html(err);
        } else {
            $.ajax({
                url: '/user/login',
                type: 'POST',
                data: {
                    username: username,
                    password: password
                },
                success(data) {
                    if (data.code == 0) { // 注册成功
                        $errMsg.html('');// 清空err的内容
                        // 提示信息
                        alert('登陆成功');
                        /*
                        // 显示用户界面
                        $userInfo.show();
                        // 显示用户名
                        $('#user-info').find('span').html(data.user.username);
                        // 隐藏登陆界面
                        $userLogin.hide();
                        */
                        window.location.reload();
                    } else {
                        $errMsg.html(data.message)
                    }
                },
                error(err) {
                    $errMsg.html('请求数据失败,请稍后再试');
                }
            })
        }
    })

    // 4. 用户退出逻辑
    $('#logout').on('click', function () {
        $.ajax({
            url: '/user/logout',
            type: 'get'
        })
            .done(function (data) {
                if (data.code == 0) {
                    alert(data.message)
                    window.location.href = '/';
                }
            })
            .fail(function (err) {
                console.log(err);
                $userInfo.find('.err').html('退出失败,请稍后再试');
            })
    })

    // 5. 构建文章列表的html
    function buildArticleHtml(docs) {
        let html = '';
        for (let i = 0; i < docs.length; i++) {
            html += `<div class="panel panel-default panel-article">
                <div class="panel-heading">
                    <h3 class="panel-title">
                        <a href="/detail/${docs[i]._id.toString()}" class="link" target="_blank">${docs[i].title}</a>
                    </h3>
                </div>
                <div class="panel-body">${docs[i].intro}</div>
                <div class="panel-footer">
                    <span class="glyphicon glyphicon-user" aria-hidden="true"></span>
                    <span class="panel-footer-text text-muted">${docs[i].user.username}</span>
                    <span class="glyphicon glyphicon-th-list" aria-hidden="true"></span>
                    <span class="panel-footer-text text-muted">${docs[i].category.category_name}</span>
                    <span class="glyphicon glyphicon-time" aria-hidden="true"></span>
                    <span class="panel-footer-text text-muted">${docs[i].createdTime}</span>
                    <span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
                    <span class="panel-footer-text text-muted"><em>${docs[i].click}</em>已阅读</span>
                </div>
            </div>`
        }
        return html;
    }
    // 6. 构建分页器的html
    function buildPaginationHtml(list, page, pages) {
        let html = '';
        if (page == 1) {
            html += `<li class="disabled">`
        } else {
            html += `<li>`
        }
        html += `   <a href="javascript:;" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>`

        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i] == page) {
                html += `<li class="active">`
            } else {
                html += `<li>`
            }
            html += `<a href="javascript:;">${list[i]}</a></li>`
        }
        if (page == pages) {
            html += `<li class="disabled">`
        } else {
            html += `<li>`
        }
        html += `   <a href="javascript:;" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>`
        return html;
    }

    // 7. 构建评论html
    function buildCommentHtml(docs) {
        var html = ''
        for (var i = 0, len = docs.length; i < len; i++) {
            html += `<div class="col-md-12">
                        <div class="text-muted comment-item">
                            <p>${docs[i].content}</p>
                            <p>
                            <span>${docs[i].user.username}</span> 发表于
                                <span>${docs[i].createdTime}</span>
                            </p>
                        </div>
                    </div>`
        }

        return html
    }

    // 8. 调用分页jquery插件
    let $articlePage = $('#article_page');
    $articlePage.on('get-data', function (ev, data) {
        // 构建文章列表html并且渲染
        let articleHtml = buildArticleHtml(data.docs);// 调用函数 并 接收return的html代码
        $('#article-wrap').html(articleHtml);
        //构建分页器html并且渲染
        if (data.pages <= 1) {
            $articlePage.find('.pagination').html('')
        } else {
            let paginationHtml = buildPaginationHtml(data.list, data.page, data.pages)
            $articlePage.find('.pagination').html(paginationHtml)
        }
    })
    var $commentPage = $('#comment-page')
    $commentPage.on('get-data', function (ev, data) {
        //构建评论列表html并且渲染
        var commentHtml = buildCommentHtml(data.docs)
        $('#comment-wrap').html(commentHtml)
        //构建分页器html并且渲染
        if (data.pages <= 1) {
            $commentPage.find('.pagination').html('')
        } else {
            var paginationHtml = buildPaginationHtml(data.list, data.page, data.pages)
            $commentPage.find('.pagination').html(paginationHtml)
        }
    })
    //调用分页jquery插件
    $articlePage.pagination({
        url: "/articlesList"
    })
    //调用分页jquery插件
    $commentPage.pagination({
        url: "/commentsList"
    })
})(jQuery);