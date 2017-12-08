//角色权限
(function() {
	'use strict';
	//启用
	var role_edit = function(e, value, row, index) {
		layer.open({
			type: 1,
			title: '编辑角色',
			btn: ['保存', '取消'], //按钮
			btnAlign: 'c', //按钮居中
			content: $("#rolepermissions #rolepermissions_edit"),
			area: ["70%", "90%"],
			moveOut: true,
			success: function(layero, index) {
				layero.find("form span").filter(".myClass").remove();
				//回填数据
				$("#rolepermissions_edit input[name=name]").val(row.name);
				$("#rolepermissions_edit input[name=code]").val(row.code);
				$("#rolepermissions_edit input[name=sort]").val(row.sort);
				//渲染树
				var setting = {
					view: {
						showLine: false
					},
					data: {
						simpleData: {
							enable: true
						}
					},
					check: {
						chkStyle: "checkbox",
						enable: true
					}
				};

				//获取所有菜单
				var zNodes = [];
				Mydao.ajax({
					"roleid": row.id
				}, 'role/selectMenuAndFunction', function(result) {
					var currentTime = result.serverTime;
					if(result.code == 200) {
						var data = result.result;
						if(data) {
							$.each(data, function(index, val) {
								if(val.checked) {
									zNodes.push({
										id: val.id,
										name: val.name,
										pId: val.parentid,
										checked: val.checked,
										mytype: val.type
									});
								} else {
									zNodes.push({
										id: val.id,
										name: val.name,
										pId: val.parentid,
										mytype: val.type
									});
								}

							});
						}
						$(document).ready(function() {
							$.fn.zTree.init($("#rolepermissions_edit #rolepermissions_tree"), setting, zNodes);
						});
					} else {
						layer.alert(result.msg);
					}

				});

			},
			yes: function(index, layero) {
				layero.find("form").trigger("validate");
				if(!layero.find("form").data("validator").isFormValid()) return false;
				//条件判断
				var fname = $("#rolepermissions_edit input[name=name]").val(),
					fcode = $("#rolepermissions_edit input[name=code]").val(),
					fsort = $("#rolepermissions_edit input[name=sort]").val();
				//获取菜单
				var tree = $.fn.zTree.getZTreeObj("rolepermissions_tree");
				var selectNode = tree.getCheckedNodes();
				var menus = [],
					functions = [];
				$.each(selectNode, function(index, val) {
					if(val.mytype == 1) { //菜单
						menus.push(val.id.substr(2));
					} else { //功能
						functions.push(val.id.substr(2));
					}
				});
				//保存
				Mydao.ajax({
					"id": row.id,
					"name": fname,
					"code": fcode,
					"sort": fsort,
					"menus": menus,
					"functions": functions
				}, 'role/editRole', function(result) {
					$("#rolepermissions_edit").find("input").val("");
					$("#rolepermissions #rolepermissions_tree").children().remove();
					layer.close(index); //如果设定了yes回调，需进行手工关闭
					var currentTime = result.serverTime;
					if(result.code == 200) {
						layer.alert("操作成功！");
						//刷新页面
						$("#rolepermissions #rolepermissions_table").bootstrapTable("refreshOptions", {
							pageNumber: 1
						}).bootstrapTable("refresh");
					} else {
						layer.alert(result.msg);
					}

				});
			},
			btn2: function(index, layero) {
				$("#rolepermissions_edit").find("input").val("");
				$("#rolepermissions #rolepermissions_tree").children().remove();
			},
			cancel: function() {
				$("#rolepermissions_edit").find("input").val("");
				$("#rolepermissions #rolepermissions_tree").children().remove();
			}
		});
	};
	//禁用
	var role_del = function(e, value, row, index) {
		//询问框
		layer.open({
			title: '消息提示', //标题
			content: '确定要删除该角色吗？', //内容
			icon: 3,
			btn: ['确认', '取消'], //按钮
			shadeClose: 'true', //遮罩
			btnAlign: 'c', //按钮居中
			yes: function(index, layero) { //回调
				Mydao.ajax({
					"id": row.id
				}, 'role/deleteRole', function(result) {
					layer.close(index); //如果设定了yes回调，需进行手工关闭
					var currentTime = result.serverTime;
					if(result.code == 200) {
						layer.alert("操作成功！");
						//刷新页面
						$("#rolepermissions #rolepermissions_table").bootstrapTable("refreshOptions", {
							pageNumber: 1
						}).bootstrapTable("refresh");
					} else {
						layer.alert("操作失败！");
					}

				});
			}
		});
	};
	var url = "role/findAllRole";
	$('#rolepermissions #rolepermissions_table').bootstrapTable({
		pagination: true,
		sidePagination: 'server',
		queryParamsType: "undefined", //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  //设置为limit可以获取limit, offset, search, sort, order  
		method: 'post',
		pageNumber: 1,
		url: Mydao.config.path + url,
		cache: true, //禁用缓存
		search: false, //禁用查询
		striped: true, //隔行变色
		uniqueId: "id", //唯一标识,
		responseHandler: function(res) { //设置返回数据
			if(res.code == 200) {
				return res.result;
			}
		},
		ajaxOptions: {
			ContentType: 'application/json',
			dataType: 'json'
		},
		queryParams: function(p) {
			Mydao.config.ajaxParams.params = {};
			Mydao.config.ajaxParams.page.orderField = 'sort';
			Mydao.config.ajaxParams.page.pageSize = p.pageSize;
			Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
			Mydao.config.ajaxParams.page.orderDirection = p.sortOrder;
			Mydao.config.ajaxParams.params.name = $('#rolepermissions [name="name"]').val();
			return Mydao.config.ajaxParams;
		},
		columns: [{
			title: '序号',
			align: 'center',
			valign: 'middle',
			formatter: function(val, row, index) {
				return index + 1;
			},
		}, {
			title: '角色名称',
			field: 'name',
			align: 'center',
			valign: 'middle'
		}, {
			title: '操作',
			align: 'center',
			formatter: function(value, row, index) {
				var ctrls = [];
				if(Mydao.permissions['role_edit']) {
					ctrls.push('edit');
				}
				//删除
				if(Mydao.permissions['role_del']) {
					ctrls.push('del');
				}
				return Mydao.operator(ctrls);
			},
			events: Mydao.operatorEvents({
				edit: role_edit,
				del: role_del
			})
		}]
	});

	//查询
	$('#rolepermissions #rolepermissions_search').on('click', function(event) {
		$("#rolepermissions #rolepermissions_table").bootstrapTable("refreshOptions", {
			pageNumber: 1
		}).bootstrapTable("refresh");
	});

	//新建
	$('#rolepermissions #rolepermissions_create').on('click', function(event) {
		layer.open({
			type: 1,
			title: '添加角色',
			btn: ['保存', '取消'], //按钮
			btnAlign: 'c', //按钮居中
			content: $("#rolepermissions #rolepermissions_edit"),
			area: ["70%", "90%"],
			moveOut: true,
			success: function(layero, index) {
				layero.find("form span").filter(".myClass").remove();
				//渲染树
				var setting = {
					view: {
						showLine: false
					},
					data: {
						simpleData: {
							enable: true
						}
					},
					check: {
						chkStyle: "checkbox",
						enable: true
					}
				};

				//获取所有菜单
				var zNodes = [];
				Mydao.ajax({}, 'role/selectMenuAndFunction', function(result) {
					var currentTime = result.serverTime;
					if(result.code == 200) {
						var data = result.result;
						if(data) {
							$.each(data, function(index, val) {
								if(val.checked) {
									zNodes.push({
										id: val.id,
										name: val.name,
										pId: val.parentid,
										checked: val.checked,
										mytype: val.type
									});
								} else {
									zNodes.push({
										id: val.id,
										name: val.name,
										pId: val.parentid,
										mytype: val.type
									});
								}

							});
						}
						$(document).ready(function() {
							$.fn.zTree.init($("#rolepermissions_edit #rolepermissions_tree"), setting, zNodes);
						});
					} else {
						layer.alert("操作失败！");
					}

				});

			},
			yes: function(index, layero) {
				layero.find("form").trigger("validate");
				if(!layero.find("form").data("validator").isFormValid()) return false;
				//条件判断
				var fname = $("#rolepermissions_edit input[name=name]").val(),
					fcode = $("#rolepermissions_edit input[name=code]").val(),
					fsort = $("#rolepermissions_edit input[name=sort]").val();
				//获取菜单
				var tree = $.fn.zTree.getZTreeObj("rolepermissions_tree");
				var selectNode = tree.getCheckedNodes();
				var menus = [],
					functions = [];
				$.each(selectNode, function(index, val) {
					if(val.mytype == 1) { //菜单
						menus.push(val.id.substr(2));
					} else { //功能
						functions.push(val.id.substr(2));
					}
				});
				//保存
				Mydao.ajax({
					"name": fname,
					"code": fcode,
					"sort": fsort,
					"menus": menus,
					"functions": functions
				}, 'role/insertRole', function(result) {
					$("#rolepermissions_edit").find("input").val("");
					$("#rolepermissions #rolepermissions_tree").children().remove();
					layer.close(index); //如果设定了yes回调，需进行手工关闭
					var currentTime = result.serverTime;
					if(result.code == 200) {
						layer.alert("操作成功！");
						//刷新页面
						$("#rolepermissions #rolepermissions_table").bootstrapTable("refreshOptions", {
							pageNumber: 1
						}).bootstrapTable("refresh");
					} else {
						layer.alert(result.msg);
					}

				});
			},
			btn2: function(index, layero) {
				$("#rolepermissions_edit").find("input").val("");
				$("#rolepermissions #rolepermissions_tree").children().remove();
			},
			cancel: function() {
				$("#rolepermissions_edit").find("input").val("");
				$("#rolepermissions #rolepermissions_tree").children().remove();
			}
		});
	});
})();