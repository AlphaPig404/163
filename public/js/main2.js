/**
 * 第一版本没有考虑ie的兼容性，事件用的addEventListener,而且代码结构混乱，
 * 各种功能混杂在一起，我自己都难读懂。。于是决定重构一下
 * 目标是结构清晰，可读性好，兼容ie8+
 * 2017.2.16
 */

!function(window){

	//===========================通用方法的封装 start===================
	/**
	 * [EventUtil]封装兼容所有浏览器的事件对象
	 */
	var EventUtil = (function(){
		
		function addHandler(element,type,handle){
			if (element.addEventListener) {
				element.addEventListener(type,handle,false);
			}else if(element.attachEvent){
				element.attachEvent('on'+type,handle);
			}else{
				element['on'+type] = handle;
			}
		}

		function removeHandler(element,type,handle){
			if (element.removeEventListener) {
				element.removeEventListener(type,handle,false);
			}else if (event.detachEvent) {
				element.detachEvent('on'+type,handle);
			}else{
				element['on'+type,handle];
			}
		}

		function getEvent(event){
			return event?event:window.event;
		}

		function getTarget(event){
			return event.target || event.srcElement;
		}

		function preventDefault(event){
			if (event.preventDefault) {
				event.preventDefault();
			}else{
				event.returnValue = false;
			}
		}

		function stopPropagation(event){
			if (event.stopPropagation) {
				event.stopPropagation();
			}else{
				event.cancelBuble = true;
			}
		}

		return{
			addHandler      : addHandler,
			removeHandler   : removeHandler,
			getEvent        : getEvent,
			getTarget       : getTarget,
			preventDefault  : preventDefault,
			stopPropagation : stopPropagation
		}
	})();

	/**
	 * 封装cookie相关的操作
	 * 
	 * @return {Object}           
	 */
	var CookieUtil = (function(){
		// 将cookie字符串转化为对象
		function getCookies(){
			var cookies={};
			if (document.cookie) {
				var arr = document.cookie.split('; ');
				for(var i in arr){
					var index = arr[i].indexOf('='),
						name = arr[i].substr(0,index),
						value=arr[i].substr(index+1,arr[i].length);
					cookies[name] = value;
				}
			}
			return cookies;
		}

		// 设置cookie
		function set(name,value,opts){
			// opts expires,path,domain,secure
			if(name&&value){
				var cookie = encodeURIComponent(name)+'='+encodeURIComponent(value);
				// 可选参数
				if (opts) {
					if (opts.expires) {
						// 要求expires传入的是天数
						var exdate = new Date();
						exdate.setDate(exdate.getDate()+expires);
						cookie += ';expires='+exdate.toGMTString();
					}
					if (opts.path) {
						cookie += '; path='+opts.path;
					}
					if (opts.domain) {
						cookie +='; domain='+opts.domain;
					}
					if (opts,secure) {
						cookie +='; secure';
					}
				}
				document.cookie = cookie;
				return cookie;
			}else{
				return '';
			}
		}

		// 获取cookie
		function get(name){
			if(getCookies()[name]){
				return decodeURIComponent(getCookies()[name])
			}else{
				return null;
			}
			
		}

		// 清除某个cookie
		function remove(name){
			if (getCookies()[name]) {
				set(name,"",-1);
			}
		}

		// 清除所有cookie
		function clear(){
			var cookies = getCookies();
			for(var key in cookies){
				set(key,"",-1);
			}
		}

		return {
			getCookies:getCookies,
			get:get,
			set:set,
			remove:remove,
			clear:clear
		}
	})();
	/**
	 * [ajax 封装ajax对象]
	 * @param  {object} opt 选项配置
	 * @param  {string} opt.method 请求的方法
	 * @param  {string} opt.url 请求的地址
	 * @param  {string} opt.data 请求的参数
	 * @param  {boolean} opt.async 是否使用异步请求
	 *
	 * @param  {function} callback 请求成功后的回调
	 */
	function ajax(opt,callback){
		var opt = opt||{};
		var method = opt.method.toUpperCase() || 'GET';
		var url = opt.url || '';
		var async = opt.async || true ;
		var data=opt.data?serialize(opt.data):'';
		// var callback = opt.success || function(){};

		var grtURL = data?url+'?'+data:url;
		
		function serialize(obj){
			if (!obj) return '';
			var pairs=[];
			for (var name in obj){
				if (!obj.hasOwnProperty(name)) continue;
				if (typeof obj[name]==='function') continue;
				var value = obj[name].toString();
				name = encodeURIComponent(name);
				value = encodeURIComponent(value);
				pairs.push(name+'='+value);
			}
			return pairs.join('&');
		}

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange=function(){
				if (xhr.readyState == 4 ) {
					if ((xhr.status>=200&&xhr.status<300)||xhr.status==304) {
					callback(xhr.responseText);
					}
				}
		}
		if (method === 'GET') {
			xhr.open(method,grtURL,async);
			xhr.send(null);		
		}else if (method === 'POST') {
			 xht.open(method, url , async);
             xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
             xhr.send(data);
		}else {
			alert('不支持GET/POST以外的方法！');
		}
		
		
	}	

	//------------------ 自定义通用方法---------------
	
	function $(id){
		return document.getElementById(id);
	}

	function addClass(node,className){
		node.classList.add(className);
	}

	function removeClass(node,className){
		node.classList.remove(className);
	}

	//-------------------------banner动画-------------------
	// 还是以前的代码，有时间再改
	var crtIndex = 0;
	function slide(){
		var list= $('sliders').getElementsByTagName('li');
		var btns= $('btns').getElementsByTagName('i');
		var c_i = (crtIndex+1)%list.length;
		var c_j = crtIndex%list.length;
		list[c_j].classList.remove('active');
		btns[c_j].classList.remove('z-crt');
		list[c_i].className += ' active';
		btns[c_i].className += ' z-crt';
		crtIndex++;
	}
	var timer=setInterval(slide,5000);

	$('banner').addEventListener('mouseover',function(){
		clearInterval(timer);
	});
	$('banner').addEventListener('mouseleave',function(){
		timer=setInterval(slide,5000);
	});
	$('btns').addEventListener('click',function(event){
		if (event.target&&event.target.nodeName==='I') {
		var target = event.target;
		var iTag = this.getElementsByTagName('i');
		var liTag= this.getElementsByTagName('li');
		var liTarget =target.parentNode; 
		var index = Number(liTarget.dataset.index);
		var imgs = $('sliders').getElementsByTagName('li');
		for (var i = 0; i < iTag.length; i++) {
			iTag[i].classList.remove('z-crt');
		}
		target.className += ' z-crt';
		for (var j = 0; j < imgs.length; j++) {
			imgs[j].classList.remove('active');
		}
		imgs[index].className += ' active';
		crtIndex = index;
		}
	});
	//-------------------------banner--------------
	//=============================通用方法的封装 end====================
	
	//=============================主要逻辑 start=====================

	// --------------------------共用状态管理
	var config={
		method:'GET',
		url:'http://study.163.com/webDev/couresByCategory.htm',
		data:{
			pageNo:1,
			psize:20,
			type:10
		},
		// success:function(res){
		// 	var data = JSON.parse(res);
			
		// },
		async:true
	};
	var renderData;
	var renderUI;
	var pages;
	var body=document.getElementsByTagName('body')[0];

	// ------------定义mian方法，为程序的入口
	function main(){
		renderData = RenderModel();
		renderUI = RenderUI();
		renderData.listData(renderUI.allRender);
		renderData.rankData(renderUI.rankRender);
		renderUI.focusRender();
	

		// 事件绑定
		eventHanler();
	}

	// ------------M层，利用ajax获取数据
	function RenderModel(){
		var _config = {
			method:'GET',
			url:'http://study.163.com/webDev/hotcouresByCategory.htm',
			async:true

		} ;

		// 获取list数据
		function listData(callback){
			ajax(config,function(Json_Data){
				var obj = JSON.parse(Json_Data);
				callback&callback(obj);
			});
		}

		// 获取rank数据
		function rankData(callback){
			ajax(_config,function(Json_Data){
				var obj = JSON.parse(Json_Data);
				callback&&callback(obj);
			})
		}

		return{
			listData:listData,
			rankData:rankData,
		}
	}

	// ========================View层，页面渲染=========================
	function RenderUI(){
		// 课程列表渲染
		function listRender(data){
		    var list = data.list;
		    var temp = new String();
		    for (var i = 0; i < list.length; i++) {
		    	if (list[i].price) {
					list[i].price="¥ "+list[i].price.toFixed(2);
				}else{
					list[i].price="免费";
				}
		    	temp +='<li class="f-fl">'
		    					+'<a href="'+list[i].providerLink+'" class="f-db" target="_blank">'
					    			+'<img src="'+list[i].middlePhotoUrl.replace(/http/i,"https")+'" alt="">'
					    			+'<h3>'+list[i].name+'</h3>'
					    			+'<div class="provider">'+list[i].provider+'</div>'
					    			+'<div class="count"><i class="icon"></i><span>'+list[i].learnerCount+'</span></div>'
			    					+'<div class="price"><span>'+list[i].price+'</span></div>'
		    					+'</a>'
		    			  	+'</li>'
		    	;
		    }
		    $('cs_list').innerHTML = temp;
		}
		// 分页器渲染
		function pageRender(data){
		    var temp = '<li class="item f-fl z-idx"><a href="#course">1</a></li>';
		    pages=data.totalPage;
			for (var i = 1; i < pages; i++) {
				var pageNo=i-0+1;
		    	temp +='<li class="item f-fl"><a href="#course">'+pageNo+'</a></li>'
		    	;
		    }
		    $('page').innerHTML=temp;
		}

		// 侧边栏排行榜渲染
		function rankRender(data){
		    var list = data;
		    var temp = new String();
		   	list.sort(function(a,b){
		   		return b.learnerCount-a.learnerCount;
		   	});
		    for (var i = 0; i < 11; i++) {

		    	temp +='<li class="f-cb">'
								+'<a href="'+list[i].providerLink+'" class="f-db" target=_blank>'
									+'<img class="f-fl" src="'+list[i].smallPhotoUrl+'" alt="">'
									+'<div class="flow">'
										+'<h3 class="f-thide">'+list[i].name+'</h3>'
										+'<div class="f-pr">'
											+'<i class="icon f-pa"></i>'
											+'<span >'+list[i].learnerCount+'</span>'
										+'</div>'
									+'</div>'
								+'</a>'
							+'</li>'
		    	;
		    }
		    $('top_list').innerHTML = temp;
		}

		// 课程列表和下放的按钮一起渲染
		function allRender(data){
			listRender(data);
			pageRender(data);
		}

		// 渲染关注按钮
		function focusRender(){
			var _unfocus='<i></i><b>已关注</b><a id="cancleFocus">取消</a>';
			var _focus='<i>+</i><b>关注</b>';
			var focused=CookieUtil.get('focused');
			var focusNode=$('focus');

			if (!focused) {
				focusNode.innerHTML = _focus;
				removeClass(focusNode,'unfocus');
			}else{
				$('focus').innerHTML = _unfocus;
				removeClass(focusNode,'focus');
			}
		}
		
		return {
			listRender:listRender,
			pageRender:pageRender,
			rankRender:rankRender,
			allRender:allRender,
			focusRender:focusRender
		}
	};

	// --------------Control层，事件绑定
	function eventHanler(){
		// Tap按钮切换事件
		// “产品设计”按钮
		EventUtil.addHandler($('btn_pd'),'click',onShiftPd);
		// “编程语言”按钮
		EventUtil.addHandler($('btn_cd'),'click',onShiftCd);
		// 页面切换事件代理
		EventUtil.addHandler($('page'),'click',onShiftPg);
		// '前一页'事件
		EventUtil.addHandler($('prev'),'click',onPrev);
		// '下一页'事件
		EventUtil.addHandler($('next'),'click',onNext);
		// 视频弹窗
		EventUtil.addHandler($('vd_img'),'click',onVedio);

		// ESC事件
		EventUtil.addHandler(body,'keydown',onEsc);
	}


	//----------------事件处理函数------------------------------------
	
	function onShiftPd(){
		addClass(this,'z-crt');
		removeClass($('btn_cd'),'z-crt');
		config.data.type = 10;
		renderData.listData(renderUI.allRender);
	}

	function onShiftCd(){
		addClass(this,'z-crt');
		removeClass($('btn_pd'),'z-crt');
		config.data.type = 20;
		renderData.listData(renderUI.allRender);
	}

	function onShiftPg(event){
		var event=EventUtil.getEvent(event);
		var target=EventUtil.getTarget(event);
		var items = this.childNodes;
		if (target&&target.nodeName==='A') {
			for (var i = 0; i < items.length; i++) {
				removeClass(items[i],'z-idx');
			}
			addClass(target.parentNode,'z-idx');
			config.data.pageNo = target.innerText;
			renderData.listData(renderUI.listRender);
		}
		EventUtil.preventDefault(event);
	}

	function onPrev(event){
		var items=$('page').childNodes;
		if (config.data.pageNo>1) {
			removeClass(items[config.data.pageNo-1],'z-idx');
			config.data.pageNo -= 1;
			addClass(items[config.data.pageNo-1],'z-idx');
			renderData.listData(renderUI.listRender);
			EventUtil.preventDefault(event);
		}else{
			EventUtil.preventDefault(event);
		}
	}

	function onNext(event){
		var items=$('page').childNodes;
		if (config.data.pageNo<pages) {
			removeClass(items[config.data.pageNo-1],'z-idx');
			config.data.pageNo += 1;
			addClass(items[config.data.pageNo-1],'z-idx');
			renderData.listData(renderUI.listRender);
			EventUtil.preventDefault(event);
		}else{
			EventUtil.preventDefault(event);
		}
	}

	function onVedio(){
		var temp=	'<div class="g-mask"></div>'
					+'<div class="m-video m-modal">'
						+'<h2>请观看下面的视频</h2>'
						+'<i class="icon" id="cls_vd">X</i>'
						+'<video  class="video" controls="controls" autoplay>'
						+'<source src="http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4" type="video/mp4">'
						+'</video>'
						+'</div>'
					+'</div>'
		;
		$('modal').innerHTML=temp;

		var $my_vd = $('modal').getElementsByTagName('video')[0];
		// 暂停事件
		EventUtil.addHandler($my_vd,'click',onPause);
		//退出事件
		EventUtil.addHandler($('cls_vd'),'click',onClsVd);
	}

	function onClsVd(){
		$('modal').innerHTML='';
	}

	function onEsc(event){
		var event = EventUtil.getEvent(event);
		if (event.keyCode==27) {
			$('modal').innerHTML='';
		}
	}

	var paused = false;
	function onPause(){
		if(paused){
			this.play();
		}else{
			this.pause();
		}
		paused = !paused;
	}

	// -----------------------------初始化
	main();
	//-----------------------主要逻辑 end----------------------
	
}(window);