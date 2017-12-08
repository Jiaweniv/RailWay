//工点表	
	(function() {
		'use strict';
		var editProject = function(e, value, row, index) {
				Mydao.ajax({
					"id": row.id
				}, 'supervisionReport/show', function(result) {
					var currentTime = result.serverTime;
					if(result.code == 200) {
						var resultForm = result.result;
						layer.open({
							type: 1,
							content: '',
							btn: ['保存', '返回'], //按钮
							title:'年度报告',
							shadeClose: 'true', //遮罩
							btnAlign: 'c', //按钮居中
							area: ["70%", "90%"],
							moveOut: true,
							success: function(layero, index) {
								layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisoryWorkReport_edit.html', function() {
									layero.find('.sidebar-collapse').slimScroll({
										height: '100%',
									});
									layero.find(".group-input").each(function(index, element) {
										$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
									});
									//  select和标头的组合
									layero.find(".group-select").each(function(index, element) {
										$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
									});

									Mydao.initselect(layero, null, function() {
										Mydao.setform(layero, resultForm); //填充表单的值
									}); //加载select
									$('#SupervisedCheck_layer [name="type"]').val(resultForm.type);

								});
							},
							yes: function(index, layero) { //回调
								var par ={
									"id": row.id,
									"projectid": $("#SupervisedCheck_layer #projectid").val(),
									"files": $("#SupervisedCheck_layer #files").val(),
									"type": $("#SupervisedCheck_layer #type").val(),
									"year": $("#SupervisedCheck_layer #year").val(),
									"reporttime": $("#SupervisedCheck_layer #reporttime").val()
								};
								Mydao.ajax(par, 'supervisionReport/edit', function(result) {
									layer.close(index); //如果设定了yes回调，需进行手工关闭
									var currentTime = result.serverTime;
									if(result.code == 200) {
										layer.alert("操作成功！");
										//刷新页面
										$("#SupervisoryWorkReport #xmztbg_table2").bootstrapTable("refreshOptions", {
											pageNumber: 1
										}).bootstrapTable("refresh");
									} else {
										layer.alert("操作失败！");
									}
								});
							},
							cancel: function(layero, index) {}
						});
						//});
						//						});
					} else {
						layer.alert(result.msg);
					}

				});
			},
			showProject = function(e, value, row, index) {
				Mydao.ajax({
					"id": row.id
				}, 'supervisionReport/show', function(result) {
					var currentTime = result.serverTime;
					if(result.code == 200) {
						var resultForm = result.result;
						layer.open({
							type: 1,
							content: '',
							btn: ['确认'], //按钮
							title:'年度报告',
							shadeClose: 'true', //遮罩
							btnAlign: 'c', //按钮居中
							area: ["70%", "90%"],
							moveOut: true,
							success: function(layero, index) {
								layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisoryWorkReport_edit.html', function() {
									layero.find('.sidebar-collapse').slimScroll({
										height: '100%',
									});
									layero.find(".group-input").each(function(index, element) {
										$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
									});
									//  select和标头的组合
									layero.find(".group-select").each(function(index, element) {
										$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
									});

									Mydao.initselect(layero, null, function() {
										Mydao.setform(layero, resultForm); //填充表单的值
									}); //加载select
									$('#SupervisedCheck_layer [name="type"]').val(resultForm.type);
									layero.find("select,input,textarea").attr("disabled", "disabled");
									setTimeout(function() {
										layero.find(".layui-upload-button,.fa-times-circle").remove();
										layero.find(".layui-layer-btn").remove();
									}, 200);
								});
							},
							yes: function(index, layero) { //回调

								layer.close(index); //如果设定了yes回调，需进行手工关闭

							},
							cancel: function(layero, index) {}
						});
						//});
						//						});
					} else {
						layer.alert(result.msg);
					}

				});
			},
			delProject = function(e, value, row, index) {
				layer.confirm('确定删除？', {
					icon: 3,
					title: '提示'
				}, function(index) {
					Mydao.ajax({
						id: row.id
					}, 'supervisionReport/delete', function(result) {
						var currentTime = result.serverTime;
						if(result.code == 200) {
							$("#SupervisoryWorkReport #xmztbg_table2").bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						} else {
							layer.alert(result.msg);
						}
					});
					layer.close(index);
				});
			};
		var url = '/supervisionReport/list';
		$('#SupervisoryWorkReport #xmztbg_table2').bootstrapTable({
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
				Mydao.config.ajaxParams.page.orderField = 'updatetime';
				Mydao.config.ajaxParams.page.pageSize = p.pageSize;
				Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
				Mydao.config.ajaxParams.page.orderDirection = 'desc';
				Mydao.config.ajaxParams.params.type = 2;
				Mydao.config.ajaxParams.params.projectid = $("#SupervisoryWorkReport #projectid").val();
				Mydao.config.ajaxParams.params.clientid = Mydao.clientid;
				return Mydao.config.ajaxParams;
			},
			columns: [{
				title: '年度',
				field: 'year',
				align: 'center'
			}, {
				title: '报告时间',
				field: 'reporttime',
				align: 'center',
				formatter: function(val, row, index) {
					return Mydao.formatDate(val);
				}
			}, {
				title: '监督报告',
				field: 'files',
				align: 'center',
				formatter: function(val, row, index) {
					if(val) {
						if(row.filesname) {
							return '<a class="m-module-a" target="_blank" href="' + MydaoFileDownPath + '?fileId=' + val + '">' + row.filesname + '</a>';
						} else {
							return '<a class="m-module-a" target="_blank" href="' + MydaoFileDownPath + '?fileId=' + val + '">点击下载</a>';
						}
					}
				}
			}, {
				title: '操作',
				align: 'center',
				formatter: function(value, row, index) {
					var ctrls = [];
					if(Mydao.permissions['supervisionreport_edit']) {
						ctrls.push('edit');
					}
					//删除
					if(Mydao.permissions['supervisionreport_del']) {
						ctrls.push('del');
					}
					ctrls.push('view');
					return Mydao.operator(ctrls);
				},
				events: Mydao.operatorEvents({
					edit: editProject,
					del: delProject,
					view: showProject
				})
			}]
		});

	})();