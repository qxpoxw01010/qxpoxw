/*jQuery Cookie Plugin v1.4.0 Copyright 2013 Klaus Hartl Released under the MIT license*/
(function(factory){if(typeof define==='function'&&define.amd){define(['jquery'],factory)}else{factory(jQuery)}}(function($){var pluses=/\+/g;function encode(s){return config.raw?s:encodeURIComponent(s)}function decode(s){return config.raw?s:decodeURIComponent(s)}function stringifyCookieValue(value){return encode(config.json?JSON.stringify(value):String(value))}function parseCookieValue(s){if(s.indexOf('"')===0){s=s.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,'\\')}try{s=decodeURIComponent(s.replace(pluses,' '))}catch(e){return}try{return config.json?JSON.parse(s):s}catch(e){}}function read(s,converter){var value=config.raw?s:parseCookieValue(s);return $.isFunction(converter)?converter(value):value}var config=$.cookie=function(key,value,options){if(value!==undefined&&!$.isFunction(value)){options=$.extend({},config.defaults,options);if(typeof options.expires==='number'){var days=options.expires,t=options.expires=new Date();t.setDate(t.getDate()+days)}return(document.cookie=[encode(key),'=',stringifyCookieValue(value),options.expires?'; expires='+options.expires.toUTCString():'',options.path?'; path='+options.path:'',options.domain?'; domain='+options.domain:'',options.secure?'; secure':''].join(''))}var result=key?undefined:{};var cookies=document.cookie?document.cookie.split('; '):[];for(var i=0,l=cookies.length;i<l;i++){var parts=cookies[i].split('=');var name=decode(parts.shift());var cookie=parts.join('=');if(key&&key===name){result=read(cookie,value);break}if(!key&&(cookie=read(cookie))!==undefined){result[name]=cookie}}return result};config.defaults={};$.removeCookie=function(key,options){if($.cookie(key)!==undefined){$.cookie(key,'',$.extend({},options,{expires:-1}));return true}return false}}));
/*history*/
function sethistory(aid,cid,cname) {
	var log = gethistory();
	var time = Math.floor(new Date().getTime()/1000);
	if (log.length == 0) return $.cookie('jieqiHistory', aid+'-'+cid+'-'+escape(cname)+'-'+time, {expires:10,path:'/'});
	var historyabc = '';
	$.each(log,function(i,val){
		if (val.indexOf(aid+'-') === 0) {
			if (cid == 0 && val.split('-')[1] > 0) cid = val.split('-')[1];
			if (cname == '' && val.split('-')[2] != '') cname = unescape(val.split('-')[2]);
		} else {
			historyabc += '|' + val;
		}
	});
	$.cookie('jieqiHistory', aid+'-'+cid+'-'+escape(cname)+'-'+time + historyabc, {expires:10,path:'/'});
}
function gethistory() {
	var log = $.cookie('jieqiHistory');
	var list = [];
	if ("string" != typeof log || "" === log) return list;
	var reg = /^\d+-\d+-.*?-\d{10}$/;
	$.each(log.split('|'), function(i, val){
		if (reg.test(val)) {
			list.push(val);
		}
	});
	return list;
}
$().ready(function(){
	if ("undefined" == typeof articleid) return;
	if ("undefined" == typeof chapterid) chapterid = 0;
	if ("undefined" == typeof chaptername) chaptername = '';
	sethistory(articleid, chapterid, chaptername);
});

function historyabc(){
	var log = $.cookie('jieqiHistory');
	if ("string" != typeof log || "" === log) return;
	$.ajax({
		url: "/modules/article/history.php?ajax_gets=jieqi_contents&ajax_request="+Math.random(),
		type: 'get',
		success : function(data){
			$("#historylist").html(data);
		}
	});
}

function getread(articleid) {
	var log = $.cookie('jieqiHistory');
	if ("string" != typeof log || "" === log) return;
	var reg = new RegExp('(?:^|\|)'+articleid+'-(\\d+)-(.+?)-(\\d{10})(?:\||$)');
	if (reg.test(log)) {
		var read = log.match(reg);
                document.write("<a href=\"http://m.69shu.com/txt/"+articleid+"/"+read[1]+"\">"+unescape(read[2])+"</a>");
	}
}

function getreadd(articleid) {
	var log = $.cookie('jieqiHistory');
	if ("string" != typeof log || "" === log) return;
	var reg = new RegExp('(?:^|\|)'+articleid+'-(\\d+)-(.+?)-(\\d{10})(?:\||$)');
	if (reg.test(log)) {
		var read = log.match(reg);
                document.write("<a href=\"http://m.69shu.com/txt/"+articleid+"/"+read[1]+"\">?入??</a>");
	}
}
function formatDate(time) {
	var date = new Date(time * 1000);
	var month = date.getMonth()+1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	if (month < 10) month = '0' + month;
	if (day < 10) day = '0' + day;
	if (hour < 10) hour = '0' + hour;
	if (minute < 10) minute = '0' + minute;
	return month+'-'+day+' '+hour+':'+minute;
}
$().ready(function(){
	if ("undefined" == typeof articleid) return;
	if ("undefined" == typeof chapterid) chapterid = 0;
	if ("undefined" == typeof chaptername) chaptername = '';
	sethistory(articleid, chapterid, chaptername);
});






//登?
var jieqiNowUrl = window.location.href;
var jieqiUserId = 0;
var jieqiUserName = '';
var jieqiUserPassword = '';
var jieqiNewMessage = 0;
if(document.cookie.indexOf('jieqiUserInfo') >= 0){
	var jieqiUserInfo = get_cookie_value('jieqiUserInfo');
	start = 0;
	offset = jieqiUserInfo.indexOf(',', start); 
	while(offset > 0){
		tmpval = jieqiUserInfo.substring(start, offset);
		tmpidx = tmpval.indexOf('=');
		if(tmpidx > 0){
			tmpname = tmpval.substring(0, tmpidx);
			tmpval = tmpval.substring(tmpidx+1, tmpval.length);
			if(tmpname == 'jieqiUserId') jieqiUserId = tmpval;
			else if(tmpname == 'jieqiUserName_un') jieqiUserName = tmpval;
			else if(tmpname == 'jieqiUserPassword') jieqiUserPassword = tmpval;
			else if(tmpname == 'jieqiNewMessage') jieqiNewMessage = tmpval;
		}
		start = offset+1;
		if(offset < jieqiUserInfo.length){
			offset = jieqiUserInfo.indexOf(',', start); 
			if(offset == -1) offset =  jieqiUserInfo.length;
		}else{
			offset = -1;
		}
	}
}
function get_cookie_value(Name) {
	var search = Name + "=";
	var returnvalue = "";
	if (document.cookie.length > 0) {
		offset = document.cookie.indexOf(search)
		if (offset != -1) {
			offset += search.length 
			end = document.cookie.indexOf(";", offset); 
			if (end == -1) {
				end = document.cookie.length; 
			}
			returnvalue=unescape(document.cookie.substring(offset, end));
		}
	}
	return returnvalue; 
}


function login() {
	if(jieqiUserId != 0 && jieqiUserName != '' && (document.cookie.indexOf('PHPSESSID') != -1 || jieqiUserPassword != '')){
		document.writeln(' <a href="/userdetail.php">?人中心</a>');

if(jieqiNewMessage > 0){
	  document.write(' | <a href="/message.php?box=inbox" target="_top" class="mue1">您有短信</a>');
  }else{
	  document.write(' | <a href="/message.php?box=inbox" target="_top">查看短信</a>');
  }
		document.writeln(' ? <a href="/logout.php?jumpurl='+jieqiNowUrl+'">退出</a>');
	}else{
		document.writeln('<a class="user_login" href="/register.php" rel="nofollow"> <span>注?</span></a>');
		document.writeln('<a class="user_login" href="/login.php?jumpurl='+jieqiNowUrl+'" rel="nofollow"><span>登?</span></a>');
		document.writeln('<a class="user_login" href="/getpass.php?jumpurl='+jieqiNowUrl+'" rel="nofollow"><span>忘?密?</span></a>&nbsp;');
	}
}