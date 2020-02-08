var web = {};
(function(namespace){
    // TIP
    var Tip = (function() {
        function Tip(config) {

            this.tag = config.tag;
            this.selector = '[data-' + config.tag + ']';
            this.node = $(config.container);
            this.url = config.url || '';
            this.tips = {};

            this.init();
        }

        Tip.prototype = {
            init: function() {

                var self = this;

                $.get('js/data.js',{},function(resp){
                    self.data = resp;
                    self.evtBind();
                },'json');

                
            },

            evtBind: function() {
                var self = this;

                $('body').on('click', self.selector, function(ev) {
                    self.showTopic($(this).data(self.tag), ev);
                });

                $('body').on('click', '.u-tips .u-mask', function(ev) {
                    //ev.stopPropagation();
                    self.hideTopic();
                });

            },

            showTopic: function(id, ev) {

                //new Mask();
                var node = '';
                var data = this.data[id];
                //console.log(data);

                for(var name in data){
                    if(name=='id')continue;
                    if(name=='level')continue;
                    if(name=='desc')continue;
                    else if(name == 'name'){
                        node += '<div class="'+ name + ' ' + setColor(data.level) +'">'+ data[name] +'</div>';
                    }
                    else if(name == 'type'){
                        if(data.type)node += '<div class="type2">'+ data.type + '</div>';
                    }
                    else{
                        node += '<div class="'+ name +'">'+ data[name] +'</div>';
                    }		
                }
                if(data.desc)node += '<div class="itemDesc">'+ data.desc+'</div>';

                this.node.find('.tip-container').html('<div class="tips-detail">'+node+'</div>');
                this.node.fadeIn();

                function setColor(str){
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
                };

            },

            hideTopic: function() {

                this.node.fadeOut();
            }

        };

        return Tip;
    }());
    namespace.Tip = Tip;

})( web || {} );

new web.Tip({
    'container': '#J-tips',
    'tag': 'tip'
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
});
