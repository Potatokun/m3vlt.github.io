var utils = {};
var bScroll = true;

(function (namespace) {
    // TIP
    var Tip = (function () {
        function Tip(config) {

            this.tag = config.tag;
            this.selector = '[data-' + config.tag + ']';
            this.node = $(config.container);
            this.url = config.url || '';
            this.tips = {};

            this.init();
        }

        Tip.prototype = {
            init: function () {

                var self = this;

                $.getJSON(self.url, function (json, textStatus) {
                    self.tips = json;
                    self.evtBind();
                });
            },

            evtBind: function () {
                var self = this;

                $('body').on('mouseover', self.selector, function(ev) {
                    self.showTopic($(this).data(self.tag), ev);
                });

                $('body').on('mouseleave', self.selector, function(ev) {
                    ev.stopPropagation();
                    self.hideTopic();
                });

                $('body').on('mousemove', self.selector, function(ev) {
                    self.setPosition(ev.clientX, ev.clientY);
                });

            },

            showTopic: function (id, ev) {

                //new Mask();

                if (this.g_oTimerHide) {
                    clearTimeout(this.g_oTimerHide);
                }

                var node = '',
                    data = this.tips[id];

                if (!data) return;

                for (var name in data) {
                    if (name == 'id') continue;
                    if (name == 'level') continue;
                    if (name == 'desc') continue;
                    if (name == 'img') continue;
                    if (name == 'type') continue;
                    else if (name == 'name') {
                        node += '<div class="' + name + ' ' + this.setColor(data.level) + '">' + data[name] + '</div>';
                    } else if (name == 'sub_type') {
                        node += '<div class="type2">' + data.sub_type + '</div>';
                    } else {
                        node += '<div class="' + name + '">' + data[name] + '</div>';
                    }
                }
                if (data.desc) node += '<div class="itemDesc">' + data.desc + '</div>';
                if (data.img) node += '<div class="img">' + data.img + '</div>';

                this.node.find('.inner_html').html(node);               
                this.node.show();
                this.setPosition(ev.clientX, ev.clientY);
            },

            hideTopic: function () {
                this.node.hide();
            },

            setPosition: function(x, y) {

                var topic = this.node;

                var top = document.body.scrollTop || document.documentElement.scrollTop;
                var left = document.body.scrollLeft || document.documentElement.scrollLeft;

                x += left;
                y += top;

                var l = x + 20;
                var t = y - (topic.outerHeight()*0.5 - 20);
                var bRight = true;
                var bTop = true;
                var iPageRight = left + document.documentElement.clientWidth;
                var iPageTop = top + document.documentElement.clientHeight;

                if (l + topic.outerWidth() > iPageRight) {
                    bRight = false;

                    l = x - (topic.outerWidth() + 20);
                    this.node.addClass('adorn_r');
                } else {
                    this.node.addClass('adorn');
                }

                if (t - topic.outerHeight() < 0) {
                    bTop = false;

                    t = y + 10;
                    this.node.addClass('adorn_r');
                } else {
                    this.node.addClass('adorn');
                }

                this.node.css({
                    'left': l,
                    'top': t
                });
            },            

            setColor: function(str){
                var color = '';
                switch(str){
                    case '金':
                        return 'gold';
                        break;
                    case '紫':
                        return 'purple';
                        break;
                    case '暗金':
                        return 'dGold';
                        break;
                    case '橙':
                        return 'orange';
                        break;
                    case '蓝':
                        return 'blue';
                        break;
                    default :
                        return 'green';									
                }
            }

        };

        return Tip;
    }());
    namespace.Tip = Tip;


})(utils || {});

var swiper = new Swiper('.swiper-container', {
    followFinger: false,
    speed: 800,
    direction: 'vertical',
    mousewheelControl: true,
    paginationClickable: true,
    noSwiping : true,
    pagination: '#J-nav',
    bulletClass: 'nav-item',
    bulletActiveClass : 'active',
    paginationBulletRender: function (swiper, index, className) {
        return '<div class="u-btn ' + className + ' nav-'+ (index+1) +'"></div>';
    },  
    autoHeight: true,
    onInit: function (swiper) {
        slide = swiper.slides.eq(0);
        slide.addClass('ani-slide');
    },
    onTransitionStart: function (swiper) {
    },
    onTransitionEnd: function (swiper) {
        swiper.activeIndex == 0? '' : $('.u-nav').fadeIn();
        $('.u-nav').removeClass('active-1 active-2 active-3').addClass('active-' + (swiper.activeIndex+1));
    }
});

new utils.Tip({
    'container': '#J-tips',
    'tag': 'tip',
    'url' : 'js/data.js'
});

var s;
function resize() {
    s = $('body').width() / 1920;
    console.log($('body').width());
    $('.m-viewport').get(0).style.transformOrigin = '0 0';
    $('.m-viewport').get(0).style.transform = 'scale(' + s + ',' + s + ')';
    $('.m-viewport').get(0).style.width = window.innerWidth / s + 'px';
    $('.m-viewport').get(0).style.height = window.innerHeight / s + 'px';
    swiper.onResize();
}
window.onresize = function () {
    resize();
}
resize();

$('.u-nav .nav-item').click(function(){
    var index = $(this).index();
    swiper.slideTo(index + 1);
});

var skillData = ['B1-1','B1-2','B1-3','B1-4','B2-1','B2-2','B2-3','B2-4'];
$('.m-skill .tab-hd .tab-btn').click(function(){
    var btn = $(this);
    var body = btn.closest('.skill-view');
    body.find('.tab-btn').removeClass('active');
    btn.addClass('active');

    body.find('img').attr('src','images/gif/'+ skillData[btn.index('.tab-btn')]+'.gif');
});

$('.m-skill .trriger').click(function(){
    var btn = $(this);
    $('.m-skill .trriger').removeClass('active');
    btn.addClass('active');

    $('.m-skill .hero-item').hide();
    $('.m-skill .hero-item').eq(btn.index()).show();

    $('.m-skill .char-img').removeClass('c-1 c-2').addClass('c-'+(btn.index()+1));
});

$('.cover').mousewheel(function(event, delta) {

    event.preventDefault();

    if(!bScroll)return;

    if (delta > 0) {
        // up
        
    } else if (delta < 0){
        //down
        $('.cover').animate({top : '-100%',opacity: 0},800);
        $('.u-nav').fadeIn();                 
    }

    bScroll = false;

    setTimeout(function(){
        bScroll = true;
    },1000);
    
    
});

$('.slide-1').mousewheel(function(event, delta) {

    event.preventDefault();

    if(!bScroll)return;

    if (delta > 0) {
        // up
        $('.cover').animate({top : '0',opacity: 1},800);
        $('.u-nav').fadeOut();           
    } else if (delta < 0){
        //down
        $('.cover').animate({top : '-100%',opacity: 0},800);
        $('.u-nav').fadeIn();                 
    }

    bScroll = false;

    setTimeout(function(){
        bScroll = true;
    },1000);
    
    
});