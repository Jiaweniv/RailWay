//菜单权限初始化
(function() {
	'use strict';

	var root = '',
		hasGCGK = false,
		_user = JSON.parse(sessionStorage.getItem("MYDAO_USER"));
	//初始化菜单
	$.each(_user.menu, function(index, val) {
		//根目录
		root += '<li class="treeview">';
		//判断是否有子节点
		if(val.child && val.child.length > 0) {
			root += '<a href="#"><i class="' + val.root.icon + '"></i> <span>' + val.root.name + '</span><i class="fa fa-angle-right pull-right"></i></a>';
		} else {
			root += '<a href="#' + val.root.code + '"><i class="' + val.root.icon + '"></i> <span>' + val.root.name + '</span></a>';
		}
		//遍历子节点
		if(val.child && val.child.length > 0) {
			root += '<ul class="treeview-menu">';
			$.each(val.child, function(index, val) {
				if(val.code == 'GCGK') {
					hasGCGK = true;
				}
				root += '<li><a href="#' + val.code + '"><i class="' + val.icon + '"></i><span>' + val.name + '</span></a></li>';
			});
			root += '</ul>';
		}
	});
	//渲染菜单
	$("#MydaoMenu").append(root);
	//初始化用户权限
	$.each(_user.function, function(index, val) {
		Mydao.permissions[val] = true;
	});
	//设定全局参数
	Mydao.config.ajaxParams.base.token = _user.token;
	Mydao.config.ajaxParams.base.userid = _user.userid;
	Mydao.config.ajaxParams.base.clientid = _user.clientid;

	Mydao.config.ajaxParamsNoPage.base.token = _user.token;
	Mydao.config.ajaxParamsNoPage.base.userid = _user.userid;
	Mydao.config.ajaxParamsNoPage.base.clientid = _user.clientid;

	Mydao.clientid = _user.clientid;
	Mydao.centerorgid = _user.centerorgid;
	$("#MydaoUser").append(_user.username);

	//	$("#MydaoMenu").find('a').click(function() {  //面包宵
	//		var _parentLi = $(this).parent('.treeview');
	//		if(_parentLi.length > 0) {
	//			$('#_parentpage').html('<strong>' + _parentLi.find('span').html() + '</strong>').removeClass('hide');
	//			$('#_curpage').addClass('hide');
	//		} else {
	//			var _parent = $(this).parents('ul') && $(this).parents('ul').prev(),
	//				_this = $(this).find('span').html();
	//			if(_parent && _parent.length > 0) {
	//				$('#_parentpage').html('<strong>' + _parent.find('span').html() + '</strong>').removeClass('hide');
	//			} else {
	//				$('#_parentpage').empty().addClass('hide');
	//			}
	//			$('#_curpage').html('<i></i><strong>' + _this + '</strong>').removeClass('hide');
	//		}
	//	});

	//修改密码
	$("#user_password").click(function() {
		layer.open({
			type: 1,
			title: '修改密码',
			btnAlign: 'c',
			content: "",
			area: ["460px", "360px"],
			cancel: function(layero, index) {},
			btn: ['确定', '取消'],
			success: function(layero, index) {
				layero.find('.layui-layer-content').load("view/password.html");
			},
			yes: function(index, layero) {
				$('#user_change_password_panel').trigger('validate');
				if(!$('#user_change_password_panel').data('validator').isFormValid()) {
					return false;
				}
				//密码信息
				var _info = $("#user_change_password_panel").serializeJson();
				_info.id = _user.userid;
				//请求服务器修改密码
				Mydao.ajax(_info, "user/changePassword", function(result) {
					if(result.code == 200) {
						layer.close(index);
						sessionStorage.removeItem('MYDAO_USER');
						location.href = 'login.html';
					} else {
						layer.msg(result.msg);
					}
				});
			}
		});

	});

	//退出
	$("#user_logout").click(function() {
		//询问框
		layer.open({
			title: '消息提示', //标题
			content: '确定要退出登录吗？', //内容
			icon: 3,
			btn: ['确认', '取消'], //按钮
			btnAlign: 'c', //按钮居中
			yes: function(index, layero) {
				Mydao.ajax({
					"userid": _user.userid,
					"token": _user.token
				}, "user/logout", function(result) {
					sessionStorage.removeItem('MYDAO_USER');
					location.href = 'login.html';
				});
			}
		});
	});

	//渲染公共项目选择下拉框
	//	$('[data-toggle="baseSelector"]').each(function(a, b) {
	//		var data = $(b).data();
	//		var params = data.params.toObj ? data.params.toObj() : {}
	//		Mydao.ajax(params, data.url, function(result) {
	//			if(result.code == 200) {
	//				if(data.nodefault) {
	//					$(b).val('').empty();
	//				}
	//				var result = result.result;
	//				for(var i = 0; i < result.length; i++) {
	//					$(b).append($('<option value="' + result[i].id + '">' + result[i].name + '</option>').data(result[i]));
	//				}
	//			} else {
	//				layer.alert(result.msg);
	//			}
	//
	//		}, false);
	//	});

	//默认跳向工程概况
	//	var url = location.hash.replace('#', '');
	//	if (url == '') {
	//		if (!hasGCGK) {
	////			如果没有权限的用户,不会直接跳到 工程概况
	//		} else{
	//			var ItemA = $('[href="#GCGK"]');
	//			ItemA.parents().addClass('active').parents().show(500).parents().addClass('active');
	//			location.href = "#GCGK";
	//		}
	//	}

})();

//下面的代码结构是必需的
var HOME = {}; //默认的部分页面，这将是最初加载
HOME.partial = "home.html";
HOME.init = function() { //引导方法
	//只是静态内容只呈现
};

var notfound = {}; // 404页
notfound.partial = "404.html";
notfound.init = function() {};

var settings = {}; //全局参数
settings.partialCache = {}; //缓存部分页面
settings.content = $("#wrapper-content .sidebar-collapse"); //div用于加载partials
var mydaoSPA = {};

mydaoSPA.render = function(url) {
	settings.rootScope = window[url];
	mydaoSPA.refresh(settings.content, settings.rootScope);
};

mydaoSPA.changeUrl = function() { //处理网址变更
	var url = location.hash.replace('#', '');
	if(url == 'closeall'){
		return false;
	}
	var flag = true;
	var J_iframe = $("<div class='J_iframe'  data-id='" + url + "' ></div>");
	if(url === '' || url === 'HOME') {
		url = 'HOME'; //默认页面
		var shouye = $('.J_iframe[data-id="HOME"]');
		if($('#wrapper-content .J_iframe').size() == 0 || shouye.size() == 0) {
			J_iframe.attr('data-id', url);
			$.get(window[url].partial, function(data) {
				$(settings.content).find('div.J_iframe').hide();
				$(settings.content).append(J_iframe);
				J_iframe.append(data);
			});
		} else {
			$('#wrapper-content .J_iframe').each(function() {
				if($(this).data('id') == url) {
					$(this).show().siblings('.J_iframe').hide();
				}
			});
		}
	}
	if(!window[url]) {
		url = "notfound";
		var found = $('[data-id="notfound"]');
		if(found.size() == 0) {
			$('.J_menuTab').removeClass('active');
			J_iframe.attr('data-id', url);
			var str = '<a href="#' + url + '" class="active J_menuTab" data-id="' + url + '">404<i class="fa fa-times-circle"></i></a>';
			$.get(window[url].partial, function(data) {
				$(settings.content).find('div.J_iframe').hide();
				$(settings.content).append(J_iframe);
				J_iframe.append(data);
			});
			$('.J_menuTabs .page-tabs-content').append(str);
		} else {
			found.addClass('active').siblings().removeClass('active');
			$('#wrapper-content .J_iframe').each(function() {
				if($(this).data('id') == url) {
					$(this).find('#notfound').toggleClass('animated fadeInDown');
					$(this).show().siblings('.J_iframe').hide();
				}
			});
		}
	}

	$('.J_menuTab').each(function(a, b) {
		var _this = $(b);
		if(_this.data('id') == url) {
			if(!_this.hasClass('active')) {
				_this.addClass('active').siblings('.J_menuTab').removeClass('active');
				//                  // 显示tab对应的内容区
				$('#wrapper-content .J_iframe').each(function() {
					if($(this).data('id') == url) {
						$(this).show().siblings('.J_iframe').hide();
						return false;
					}
				});
			}
			flag = false;
			return false;
		}
	});
	// 选项卡菜单不存在
	if(flag) {
		var str2 = '<a href="#' + url + '" class="active J_menuTab" data-id="' + url + '">' + $('#MydaoMenu [href="#' + url + '"]').text() + ' <i class="fa fa-times-circle"></i></a>';
		$('.J_menuTab').removeClass('active');
		//		// 添加选项卡
		$.get(window[url].partial, function(data) {
			var years = '';
			for(var i = new Date().getFullYear(); i >= 1960; i--) {
				years += "<option value='" + i + "'>" + i + "</option>";
			}
			data = data.replace('${years}', years);
			
			$(settings.content).find('div.J_iframe').hide();
			$(settings.content).append(J_iframe);
			J_iframe.append(data);
		});

		// 添加选项卡
		$('.J_menuTabs .page-tabs-content').append(str2);
	}

	// 点击选项卡菜单
	function activeTab() {
		if(!$(this).hasClass('active')) {
			var currentId = $(this).data('id');
			// 显示tab对应的内容区
			$('#wrapper-content .J_iframe').each(function() {
				if($(this).data('id') == currentId) {

					//					如果需要点击上面标签栏 ,刷新页面的话 请把这段代码放开
					//					var _hashFun = currentId
					//					$(settings.content).find('[data-id="' + _hashFun + '"]').empty()
					//					$(settings.content).find('div.J_iframe').hide();
					//					$.get(window[_hashFun].partial, function(data) {
					//						$(settings.content).find('[data-id="' + _hashFun + '"]').append(data).show()
					//					});

					$(this).show().siblings('.J_iframe').hide();
					return false;
				}
			});
			$(this).addClass('active').siblings('.J_menuTab').removeClass('active');
		}
	}
	$('.J_menuTabs').on('click', '.J_menuTab', activeTab);

};

$('#MydaoMenu li a').on('click', function(e) {
	var _aThis = $(this);
	var _href = _aThis.attr('href');
	if(_href != '#') {
		if($('.J_menuTabs').find('.J_menuTab[href=' + _href + ']').length == 0) {
			mydaoSPA.changeUrl();
		}
	}
});

mydaoSPA.ajaxRequest = function(url, method, data, callback) { //加载部分页面
	if(settings.partialCache[url]) {
		callback(200, settings.partialCache[url]);
	} else {
		var xmlhttp;
		if(window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
			xmlhttp.open(method, url, true);
			if(method === 'POST') {
				xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			}
			xmlhttp.send(data);
			xmlhttp.onreadystatechange = function() {
				if(xmlhttp.readyState == 4) {
					switch(xmlhttp.status) {
						case 404: //如果URL是无效的，显示404页
							url = 'notfound';
							break;
						default:
							var parts = url.split('.');
							if(parts.length > 1 && parts[parts.length - 1] == 'html') { //仅缓存静态的HTML页面
								settings.partialCache[url] = xmlhttp.responseText; //缓存谐音来提高性能
							}
					}
					callback(xmlhttp.status, xmlhttp.responseText);
				}
			};
		} else {
			alert('对不起，您的浏览器太旧，无法运行这个程序.');
			callback(404, {});
		}
	}
};

//mydaoSPA.refresh = function(node, scope) {
//	var children = node.childNodes;
//	if(node.nodeType != 3) { //横动子节点，Node.TEXT_NODE == 3
//		for(var k = 0; k < node.attributes.length; k++) {
//			node.setAttribute(node.attributes[k].name, mydaoSPA.feedData(node.attributes[k].value, scope)); //替换属性定义的变量
//		}
//		if(node.hasAttribute('data-src')) {
//			node.setAttribute('src', node.getAttribute('data-src')); //代替src属性
//		}
//		var childrenCount = children.length;
//		for(var j = 0; j < childrenCount; j++) {
//			if(children[j].nodeType != 3 && children[j].hasAttribute('data-repeat')) { //处理重复项目
//				var item = children[j].dataset.item;
//				var repeat = children[j].dataset.repeat;
//				children[j].removeAttribute('data-repeat');
//				var repeatNode = children[j];
//				for(var prop in scope[repeat]) {
//					repeatNode = children[j].cloneNode(true); //为重复节点的克隆兄弟节点
//					node.appendChild(repeatNode);
//					var repeatScope = scope;
//					var obj = {};
//					obj.key = prop;
//					obj.value = scope[repeat][prop]; //键/值对添加到当前范围
//					repeatScope[item] = obj;
//					mydaoSPA.refresh(repeatNode, repeatScope); //遍历所有克隆节点
//				}
//				node.removeChild(children[j]); //取出空模板节点
//			} else {
//				mydaoSPA.refresh(children[j], scope); //为不重复，只是想迭代子节点
//			}
//		}
//	} else {
//		node.textContent = mydaoSPA.feedData(node.textContent, scope); //替换模板中定义的变量
//	}
//}
//
//mydaoSPA.feedData = function(template, scope) { //在当前范围内的数据替换变量
//	return template.replace(/\{\{([^}]+)\}\}/gmi, function(model) {
//		var properties = model.substring(2, model.length - 2).split('.'); //split all levels of properties
//		var result = scope;
//		for(var n in properties) {
//			if(result) {
//				switch(properties[n]) { //move down to the deserved value
//					case 'key':
//						result = result.key;
//						break;
//					case 'value':
//						result = result.value;
//						break;
//					case 'length': //从对象获取长度
//						var length = 0;
//						for(var x in result) length++;
//						result = length;
//						break;
//					default:
//						result = result[properties[n]];
//				}
//			}
//		}
//		return result;
//	});
//}

mydaoSPA.initFunc = function(partial) { //执行负责当前模板控制器功能
	var fn = window[partial].init;
	if(typeof fn === 'function') {
		fn();
	}
};

mydaoSPA.ajaxRequest('404.html', 'GET', '', function(status, partial) {
	settings.partialCache.notfound = partial;
}); //缓存404页

mydaoSPA.ajaxRequest('home.html', 'GET', '', function(status, partial) {
	settings.partialCache.HOME = partial;
}); //缓存HOME页