!function (g) {
    var PD = function (o) {
        this.o = {
            sDom: 'body', //滚动DOM
            dDom: null, //下拉时移动的DOM
            rWrap: 'body', //刷新盒子的wrap
            reY: 150, //松开时触发刷新距离
            diyBool: true, //一些自定义的刷新条件
            imgUrl: null
        };
        $.extend(this.o, o);
        this.init();
    };
    PD.prototype = {
        createDom: function () {
            var html = '<div class="refreshBox"><div class="refreshImageBox">';
            if (this.o.imgUrl) {
                html += '<img src=' + this.o.imgUrl + ' alt="" class="refreshImage">';
            }
            html += '</div><p class="refreshText">下拉刷新</p></div>';
            $(this.o.rWrap).prepend(html);
        },
        init: function () {
            $('head').append('<style>body,html{margin:0;padding:0;}.refreshBox{opacity:0;position: absolute;width: 100%;height: auto;display: -webkit-box; -webkit-box-align: center; -webkit-box-pack: center;font-size: 14px;color: #333;z-index: 0;}.refreshImageBox{margin-right: 20px;width: 40px;height: 40px;display: -webkit-box;-webkit-box-align: center; -webkit-box-pack: center;}.refreshImage{display: block;width:1px;-webkit-transform-style: preserve-3d;}.refreshText{width: 100px;} </style>')
            this.createDom();
            this.reBox = document.querySelector('.refreshBox');
            this.sDom = document.querySelector(this.o.sDom);
            this.dDom = document.querySelector(this.o.dDom);
            this.roll = document.querySelector('.refreshImage');
            this.rText = document.querySelector('.refreshText');
            this.windowWidth = $(window).width();
            var _this = this;
            var addEvent = function (eventType) {
                document.body.addEventListener(eventType, _this, false);
            };
            var eventArr = ['touchstart', 'touchmove', 'touchend','touchcancel'];
            eventArr.forEach(function (type) {
                addEvent(type);
            });
        },
        _touchstart: function (event) {
            if (this.sDom.scrollTop == 0 && !this.watingLoad) {
                $(this.dDom).css("-webkit-transition", "none");
                $(this.roll).css({"-webkit-transition": "none"});
                $(this.reBox).css('opacity', '1');
                this.canCalc = true;
                this.startY = event.touches[0].pageY;
            }
        },
        _touchmove: function (event) {
            if (this.canCalc) {
                this.endY = event.touches[0].pageY;
                this.touching = this.endY - this.startY;
                if (this.touching >= 0) {
                    event.preventDefault();
                    var scrollLength = this.windowWidth / 1.5 - this.windowWidth * 50 / (0.3 * this.touching + 75);
                    $(this.dDom).css({
                        "-webkit-transform": "translateY(" + scrollLength + "px)"
                    });
                    var refreshWidth = this.touching / 5 >= 30 ? 30 : this.touching / 5 + 1;
                    $(this.roll).css({
                        "-webkit-transform": "rotate(" + this.touching + "deg)",
                        width: refreshWidth
                    });
                    if (this.touching > this.o.reY) {
                        $(this.rText).text('松开后刷新');
                    } else {
                        $(this.rText).text('下拉刷新');
                    }
                }
            }
        },
        _touchend: function () {
            this.watingLoad = true;
            if (this.canCalc) {
                if (this.touching < 10) {
                    $(this.dDom).css({"-webkit-transform": "translateY(0)"});
                    $(this.roll).css({"-webkit-transform": "rotate(0)", width: '1px'});
                    $(this.reBox).css('opacity', '0');
                    this.watingLoad = false;
                } else {
                    $(this.dDom).animate({
                        "-webkit-transform": "translateY(0)"
                    }, 500);
                    $(this.roll).animate({
                        "-webkit-transform": "rotate(-360deg)",
                        width: '1px'
                    }, 500);
                    if (this.touching > this.o.reY) {
                        setTimeout(function () {
                            if ((document.body.scrollTop || document.documentElement.scrollTop) < 150) {
                                location.reload();
                            }
                        }, 500);
                    }
                    var self = this;
                    setTimeout(function () {
                        $(self.reBox).css('opacity', '0');
                        self.watingLoad = false;
                    }, 500);
                }
            }else{
                $(this.reBox).css('opacity', '0');
                this.watingLoad = false;
            }
            this.canCalc = false;
        },
        _touchcancel:function(){
            this._touchend();
        },
        handleEvent: function (e) {
            var eventFun = "_" + e.type;
            if (typeof this[eventFun] == "function") this[eventFun](e);
        }
    };
    Object.defineProperty(g, 'PD', {
        configurable: true,
        enumerable: true,
        value: PD
    })
}(window);
