!function(){

	function setCookie(name,value,expires,path,domain,secure){
		var cookie = encodeURIComponent(name)+'='+encodeURIComponent(value);
		if (expires) {
			var exdate = new Date();
			exdate.setDate(exdate.getDate()+expires);
			cookie += ';expires='+exdate.toGMTString(); 
		}
		if (path) {
			cookie += ';path='+path;
		}
		if (domain) {
			cookie += ';domain='+domain;
		}
		if (secure) {
			cookie += ';secure='+secure;
		}
		document.cookie = cookie;
	}
	// function getCookie(c_name){
	// 	if (document.cookie.length>0) {
	// 		c_start = document.cookie.indexOf(c_name+'=');
	// 		if (c_start!==-1) {
	// 			c_start = c_start + c_name.length + 1;
	// 			c_end = document.cookie.indexOf(';',c_start);
	// 			if (c_end === -1) {
	// 				c_end = document.cookie.length
	// 				return unescape(document.cookie.substring(c_start,c_end))
	// 			}
	// 		}
	// 	}
	// 	return "";
	// }

	function getCookie(c_name){
		var cookie={};
		var all=document.cookie;
		if (all==='') {return cookie;}
		var list=all.split('; ');
		for (var i = 0; i < list.length; i++) {
			var item=list[i];
			var p=item.indexOf('=');
			var name=item.substring(0,p);
			name=decodeURIComponent(name);
			var value=item.substring(p+1);
			value=decodeURIComponent(value);
			cookie[name]=value;
		}
		return cookie[c_name];
	}
	//隐藏m-msg节点
	function nodeHidde(id){
		var msg = $(id);
		msg.className+=' f-dn';
	}
	//检查cookie;
	function checknmCookie(){
		var nmCookie=getCookie("nomore");
		if (nmCookie) {
			nodeHidde('m-msg');
		}
	}

	var nmNode = $('m-msg').firstElementChild.lastElementChild;
	nmNode.addEventListener('click',function(){
		nodeHidde('m-msg');
		setCookie("nomore",true,1);
	})

	window.onload = function(){
		checknmCookie();
		if (getCookie('followSuc')) {
			followSuc=true;
		}
		if (getCookie('loginSuc')) {
			loginSuc=true;
		}
		render_focus();
	}

	var followSuc=false;
	var loginSuc=false;
	var _unfocus='<i></i><b>已关注</b><a id="cancleFocus">取消</a>';
	var _focus='<i>+</i><b>关注</b>';

	
	// function unFocus(){
	// 	$('focus').innerHTML=_focus;
	// 	$('focus').className='focus';
	// }
	// function focusing(){
	// 	$('focus').innerHTML=_unfocus;
	// 	$('focus').className='unfocus';
	// }
	function toggleFocus(temp,className){
		$('focus').innerHTML=temp;
		$('focus').className=className;
	}
	function focusing(){
		toggleFocus(_unfocus,'unfocus');
		$('focus').removeEventListener('click',loginTemp);
		$('cancleFocus').addEventListener('click',function(event){
			followSuc=false;
			render_focus();
			event.stopPropagation();
		})
	}
	function loginTemp(){
					var temp= '<div class="g-mask"></div>'
								+'<div class="m-modal m-login">'
									+'<div class="login_head">登录网易云课堂</div>'
									+'<i id="unlogin">X</i>'
									+'<div class="login_body">'
										+'<form method="get"'
											  +'action="http://study.163.com/webDev/login.htm" target="result"'
											  +'enctype="application/x-www-form-urlencoded" name="login">'
											+'<input name="userName" type="text" placeholder="账号" required>'
											+'<input name="password" type="password" placeholder="密码" required>'
											+'<button id="login" style="display: none;"></button>'
											+'<label for="login">登录</label>'
										+'</form>'
									+'</div>'
								+'</div>';
					
					
					$('modal').innerHTML=temp;
					$('unlogin').addEventListener('click',function(){
						$('modal').innerHTML='';
					});
					//获取表单节点
					var loginForm=document.forms.login;
					loginForm.addEventListener('submit',function(){
						var userName=this.userName.value;
						var password=this.password.value;
						var name_pass=userName==='studyOnline'?true:false;
						var word_pass=password==='study.163.com'?true:false;
						if (name_pass&&word_pass) {
							this.userName.value=md5(userName);
							this.password.value=md5(password);
							$('modal').innerHTML='';
							setCookie('loginSuc',true,2);
							setCookie('followSuc',true,1);
							loginSuc=true;
							followSuc=true;
							render_focus();
						}else if(!name_pass){
							clearClass(this.userName);
							addClass(this.userName,'err');
							return;
						}else if(!word_pass){
							clearClass(this.password);
							addClass(this.password,'err');
							return;
						}
						
					});
					loginForm.userName.addEventListener('focus',function(event){
						event.preventDefault;
						this.value='';
						clearClass(this);
						addClass(this,'fc');
					});
					loginForm.userName.addEventListener('blur',function(){
						clearClass(this);
					});
					loginForm.password.addEventListener('focus',function(event){
						event.preventDefault;
						this.value='';
						clearClass(this);
						addClass(this,'fc');
					});
					loginForm.password.addEventListener('blur',function(){
						clearClass(this);
					});

					// $('result').addEventListener('load',function(){
					// 	var result = JSON.parse(this.contentWindow.document.body.textContent);
					// });
				}
	function render_focus(){
		if (followSuc) {
			focusing();
		}else{
			toggleFocus(_focus,'focus');
			if (loginSuc) {
				$('focus').addEventListener('click',focusing);
			}else{
				toggleFocus(_focus,'focus');
				$('focus').addEventListener('click',loginTemp);
			}
		}
	}


	// if (focus) {
	// 	$('focus').innerHTML=_unfocus;
	// 	$('focus').className='unfocus';
	// }else{
	// 	$('focus').innerHTML=_focus;
	// 	$('focus').className='focus';
	// 	$('focus').addEventListener('click',function(){
	// 		var temp= '<div class="g-mask"></div>'
	// 					+'<div class="m-modal m-login">'
	// 						+'<div class="login_head">登录网易云课堂</div>'
	// 						+'<i id="unlogin">X</i>'
	// 						+'<div class="login_body">'
	// 							+'<form method="get"'
	// 								  +'action="http://study.163.com/webDev/login.htm" target="result"'
	// 								  +'enctype="application/x-www-form-urlencoded" name="login">'
	// 								+'<input name="userName" type="text" placeholder="账号" required>'
	// 								+'<input name="password" type="password" placeholder="密码" required>'
	// 								+'<button id="login" style="display: none;"></button>'
	// 								+'<label for="login">登录</label>'
	// 							+'</form>'
	// 						+'</div>'
	// 					+'</div>';
			
			
	// 		$('modal').innerHTML=temp;
	// 		$('unlogin').addEventListener('click',function(){
	// 			$('modal').innerHTML='';
	// 		});
	// 		//获取表单节点
	// 		var loginForm=document.forms.login;
	// 		loginForm.addEventListener('submit',function(){
	// 			var userName=this.userName.value;
	// 			var password=this.password.value;
	// 			var name_pass=userName==='studyOnline'?true:false;
	// 			var word_pass=password==='study.163.com'?true:false;
	// 			if (name_pass&&word_pass) {
	// 				this.userName.value=md5(userName);
	// 				this.password.value=md5(password);
	// 				$('modal').innerHTML='';
	// 				setCookie('loginSuc',true,1);
	// 				// $('focus').innerHTML=;
	// 			}else if(!name_pass){
	// 				clearClass(this.userName);
	// 				addClass(this.userName,'err');
	// 			}else if(!word_pass){
	// 				clearClass(this.password);
	// 				addClass(this.password,'err');
	// 			}
				
	// 		});
	// 		loginForm.userName.addEventListener('focus',function(event){
	// 			event.preventDefault;
	// 			this.value='';
	// 			clearClass(this);
	// 			addClass(this,'fc');
	// 		});
	// 		loginForm.userName.addEventListener('blur',function(){
	// 			clearClass(this);
	// 		});
	// 		loginForm.password.addEventListener('focus',function(event){
	// 			event.preventDefault;
	// 			this.value='';
	// 			clearClass(this);
	// 			addClass(this,'fc');
	// 		});
	// 		loginForm.password.addEventListener('blur',function(){
	// 			clearClass(this)
	// 		});

	// 		$('result').addEventListener('load',function(){
	// 			var result = JSON.parse(this.contentWindow.document.body.textContent);
	// 		});
	// 	});
	// };
	
	
	

	//-------------------------banner动画-------------------
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

	//----------------------Tab切换-----------------
	function ajax(node,_config,page){
		var xhr = new XMLHttpRequest();
	    xhr.open('GET',_config.url+'?pageNo='+_config.pageNo+'&psize='+_config.psize+'&type='+_config.type,true);
	    xhr.onload = function(){
	    	var data = JSON.parse(xhr.responseText);
	    	_config.totalPage=data.totalPage;
	        render(node,data);

	        if (page) {render_page($('page'),data);}
	    };
	    xhr.send(null);
	};
	// function _ajax(){
	// 	var xhr = new XMLHttpRequest();
	//     xhr.open('GET','http://study.163.com/webDev/login.htm?userName='+md5('studyOnline')+'&password='+md5('study.163.com'));
	//     xhr.onload = function(){
	//     	console.log(JSON.parse(xhr.responseText));
	//     };
	//     xhr.send(null);
	// };
	// _ajax();

	var _config={
		url:'http://study.163.com/webDev/couresByCategory.htm',
		pageNo:1,
		psize:20,
		type:10
	};
	ajax($('cs_list'),_config,true);
    function render(node,data){
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
				    			+'<img src="'+list[i].middlePhotoUrl+'" alt="">'
				    			+'<h3>'+list[i].name+'</h3>'
				    			+'<div class="provider">'+list[i].provider+'</div>'
				    			+'<div class="count"><i class="icon"></i><span>'+list[i].learnerCount+'</span></div>'
		    					+'<div class="price"><span>'+list[i].price+'</span></div>'
	    					+'</a>'
	    			  	+'</li>'
	    	;
	    }
	    node.innerHTML = temp;
	}
	//渲染分页器
	function render_page(node,data){
	    var temp = '<li class="item f-fl z-idx"><a href="#course">1</a></li>';
	    var pages=data.totalPage;
		for (var i = 1; i < pages; i++) {
			var pageNo=i-0+1;
	    	temp +='<li class="item f-fl"><a href="#course">'+pageNo+'</a></li>'
	    	;
	    }
	    node.innerHTML=temp;
		
		//给分页按钮绑定事件
		var pageBtn = $('m-pages').getElementsByClassName('item');
		$('page').addEventListener('click',function(event){
			var target=event.target;
			var itemNode=target.parentNode;
			if (target&&target.nodeName==='A') {
				_config.pageNo=Number(target.innerText);
				ajax($('cs_list'),_config,false);
				shiftPageBtn();
			}
		});
	}
	function shiftPageBtn(){
		var pageBtn = $('m-pages').getElementsByClassName('item');
		for (var i = 0; i < pageBtn.length; i++) {
			removeClass(pageBtn[i],'z-idx');
			if (pageBtn[i].innerText==_config.pageNo) {
				addClass(pageBtn[i],'z-idx');
			}
		}
	}
	//Tab按钮切换
	var pdBtn = $('course').getElementsByClassName('btn1')[0];
	var codeBtn = $('course').getElementsByClassName('btn2')[0];
	codeBtn.addEventListener('click',function(){
		removeClass(pdBtn,'z-crt');
		addClass(this,'z-crt');
		_config.pageNo=1;
		_config.type=20;
		ajax($('cs_list'),_config,true)
	});
	pdBtn.addEventListener('click',function(event){
		removeClass(codeBtn,'z-crt');
		addClass(this,'z-crt');
		_config.pageNo=1;
		_config.type=10;
		ajax($('cs_list'),_config,true);
	});

	//------------分页器prev、next按钮
	$('prev').addEventListener('click',function(event){
		if (_config.pageNo>1) {
			_config.pageNo--;
			ajax($('cs_list'),_config);
			shiftPageBtn();
		}else{
			event.preventDefault();
		}
	});
	$('next').addEventListener('click',function(event){
		if (_config.totalPage-_config.pageNo) {
			_config.pageNo++;
			ajax($('cs_list'),_config);
			shiftPageBtn();
		}else{
			event.preventDefault();
		}
	});
	//------------------------Tab切换-------------------
	
	//-----------------------最热排行---------------
	function ajax_hot(node,url){
		var xhr = new XMLHttpRequest();
	    xhr.open('GET',url,true);
	    xhr.onload = function(){
	        // render(parent,JSON.parse(xhr.responseText));
	        render_top(node,JSON.parse(xhr.responseText));
	 
	    };
	    xhr.send(null);
	}
	ajax_hot($('top_list'),'http://study.163.com/webDev/hotcouresByCategory.htm');
    function render_top(node,data){
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
	//-----------------------最热排行---------------
	

	//-----------------------视频弹窗--------------------
	//弹出视频
	$('vd_img').addEventListener('click',function(){
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
		//关闭视频
		$('cls_vd').addEventListener('click',function(){
			$('modal').innerHTML="";
		});
	});
	
	//-----------------------视频弹窗--------------------
	

	//---------------------通用方法------------------------
	function $(id){
		return document.getElementById(id);
	}
	function removeClass(node,className){
		node.classList.remove(className);
	}
	function addClass(node,className){
		node.classList.add(className);
	}
	function toggleClass(node,className){
		node.className = className;
	}
	function clearClass(node){
		node.classList='';
	}
	//MD5
	function md5(string){
                function md5_RotateLeft(lValue, iShiftBits) {
                        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
                }
                function md5_AddUnsigned(lX,lY){
                        var lX4,lY4,lX8,lY8,lResult;
                        lX8 = (lX & 0x80000000);
                        lY8 = (lY & 0x80000000);
                        lX4 = (lX & 0x40000000);
                        lY4 = (lY & 0x40000000);
                        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
                        if (lX4 & lY4) {
                                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                        }
                        if (lX4 | lY4) {
                                if (lResult & 0x40000000) {
                                        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                                } else {
                                        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                                }
                        } else {
                                return (lResult ^ lX8 ^ lY8);
                        }
                }         
                function md5_F(x,y,z){
                        return (x & y) | ((~x) & z);
                }
                function md5_G(x,y,z){
                        return (x & z) | (y & (~z));
                }
                function md5_H(x,y,z){
                        return (x ^ y ^ z);
                }
                function md5_I(x,y,z){
                        return (y ^ (x | (~z)));
                }
                function md5_FF(a,b,c,d,x,s,ac){
                        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
                        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
                }; 
                function md5_GG(a,b,c,d,x,s,ac){
                        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
                        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
                };
                function md5_HH(a,b,c,d,x,s,ac){
                        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
                        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
                }; 
                function md5_II(a,b,c,d,x,s,ac){
                        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
                        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
                };
                function md5_ConvertToWordArray(string) {
                        var lWordCount;
                        var lMessageLength = string.length;
                        var lNumberOfWords_temp1=lMessageLength + 8;
                        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
                        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
                        var lWordArray=Array(lNumberOfWords-1);
                        var lBytePosition = 0;
                        var lByteCount = 0;
                        while ( lByteCount < lMessageLength ) {
                                lWordCount = (lByteCount-(lByteCount % 4))/4;
                                lBytePosition = (lByteCount % 4)*8;
                                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                                lByteCount++;
                        }
                        lWordCount = (lByteCount-(lByteCount % 4))/4;
                        lBytePosition = (lByteCount % 4)*8;
                        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
                        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
                        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
                        return lWordArray;
                }; 
                function md5_WordToHex(lValue){
                        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
                        for(lCount = 0;lCount<=3;lCount++){
                                lByte = (lValue>>>(lCount*8)) & 255;
                                WordToHexValue_temp = "0" + lByte.toString(16);
                                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
                        }
                        return WordToHexValue;
                };
                function md5_Utf8Encode(string){
                        string = string.replace(/\r\n/g,"\n");
                        var utftext = ""; 
                        for (var n = 0; n < string.length; n++) {
                                var c = string.charCodeAt(n); 
                                if (c < 128) {
                                        utftext += String.fromCharCode(c);
                                }else if((c > 127) && (c < 2048)) {
                                        utftext += String.fromCharCode((c >> 6) | 192);
                                        utftext += String.fromCharCode((c & 63) | 128);
                                } else {
                                        utftext += String.fromCharCode((c >> 12) | 224);
                                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                                        utftext += String.fromCharCode((c & 63) | 128);
                                } 
                        } 
                        return utftext;
                }; 
                var x=Array();
                var k,AA,BB,CC,DD,a,b,c,d;
                var S11=7, S12=12, S13=17, S14=22;
                var S21=5, S22=9 , S23=14, S24=20;
                var S31=4, S32=11, S33=16, S34=23;
                var S41=6, S42=10, S43=15, S44=21;
                string = md5_Utf8Encode(string);
                x = md5_ConvertToWordArray(string); 
                a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476; 
                for (k=0;k<x.length;k+=16) {
                        AA=a; BB=b; CC=c; DD=d;
                        a=md5_FF(a,b,c,d,x[k+0], S11,0xD76AA478);
                        d=md5_FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
                        c=md5_FF(c,d,a,b,x[k+2], S13,0x242070DB);
                        b=md5_FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
                        a=md5_FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
                        d=md5_FF(d,a,b,c,x[k+5], S12,0x4787C62A);
                        c=md5_FF(c,d,a,b,x[k+6], S13,0xA8304613);
                        b=md5_FF(b,c,d,a,x[k+7], S14,0xFD469501);
                        a=md5_FF(a,b,c,d,x[k+8], S11,0x698098D8);
                        d=md5_FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
                        c=md5_FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
                        b=md5_FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
                        a=md5_FF(a,b,c,d,x[k+12],S11,0x6B901122);
                        d=md5_FF(d,a,b,c,x[k+13],S12,0xFD987193);
                        c=md5_FF(c,d,a,b,x[k+14],S13,0xA679438E);
                        b=md5_FF(b,c,d,a,x[k+15],S14,0x49B40821);
                        a=md5_GG(a,b,c,d,x[k+1], S21,0xF61E2562);
                        d=md5_GG(d,a,b,c,x[k+6], S22,0xC040B340);
                        c=md5_GG(c,d,a,b,x[k+11],S23,0x265E5A51);
                        b=md5_GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
                        a=md5_GG(a,b,c,d,x[k+5], S21,0xD62F105D);
                        d=md5_GG(d,a,b,c,x[k+10],S22,0x2441453);
                        c=md5_GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
                        b=md5_GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
                        a=md5_GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
                        d=md5_GG(d,a,b,c,x[k+14],S22,0xC33707D6);
                        c=md5_GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
                        b=md5_GG(b,c,d,a,x[k+8], S24,0x455A14ED);
                        a=md5_GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
                        d=md5_GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
                        c=md5_GG(c,d,a,b,x[k+7], S23,0x676F02D9);
                        b=md5_GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
                        a=md5_HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
                        d=md5_HH(d,a,b,c,x[k+8], S32,0x8771F681);
                        c=md5_HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
                        b=md5_HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
                        a=md5_HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
                        d=md5_HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
                        c=md5_HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
                        b=md5_HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
                        a=md5_HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
                        d=md5_HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
                        c=md5_HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
                        b=md5_HH(b,c,d,a,x[k+6], S34,0x4881D05);
                        a=md5_HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
                        d=md5_HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
                        c=md5_HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
                        b=md5_HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
                        a=md5_II(a,b,c,d,x[k+0], S41,0xF4292244);
                        d=md5_II(d,a,b,c,x[k+7], S42,0x432AFF97);
                        c=md5_II(c,d,a,b,x[k+14],S43,0xAB9423A7);
                        b=md5_II(b,c,d,a,x[k+5], S44,0xFC93A039);
                        a=md5_II(a,b,c,d,x[k+12],S41,0x655B59C3);
                        d=md5_II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
                        c=md5_II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
                        b=md5_II(b,c,d,a,x[k+1], S44,0x85845DD1);
                        a=md5_II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
                        d=md5_II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
                        c=md5_II(c,d,a,b,x[k+6], S43,0xA3014314);
                        b=md5_II(b,c,d,a,x[k+13],S44,0x4E0811A1);
                        a=md5_II(a,b,c,d,x[k+4], S41,0xF7537E82);
                        d=md5_II(d,a,b,c,x[k+11],S42,0xBD3AF235);
                        c=md5_II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
                        b=md5_II(b,c,d,a,x[k+9], S44,0xEB86D391);
                        a=md5_AddUnsigned(a,AA);
                        b=md5_AddUnsigned(b,BB);
                        c=md5_AddUnsigned(c,CC);
                        d=md5_AddUnsigned(d,DD);
                }
        return (md5_WordToHex(a)+md5_WordToHex(b)+md5_WordToHex(c)+md5_WordToHex(d)).toLowerCase();
	}

	//---------------------------------------------
}()