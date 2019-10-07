/*
    博客助手（Zone）页面
*/

layui.use(['layer', 'laytpl'], function () {
    var $ = layui.$
        , laytpl = layui.laytpl
        , blog = parent.layui.blog;
    $('.fa-power-off').click(function () {
        blog.closeBlogHelper();
    });
    //底部导航单击
    $('.bloghelper-foot .flex').on('click', function () {
        var index = $(this).index();
        $(this).addClass('selected').siblings().removeClass('selected');
        $('.bloghelper-body-content').eq(index).addClass('layui-show').siblings().removeClass('layui-show');
    });
    //消息列表单击
    $('.bloghelper-msg-list li').on('click', function () {
        var that = this;
        var type = $(that).data('type'), title;
        switch (type) {
            case 'pl':
                title = "评论回复";
                break;
            case 'ly':
                title = "留言回复";
                break;
            case 'xt':
                title = "系统消息";
                break;
            default:
                title = "0.0消息";
        }
        $.ajax({
            url: '/api/user/getallmsg',
            data: { type: type },
            success: function (res) {
                if (res.code === 1) {
                    laytpl($('#msgTpl').html()).render({ title: title, list: res.data }, function (html) {
                        $('.main-panel').addClass('slideOutLeft');
                        var index = layer.open({
                            type: 1,
                            content: html,
                            area: ['100vw', '100vh'],
                            title: false,
                            closeBtn: 0,
                            scrollbar: false,
                            anim: -1,
                            resize: false,
                            move: false,
                            shade: 0,
                            isOutAnim: false,
                            skin: 'bloghelper-panel animated slideInRight',
                            success: function (layero, index) {
                                $(that).find('i').remove(); //移除未读消息提示
                                $(layero).find('.bloghelper-head i').on('click', function () {
                                    $(layero).removeClass('slideInRight').addClass('slideOutRight');
                                    $('.main-panel').removeClass('slideOutLeft').addClass('slideInLeft');
                                    setTimeout(function () {
                                        layer.close(index);
                                    }, 1000);
                                });
                            }
                        });
                        layer.full(index);
                    });
                } else {
                    if (res.msg != '') {
                        layer.msg(res.msg);
                    } else {
                        layer.msg('获取未读消息失败');
                    }
                }
            }
        });

    });
});