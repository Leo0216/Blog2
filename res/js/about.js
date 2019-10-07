layui.use(['jquery'], function () {
    var $ = layui.$;

    $('.blog-nav-follow').onePageNav({
        scrollThreshold: 0.1
    });

    $(window).scroll(function () {
        if ($(window).scrollTop() > 65) {
            $('.blog-nav').addClass('layui-hide');
        } else {
            $('.blog-nav').removeClass('layui-hide');
        }
        if ($(window).scrollTop() > 65) {
            $('.blog-nav-follow').addClass('fixed');
        } else {
            $('.blog-nav-follow').removeClass('fixed');
        }
    });
});