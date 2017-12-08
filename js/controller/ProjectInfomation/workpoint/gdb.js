//工点表
	
	(function() {
		'use strict';
		//初始化编辑页面
		var init_workpoint_edit_page = function(e, value, row, index) {
			layer.open({
				type: 1,
				title: '工点信息',
				btnAlign: 'c',
				content: "",
				area: ["70%", "90%"],
				moveOut: true,
				cancel: function(layero, index) {},
				success: function(layero, index) {
					layero.find('.sidebar-collapse').slimScroll({
						height: '100%',
					});

					layero.find('.layui-layer-content').load('view/ProjectInformation/workpoint/gdb_edit.html', function() {

						init_step(index, row);

						layero.find('.sidebar-collapse').slimScroll({
							height: '100%',
						});

						layero.find(".group-input").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
						});

						//select和标头的组合
						layero.find(".group-select").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
						});
						Mydao.initselect(layero, null, function() {
							if(row) {
								$("#workpoint_gd_edit_panel input[name='workpoint_id']").val(row.id);
								$("#workpoint_gd_edit_panel input[name='name']").val(row.name);
								$("#workpoint_gd_edit_panel input[name='code']").val(row.code);
								$("#workpoint_gd_edit_panel select[name='discipline']").val(row.discipline);
								$("#workpoint_gd_edit_panel select[name='progresstate']").val(row.progresstate);
								$("#workpoint_gd_edit_panel select[name='isimportant']").val(row.isimportant);								
								$("#workpoint_gd_edit_panel input[name='weight']").val(row.weight);
								$("#workpoint_gd_edit_panel select[name='level']").val(row.level);
							}
						});

					});

				}
			});
		};

		//工点编辑
		var workpoint_edit = function(e, value, row, index) {
			init_workpoint_edit_page(e, value, row, index);
		};

		//工点删除
		var workpoint_del = function(e, value, row, index) {
			layer.confirm('确定删除？', {
				icon: 3,
				title: '提示'
			}, function(index) {
				Mydao.ajax({
					id: row.id
				}, 'workPoint/deleteWorkPoint ', function(result) {
					var currentTime = result.serverTime;
					if(result.code == 200) {
						$("#workpoint_gd_table").bootstrapTable("refreshOptions", {
							pageNumber: 1
						}).bootstrapTable("refresh");
					} else {
						layer.msg(result.msg);
					}
				});
				layer.close(index);
			});
		};

		//显示工点信息
//		var workpoint_show = function(e, value, row, index) {
//
//			$.get("view/ProjectInformation/workpoint/gdb_show.html", function(result) {
//				layer.open({
//					type: 1,
//					title: '工点信息详情',
//					content: result,
//					area: ["70%", "90%"],
//					moveOut: true,
//					btnAlign: 'c', //按钮居中
//					success: function(layero, index) {
//						layero.find(".group-input").each(function(index, element) {
//							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22)
//						});
//						//  select和标头的组合
//						layero.find(".group-select").each(function(index, element) {
//							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30)
//						});
//
//						Mydao.setform(layero, row);
//
//						//获取施工标段
//						$('#workpoint_gdb_show_table').bootstrapTable({
//							method: 'post',
//							url: Mydao.config.path + 'paragraph/findAllParagraph',
//							uniqueId: "id", //唯一标识,
//							responseHandler: function(res) { //设置返回数据
//								if(res.code == 200) {
//									return res.result
//								}
//							},
//							contentType: 'application/json',
//							dataType: 'json',
//							queryParams: function(p) {
//								Mydao.config.ajaxParams.params = {};
//								Mydao.config.ajaxParams.params.projectid = Mydao.currentPage.params.projectid;
//								Mydao.config.ajaxParams.params.clientid = Mydao.clientid;
//								Mydao.config.ajaxParams.params.workpointid = row ? row.id : '';
//								return Mydao.config.ajaxParams;
//							},
//							columns: [{
//								title: '施工段落',
//								field: 'name'
//							}, {
//								title: '段落编号',
//								field: 'code'
//							}, {
//								title: '起讫里程',
//								field: 'startmileage'
//							}, {
//								title: '中心里程',
//								field: 'centermileage'
//							}, {
//								title: '终点里程',
//								field: 'endmileage'
//							}, {
//								title: '设计工程',
//								field: 'design'
//							}, {
//								title: '计量单位',
//								field: 'measurement'
//							}, {
//								title: '结构物',
//								field: 'length'
//							}, {
//								title: '重点工程',
//								field: 'isemphasis',
//								formatter: function(value, row, index) {
//									return value == 0 ? "否" : "是";
//								}
//							}]
//						});
//					}
//				});
//			});
//
//		}

		//显示工点信息新
		var workpoint_show = function(e, value, row, index) {
			var d=row;
			$.get("view/ProjectInformation/workpoint/gdb_See.html", function(result) {
				layer.open({
					type: 1,
					title: '工点信息详情',
					content: result,
					area: ["70%", "90%"],
					moveOut: true,
					btnAlign: 'c', //按钮居中
					success: function(layero, index) {
						layero.find(".group-input").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
						});
						layero.find(".group-select").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
						});

						//Mydao.setform(layero, row);
						layui.use(['laytpl'], function() {
							var laytpl = layui.laytpl;
							var _getTpl = $('#workpoint_layui').html(),
								workpoint_show = $('#workpoint_show_layui');
							laytpl(_getTpl).render(d, function(html) {
									workpoint_show.html(html);
							});								
							$('#workpoint_gdb_show_table').bootstrapTable({
							method: 'post',
							url: Mydao.config.path + 'paragraph/findAllParagraph',
							uniqueId: "id", //唯一标识,
							responseHandler: function(res) { //设置返回数据
								if(res.code == 200) {
									return res.result;
								}
							},
							contentType: 'application/json',
							dataType: 'json',
							queryParams: function(p) {
								Mydao.config.ajaxParams.params = {};
								Mydao.config.ajaxParams.params.projectid = Mydao.currentPage.params.projectid;
								Mydao.config.ajaxParams.params.clientid = Mydao.clientid;
								Mydao.config.ajaxParams.params.workpointid = row ? row.id : '';
								return Mydao.config.ajaxParams;
							},
							columns: [{
								title: '施工段落',
								field: 'name',
								align:'center'
							}, {
								title: '段落编号',
								field: 'code',
								align:'center'
							}, {
								title: '起讫里程',
								field: 'startmileage',
								align:'center'
							}, {
								title: '中心里程',
								field: 'centermileage',
								align:'center'
							}, {
								title: '计量单位',
								field: 'measurement',
								align:'center'
							}, {
								title: '结构物',
								field: 'length',
								align:'center'
							}, {
								title: '设计工程量',
								field: 'design',
								align:'center'
							}, 
//							{
//								title: '终点里程',
//								field: 'endmileage',
//								align:'center'
//							},
							{
								title: '是否为重点工程',
								field: 'isemphasis',
								align:'center',
								formatter: function(value, row, index) {
									return value == 0 ? "否" : "是";
								}
							}, {
								title: '进展状态',
								field: 'progresstate',
								align:'center',
								formatter: function(val, row, index) {
									if(row.progresstate == 1) {
										return '未开工';
									} else if(row.progresstate == 2) {
										return '施工中';
									} else if(row.progresstate == 3) {
										return '已完成';
									} else if(row.progresstate == 4) {
										return '已初验';
									} else {
										return '已竣工';
									}
			
								}
							}]
						});
								
						});

						}
				});
			});
//
		};
			


					
//					}
//				});
//			});
//
//
//		})
		//施工段落编辑
		var workpoint_sgdl_edit = function(e, value, row, indexr) {
			$.get("view/ProjectInformation/workpoint/sgbd_edit.html", function(result) {
				layer.open({
					type: 1,
					content: result,
					area: ["60%", "80%"],
					btn: ['保存', '取消'], //按钮
					title:'编辑施工段落',
					btnAlign: 'c', //按钮居中
					moveOut: true,
					success: function(layero, index) {
						layero.find(".group-input").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
						});
						//  select和标头的组合
						layero.find(".group-select").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
						});
						if(row) {
							Mydao.setform(layero, row);
						}
					},
					yes: function(index, layero) {
						layero.find("form").trigger("validate");
						if(!layero.find("form").data("validator").isFormValid()) return false;
						var cs = $(layero).find("form").serializeJson();
//						var _progresstate=cs.progresstate						
						var flag = true;
						$.each($('#workpoint_sgdl_table').bootstrapTable('getData'), function(index, val) {
							if(cs.name == val.name && indexr != index) {
								layer.msg("施工段落已存在");
								flag = false;
							}
							if(cs.code == val.code && indexr != index) {
								layer.msg("段落编号已存在");
								flag = false;
							}
						});

						if(!flag) {
							return flag;
						}
						if(!$("#workpoint_gd_edit_panel input[name='workpoint_id']").val()) {
							//临时保存
							if(row) {
								$('#workpoint_sgdl_table').bootstrapTable("updateRow", {
									index: indexr,
									row: cs
								});
							} else {
								$('#workpoint_sgdl_table').bootstrapTable("append", cs);
							}
							layer.close(index);
						} else {
							//直接入库
							if(row) { //编辑
								cs.id = row.id;
								Mydao.ajax(cs, 'paragraph/updateParagraph', function(result) {
									var currentTime = result.serverTime;
									if(result.code == 200) {
										var _result = result.result;
										$('#workpoint_sgdl_table').bootstrapTable("refreshOptions", {
											pageNumber: 1
										}).bootstrapTable("refresh");
									} else {
										layer.msg(result.msg);
									}
								});
							} else { //新增
								cs.workpointid = $("#workpoint_gd_edit_panel input[name='workpoint_id']").val();
								Mydao.ajax(cs, 'paragraph/insertParagraph', function(result) {
									var currentTime = result.serverTime;
									if(result.code == 200) {
										var resultForm = result.result;
										$('#workpoint_sgdl_table').bootstrapTable("refreshOptions", {
											pageNumber: 1
										}).bootstrapTable("refresh");
									} else {
										layer.msg(result.msg);
									}
								});
							}
						}
						layer.close(index);
					},
					cancel: function(layero, index) {

					}
				});
			});
		};

		//施工段落删除
		var workpoint_sgdl_del = function(e, value, row, index) {
			layer.confirm('确定删除？', {
				icon: 3,
				title: '提示'
			}, function(index) {
				if(!$("#workpoint_gd_edit_panel input[name='workpoint_id']").val()) {
					$("#workpoint_sgdl_table").bootstrapTable('remove', {
						field: 'name',
						values: [row.name]
					});
				} else {
					Mydao.ajax({
						id: row.id
					}, 'paragraph/deleteParagraph ', function(result) {
						var currentTime = result.serverTime;
						if(result.code == 200) {
							$("#workpoint_sgdl_table").bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						} else {
							layer.msg(result.msg);
						}
					});
				}
				layer.close(index);
			});
		};

		//新增
		var workpoint_sgdl_create = function() {
			workpoint_sgdl_edit();
		};

		//表格
		var url = "workPoint/findAllWorkPoint";
		$('#workpoint_gd #workpoint_gd_table').bootstrapTable({
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
				Mydao.config.ajaxParams.params.projectid = $("#workpointinfo-overview #workpoint_select_projectid").val();
				Mydao.config.ajaxParams.params.sectionid = $("#workpointinfo-overview #workpoint_select_section").val();
				Mydao.config.ajaxParams.params.name = $("#workpoint_gd input[name='name']").val();
				Mydao.config.ajaxParams.params.code = $("#workpoint_gd input[name='code']").val();
				return Mydao.config.ajaxParams;
			},
			columns: [
				//			{
				//				title: '序号',
				//				align: 'center',
				//				valign: 'middle',
				//				formatter: function(val, row, index) {
				//					return index + 1;
				//				},
				//			}, 
				{
					title: '专业',
					field: 'disciplinename',
					align: 'center'
				}, {
					title: '工点编号',
					field: 'code',
					align: 'center',
					valign: 'middle'
				}, {
					title: '工点名称',
					field: 'name',
					align: 'center',
					formatter: Mydao.nameFormatter,
					events: {
						'click a': workpoint_show
					}
				}, {
					title: '进展状态',
					field: 'progresstate',
					align: 'center',
					formatter: function(val, row, index) {
						if(row.progresstate == 1) {
							return '未开工';
						} else if(row.progresstate == 2) {
							return '施工中';
						} else if(row.progresstate == 3) {
							return '已完成';
						} else if(row.progresstate == 4) {
							return '已初验';
						} else {
							return '已竣工';
						}

					},
				}, {
					title: '权重',
					field: 'weight',
					align: 'center'
				}, {
					title: '风险等级',
					field: 'level',
					align: 'center',
					formatter: function(value, row, index){
						if(row.level==1){
							return "低度风险";
						}else if(row.level==2){
							return "中度风险";
						}else if(row.level==3){
							return "高度风险";
						}else if(row.level==4){
							return "极高度风险";
						}else{
							return "-";
						}
					}
				}, {
					title: '操作',
					align: 'center',
					formatter: function(value, row, index) {
						var ctrls = [];
						//编辑
						if(Mydao.permissions['workpoint_edit']) {
							ctrls.push('edit');
						}
						//删除
						if(Mydao.permissions['workpoint_del']) {
							ctrls.push('del');
						}
						return Mydao.operator(ctrls);
					},
					events: Mydao.operatorEvents({
						edit: workpoint_edit,
						del: workpoint_del
					})
				}
			]
		});

		//查询
		$("#workpoint_gd button[name='search']").on("click", function() {
			//刷新页面
			$("#workpoint_gd #workpoint_gd_table").bootstrapTable("refreshOptions", {
				pageNumber: 1
			}).bootstrapTable("refresh");
		});

		//新建
		$("#workpoint_gd button[name='create']").on("click", function() {
			if(!$("#workpointinfo-overview select[name='projectid']").val()) {
				layer.msg('请选择项目后新建工点信息');
				return false;
			}

			if(!$("#workpointinfo-overview select[name='sectionid']").val()) {
				layer.msg('请选择标段后后新建工点信息');
				return false;
			}

			init_workpoint_edit_page();
		});

		//初始化step页面
		var init_step = function(curdialog, row) {
			$("#workpoint_gd_step").steps({
				transitionEffect: "fade",
				onInit: function(event, currentIndex) {
					//获取施工标段
					$('#workpoint_sgdl_table').bootstrapTable({
						method: 'post',
						url: Mydao.config.path + 'paragraph/findAllParagraph',
						uniqueId: "id", //唯一标识,
						responseHandler: function(res) { //设置返回数据
							if(res.code == 200) {
								return res.result;
							}
						},
						contentType: 'application/json',
						dataType: 'json',
						queryParams: function(p) {
							Mydao.config.ajaxParams.params = {};
							Mydao.config.ajaxParams.params.projectid = Mydao.currentPage.params.projectid;
							Mydao.config.ajaxParams.params.clientid = Mydao.clientid;
							Mydao.config.ajaxParams.params.workpointid = row ? row.id : '';
							return Mydao.config.ajaxParams;
						},
						columns: [{
							title: '段落编号',
							field: 'code',
						}, {
							title: '施工段落',
							field: 'name'
						}, {
							title: '起讫里程',
							field: 'startmileage'
						}, {
							title: '中心里程',
							field: 'centermileage'
						}, {
							title: '操作　<i id="workpoint_sgdl_add_btn" class="fa fa-plus-square-o" title="新增"></i>',
							align: 'center',
							formatter: function(value, row, index) {
								return Mydao.operator(['edit', 'del']);
							},
							events: Mydao.operatorEvents({
								edit: workpoint_sgdl_edit,
								del: workpoint_sgdl_del
							})
						}]
					});

					//绑定事件
					$("#workpoint_sgdl_add_btn").on('click', workpoint_sgdl_create);
				},
				onStepChanging: function(event, currentIndex, newIndex) {
					if(currentIndex > newIndex) {
						console.log("上一页");
						//上一页
						return true;
					} else {
						$("#workpoint_gd_edit_panel form").trigger("validate");
						if(!$("#workpoint_gd_edit_panel form").data("validator").isFormValid())return false;						
						var flag1 = false;	
						if($("#workpoint_gd_edit_panel input[name='workpoint_id']").val()) { //编辑
							var _workpoint = $("#workpoint_gd_edit_panel form").serializeJson();
							_workpoint.id = $("#workpoint_gd_edit_panel input[name='workpoint_id']").val();
							_workpoint.projectid = row.projectid;
							_workpoint.sectionid = row.sectionid;
							Mydao.ajax(_workpoint, 'workPoint/updateWorkPoint', function(result) {
								if(result.code == 200) {
									flag1 = true;
								} else {
									layer.msg(result.msg);
									flag1 = false;
								}
							}, false);
						} else { //新建
							flag1 = true;
						}
						return flag1;
					}
				},
				onStepChanged: function(event, currentIndex, priorIndex) {
					if(currentIndex < priorIndex) {
						//上一页完成
						console.log("上一页完成");
					} else {
						console.log("下一页完成");
					}
				},
				onFinishing: function(event, currentIndex) {
					if(!$("#workpoint_gd_edit_panel input[name='workpoint_id']").val()) {
						var params = {};
						params.workpoint = $("#workpoint_gd_edit_panel form").serializeJson();
						params.workpoint.projectid = $("#workpointinfo-overview select[name='projectid']").val();
						params.workpoint.sectionid = $("#workpointinfo-overview select[name='sectionid']").val();
						params.paragraphs = $('#workpoint_sgdl_table').bootstrapTable('getData');					
						//新增
						var _flag = false;
						Mydao.ajax(params, 'workPoint/insertWorkPoint', function(result) {
							var currentTime = result.serverTime;							
							if(result.code == 200) {
								_flag = true;
							} else {
								layer.msg(result.msg);
								_flag = false;
							}
						}, false);
						return _flag;

					} else {
						return true;
					}
				},
				onFinished: function(event, currentIndex) {					
					$("#workpoint_gd_table").bootstrapTable("refreshOptions", {
						pageNumber: 1
					}).bootstrapTable("refresh");
					layer.close(curdialog);
					return true;
				}
			});
		};

	})();
