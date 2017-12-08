//用户管理
	(function() {
		'use strict';
		//启用
		var user_open = function(e, value, row, index) {
			//询问框
			layer.open({
				title: '消息提示', //标题
				content: '确定要启用该用户吗？', //内容
				icon: 3,
				btn: ['确认', '取消'], //按钮
				btnAlign: 'c', //按钮居中
				yes: function(index, layero) {
					Mydao.ajax({
						"id": row.id
					}, 'user/changeStatus', function(result) {
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						var currentTime = result.serverTime;
						if(result.code == 200) {
							layer.alert("操作成功！");
							//刷新页面
							$("#usermanagement #usermanagement_table").bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						} else {
							layer.alert("操作失败！");
						}

					});
				}
			});
		};
		//禁用
		var user_close = function(e, value, row, index) {
			//询问框
			layer.open({
				title: '消息提示', //标题
				content: '确定要禁用该用户吗？', //内容
				icon: 3,
				btn: ['确认', '取消'], //按钮
				btnAlign: 'c', //按钮居中
				yes: function(index, layero) { //回调
					Mydao.ajax({
						"id": row.id
					}, 'user/changeStatus', function(result) {
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						var currentTime = result.serverTime;
						if(result.code == 200) {
							layer.alert("操作成功！");
							//刷新页面
							$("#usermanagement #usermanagement_table").bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						} else {
							layer.alert("操作失败！");
						}

					});
				}
			});
		};
		//删除
		var user_del = function(e, value, row, index) {
			//询问框
			layer.open({
				title: '消息提示', //标题
				content: '确定要删除该用户吗？', //内容
				icon: 3,
				btn: ['确认', '取消'], //按钮
				btnAlign: 'c', //按钮居中
				yes: function(index, layero) { //回调
					Mydao.ajax({
						"id": row.id
					}, 'user/delete', function(result) {
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						var currentTime = result.serverTime;
						if(result.code == 200) {
							layer.alert("操作成功！");
							//刷新页面
							$("#usermanagement #usermanagement_table").bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						} else {
							layer.alert("操作失败！");
						}

					});
				}
			});
		};

		//重置密码
		var user_key = function(e, value, row, index) {
			layer.open({
				title: '消息提示', //标题
				content: '重置用户密码后,密码将改为111111，确定要重置该用户密码吗？', //内容
				icon: 3,
				btn: ['确认', '取消'], //按钮
				btnAlign: 'c', //按钮居中
				yes: function(index, layero) { //回调
					Mydao.ajax({
						"id": row.id
					}, 'user/repassword', function(result) {
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						var currentTime = result.serverTime;
						if(result.code == 200) {
							layer.msg("操作成功！");
						} else {
							layer.msg(result.msg);
						}

					});
				}
			});
		};
		//		权限修改
		var center_user = function(e, value, row, index) {
			layer.open({
				type: 1,
				title: '权限修改',
				btnAlign: 'c',
				content: $('#usermanagement #GenerateUserLayer').html(),
				area: ["340px", "280px"],
				btn: ['确认', '取消'],
				success: function(layero, index) {
					Mydao.initselect(layero, null, function() {
						Mydao.ajax({
							userid:row.id
						}, 'userRoleKey/findAll', function(data) {
							if(data.code ==200){
								var _arrRes = data.result;
								$.each(_arrRes, function(a,b) {
									layero.find('#roleSel').val(b.roleid);
								});
							}
						});
					}); 
				},
				yes: function(index, layero) {
					layero.find("form").trigger("validate");
					if(!layero.find("form").data("validator").isFormValid()) return false;
					Mydao.ajax({
						"userid": row.id, //用户ID
						"roleid": layero.find("#roleSel option:selected").val(), //人员ID
					}, 'user/updateRole', function(result) {
						layer.close(index);
						var currentTime = result.serverTime;
						if(result.code == 200) {
							layer.alert(result.msg);
							//刷新列表
							//刷新页面
							$("#usermanagement #usermanagement_table").bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						} else {
							layer.alert(result.msg);
						}
					});
				},
				cancel: function(layero, index) {
					index.find("input,select").val("");
				},
				btn2: function(index, layero) {
					layero.find("input,select").val("");
				}
			});
		};
		//表格
		var url = "user/list";
		$('#usermanagement #usermanagement_table').bootstrapTable({
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
				Mydao.config.ajaxParams.page.orderField = p.sortName;
				Mydao.config.ajaxParams.page.pageSize = p.pageSize;
				Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
				Mydao.config.ajaxParams.page.orderDirection = p.sortOrder;
				Mydao.config.ajaxParams.params.name = $('#usermanagement [name="name"]').val();
				Mydao.config.ajaxParams.params.loginname = $('#usermanagement [name="loginname"]').val();
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
				title: '所属机构',
				field: 'organizationName',
				align: 'center',
				valign: 'middle'
			}, {
				title: '所属部门',
				field: 'departmentName',
				align: 'center'
			}, {
				title: '姓名',
				field: 'name',
				align: 'center'
			}, {
				title: '职务',
				field: 'postName',
				align: 'center',
			}, {
				title: '用户名',
				field: 'loginname',
				align: 'center',
			}, {
				title: '状态',
				field: 'status',
				align: 'center',
				formatter: function(val) {
					var status = ["启用", "禁用"];
					return status[val];
				}
			}, {
				title: '操作',
				align: 'center',
				formatter: function(value, row, index) {
					var ctrls = [];
					//根据状态显示不同操作
					if(row.status == 0) {
						//判断权限
						if(Mydao.permissions['user_close']) {
							ctrls.push('mdclose');
						}
					} else {
						//判断权限
						if(Mydao.permissions['user_open']) {
							ctrls.push('mdopen');
						}
					}
					//修改密码
					if(Mydao.permissions['user_repwd']) {
						ctrls.push('mdkey');
					}
					//删除
					if(Mydao.permissions['user_del']) {
						ctrls.push('del');
					}
					if(Mydao.permissions['user_del']) {
						ctrls.push('edit');
					}
					return Mydao.operator(ctrls);
				},
				events: Mydao.operatorEvents({
					edit: center_user,
					mdclose: user_close,
					mdopen: user_open,
					del: user_del,
					mdkey: user_key
				})
			}]
		});
		
			//查询
	$('#usermanagement #usermanagement_search').on('click', function(event) {
		$("#usermanagement #usermanagement_table").bootstrapTable("refreshOptions", {
			pageNumber: 1
		}).bootstrapTable("refresh");
	});
	})();

