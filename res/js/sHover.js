function sHover(itemClass, introClass) {
    var _this = this;
    //获得所有hoverItem
    var sItemArr = _this.getByClass(document, itemClass);
    for (var i = 0; i < sItemArr.length; i++) {
        //获得当前Item下的Intro
        var thisItem = sItemArr[i];
        var sIntro = _this.getByClass(thisItem, introClass)[0];
        //获取宽度高度
        thisItem.size = {
            width: _this.getStyle(thisItem, 'width'),
            height: _this.getStyle(thisItem, 'height')
        };
        // 设置默认的样式
        thisItem.style.position = 'relative';
        thisItem.style.overflow = 'hidden';
        sIntro.style.display = 'block';
        sIntro.style.position = 'absolute';
        sIntro.style.width = thisItem.size.width + "px";
        sIntro.style.height = thisItem.size.height + 1 + "px";
        sIntro.style.top = thisItem.size.height + 1 + "px";
        sIntro.style.left = "0px";
        sIntro.style.zIndex = "99";
        sIntro.style.opacity = "1";

        //默认参数设置
        this.slideSpeed = 5;
        this.opacityChange = false;
        this.opacity = 100;

        //绑定事件
        function eventRegister(item, intro) {
            _this.myAddEvent(item, 'mouseover', function (ev) {
                _this.hoverIn(ev, item, intro);
            });
            _this.myAddEvent(sItemArr[i], 'mouseout', function (ev) {
                _this.hoverOut(ev, item, intro);
            });
        }
        eventRegister(thisItem, sIntro);
    }
}

sHover.prototype.set = function (json) {
    for (i in json) {
        this[i] = json[i];
    }
}
sHover.prototype.trigger = function (item, dir, ev) {
    try {
        if (item.contains(ev.relatedTarget)) {
            return false;
        } else if (!ev.relatedTarget) {
            throw new error();
        }
    } catch (exception) {
        if (dir == 'in') {
            if (item.contains(ev.fromElement)) {
                return false;
            }
        } else if (dir == 'out') {
            if (item.contains(ev.toElement)) {
                return false;
            }
        }
    }
    return true;
}
sHover.prototype.hoverIn = function (ev, item, intro) {
    var e = ev || event;
    if (this.trigger(item, 'in', e)) {
        var dir = this.getDir(e, item);
        if (dir == 0 || dir == 2) {
            if (dir == 0) {
                intro.style.top = -item.size.height + 'px';
            } else {
                intro.style.top = item.size.height + 'px';
            }
            intro.style.left = '0px';
            this.startMove(intro, { 'top': 0, 'left': 0, 'opacity': this.opacity });
        } else {
            if (dir == 1) {
                intro.style.left = item.size.width + 'px';
            } else {
                intro.style.left = -item.size.width + 'px';
            }
            intro.style.top = '0px';
            this.startMove(intro, { 'left': 0, 'opacity': this.opacity });
        }
    }
}

sHover.prototype.hoverOut = function (ev, item, intro) {
    var e = ev || event;
    var opacity = 100;
    if (this.trigger(item, 'out', e)) {
        var dir = this.getDir(e, item);
        if (this.opacityChange) { opacity = 0; }
        switch (dir) {
            case 0:
                this.startMove(intro, { 'top': -item.size.height, 'left': 0, 'opacity': opacity });
                break;
            case 2:
                this.startMove(intro, { 'top': item.size.height, 'left': 0, 'opacity': opacity });
                break;
            case 1:
                this.startMove(intro, { 'left': item.size.width, 'top': 0, 'opacity': opacity });
                break;
            case 3:
                this.startMove(intro, { 'left': -item.size.width, 'top': 0, 'opacity': opacity });
                break;
        }
    }
}

sHover.prototype.startMove = function (obj, json, fn) {
    var nowAttr;
    var speed;
    var k = (11 - this.slideSpeed) > 0 ? (11 - this.slideSpeed) : 1;
    var delay = 30;
    var _this = this;
    clearInterval(obj.moveTimer);
    obj.moveTimer = setInterval(function () {
        var stop = true;
        for (var attr in json) {
            var gotStyle = _this.getStyle(obj, attr);
            var target = json[attr];
            if (attr == "opacity") {
                nowAttr = parseInt(parseFloat(gotStyle) * 100, 10);
            } else {
                nowAttr = parseInt(gotStyle, 10);
            }

            if (nowAttr != target) {
                stop = false;
            }

            if (stop) {
                clearInterval(obj.moveTimer);
                fn && fn();
            } else {
                speed = (target - nowAttr) / k;
                speed = target > nowAttr ? Math.ceil(speed) : Math.floor(speed);

                if (attr == "opacity") {
                    obj.style[attr] = (nowAttr + speed) / 100;
                    obj.style.filter = 'alpha(opacity=' + (nowAttr + speed) + ')';
                } else {
                    obj.style[attr] = (nowAttr + speed) + "px";
                }
            }
        }
    }, delay);
}

sHover.prototype.myAddEvent = function (obj, evName, fn) {
    if (obj.attachEvent) {//IE
        obj.attachEvent('on' + evName, function () {
            fn.call(this);//避免this被修改
        });
    } else {
        obj.addEventListener(evName, fn, false);
    }
}
sHover.prototype.getByClass = function (oParent, className) {
    var aResult = [];
    var arr = oParent.getElementsByTagName('*');
    var re = new RegExp('\\b' + className + '\\b', i);

    for (var i = 0; i < arr.length; i++) {
        if (re.test(arr[i].className)) {
            aResult.push(arr[i]);
        }
    };
    return aResult;
}
sHover.prototype.getStyle = function (obj, attr) {
    var value;
    if (obj.currentStyle) {//IE
        value = obj.currentStyle[attr];
    } else {
        value = getComputedStyle(obj, false)[attr];
    }
    if (attr != 'opacity') {
        value = parseInt(value, 10);
    }
    if (isNaN(value)) {
        value = obj['offset' + attr.charAt(0).toUpperCase() + attr.substring(1)];
    }
    return value;
}
sHover.prototype.getScroll = function () {
    var scroll = {
        top: document.body.scrollTop || document.documentElement.scrollTop,
        left: document.body.scrollLeft || document.documentElement.scrollLeft
    }
    return scroll
}
sHover.prototype.getPos = function (obj) {
    var pos = { left: 0, top: 0 };
    while (obj) {
        pos.left += obj.offsetLeft;
        pos.top += obj.offsetTop;
        obj = obj.offsetParent;
    }
    return pos;
}
sHover.prototype.getDir = function (e, item) {
    var e = e || event;
    var w = this.getStyle(item, 'width'),
        h = this.getStyle(item, 'height'),
        x = (e.clientX - this.getPos(item).left + this.getScroll().left - (w / 2)) * (w > h ? (h / w) : 1),
        y = (e.clientY - this.getPos(item).top + this.getScroll().top - (h / 2)) * (h > w ? (w / h) : 1),
        direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4,
        eventType = e.type;
    return direction;
}