ClassicEditor
.create(document.querySelector('#content'), {
    language:"zh-cn",
    ckfinder: {
        uploadUrl: '/article/uploadImage',
    },
})
.catch(error => {
    console.log(error);
});