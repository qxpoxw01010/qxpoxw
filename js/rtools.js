/* reading function */
var rtools = rtools || {};
rtools.config = {},
rtools.isShow = !1,
rtools.islogin = !1,
rtools.uid = 0,
rtools.bid = 0,
rtools.cid = 0,
rtools.setting = {fontcolor:"",fontsize:"",nightmode:"day",speed:50,tiptime:0},
rtools.checklogin = function(){
},
rtools.getinfo = function(){
    if(typeof ks_uid != "undefined")rtools.uid = ks_uid;
    if(typeof ks_bkid != "undefined")rtools.bid = ks_bkid;
    if(typeof ks_cid != "undefined")rtools.cid = ks_cid;
    var api_info = ks_host + "/usercenter/getUserinfo";
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        url: api_info,
        data: {uid:rtools.uid},
        success: function(data) {
            var json = data,
                request = json.result.status.code,
                msg = json.result.status.msg;
            if(request == 0){
                rtools.money.balance = json.result.data.usergold;
                rtools.flower.balance = json.result.data.userflower;
            }
            return
        }
    });
},
rtools.int = function(){
    rtools.poptip();
    rtools.getinfo();
    $("#chapter").on("click",function(e){rtools.start(e)});  
    $("#chapter").on("doubleTap",rtools.scroll.launch);        //???停?屏;
    $("#t-m-mode").on("click",function(){rtools.read.change(this)}); //切???模式
    $("#t-m-clt").on("click",function(){rtools.collect.confirm(this)});   //收藏
    rtools.component.int("#t-m-cmt",rtools.comment);    //??
    rtools.component.int("#t-m-mny",rtools.money);      //打?
    rtools.component.int("#t-m-flw",rtools.flower);     //送花
    rtools.component.int("#t-m-font",rtools.font);      //字体
    rtools.component.int("#t-m-off",rtools.offline);    //离?
    rtools.component.int("#t-m-scrol",rtools.scroll);   //??
    rtools.readsetting();            //?取用??置
},
rtools.readsetting = function(){
    var setting = window.localStorage.getItem("kssetting");
    if(setting){
        setting = JSON.parse(setting);
        rtools.setting = setting;
        $("body").addClass(setting.fontsize);
        $("body").addClass(setting.fontcolor);
        rtools.read.mode = setting.nightmode;
        if(setting.nightmode == "night"){
            rtools.font.removestyle();
            $("body").addClass("night-mode");
        }
        rtools.scroll.speed = setting.speed;
    }
},
rtools.start = function(e){
    var ey = e.clientY, ex = e.clientX;
    if(!rtools.position(ey,ex))return;
    if(!rtools.isShow)rtools.show();
    else rtools.hide();
    return !1;
},
rtools.poptip = function(){
    var kstipdate = window.localStorage.getItem("kstipdate");
    if(typeof kstipdate != null && typeof kstipdate != ""){
        var date = new Date();
        var times = date.getTime() - kstipdate;
        var days = parseInt(times/(24*60*60*1000));
        if(days<=7)
            return;
        else{
            window.localStorage.setItem("kstipdate",date.getTime());
            $("#t-pop-tip").fadeIn().on("click",function(){$(this).hide()});
        }
    }else
        $("#t-pop-tip").fadeIn().on("click",function(){$(this).hide()});
    
    
},
rtools.viewHeight = function(){
    var a = document,
    b = a.compatMode == "BackCompat" ? a.body: a.documentElement;
    return b.clientHeight
},
rtools.viewWidth = function() {
    var a = document,
    b = a.compatMode == "BackCompat" ? a.body: a.documentElement;
    return b.clientWidth
},
rtools.position = function(y,x){
    var vh = rtools.viewHeight(), vw = rtools.viewWidth();
    var y1 = vh*.2, y2 = vh*.8, x1 = vh*.2, x2 = vh*.8;
    if(y<y1 || y>y2)return !1;
    else return 1;
},
rtools.show = function(){
        $("#t-nav").show();
        $("#t-menu").show();
        $("#t-prev").show();
        $("#t-next").show();
        rtools.isShow = 1;
},
rtools.hide = function(){
        $("#t-nav").hide();
        $("#t-menu").hide();
        $("#t-prev").hide();
        $("#t-next").hide();
        rtools.isShow = !1;
},
rtools.animate = rtools.animate || {},
rtools.animate.show = function(c,o){
    rtools.hide();
    $(c).fadeIn().animate({"bottom":0},200);
    if(!o)return;
    $(".t-cover").show().on("click",function(){        
        o.hide();
        $(this).hide()
    });
    o.isShow = 1;
},
rtools.animate.hide = function(c,o){
    $(".t-cover").hide();
    $(c).animate({"bottom":"-180px"},100).hide();
    o.isShow = !1;
},
rtools.component = rtools.component || {},
rtools.component.int = function(c,o){
    $(c).off("click").on("click",function(){ 
        if(!o.isShow)o.show();
        else o.hide();
    });
},
rtools.tips = rtools.tips || {},
rtools.tips.isShow = !1,
rtools.tips.show = function(){
    rtools.animate.show(".t-tips", rtools.tips);
},
rtools.tips.hide = function(){
    rtools.animate.hide(".t-tips", rtools.tips);
},


rtools.font = rtools.font || {},    //字体
rtools.font.isShow = !1,
rtools.font.sizenow = 2,
rtools.font.style = ["font-color-1","font-color-2","font-color-3"],
rtools.font.size = ["font-smaller","font-small","font-orign","font-big","font-bigger"],
rtools.font.show = function(){
    rtools.animate.show(".t-font", rtools.font);
    $("#t-f-i").off("click").on("click",rtools.font.increase);
    $("#t-f-d").off("click").on("click",rtools.font.decrease);
    $("#t-fc-1").off("click").on("click",function(){rtools.font.setstyle(0)});
    $("#t-fc-2").off("click").on("click",function(){rtools.font.setstyle(1)});
    $("#t-fc-3").off("click").on("click",function(){rtools.font.setstyle(2)});
    $("#t-fc-4").off("click").on("click",function(){rtools.font.setstyle(3)});
},
rtools.font.hide = function(){
    rtools.animate.hide(".t-font", rtools.font)
},
rtools.font.increase = function(){
    var size = rtools.font.sizenow;
    if(size<4)size+=1;
    else return;
    rtools.font.setsize(size);
    rtools.font.sizenow = size;
},
rtools.font.decrease = function(){
    var size = rtools.font.sizenow;
    if(size>0)size-=1;
    else return;
    rtools.font.setsize(size);
    rtools.font.sizenow = size;
},
rtools.font.setsize = function(n){
    var sa = rtools.font.size;
    rtools.font.romovesize();
    $("body").addClass(sa[n]);
    rtools.setting.fontsize = sa[n];
    var setting = JSON.stringify(rtools.setting);
    window.localStorage.setItem("kssetting",setting);
},
rtools.font.romovesize = function(){
    var sa = rtools.font.size;
    for(var i=0;i<sa.length;i++){
        $("body").removeClass(sa[i])
    }
},    
rtools.font.setstyle = function(n){
    var mode = rtools.read.mode,
        sa = rtools.font.style;
    var dom = $("#t-m-mode")[0];
    if(mode == "night"){
        rtools.read.change(dom);
    }
    rtools.font.removestyle();
    if(n)$("body").addClass(sa[n-1]);
    rtools.setting.fontcolor = sa[n-1];
    rtools.setting.nightmode = "day";
    var setting = JSON.stringify(rtools.setting);
    window.localStorage.setItem("kssetting",setting);
},
rtools.font.removestyle = function(){
    var sa = rtools.font.style;
    for(var i=0;i<sa.length;i++){
        $("body").removeClass(sa[i])
    }
},
rtools.read = rtools.read || {},
rtools.read.mode = "day",
rtools.read.change = function(o){       //夜?模式
    var m = rtools.read.mode;
    rtools.font.removestyle();
    if(m == "day"){
        rtools.read.mode = "night";
        $("body").addClass("night-mode");
        $(o).find("b").html("白天");
    }
    if(m == "night"){
        rtools.read.mode = "day";
        $("body").removeClass("night-mode");
        $(o).find("b").html("夜?");
    }
    rtools.setting.nightmode = rtools.read.mode;
    var setting = JSON.stringify(rtools.setting);
    window.localStorage.setItem("kssetting",setting);
},
rtools.scroll = rtools.scroll || {},    //?屏
rtools.scroll = (function() {
    var top, timer, height = $("#chapter").height();
    function startTimer() {
        stopTimer();
        timer = setInterval(scroll, rtools.scroll.speed);
    }
    function scroll() {
        top = $("#chapfoot").scrollTop();
        window.scrollBy(0,1); 
        if(top>=height)stopTimer();
        //console.log(top+" : "+height)
    }
    function stopTimer() {
        clearInterval(timer);
    }
    return {starts:startTimer,stops:stopTimer};
})(),
rtools.scroll.isShow = !1,
rtools.scroll.speed = 50,
rtools.scroll.isstop = 1,
rtools.scroll.speedup = function(){
    var realspeed = rtools.scroll.speed, speed = 100 - realspeed;
    if(speed<=90){
        rtools.scroll.speed-=10;
    }
    rtools.scroll.start();
},
rtools.scroll.reduce = function(){
    var realspeed = rtools.scroll.speed, speed = 100 - realspeed;
    if(speed>10)rtools.scroll.speed+=10;
    else return;
    rtools.scroll.start()
},
rtools.scroll.stop = function(){
    rtools.scroll.isstop = 1;
    rtools.scroll.stops();
    rtools.scroll.showSpeed();
    rtools.scroll.coveroff()
//    $("#t-s-s").html("?").off("click").on("click",rtools.scroll.start);
},
rtools.scroll.start = function(){
    rtools.scroll.isstop = 0;
    rtools.scroll.starts();
    rtools.scroll.showSpeed();
    rtools.scroll.coveron();
    rtools.setting.speed = rtools.scroll.speed;
    var setting = JSON.stringify(rtools.setting);
    window.localStorage.setItem("kssetting",setting);
//    $("#t-s-s").html("||").off("click").on("click",rtools.scroll.stop);
},
rtools.scroll.showSpeed = function(){
    if(rtools.scroll.timer)clearTimeout(rtools.scroll.timer);
    $("#t-s-n").html(100-rtools.scroll.speed).show();
    rtools.scroll.timer = setTimeout(function(){$("#t-s-n").fadeOut()},2000)
},
rtools.scroll.launch = function(){
    if(rtools.scroll.isstop){
        rtools.scroll.show();
        rtools.scroll.start();
    }else{
        rtools.scroll.hide();
        rtools.scroll.stop();
    }
},
rtools.scroll.coveron = function(){
    $(".t-scroll-lock").show().off("click").on("click",rtools.scroll.launch);
},
rtools.scroll.coveroff = function(){
    $(".t-scroll-lock").hide().off("click");
},
rtools.scroll.show = function(){
    rtools.scroll.start();
    rtools.animate.show(".t-scrol");
    $("#t-s-i").off("click").on("click",rtools.scroll.speedup);
    $("#t-s-d").off("click").on("click",rtools.scroll.reduce);
    $("#t-s-s").off("click").on("click",rtools.scroll.start);
},
rtools.scroll.hide = function(){
    rtools.animate.hide(".t-scrol", rtools.scroll);
    return !1;
};
rtools.int();