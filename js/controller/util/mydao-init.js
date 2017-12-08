var Mydao = {};
Mydao.VERSION = "1.0.0";
Mydao.permissions = {};
Mydao.currentPage = {}; //声明当前页面
Mydao.currentPage.params = {}; //声明当前页面参数
Mydao.currentPage.dialog = {}; //声明当前弹出窗口
Mydao.config = {
	path: MyDaoRequestPath + "/RailWayInvoker/",
	ajaxParams: {
		"base": {
			"token": "123456",
			"userid": 123456
		},
		"params": {},
		"page": {
			"pageCurrent": 1,
			"pageSize": 30,
			"orderField": "",
			"orderDirection": ""
		}
	},
	ajaxParamsNoPage: {
		"base": {
			"token": "123456",
			"userid": 123456
		},
		"params": {}
	}

};

function alertMsg(Msg) {
	window.location.href = "login.html";
	alert(Msg);
}
Mydao.ajax = function(params, url, success, async) {
	Mydao.config.ajaxParams.params = params;
	return $.ajax({
		url: Mydao.config.path + url,
		type: 'POST',
		async: async == false ? false : true,
		data: JSON.stringify(Mydao.config.ajaxParams),
		contentType: 'application/json',
		dataType: 'json',
		dataFilter: function(data, type) {
			data = data.replace(/:(\d+),/g, ':\"$1\",').replace(/:(\d+)}/g, ':\"$1\"}').replace(/:(\d+)]/g, ':\"$1\"]');
			return data;
		},
		success: function(data) {
			if(data.code == 204) {
				alertMsg(data.msg);
				return false;
			}
			success.apply(this, [data]);
		}
	});
};

Mydao.ajaxNoPage = function(params, url, success, async) {
	Mydao.config.ajaxParamsNoPage.params = params;
	return $.ajax({
		url: Mydao.config.path + url,
		type: 'POST',
		async: async == false ? false : true,
		data: JSON.stringify(Mydao.config.ajaxParamsNoPage),
		contentType: 'application/json',
		dataType: 'json',
		dataFilter: function(data, type) {
			data = data.replace(/:(\d+),/g, ':\"$1\",').replace(/:(\d+)}/g, ':\"$1\"}').replace(/:(\d+)]/g, ':\"$1\"]');
			return data;
		},
		success: function(data) {
			if(data.code == 204) {
				alertMsg(data.msg);
				return false;
			}
			success.apply(this, [data]);
		}
	});
};
Mydao.ajaxPage = function(params, page, url, success) {
	Mydao.config.ajaxParams.params = params;
	Mydao.config.ajaxParams.page = page ? page : Mydao.config.ajaxParams.page;
	return $.ajax({
		url: Mydao.config.path + url,
		type: 'POST',
		data: JSON.stringify(Mydao.config.ajaxParams),
		contentType: 'application/json',
		dataType: 'json',
		success: function(data) {
			if(data.code == 204) {
				alertMsg(data.msg);
				return false;
			}
			success.apply(this, [data]);
		}
	});
};
Mydao.nameFormatter = function(value) {
	if(value != null) {
		var str = value.toString().replace(/<[^>]+>/g, ""); //去除页面回填带的HTML标签的字段
		var str2 = str;
		if(str.length > 50) {
			str2 = str.substring(0, 50) + '...';
		}
		return [
			'<a href="javascript:;" title=' + str + '  class="To-view" >' + str2 + '</a> '
		].join('');
	}
};

Mydao.valueFormatter = function(value, length) {
	if(value != null) {
		var str = value.toString().replace(/<[^>]+>/g, ""); //去除页面回填带的HTML标签的字段
		var str2 = str;
		if(str.length > length) {
			str2 = str.substring(0, length) + '...';
		}
		return [
			'<p title=' + str + ' style="cursor: pointer;">' + str2 + '</p> '
		].join('');
	}
};

//根据row.file id获取文件明
Mydao.fileName = function(value) {
	var am;
	Mydao.ajax({
		"id": value
	}, "file/getNameById", function(result) {
		if(result.code == 200) {
			var data = result.result;
			am = "<a class='m-module-a' target='_blank' href='" + MydaoFileDownPath + "?fileId=" + data.id + "'>" + data.name + "</a>";
		}
	}, false);
	return am;
};

Mydao.imgName = function(value) {
	var am = '';
	if(value) {
		var fidss = value.split(',');
		for(var k = 0; k < fidss.length; k++) {
			Mydao.ajax({
				"id": fidss[k]
			}, "file/getNameById", function(result) {
				if(result.code == 200) {
					var data = result.result;
					//原来是am=，换成am+=,显示多张图片，否则只显示最后上传的那张图片
					//					href='" + MydaoFileDownPath + "?fileId=" + data.id + "'
					am += "<a target='_blank' class='m-module-a' href='" + MydaoFileDownPath + "?fileId=" + data.id + "'><img style='max-width: 65px;max-height: 60px; margin-right: 10px; margin-bottom:10px' src='" + MydaoFileDownPath + "?fileId=" + data.id + "' alt='" + data.name + "'/></a>";
				}
			}, false);
		}
	}
	return am;
};
Mydao.operator = function(pa) {
	var operator = '';
	var opr = {
		'save': ['新增', 'fa-plus-square-o'],
		'edit': ['编辑', 'fa-pencil-square-o'],
		'del': ['删除', 'fa-trash'],
		'view': ['查看', 'fa-eye'],
		'mdopen': ['启用', 'fa-bell'],
		'mdclose': ['禁用', 'fa-bell-slash'],
		'mdkey': ['修改密码', 'fa-key'],
		'download': ['下载', 'fa-download'],
		'mduser': ['生成用户', 'fa-user-plus'],
		'message': ['留言', 'fa-commenting'],
		'export': ['导出', 'fa-share-square-o'],
		'qualified': ['合格', 'fa-check'],
		'unqualified': ['不合格', 'fa-close'],
	};
	$.each(pa, function(a, b) {
		operator += '<a herf="javascript:;" operator="' + b + '"  class="ml10 ' + b + '" title="' + opr[b][0] + '"><i class="fa ' + opr[b][1] + ' "></i></a>';
	});
	return operator;
};
Mydao.operatorEvents = function(fns) {
	return {
		'click .save': function(e, value, row, index) {
			fns['save'].apply(this, [e, value, row, index]);
		},
		'click .del': function(e, value, row, index) {
			fns['del'].apply(this, [e, value, row, index]);
		},
		'click .view': function(e, value, row, index) {
			fns['view'].apply(this, [e, value, row, index]);
		},
		'click .edit': function(e, value, row, index) {
			fns['edit'].apply(this, [e, value, row, index]);
		},
		'click .mdopen': function(e, value, row, index) {
			fns['mdopen'].apply(this, [e, value, row, index]);
		},
		'click .mdclose': function(e, value, row, index) {
			fns['mdclose'].apply(this, [e, value, row, index]);
		},
		'click .mdkey': function(e, value, row, index) {
			fns['mdkey'].apply(this, [e, value, row, index]);
		},
		'click .download': function(e, value, row, index) {
			fns['download'].apply(this, [e, value, row, index]);
		},
		'click .mduser': function(e, value, row, index) {
			fns['mduser'].apply(this, [e, value, row, index]);
		},
		'click .message': function(e, value, row, index) {
			fns['message'].apply(this, [e, value, row, index]);
		},
		'click .export': function(e, value, row, index) {
			fns['export'].apply(this, [e, value, row, index]);
		},
		'click .qualified': function(e, value, row, index) {
			fns['qualified'].apply(this, [e, value, row, index]);
		},
		'click .unqualified': function(e, value, row, index) {
			fns['unqualified'].apply(this, [e, value, row, index]);
		}
	};
};
Mydao.setform = function(selector, model, beforfn, afterfn) { // 编辑回填
	setTimeout(function() {
		var befor;
		if(beforfn) {
			befor = beforfn.apply(this);
		}
		for(var o in model) {
			$(selector).find('select[name="' + o + '"]').attr('data-value', model[o]);
			if($(selector).find('[name="' + o + '"]').hasClass('laydate-icon')) {
				if(!isNaN(model[o]) && model[o]) {
					var d = new Date();
					d.setTime(model[o]);
					$(selector).find('[name="' + o + '"]').val(d.format($(selector).find('[name="' + o + '"]').data('format') ? $(selector).find('[name="' + o + '"]').data('format') : 'YYYY-MM-DD'));
				} else {
					$(selector).find('[name="' + o + '"]').val(model[o]);
				}
			} else {
				$(selector).find('[name="' + o + '"]').val(model[o]);
			}
			$(selector).find('select[name="' + o + '"]').trigger('change');
		}
		if(afterfn) {
			if(beforfn && befor) {
				if(befor) {
					afterfn.apply(this);
				}
			} else {
				afterfn.apply(this);
			}
		}
	}, 400);
	return selector;
};

Mydao.ShowHuiTian = function(selector, model) { // 查看回填
	setTimeout(function() {
		for(var o in model) {
			// 时间回填要在接受 DOM 元素上加上这个Class layUI-data
			if($(selector).find('[data-name="' + o + '"]').hasClass('layUI-data')) {
				if(!isNaN(model[o]) && model[o]) {
					var d = new Date();
					d.setTime(model[o]);
					// 时间回填 的格式 
					$(selector).find('[data-name="' + o + '"]').html(d.format($(selector).find('[data-name="' + o + '"]').data('format') ? $(selector).find('[data-name="' + o + '"]').data('format') : 'YYYY-MM-DD'));
				} else {
					$(selector).find('[data-name="' + o + '"]').html(model[o]);
				}
				// 文件回填要在接受 DOM 元素上加上这个Class  layUI-upload
			} else if($(selector).find('[data-name="' + o + '"]').hasClass('layUI-upload')) {

				$(selector).find('[data-name="' + o + '"]').html(Mydao.fileName(model[o]));

			} else {
				$(selector).find('[data-name="' + o + '"]').html(model[o]);
			}
		}
	}, 150);
	return selector;
};

//多选  待改进
Mydao.multiple = function(element) {
	$(element).find('select.js-example-basic-multiple').each(function(index, ele) {
		var _this = $(ele),
			data = _this.data(),
			params = data.params.toObj ? data.params.toObj() : {};
		Mydao.ajax(params, data.url, function(result) {
			var currentTime = result.serverTime;
			if(result.code == 200) {
				var _result = result.result;
				for(var i = 0; i < _result.length; i++) {
					_this.append($('<option value="' + _result[i].id + '" >' + _result[i].name + '</option>').data(_result[i]));
				}
				_this.select2({
					placeholder: "请选择"
				});
			} else {
				layer.alert(result.msg);
			}
		});
	});

};
Mydao.initselect = function(selector, initfn, afterfn) {
	selector = selector ? selector : document.body;
	$(selector).find('[data-toggle="selector"]').each(function(a, b) {
		var data = $(b).data();
		var params = data.params.toObj ? data.params.toObj() : {};
		Mydao.ajax(params, data.url, function(result) {
			if(initfn) {
				initfn.apply(this);
			} else {
				var currentTime = result.serverTime;
				if(result.code == 200) {
					if(data.nodefault) {
						$(b).val('').empty();
					} else {
						$(b).val('').empty().append('<option value="">--请选择--</option>');
					}
					var result1 = result.result;
					if(result1 != null) { // 李朝华  假如成功后 result 为null 报错
						for(var i = 0; i < result1.length; i++) {
							$(b).append($('<option value="' + result1[i].id + '">' + result1[i].name + '</option>').data(result1[i]));
						}
					}
				} else {
					layer.alert(result.msg);
				}
			}
			if(data.next) {
				$(b).on('change', function() {
					var _nexts = data.next && data.next.split(',');
					for(var i = 0; i < _nexts.length; i++) {
						var _next = $(selector).find(_nexts[i]);
						if(!_next || _next.length == 0) {
							continue;
						}
						var nparams = _next.data('params').toObj ? _next.data('params').toObj() : {},
							_this = $(this);
						nparams[data.nextField] = _this.val();
						if(_next.data('nodefault')) {
							_next.val('').empty();
						} else {
							_next.val('').empty().append('<option value="">--请选择--</option>');
							//修改默认值不要<option value="">--请选择--</option>
							//							_next.val('').empty()
						}
						if(_this.val()) {
							Mydao.ajax(nparams, _next.data('url'), function(nresult) {
								var currentTime = result.serverTime;
								if(nresult.code == 200) {
									var _nresult = nresult.result;
									for(var j = 0; j < _nresult.length; j++) {
										_next.append($('<option value="' + _nresult[j].id + '">' +

											_nresult[j].name + '</option>').data(_nresult[j]));
									}
									if(_next.data('value')) {
										_next.val(_next.data('value'));
									}
								} else {
									layer.alert(result.msg);
								}
							}, false);
						}
					}
				});
			}
		}, false);
	});
	if(afterfn) {
		afterfn.apply(this);
	}
	return selector;
};

Mydao.setcontent = function(data, result) {
	var regstr = /\$\{(.*)\}/g,
		rds = data.match(regstr);
	if(rds && rds.length > 0) {
		$.each(rds, function(a, b) {
			console.log(123);
			data = data.replace(b, result[b.replace(/\$\{|\}/g, '')] ? result[b.replace(/\$\{|\}/g, '')] : '');
		});
	}

	var regfile = /\$file\{(.*)\}/g,
		rfs = data.match(regfile);
	if(rfs && rfs.length > 0) {
		$.each(rfs, function(a, b) {
			data = data.replace(b, result[b.replace(/\$file\{|\}/g, '')] ? "<a target='_blank' href='" + MydaoFileDownPath + "?fileId=" + result[b.replace(/\$file\{|\}/g, '')] + "'>点击下载</a>" : '');
		});
	}

	var regimgs = /\$imgs\{(.*)\}/g,
		riss = data.match(regimgs);
	if(riss && riss.length > 0) {
		$.each(riss, function(a, b) {
			var imgs = result[b.replace(/\$imgs\{|\}/g, '')] && result[b.replace(/\$imgs\{|\}/g, '')].split(','),
				imgstrs = '';
			if(imgs) {
				$.each(imgs, function(O1, O2) {
					imgstrs += '<img width="200" src="' + MydaoFileDownPath + '?fileId=' + O2 + '"/>';
				});
			}
			data = data.replace(b, imgstrs);
		});
	}

	var regdate = /\$date\{(.*)\}/g,
		rdates = data.match(regdate);
	if(rdates && rdates.length > 0) {
		$.each(rdates, function(a, b) {
			if(result[b.replace(/\$date\{|\}/g, '')]) {
				if(!isNaN(result[b.replace(/\$date\{|\}/g, '')])) {
					var d = new Date(),
						nd = '';
					d.setTime(result[b.replace(/\$date\{|\}/g, '')]);
					nd = d.format('YYYY-MM-DD');
					data = data.replace(b, nd);
				} else {
					data = data.replace(b, result[b.replace(/\$date\{|\}/g, '')]);
				}
			} else {
				data = data.replace(b, '');
			}

		});
	}
	return data;
};
Mydao.formatDate = function(val, format) {
	if(!format)
		format = "YYYY-MM-DD";
	if(!val)
		return "";
	else {
		var d = new Date();
		d.setTime(val);
		return d.format(format);
	}
};
Mydao.getedu = function(edu) {
	switch(edu) {
		case "801":
			edu = "中专";
			break;
		case "802":
			edu = "专科";
			break;
		case "803":
			edu = "本科";
			break;
		case "804":
			edu = "研究生";
			break;
		case "805":
			edu = "博士生";
			break;
		default:
			edu = "无";
			break;
	}
	return edu;
};