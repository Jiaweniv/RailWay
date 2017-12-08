/*!
 * 
 * 
 * jq扩展
 * */
(function() {
	'use strict';
	$.fn.extend({
		getMaxIndexObj: function($elements) {
			var zIndex = 0,
				index = 0;

			$elements.each(function(i) {
				var newZIndex = parseInt($(this).css('zIndex')) || 1;

				if(zIndex < newZIndex) {
					zIndex = newZIndex;
					index = i;
				}
			});

			return $elements.eq(index);
		},
		/**
		 * 将表单数据转成JSON对象 用法：$(form).serializeJson() Author: Jing
		 */
		serializeJson: function() {
			var o = {};
			var a = this.serializeArray();
			$.each(a, function() {
				if(o[this.name] !== undefined) {
					if(!o[this.name].push) {
						o[this.name] = [o[this.name]];
					}
					o[this.name].push(this.value || '');
				} else {
					o[this.name] = this.value || '';
				}
			});
			$.each(o, function(i, j) {
				if(j.push) {
					var h = [];
					$.each(j, function(c, d) {
						if(d != '')
							h.push(d);
					});
					o[i] = h.join(",");
				}
			});
			return o;
		},
		//序列化DIV
		serializeDiv: function() {
			var st = new Date().getTime();
			var _form = $('<form id="curform' + st + '"></form>');
			$(this).wrap(_form);
			return $('#curform' + st).serializeJson();
		},
		isTag: function(tn) {
			if(!tn) return false;
			if(!$(this).prop('tagName')) return false;
			return $(this)[0].tagName.toLowerCase() == tn ? true : false;
		},
		/**
		 * 判断当前元素是否已经绑定某个事件
		 * @param {Object} type
		 */
		isBind: function(type) {
			var _events = $(this).data('events');
			return _events && type && _events[type];
		},
		/**
		 * 输出firebug日志
		 * @param {Object} msg
		 */
		log: function(msg) {
			return this.each(function() {
				if(console) console.log('%s: %o', msg, this);
			});
		},
		/**
		 * 自定义form提交，依赖nice-validate
		 * @param {Object} options
		 * @param {Object} _callback
		 */
		ajaxSubmit: function(options, _callback) {
			var data = $(this).serializeJson(),
				_this = $(this);
			if(options.data) {
				$.extend(data, options.data);
			}
			Mydao.config.ajaxParams.params = data;
			$.ajax({
				type: options.type ? options.type : 'POST',
				url: options.url ? Mydao.config.path + options.url : Mydao.config.path + $(this).attr('action'),
				dataType: 'json',
				data: JSON.stringify(Mydao.config.ajaxParams),
				async: options.async == false ? false : true,
				contentType: 'application/json',
				success: function(result) {
					Mydao.config.ajaxParams.params = {};
					var currentTime = result.serverTime;
					if(result.code == 200) {
						layer.alert('保存成功！', function(index) {
							if(_callback) {
								_callback.apply(this, [result, _this]);
							}
							layer.close(index);
						});
					} else {
						layer.alert(result.msg);
					}
				}
			});
		},
		doajax: function(options, _callback) {
			var _this = $(this);
			Mydao.config.ajaxParams.params = options.data;
			$.ajax({
				type: options.type ? options.type : 'POST',
				url: Mydao.config.path + options.url,
				dataType: 'json',
				data: JSON.stringify(Mydao.config.ajaxParams),
				async: options.async == false ? false : true,
				contentType: 'application/json',
				success: function(result) {
					Mydao.config.ajaxParams.params = {};
					var currentTime = result.serverTime;
					if(result.code == 200) {
						layer.alert('操作完成！', function(index) {
							if(_callback) {
								_callback.apply(this, [result, _this]);
							}
							layer.close(index);
						});
					} else {
						layer.alert(result.msg);
					}
				}
			});
		},
		showimage: function() {
			var _this = $(this);
			_this.find('.layui-layer-content').hide();
			setTimeout(function() {
				_this.find('div[id*="showimage"]').each(function(a, b) {
					var imgs = [];
					$(b).find('img').each(function() {
						imgs.push(this);
					});
					$(b).empty();
					$.each(imgs, function() {
						$(b).append(this);
					});
					_this.find('#' + this.id.replace('showimage', '')).remove();
				});
				_this.find('.layui-layer-content').show();
			}, 500);
		}
	});

	/**
	 * 扩展String方法
	 */
	$.extend(String.prototype, {
		isPositiveInteger: function() {
			return(new RegExp(/^[1-9]\d*$/).test(this));
		},
		isInteger: function() {
			return(new RegExp(/^\d+$/).test(this));
		},
		isNumber: function() {
			return(new RegExp(/^([-]{0,1}(\d+)[\.]+(\d+))|([-]{0,1}(\d+))$/).test(this));
		},
		includeChinese: function() {
			return(new RegExp(/[\u4E00-\u9FA5]/).test(this));
		},
		trim: function() {
			return this.replace(/(^\s*)|(\s*$)|\r|\n/g, '');
		},
		startsWith: function(pattern) {
			return this.indexOf(pattern) === 0;
		},
		endsWith: function(pattern) {
			var d = this.length - pattern.length;
			return d >= 0 && this.lastIndexOf(pattern) === d;
		},
		replaceSuffix: function(index) {
			return this.replace(/\[[0-9]+\]/, '[' + index + ']').replace('#index#', index);
		},
		replaceSuffix2: function(index) {
			return this.replace(/\-(i)([0-9]+)$/, '-i' + index).replace('#index#', index);
		},
		trans: function() {
			return this.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
		},
		encodeTXT: function() {
			return(this).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll(' ', '&nbsp;');
		},
		replaceAll: function(os, ns) {
			return this.replace(new RegExp(os, 'gm'), ns);
		},
		/*替换占位符为对应选择器的值*/ //{^(.|\#)[A-Za-z0-9_-\s]*}
		replacePlh: function($box) {
			$box = $box || $(document);
			return this.replace(/{\/?[^}]*}/g, function($1) {
				var $input = $box.find($1.replace(/[{}]+/g, ''));

				return $input && $input.val() ? $input.val() : $1;
			});
		},
		replaceMsg: function(holder) {
			return this.replace(new RegExp('({.*})', 'g'), holder);
		},
		replaceTm: function($data) {
			if(!$data) return this;

			return this.replace(RegExp('({[A-Za-z_]+[A-Za-z0-9_-]*})', 'g'), function($1) {
				return $data[$1.replace(/[{}]+/g, '')];
			});
		},
		replaceTmById: function(_box) {
			var $parent = _box || $(document);

			return this.replace(RegExp('({[A-Za-z_]+[A-Za-z0-9_-]*})', 'g'), function($1) {
				var $input = $parent.find('#' + $1.replace(/[{}]+/g, ''));
				return $input.val() ? $input.val() : $1;
			});
		},
		isFinishedTm: function() {
			return !(new RegExp('{\/?[^}]*}').test(this));
		},
		skipChar: function(ch) {
			if(!this || this.length === 0) return '';
			if(this.charAt(0) === ch) return this.substring(1).skipChar(ch);
			return this;
		},
		isValidPwd: function() {
			return(new RegExp(/^([_]|[a-zA-Z0-9]){6,32}$/).test(this));
		},
		isValidMail: function() {
			return(new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(this.trim()));
		},
		isSpaces: function() {
			for(var i = 0; i < this.length; i += 1) {
				var ch = this.charAt(i);

				if(ch != ' ' && ch != '\n' && ch != '\t' && ch != '\r') return false;
			}
			return true;
		},
		isPhone: function() {
			return(new RegExp(/(^([0-9]{3,4}[-])?\d{3,8}(-\d{1,6})?$)|(^\([0-9]{3,4}\)\d{3,8}(\(\d{1,6}\))?$)|(^\d{3,8}$)/).test(this));
		},
		isUrl: function() {
			return(new RegExp(/^[a-zA-z]+:\/\/([a-zA-Z0-9\-\.]+)([-\w .\/?%&=:]*)$/).test(this));
		},
		isExternalUrl: function() {
			return this.isUrl() && this.indexOf('://' + document.domain) == -1;
		},
		toBool: function() {
			return(this.toLowerCase() === 'true') ? true : false;
		},
		toJson: function() {
			var json = this;

			try {
				if(typeof json == 'object') json = json.toString();
				if(!json.trim().match("^\{(.+:.+,*){1,}\}$")) return this;
				else return JSON.parse(this);
			} catch(e) {
				return this;
			}
		},
		toObj: function() {
			var obj = null;

			try {
				obj = (new Function('return ' + this))();
			} catch(e) {
				obj = this;
				console.debug('String toObj：Parse "String" to "Object" error! Your str is: ' + this);
			}
			return obj;
		},
		/**
		 * String to Function
		 * 参数(方法字符串或方法名)： 'function(){...}' 或 'getName' 或 'USER.getName' 均可
		 * Author: K'naan
		 */
		toFunc: function() {
			if(!this || this.length == 0) return undefined;
			//if ($.isFunction(this)) return this

			if(this.startsWith('function')) {
				return(new Function('return ' + this))();
			}

			var m_arr = this.split('.');
			var fn = window;

			for(var i = 0; i < m_arr.length; i++) {
				fn = fn[m_arr[i]];
			}

			if(typeof fn === 'function') {
				return fn;
			}

			return undefined;
		},
		setUrlParam: function(key, value) {
			var str = '',
				url = this;

			if(url.indexOf('?') != -1)
				str = url.substr(url.indexOf('?') + 1);
			else
				return url + '?' + key + '=' + value;

			var returnurl = '',
				setparam = '',
				arr, modify = '0';

			if(str.indexOf('&') != -1) {
				arr = str.split('&');
				for(var i = 0; i < arr.length; i++) {
					if(arr[i].split('=')[0] == key) {
						setparam = value;
						modify = '1';
					} else {
						setparam = arr[i].split('=')[1];
					}
					returnurl = returnurl + arr[i].split('=')[0] + '=' + setparam + '&';
				}

				returnurl = returnurl.substr(0, returnurl.length - 1);
				if(modify == '0') {
					if(returnurl == str)
						returnurl = returnurl + '&' + key + '=' + value;
				}
			} else {
				if(str.indexOf('=') != -1) {
					arr = str.split('=');
					if(arr[0] == key) {
						setparam = value;
						modify = '1';
					} else {
						setparam = arr[1];
					}
					returnurl = arr[0] + '=' + setparam;
					if(modify == '0') {
						if(returnurl == str)
							returnurl = returnurl + '&' + key + '=' + value;
					}
				} else {
					returnurl = key + '=' + value;
				}
			}
			return url.substr(0, url.indexOf('?')) + '?' + returnurl;
		}
	});
	$.ajaxSetup({
		cache: false, //关闭AJAX相应的缓存
		//      complete:function(XMLHttpRequest,status){
		//      	var data = XMLHttpRequest.responseText;
		//      	if(XMLHttpRequest.status==200){
		//      		try {
		//      			if(data.length<300){
		//						var obj = data.toObj()
		//						if(obj.statusCode==201){
		//	            			console.log('登录超时')
		//	            		}
		//      			}
		//				} catch (e) {
		//					//
		//					console.log(e)
		//				}
		//      	}
		//      },
		dataFilter: function(data, type) {
			if(type == 'json') {
				data = data.replace(/:(\d+),/g, ':\"$1\",');
				data = data.replace(/:(\d+)}/g, ':\"$1\"}');

			} else if(type == 'html') {
				var years = '';
				for(var i = new Date().getFullYear(); i >= 1960; i--) {
					years += "<option value='" + i + "'>" + i + "</option>";
				}
				data = data.replace('${years}', years);
			}
			var permissionstr = '/\<permission(.*)\<\/permission\>/g',
				pds = data.match(permissionstr);
			if(pds && pds.length > 0) {
				$.each(pds, function(a, b) {
					var c = b.substr(b.indexOf('"') + 1, b.length),
						d = c.substr(0, c.indexOf('"'));
					data = data.replace(b, Mydao.permissions[d] ? b : '');
				});
			}
			return data;
		}
	});
	/* Function */
	$.extend(Function.prototype, {
		//to fixed String.prototype -> toFunc
		toFunc: function() {
			return this;
		}
	});

	/* Array */
	$.extend(Array.prototype, {
		//		remove: function(index) {
		//			if(index < 0) return this;
		//			else return this.slice(0, index).concat(this.slice(index + 1, this.length));
		//		},
		removeByValue: function (arr, val) {
			for(var i = 0; i < arr.length; i++) {
				if(arr[i] == val) {
					arr.splice(i, 1);
					break;
				}
			}
		},
		unique: function() {
			var temp = [];

			this.sort();
			for(var i = 0; i < this.length; i++) {
				if(this[i] == this[i + 1]) continue;
				temp[temp.length] = this[i];
			}

			return temp;
		},
		myIndexOf: function(e) {
			if(!this || !this.length) return -1;

			for(var k = 0, j; j = this[k]; k++) {
				if(j == e) return k;
			}

			return -1;
		},
		/* serializeArray to json */
		toJson: function() {
			var o = {};
			var a = this;

			$.each(a, function() {
				if(o[this.name] !== undefined) {
					if(!o[this.name].push) {
						o[this.name] = [o[this.name]];
					}
					o[this.name].push(this.value || '');
				} else {
					o[this.name] = this.value || '';
				}
			});

			return o;
		}
	});

	/* Global */
	$.isJson = function(obj) {
		var flag = true;

		try {
			flag = $.parseJSON(obj);
		} catch(e) {
			return false;
		}
		return flag ? true : false;
	};

	/**
	 * Date
	 */
	$.extend(Date.prototype, {
		format: function(fmt) {
			var o = {
				"M+": this.getMonth() + 1, //月份 
				"D+": this.getDate(), //日 
				"h+": this.getHours(), //小时 
				"m+": this.getMinutes(), //分 
				"s+": this.getSeconds(), //秒 
				"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
				"S": this.getMilliseconds() //毫秒 
			};
			if(/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			for(var k in o)
				if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			return fmt;
		}
	});

	function stopDefault(e) {
		//阻止默认浏览器动作(W3C) 
		if(e && e.preventDefault)
			e.preventDefault();
		//IE中阻止函数器默认动作的方式 
		else
			window.event.returnValue = false;
		return false;
	}

	function stopBubble(e) {
		//如果提供了事件对象，则这是一个非IE浏览器 
		if(e && e.stopPropagation)
			//因此它支持W3C的stopPropagation()方法 
			e.stopPropagation();
		else
			//否则，我们需要使用IE的方式来取消事件冒泡 
			window.event.cancelBubble = true;
	}
})();