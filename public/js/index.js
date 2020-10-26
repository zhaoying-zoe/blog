$('.form-login-active').on('click',function(){
    $('.form-login').hide();
    $('.form-registered').show();
})

$('.form-registered-active').on('click',function(){
    $('.form-login').show();
    $('.form-registered').hide();
})