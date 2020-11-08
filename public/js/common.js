;(function($){
    // 1.登录注册面板切换
    const $userLogin = $('#form-login');// 登陆面板
    const $userInfo = $('#user-info');// 用户面板
    const $userRegister = $('#form-registered');// 注册面板
    // 1.1 登陆 > 注册
    $('#register').on('click',function(){
        // 登陆面板隐藏
        $userLogin.hide();
        // 注册面板显示
        $userRegister.show();
    })
    // 1.2 注册 > 登陆
    $('#login').on('click',function(){
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
    $('#submit-register').on('click',function(){
        // 2.1 获取注册信息
        let username = $userRegister.find('[id="username"]').val();// 用户名
        let password = $userRegister.find('[id="password1"]').val();// 密码
        let repassword = $userRegister.find('[id="password2"]').val();// 重复密码
        let $errMsg = $userRegister.find('.err');
        let err = '';
        // 2.2 验证数据合法性
        // 提示文本的对齐方式为center
        $errMsg.css('text-align','center');
        //验证用户名
        if(!usernameReg.test(username)){ 
            err = '用户名是字母开头3-10位字符(下划线,字母,数字)';
        // 验证密码
        }else if(!passwordReg.test(password)){
            err = '密码是3-6位任意字符';
        // 验证重复密码
        }else if(password != repassword){
            err = '两次密码输入的不一致,请核对';
        // 验证通过
        }else{
            err = '';
            $errMsg.css('text-align','center');
            $errMsg.html(err);
        }
        // 2.3 验证通过发送ajax请求
        if(err){
            $errMsg.html(err);
        }else{
            $.ajax({
                url:'/user/register',
                type:'POST',
                data:{
                    username: username,
                    password: password
                },
                success(data){
                    if(data.code == 0){ // 注册成功
                        $errMsg.html(''); // 清空err的内容
                        // 提示信息
                        alert('注册成功,请登录');
                        // 转到登陆界面
                        $('#login').trigger('click');
                    }else{
                        $errMsg.html(data.message)
                    }
                },
                error(err){
                    $errMsg.html('请求数据失败,请稍后再试。');
                }
            })
        }
    })


    // 3. 用户登陆逻辑
    $('#submit-login').on('click',function(){
        // 3.1 获取注册信息
        let username = $userLogin.find('[id="exampleInputEmail1"]').val();// 用户名
        let password = $userLogin.find('[id="exampleInputPassword1"]').val();// 密码
        let $errMsg = $userLogin.find('.err');
        let err = '';
        // 3.2 验证数据合法性
        // 提示文本的对齐方式为center
        $errMsg.css('text-align','center');
        //验证用户名
        if(!usernameReg.test(username)){ 
            err = '用户名是字母开头3-10位字符(下划线,字母,数字)';
        // 验证密码
        }else if(!passwordReg.test(password)){
            err = '密码是3-6位任意字符';
        }
        // 验证通过
        else{
            err = '';
            $errMsg.css('text-align','center');
            $errMsg.html(err);
        }
        // 3.3 验证通过发送ajax请求
        if(err){
            $errMsg.html(err);
        }else{
            $.ajax({
                url:'/user/login',
                type:'POST',
                data:{
                    username: username,
                    password: password
                },
                success(data){
                    if(data.code == 0){ // 注册成功
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
                    }else{
                        $errMsg.html(data.message)
                    }
                },
                error(err){
                    $errMsg.html('请求数据失败,请稍后再试。');
                }
            })
        }
    })

})(jQuery)