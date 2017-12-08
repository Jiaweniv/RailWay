
	(function() {
		'use strict';
		//首页获取处室列表的方法
		var params = {
			clientid: 1,
		};
		var _selurl = 'centerPlan/findDepartment';
//		Mydao.ajax(params, _selurl, function(result) {
//			var currentTime = result.serverTime;
//			if(result.code == 200) {
//				var result = result.result;
//				//console.log(result)
//				$('#cneterselect').append('<option value="">--请选择--</option>');
//				$.each(result, function(index, val) {
//					$('#cneterselect').append('<option value=' + val.id + '>' + val.name + '</option>')
//				});
//			}
//		});
//
//		//新建和编辑页面获取处室列表
//		var cneterselect = function() {
//			Mydao.ajax(params, _selurl, function(result) {
//				var currentTime = result.serverTime;
//				if(result.code == 200) {
//					var result = result.result;
//					//console.log(result)
//					$('#hlj-central-s1').append('<option value="">--请选择--</option>');
//					$.each(result, function(index, val) {
//						//console.log(val);
//						$('[name="organizationid"]').append('<option value=' + val.id + '>' + val.name + '</option>')
//					});
//				}
//			});
//		}

		//编辑
		var central_edit = function(e, value, row, index) {
			layer.open({
				type: 1,
				content: "",
				btn: ['确定', '返回'], //底部按钮
				btnAlign: 'c', //按钮居中
				title: '编辑数据字典',
				area: ["285px", "380px"],
				shadeClose: true,
				success: function(layero, index) {
					layero.find("input").val("");
					layero.find('.layui-layer-content').load('view/SystemManagement/DictionaryChilds.html', function() {
						//回填
						Mydao.ajax({
							"id": row.id
						}, "dictionary/getDuty", function(result) {
							var resultForm = result.result;
							if(resultForm.starttime)
								resultForm.planstarttime = resultForm.starttime;
							if(resultForm.endtime)
								resultForm.planendtime = resultForm.endtime;
							if(result.code == 200) {
								Mydao.initselect(layero, null, function() {
									//									console.log(resultForm);
									Mydao.setform(layero, resultForm); //填充表单的值
								});
							}
						});
					});
				},
				yes: function(index, layero) {
					layero.find("form").trigger("validate");
					if(!layero.find("form").data("validator").isFormValid()) return false;
					Mydao.ajax({
							"id":row.id,
							"type": $("#menumanagement_menu select[name=type] option:selected").val(),
							"value": $("#menumanagement_menu #value").val(),
							"code": $("#menumanagement_menu input[name='code']").val(),
							"desc": $("#menumanagement_menu select[name=type] option:selected").text(),
					}, 'dictionary/update2Dictionary', function(result) {
						//						console.log(result)
						if(result.code == 200) {
							layer.close(index); //如果设定了yes回调，需进行手工关闭
							layer.alert("操作成功！");
							//刷新页面
							$("#DictionaryManagement_HLJ #EnterpriseTable-zs").bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						} else {
							layer.alert("操作失败！");
						}
					});
				},
				cancel: function(layero, index) {
				},
				btn2: function(index, layero) {
				}
			});
		};

		//新建
		$('#DictionaryManagement_HLJ #savec').on('click', function(event) {
			$.get("view/SystemManagement/DictionaryChilds.html", function(result) {
				layer.open({
					type: 1,
					content: result,
					btn: ['确定', '返回'], //底部按钮
					btnAlign: 'c', //按钮居中
					title: '新建数据字典',
					area: ["285px", "380px"],
					shadeClose: true,
					success: function(layero, index) {
						layero.find("input").val("");
					},
					//确定按钮
					yes: function(index, layero) {
						layero.find("form").trigger("validate");
						
						if(!layero.find("form").data("validator").isFormValid()) return false;
						Mydao.ajax({
							"type": $("#menumanagement_menu select[name=type] option:selected").val(),
							"value": $("#menumanagement_menu #value").val(),
							"code": $("#menumanagement_menu input[name='code']").val(),
							"desc": $("#menumanagement_menu select[name=type] option:selected").text(),
							"mode": '1',
						}, 'dictionary/editDictionary', function(result) {
							//							console.log(result)
							var resultForm = result.result;
							if(result.code == 200) {
								layer.close(index); //如果设定了yes回调，需进行手工关闭
								layer.alert("操作成功！");
								//刷新页面
								$("#DictionaryManagement_HLJ #EnterpriseTable-zs").bootstrapTable("refreshOptions", {
									pageNumber: 1
								}).bootstrapTable("refresh");
							} else {
								layer.alert("操作失败！");
							}
						});

						layer.close(index);
					},

					//					//取消按钮
					cancel: function(layero, index) {
						index.find("input").val("");
						index.find("select").val("");

						//Mydao.currentPage.params = {} //清空当前页面参数
						//Mydao.currentPage.params.id = undefined; //清空项目ID
					},
					btn2: function(index, layero) {
						//Mydao.currentPage.params = {} //清空当前页面参数
						//Mydao.currentPage.params.id = undefined; //清空项目ID
						layero.find("input").val("");
						layero.find("select").val("");
					}
				});
			});

		});

		//删除
		var central_del = function(e, value, row, index) {
			//弹框
			layer.open({
				title: '消息提示', //标题
				content: '确定要删除该数据吗？', //内容
				btn: ['确认', '取消'], //按钮
				btnAlign: 'c', //按钮居中
				success: function(layero, index) {

				},
				yes: function(index, layero) { //回调
					Mydao.ajax({
						"id": row.id
					}, 'dictionary/deleteDictionary', function(result) {
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						var currentTime = result.serverTime;
						if(result.code == 200) {
							layer.alert("操作成功！");
							//刷新页面
							$("#DictionaryManagement_HLJ #EnterpriseTable-zs").bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						} else {
							layer.alert("操作失败！");
						}

					});
				}
			});
		};

		var url = 'dictionary/findAlldutyPage';
		$('#DictionaryManagement_HLJ #EnterpriseTable-zs').bootstrapTable({
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
				Mydao.config.ajaxParams.page.orderField = 'a.updatetime';
				Mydao.config.ajaxParams.page.pageSize = p.pageSize;
				Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
				Mydao.config.ajaxParams.page.orderDirection = 'desc';
				Mydao.config.ajaxParams.params.duty = $('#DictionaryManagement_HLJ #JobSettingsInput').val();
				return Mydao.config.ajaxParams;
			},
			columns: [{
				title: '序号',
				formatter: function(val, row, index) {
					return index + 1;
				}
			},/* {
				title: '级别',
				field: 'dutylevel',
			}, */{
				title: '名称',
				field: 'duty',
			}, {
				title: '操作',
				formatter: function(value, row, index) {
					var ctrls = [];
//					if(Mydao.permissions['central_edit']){
//						ctrls.push('edit');
//					}
//					if(Mydao.permissions['central_del']){
//						ctrls.push('del');
//					}
				ctrls.push('del');
				ctrls.push('edit');
					return Mydao.operator(ctrls);
				},
				events: Mydao.operatorEvents({
					edit: central_edit,
					del: central_del
				})
			}]
		});

		//查询
		$('#DictionaryManagement_HLJ #searchc').on('click', function(event) {
			$("#DictionaryManagement_HLJ #EnterpriseTable-zs").bootstrapTable("refreshOptions", {
				pageNumber: 1
			}).bootstrapTable("refresh");
		});

	})();