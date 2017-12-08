//职务设置
(function() {
	'use strict';
	//调整input宽度
	var resizeInput = function(layer) {
		$(layer).find(".group-input").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
		});
		//  select和标头的组合
		$(layer).find(".group-select").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
		});

		$(layer).find('.sidebar-collapse').slimScroll({
			height: '100%',
		});
	};

	//级别管理 弹层
	$('#JobSettings_lzh #JobLevelBtn').on('click', function(e) {
		layer.open({
			type: 1,
			content: $('#JobLevelLayer'),
			shadeClose: 'true', //遮罩
			area: ["70%", "90%"],
			moveOut: true,
			success: function(layero, index) {
				resizeInput(layero);
				//		编辑  职务级别
				var Level_edit = function(e, value, row, index) {
					Mydao.ajax({
						"id": row.id,
					}, 'dictionary/getDuty', function(result) {
						var currentTime = result.serverTime;
						if(result.code == 200) {
							var resultForm = result.result;
							layer.open({
								type: 1,
								title: '编辑职务级别',
								btnAlign: 'c',
								content: $('#LevelLayer'),
								area: ["340px", "280px"],
								btn: ['确认', '返回'],
								success: function(layero, index) {
									layero.find("form span").filter(".myClass").remove();
									resizeInput(layero);
									Mydao.initselect(layero, null, function() {
										Mydao.setform(layero, resultForm); //填充表单的值
									});
								},
								yes: function(index, layero) {
									layero.find("form").trigger("validate");
									if(!layero.find("form").data("validator").isFormValid()) return false;
									Mydao.ajax({
										'id': row.id,
										'dutylevelname': $('#LevelLayer [name="name"]').val(),
										'duty': '',
									}, 'dictionary/updateDictionary', function(result) {
										layer.close(index); //如果设定了yes回调，需进行手工关闭
										var currentTime = result.serverTime;
										if(result.code == 200) {
											layer.alert(result.msg);
											//刷新页面
											$("#JobLevelLayer #JobLevelTable").bootstrapTable("refreshOptions", {
												pageNumber: 1
											}).bootstrapTable("refresh");
										} else {
											layer.alert(result.msg);
										}
									});
								},
								cancel: function(index, layero) {}
							});
						} else {
							layer.msg(result.msg);
						}
					});
				};
				//		删除职务级别
				var Level_del = function(e, value, row, index) {
					//询问框
					layer.open({
						title: '消息提示', //标题
						content: '确定要删除该职务级别吗？', //内容
						btn: ['确认', '取消'], //按钮
						btnAlign: 'c', //按钮居中
						success: function(layero, index) {},
						yes: function(index, layero) { //回调
							Mydao.ajax({
								"id": row.id,
							}, 'dictionary/deleteDictionary', function(result) {
								layer.close(index); //如果设定了yes回调，需进行手工关闭
								var currentTime = result.serverTime;
								if(result.code == 200) {
									layer.alert("操作成功！");
									//刷新页面
									$("#JobLevelLayer #JobLevelTable").bootstrapTable("refreshOptions", {
										pageNumber: 1
									}).bootstrapTable("refresh");
								} else {
									layer.msg(result.msg);
								}

							});
						}
					});
				};
				//						职务级别离列表
				var _url2 = 'dictionary/fingDutylevelPage';
				$('#JobLevelLayer #JobLevelTable').bootstrapTable({
					pagination: true,
					sidePagination: 'server',
					queryParamsType: "undefined", //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  //设置为limit可以获取limit, offset, search, sort, order  
					method: 'post',
					pageNumber: 1,
					url: Mydao.config.path + _url2,
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
						Mydao.config.ajaxParams.page.orderField = p.orderField;
						Mydao.config.ajaxParams.page.pageSize = p.pageSize;
						Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
						Mydao.config.ajaxParams.page.orderDirection = p.sortOrder;
						Mydao.config.ajaxParams.params.pjoblvl = 'PJOBLVL';
						return Mydao.config.ajaxParams;
					},
					columns: [{
						title: '序号',
						formatter: function(val, row, index) {
							return index + 1;
						}
					}, {
						title: '职务级别名称',
						field: 'value',
					}, {
						title: '操作 <i id="JobNewBtn2" class="fa fa-plus-square-o" title="添加职务级别"></i>',
						formatter: function(value, row, index) {
							return Mydao.operator(['edit', 'del']);
						},
						events: Mydao.operatorEvents({
							edit: Level_edit,
							del: Level_del
						})
					}]
				});
				//	添加职务级别
				$('#JobSettings_lzh').find('#JobLevelLayer').delegate('#JobNewBtn2', 'click', function(e) {
					layer.open({
						type: 1,
						id: 'Level',
						content: $('#LevelLayer'),
						title: '新建职务级别',
						btn: ['保存', '取消'], //按钮
						btnAlign: 'c', //按钮居中
						//							area: ["340px", "280px"],
						area: ["420px", "350px"],
						success: function(layero, index) {
							layero.find("form span").filter(".myClass").remove();
							layero.find('input').val('');
							resizeInput(layero);
						},
						yes: function(index, layero) {
							layero.find("form").trigger("validate");
							if(!layero.find("form").data("validator").isFormValid()) return false;
							Mydao.ajax({
								'type': 'PJOBLVL',
								'value': $('#LevelLayer [name="name"]').val(),
								'code': '',
								'desc': '人员职务级别',
								'parentid': '',
								'mode': '1',
							}, 'dictionary/editDictionary', function(result) {
								layer.close(index); //如果设定了yes回调，需进行手工关闭
								var currentTime = result.serverTime;
								if(result.code == 200) {
									layer.alert("操作成功！");
									//刷新页面
									$("#JobLevelLayer #JobLevelTable").bootstrapTable("refreshOptions", {
										pageNumber: 1
									}).bootstrapTable("refresh");
								} else {
									layer.alert("操作失败！");
								}

							});
						},
						cancel: function(index, layero) {
							layero.find('input').val('');
						},
						btn2: function(index, layero) {
							layero.find('input').val('');
						}
					});
				});

			},
		});
	});
	//		添加/编辑职务 弹层
	$('#JobSettings_lzh').find('#JobSettings #JobNewBtn').on('click', function(e) {
		layer.open({
			type: 1,
			content: $('#JobSettings #JobLayer'),
			title: '添加/编辑职务',
			id: 'addJobLayer',
			btn: ['保存', '取消'], //按钮
			btnAlign: 'c', //按钮居中
			//				area: ["340px", "280px"],
			area: ["420px", "350px"],
			success: function(layero, index) {
				layero.find("form span").filter(".myClass").remove();
				resizeInput(layero);
				layero.find('input').val('');
				Mydao.initselect(layero); //加载select
			},
			yes: function(index, layero) {
				layero.find("form").trigger("validate");
				if(!layero.find("form").data("validator").isFormValid()) return false;
				Mydao.ajax({
					"type": 'PJOB',
					"value": $("#JobLayer input[name=name]").val(),
					"code": '',
					"desc": '人员职务',
					"parentid": $("select[name=dutylevelid] option:selected").val(),
					"mode": '1',
				}, 'dictionary/editDictionary', function(result) {
					layer.close(index); //如果设定了yes回调，需进行手工关闭
					var currentTime = result.serverTime;
					if(result.code == 200) {
						layer.alert(result.msg);
						//刷新页面
						$("#JobSettings #JobTable").bootstrapTable("refreshOptions", {
							pageNumber: 1
						}).bootstrapTable("refresh");
					} else {
						layer.msg(result.msg);
					}
				});
			},
			cancel: function(index, layero) {
				layero.find('input').val('');
			},
			btn2: function(index, layero) {
				layero.find('input').val('');
			}
		});
	});
	//		编辑     dictionary/editDuty
	var jode_edit = function(e, value, row, index) {
		Mydao.ajax({
			"id": row.id,
		}, 'dictionary/getDuty', function(result) {
			var currentTime = result.serverTime;
			if(result.code == 200) {
				var resultForm = result.result;
				Mydao.currentPage.params.projectid = row.id; //保存项目ID
				layer.open({
					type: 1,
					title: '编辑职务',
					id: 'editJobLayer',
					btnAlign: 'c',
					content: $('#JobSettings #JobLayer'),
					area: ["420px", "350px"],
					btn: ['确认', '取消'],
					success: function(layero, index) {
						layero.find("form span").filter(".myClass").remove();
						resizeInput(layero);
						Mydao.initselect(layero, null, function() {
							Mydao.setform(layero, resultForm); //填充表单的值
						}); //加载select
					},
					yes: function(index, layero) {
						layero.find("form").trigger("validate");
						if(!layero.find("form").data("validator").isFormValid()) return false;
						Mydao.ajax({
							"id": row.id,
							"duty": $("#JobLayer input[name=name]").val(),
							"dutylevelid": $("select[name=dutylevelid] option:selected").val(),
						}, 'dictionary/updateDictionary', function(result) {
							layer.close(index); //如果设定了yes回调，需进行手工关闭
							var currentTime = result.serverTime;
							if(result.code == 200) {
								layer.alert("操作成功！");
								//刷新页面
								$("#JobSettings #JobTable").bootstrapTable("refreshOptions", {
									pageNumber: 1
								}).bootstrapTable("refresh");
							} else {
								layer.alert(result.msg);
							}
						});
					},
					cancel: function(index, layero) {
						Mydao.currentPage.params = {}; //清空当前页面参数
						Mydao.currentPage.params.projectid = undefined; //清空项目ID
					},
					btn2: function(index, layero) {}

				});
			} else {
				layer.msg(result.msg);
			}
		});
	};
	//		删除
	var jode_del = function(e, value, row, index) {
		//询问框
		layer.open({
			title: '消息提示', //标题
			content: '确定要删除该职务吗？', //内容
			btn: ['确认', '取消'], //按钮
			btnAlign: 'c', //按钮居中
			success: function(layero, index) {},
			yes: function(index, layero) { //回调
				Mydao.ajax({
					"id": row.id
				}, 'dictionary/deleteDictionary', function(result) {
					layer.close(index); //如果设定了yes回调，需进行手工关闭
					var currentTime = result.serverTime;
					if(result.code == 200) {
						layer.alert("操作成功！");
						//刷新页面
						$("#JobSettings #JobTable").bootstrapTable("refreshOptions", {
							pageNumber: 1
						}).bootstrapTable("refresh");
					} else {
						layer.msg("操作失败！");
					}

				});
			}
		});
	};

	//		职务级别列表
	var url = 'dictionary/findAlldutyPage';

	$('#JobSettings_lzh #JobSettings #JobTable').bootstrapTable({
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
			Mydao.config.ajaxParams.params.type = 'PJOB';
			Mydao.config.ajaxParams.params.duty = $('#JobSettingsInput').val();
			return Mydao.config.ajaxParams;
		},
		columns: [{
			title: '序号',
			formatter: function(val, row, index) {
				return index + 1;
			}
		}, {
			title: '级别',
			field: 'dutylevel',
		}, {
			title: '职务名称',
			field: 'duty',
		}, {
			title: '操作',
			formatter: function(value, row, index) {
				var ctrls = [];
				if(Mydao.permissions['duty_edit']) {
					ctrls.push('edit');
				}
				if(Mydao.permissions['duty_del']) {
					ctrls.push('del');
				}
				return Mydao.operator(ctrls);
			},
			events: Mydao.operatorEvents({
				edit: jode_edit,
				del: jode_del
			})
		}]
	});
	//查询
	$('#JobSettings_lzh #JobInquireBtn').on('click', function(event) {
		$("#JobSettings #JobTable").bootstrapTable("refreshOptions", {
			pageNumber: 1
		}).bootstrapTable("refresh");
	});
})();
//	职务设置end