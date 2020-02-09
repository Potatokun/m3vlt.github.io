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

(function(window, document, undefined) {
    // 存储所有的雪花
    const snows = [];
   
    // 下落的加速度
    const G = 0.01;
   
    const fps = 60;
   
    // 速度上限，避免速度过快
    const SPEED_LIMIT_X = 1;
    const SPEED_LIMIT_Y = 1;
   
    const W = window.innerWidth;
    const H = window.innerHeight;
   
    let tickCount = 150;
    let ticker = 0;
    let lastTime = Date.now();
    let deltaTime = 0;
   
    let canvas = null;
    let ctx = null;
   
    let snowImage = null;
   
    window.requestAnimationFrame = (function() {
      return window.requestAnimationFrame ||
             window.webkitRequestAnimationFrame ||
             window.mozRequestAnimationFrame ||
             window.oRequestAnimationFrame ||
             window.msRequestAnimationFrame ||
             function (callback) {
                setTimeout(callback, 1000/ fps);
              }
    })();
   
    init();
   
    function init() {  
        snowImage = new Image();
        snowImage.src = 'images/huap2.png';

        snowImage.onload = function(){
            createCanvas();
            canvas.width = W;
            canvas.height = H;
            canvas.style.cssText = 'position: fixed; top: 0; left: 0; pointer-events: none;z-index:60';
            document.body.appendChild(canvas);
            if (W < 768) {
              tickCount = 350;
            }
    
            loop();
        }
     
      }
   
    function loop() {
      requestAnimationFrame(loop);
   
      ctx.clearRect(0, 0, W, H);
   
      const now = Date.now();
      deltaTime = now - lastTime;
      lastTime = now;
      ticker += deltaTime;
   
      if (ticker > tickCount) {
        snows.push(
          new Snow(Math.random() * W, 0, Math.random() * 5 + 5)
        );
        ticker %= tickCount;
      }
   
      const length = snows.length;
      snows.map(function(s, i) {
        s.update();
        s.draw();
        if (s.y >= H) {
          snows.splice(i, 1);
        }
      });
    }
   
    function Snow(x, y, radius) {
      this.x = x;
      this.y = y;
      this.sx = 0;
      this.sy = 0;
      this.deg = 0;
      this.radius = radius;
      this.ax = Math.random() < 0.5 ? 0.005 : -0.005;
    }
   
    Snow.prototype.update = function() {
      const deltaDeg = Math.random() * 0.6 + 0.2;
   
      this.sx += this.ax;
      if (this.sx >= SPEED_LIMIT_X || this.sx <= -SPEED_LIMIT_X) {
        this.ax *= -1;
      }
   
      if (this.sy < SPEED_LIMIT_Y) {
        this.sy += G;
      }
   
      this.deg += deltaDeg;
      this.x += this.sx;
      this.y += this.sy;
    }
   
    Snow.prototype.draw = function() {
      const radius = this.radius;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.deg * Math.PI / 180);
      ctx.drawImage(snowImage, -radius, -radius, radius * 2, radius * 2);
      ctx.restore();
    }
   
    function createCanvas() {
      canvas = document.createElement('canvas');
      ctx = canvas.getContext('2d');
    }
   
  })(window, document);