+ function($) {
	'use strict';
	(function() {
		var url = '/project/s1001';
		//下载
		var designdocument_download = function(e, value, row, index) {
			window.open(MydaoFileDownPath + "?fileId=" + row.fileid);
		};
		//	根据监管类型 获取监管机构
		var designdocument_change = function(row) {
			$('#project-edit #supervisetype').change(function() {
				var _val = $(this).val();
				var _this = $('#project-edit #hlj-superviseorg');
				Mydao.ajax({
					type: _val
				}, 'organization/findJDJGByType', function(data) {
					var currentTime = data.serverTime;
					if(data.code == 200) {
						_this.val('').empty().append('<option value="">--请选择--</option>');
						var result = data.result;
						for(var i = 0; i < result.length; i++) {
							_this.append($('<option value="' + result[i].id + '" >' + result[i].name + '</option>').data(result[i]));
						}
						if(row) { //编辑回填
							_this.val(row);
						}
					} else {
						layer.alert(data.msg);
					}
				});
			});
		};
		//上传文件(工程量清单)
		var designingdocuments_tableFn = function(data) {
			$('#designingdocuments_table').bootstrapTable({
				cache: true, //禁用缓存
				search: false, //禁用查询
				striped: true, //隔行变色
				uniqueId: "id", //唯一标识,
				ajaxOptions: {
					ContentType: 'application/json',
					dataType: 'json'
				},
				data: data,
				columns: [{
					title: '序号',
					align: 'center',
					valign: 'middle',
					formatter: function(val, row, index) {
						return index + 1;
					},
				}, {
					title: '文件名称',
					field: 'filename',
					align: 'center',
					valign: 'middle'
				}, {
					title: '上传时间',
					field: 'uploadtime',
					align: 'center',
					formatter: function(val, row, index) {
						return Mydao.formatDate(row.uploadtime, "YYYY-MM-DD hh:mm:ss");
					}
				}, {
					title: '操作<permission opt="project_upload"><a id="designingdocuments_file_btn" herf="javascript:;" class="ml10 " title="上传文件" ><i class="fa fa-upload"></i></a></permission>',
					align: 'center',
					formatter: function(value, row, index) {
						var ctrls = [];
						//下载
						if(Mydao.permissions['design_down']) {
							ctrls.push('download');
						}
						//删除
						if(Mydao.permissions['design_del']) {
							ctrls.push('del');
						}
						return Mydao.operator(ctrls);
					},
					events: Mydao.operatorEvents({
						download: designdocument_download,
						del: designdocument_del
					})
				}]
			});
			$("#designingdocuments_file_btn").on('click', function() {
				layer.open({
					type: 1,
					title: '上传文件',
					content: '',
					btnAlign: 'c',
					area: ["400px", "400px"],
					btn: ['上传'],
					success: function(layero, index) {
						layero.find('.layui-layer-content').load('view/ProjectInformation/section_edit_upload.html', function() {});
					},
					yes: function(index, layero) {
						var d = (new Date()).valueOf();
						var parameter = {
							"id": $("[name='filename']").val(),
							"fileid": $("[name='filename']").val(),
							//							"fileinput": $("[name='filename']"),
							"filename": $("[name='filename']").attr("filename"),
							"createtime": d,
							"uploadtime": d
						};
						$('#designingdocuments_table').bootstrapTable('append', parameter);
						layer.close(index);
					},
					cancel: function(index, layero) {}

				});
			});
		};
		var designdocument_del = function(e, value, row, index) {
			layer.confirm("是否删除？", function(indexl) {
				$("#designingdocuments_table").bootstrapTable('removeByUniqueId', row.id);
				layer.close(indexl);
			});
		};
		//编辑项目
		var editProject = function(e, value, row, index) {
			Mydao.ajax({
				"id": row.id
			}, 'project/s1004', function(result) {
				var currentTime = result.serverTime;
				if(result.code == 200) {
					var resultForm = result.result;
					Mydao.currentPage.params.projectid = row.id; //保存项目ID							
					layer.open({
						type: 1,
						content: "",
						title: '编辑基本信息',
						area: ["70%", "90%"],
						moveOut: true,
						success: function(layero, index) {
							layero.find('.layui-layer-content').load("view/ProjectInformation/Project_edit.html", function(result) {
								init_step(index); //加载tab切换表单	
								designdocument_change(resultForm.superviseorg);
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

							});
						},
						cancel: function(layero, index) {
							Mydao.currentPage.params = {}; //清空当前页面参数
							Mydao.currentPage.params.projectid = undefined; //清空项目ID
						},
						btn2: function(index, layero) {}
					});
				} else {
					layer.alert(result.msg);
				}

			});
		};
		//删除项目
		var delProject = function(e, value, row, index) {
			layer.confirm('确定删除？', {
				icon: 3,
				title: '提示'
			}, function(index) {
				Mydao.ajax({
					id: row.id
				}, 'project/s1005', function(result) {
					var currentTime = result.serverTime;
					if(result.code == 200) {
						xiangmuFuc();
						$("#project #project-table").bootstrapTable("refreshOptions", {
							pageNumber: 1
						}).bootstrapTable("refresh");
					} else {
						layer.alert(result.msg);
					}
				});
				layer.close(index);
			});
		};
		//导出报告
		var downloadProject = function(e, value, row, index) {
			Mydao.ajax({
				id: row.id
			}, 'project/exportProject', function(result) {
				window.location.href = MydaoFileDownPath + "?fileId=" + result.result;
			});
		};

		//编辑监理标段
		var editSupervisionSection = function(e, value, row, indexr) {
			layer.open({
				type: 1,
				content: "",
				title: "编辑监理标段",
				area: ["60%", "80%"],
				moveOut: true,
				success: function(layero, index) {
					layero.find('.layui-layer-content').load("view/ProjectInformation/section_edit.html", function(result) {
						$('.hlj-xzjlfw').show();
						$('.hlj-xzgclqd').hide();
						$('.quanzhong').hide();
						$('#section-edit').on('valid.form', function(e, f) {
							if(!Mydao.currentPage.params.projectid) {
								//临时保存
								var ss = $(f).serializeJson();
								ss.createuserid = Mydao.config.ajaxParams.base.userid;
								ss.clientid = Mydao.clientid;
								Mydao.currentPage.supervisionsection[ss.name] = ss;
								var flag = true,
									_datas = $('#jlbd').bootstrapTable('getData');
								if(_datas.length != 0) {
									for(var i = 0; i < _datas.length; i++) {
										if(_datas[i].delid != row.delid) {
											if(_datas[i].serialnum == ss.serialnum) {
												layer.msg('标段标号已存在!');
												flag = false;
											}
											if(_datas[i].name == ss.name) {
												layer.msg('标段名称已存在!');
												flag = false;
											}
										}
									}
								}
								if(flag) {
									$('#jlbd').bootstrapTable('updateRow', {
										index: indexr,
										row: ss
									});
									layer.close(index);
								}
							} else {
								//立即提交
								var ssww = $(f).serializeJson();
								ssww.createuserid = Mydao.config.ajaxParams.base.userid;
								ssww.clientid = Mydao.clientid;
								ssww.projectid = Mydao.currentPage.params.projectid;
								ssww.id = row.id;
								Mydao.ajax(ssww, 'supervisionSection/s1004', function(data) {
									var currentTime = data.serverTime;
									if(data.code == 200) {
										var result = data.result;
										$('#jlbd').bootstrapTable("refreshOptions", {
											pageNumber: 1
										}).bootstrapTable("refresh");
										//											UE.getEditor('section-edit1').destroy();
										layer.close(index);
									} else {
										layer.alert(data.msg);
									}

								});
							}
						});
						layero.find(".group-input").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30); //解决原先的页面样式混乱问题
						});
						//  select和标头的组合
						layero.find(".group-select").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 40); //解决原先的页面样式混乱问题
						});
						//填充表单的值
						Mydao.initselect(layero, null, function() {
							Mydao.setform(layero, row); //填充表单的值
						}); //加载select
						layero.find('.save').click(function() {
							$('#section-edit').trigger('validate');
						});
					});
				},
				cancel: function(layero, index) {},
				btn2: function(index, layero) {}
			});
		};
		//删除监理标段
		var delSupervisionSection = function(e, value, row, index) {
			layer.confirm('确定删除？', {
				icon: 3,
				title: '提示'
			}, function(index) {
				if(Mydao.currentPage.params.projectid) {
					Mydao.ajax({
						id: row.id
					}, 'supervisionSection/s1005 ', function(result) {
						var currentTime = result.serverTime;
						if(result.code == 200) {
							$("#jlbd").bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						} else {
							layer.alert(result.msg);
						}
					});
				} else {
					$("#jlbd").bootstrapTable('remove', {
						field: 'delid',
						values: [row.delid]
					});
				}
				layer.close(index);
			});
		};
		//编辑施工标段
		var editConstructionSection = function(e, value, row, indexr) {
			layer.open({
				type: 1,
				content: "",
				area: ["60%", "80%"],
				moveOut: true,
				success: function(layero, index) {
					layero.find('.layui-layer-content').load("view/ProjectInformation/section_edit.html", function(result) {
						$('#section-edit').on('valid.form', function(e, f) {
							if(!Mydao.currentPage.params.projectid) {

								// 								cs.quantities = $('#designingdocuments_table').bootstrapTable('getData');
								//临时保存
								var cs = $(f).serializeJson();
								cs.createuserid = Mydao.config.ajaxParams.base.userid;
								cs.clientid = Mydao.clientid;
								Mydao.currentPage.constructionsection[cs.name] = cs;

								var flag = true,
									_datas = $('#sgbd').bootstrapTable('getData');
								if(_datas.length != 0) {
									for(var i = 0; i < _datas.length; i++) {
										if(_datas[i].delid != row.delid) {
											if(_datas[i].serialnum == cs.serialnum) {
												layer.msg('标段标号已存在!');
												flag = false;
											}
											if(_datas[i].name == cs.name) {
												layer.msg('标段名称已存在!');
												flag = false;
											}
										}

									}
								}
								if(flag) {
									cs.quantities = $('#designingdocuments_table').bootstrapTable('getData');
									$('#sgbd').bootstrapTable('updateRow', {
										index: indexr,
										row: cs
									});
									layer.close(index);
								}
							} else {
								//立即提交
								Mydao.currentPage.params.cs = $(f).serializeJson();
								Mydao.currentPage.params.quantities = $('#designingdocuments_table').bootstrapTable('getData');
								//								cs.createuserid = Mydao.config.ajaxParams.base.userid;
								//								cs.clientid = Mydao.clientid;
								//								cs.projectid = Mydao.currentPage.params.projectid;
								Mydao.currentPage.params.cs.id = row.id;
								Mydao.ajax(Mydao.currentPage.params, 'constructionSection/s1004', function(data) {
									var currentTime = data.serverTime;
									if(data.code == 200) {
										var result = data.result;
										$('#sgbd').bootstrapTable("refreshOptions", {
											pageNumber: 1
										}).bootstrapTable("refresh");
										layer.close(index);
									} else {
										layer.alert(data.msg);
									}

								});
							}
						});
						layero.find(".group-input").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
						});
						//  select和标头的组合
						layero.find(".group-select").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 40);
						});

						//填充表单的值
						Mydao.initselect(layero, null, function() {
							Mydao.setform(layero, row); //填充表单的值

						}); //加载select
						if(row.quantities) {
							designingdocuments_tableFn(row.quantities);
						} else {
							designingdocuments_tableFn(row.ql);
						}
						layero.find('.save').click(function() {
							$('#section-edit').trigger('validate');
						});
					});
				},
				cancel: function(layero, index) {}
			});
		};
		//删除施工标段
		var delConstructionSection = function(e, value, row, index) {
			layer.confirm('确定删除？', {
				icon: 3,
				title: '提示'
			}, function(index) {
				if(Mydao.currentPage.params.projectid) {
					Mydao.ajax({
						id: row.id
					}, 'constructionSection/s1005 ', function(result) {
						var currentTime = result.serverTime;
						if(result.code == 200) {
							$("#sgbd").bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						} else {
							layer.alert(result.msg);
						}
					});
				} else {
					$("#sgbd").bootstrapTable('remove', {
						field: 'delid',
						values: [row.delid]
					});
				}
				layer.close(index);
			});
		};

		var dataFilter1 = function(data, resultFrom) {
			data = Mydao.setcontent(data, resultFrom);
			return data;
		};

		var showProject = function(e, value, row, index) {
			Mydao.ajax({
				"id": row.id
			}, 'project/showProject', function(result) {
				var currentTime = result.serverTime;
				var d = result.result;
				if(result.code == 200) {
					layer.open({
						type: 1,
						content: "",
						area: ["70%", "90%"],
						moveOut: true,
						success: function(layero, index) {
							layui.use(['laytpl'], function() {
								var laytpl = layui.laytpl;
								layero.find('.layui-layer-content').load("view/ProjectInformation/Project_show.html", function(e) {
									var _getTpl = $('#project_layui').html(),
										project_show = $('#project_show_layui');
									laytpl(_getTpl).render(d, function(html) {
										project_show.html(html);
									});
									//获取施工标段列表
									project_show.find('#sgbd').bootstrapTable({
										cache: true, //禁用缓存
										search: false, //禁用查询
										striped: true, //隔行变色
										uniqueId: "id", //唯一标识,
										data: d.csl,
										ajaxOptions: {
											ContentType: 'application/json',
											dataType: 'json'
										},
										columns: [{
											title: '序号',
											align: 'center',
											valign: 'middle',
											formatter: function(val, row, index) {
												return index + 1;
											},
										}, {
											title: '标段编号',
											field: 'serialnum',
										}, {
											title: '标段名称',
											field: 'name',
											formatter: Mydao.nameFormatter,
											events: {
												'click a': showssSection
											}
										}, {
											title: '起点进程',
											field: 'startmileage',
										}, {
											title: '终点进程',
											field: 'endmileage',
										}, {
											title: '施工单位',
											field: 'sg',
										}, {
											title: '设计单位',
											field: 'sj',
										}, {
											title: '咨询单位',
											field: 'zx',
										}, {
											title: '监理单位',
											field: 'jl',
										}]
									});
									//获取监理标段列表
									project_show.find('#jlbd').bootstrapTable({
										cache: true, //禁用缓存
										search: false, //禁用查询
										striped: true, //隔行变色
										uniqueId: "id", //唯一标识,
										data: d.ssl,
										ajaxOptions: {
											ContentType: 'application/json',
											dataType: 'json'
										},
										columns: [{
											title: '标段编号',
											field: 'serialnum',
										}, {
											title: '标段名称',
											field: 'name',
											formatter: Mydao.nameFormatter,
											events: {
												'click a': showcsSection
											}
										}, {
											title: '起点进程',
											field: 'startmileage',
										}, {
											title: '终点进程',
											field: 'endmileage',
										}, {
											title: '监理单位',
											// 											field: 'bidunitname',
										}]
									});

								});
							});
						},
						cancel: function(layero, index) {

						}
					});

				} else {
					layer.alert(result.msg);
				}

			});
		};

		var work_points_fun = function(ele, projectid, rowid) {
			if(rowid) {
				Mydao.config.ajaxParams.page = {
					"pageCurrent": 1,
					"pageSize": 1000,
					"orderField": "wp.level",
					"orderDirection": "desc"
				};
				Mydao.ajax({
					'projectid': projectid,
					'sectionid': rowid
				}, "workPoint/findAllWorkPoint", function(resultFrom) {
					if(resultFrom.code == 200) {
						$(ele).find('#work_points_table').bootstrapTable({ // 不用分页也可以显示
							data: resultFrom.result.rows,
							columns: [{
									title: '序号',
									align: 'center',
									valign: 'middle',
									formatter: function(val, row, index) {
										return index + 1;
									},
								},
								{
									title: '专业',
									field: 'disciplinename',
									align: 'center'
								}, {
									title: '工点名称',
									field: 'name',
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
									title: '风险等级',
									field: 'level',
									align: 'center',
									formatter: function(val, row, index) {
										var strs = ["低度风险","中度风险","高度风险","极高度风险"];
										if(val&&val>0&&val<=4){
											return strs[val-1];
										}
										return '';
									}
									
								}
							]
						});
					}
				});
				Mydao.config.ajaxParams.page = {
					"pageCurrent": 1,
					"pageSize": 30,
					"orderField": "",
					"orderDirection": ""
				};
			}
		};

		//显示施工标段
		var showssSection = function(e, value, row, index) {
			layer.open({
				type: 1,
				content: "",
				area: ["60%", "80%"],
				moveOut: true,
				success: function(layero, index) {
					layui.use(['laytpl'], function() {
						var laytpl = layui.laytpl;
						//通过文件id获取文件名						
						layero.find('.layui-layer-content').load("view/ProjectInformation/section_edit_show.html", function(result) {
							if(!Mydao.currentPage.params.projectid) {
								Mydao.ajax({
									'id': row.id
								}, "constructionSection/s1002", function(resultFrom) {
									var d = resultFrom.result;
									var _getTp3 = $('#section_layui').html(),
										section_show1 = $('#section_show_layui');
									laytpl(_getTp3).render(d, function(body) {
										section_show1.html(body);
										section_show1.find("#section_edit_show_gongchengliangqingdan").remove();
										section_show1.find("#section_edit_show_hetong").remove();
									});
									if(d.persons != null) { // 显示人员列表
										$('#Bid_winning_unit').hide(); // 中标单位隐藏
										$('#Key_personnel_boxs').show(); // 显示人员列表
										RenYuanGongGong.Personnel_list(layero, d.persons);
										work_points_fun(layero, row.projectid, row.id);
									}
									Mydao.ajax({
										"id": row.contract
									}, "file/getNameById", function(result) {
										if(result.code == 200) {
											var data1 = result.result;
											var am1 = $('<a class="m-module-a" target="_blank"></a>'),
												showa1 = layero.find('.showa');
											showa1.empty().append(am1.append());
											am1.attr('href', MydaoFileDownPath + '?fileId=' + data1.id).html(data1.name);
										}
									});
									Mydao.ajax({
										"level": 2,
									}, "dictionary/region", function(result) {
										if(result.code == 200) {
											for(var i = 0; i < result.result.length; i++) {
												if(result.result[i].id == row.city) {
													$("#city").html(result.result[i].name);
												}
											}
										}
									});
									Mydao.ajax({
										"level": 1,
									}, "dictionary/region", function(result) {
										if(result.code == 200) {
											for(var j = 0; j < result.result.length; j++) {
												if(result.result[j].id == row.province) {
													$("#province").html(result.result[j].name);
												}
											}
										}
									});

									//工程量清单
//									section_show1.find('#designingdocuments_table').bootstrapTable({
//										cache: true, //禁用缓存
//										search: false, //禁用查询
//										striped: true, //隔行变色
//										uniqueId: "id", //唯一标识,
//										data: d.ql,
//										ajaxOptions: {
//											ContentType: 'application/json',
//											dataType: 'json'
//										},
//										columns: [{
//												title: '序号',
//												align: 'center',
//												valign: 'middle',
//												formatter: function(val, row, index) {
//													return index + 1;
//												},
//											},
//											{
//												title: '文件名称',
//												align: 'center',
//												valign: 'middle',
//												field: 'filename',
//											},
//											{
//												title: '上传时间',
//												align: 'center',
//												valign: 'middle',
//												field: 'uploadtime',
//												formatter: function(val, row, index) {
//													return Mydao.formatDate(row.uploadtime, "YYYY-MM-DD");
//												}
//											}
//										]
//									});
								});
							} else {

								Mydao.ajax({
									'id': row.id
								}, "constructionSection/s1002", function(data) {
									var resultFrom = data.result;
									var d = resultFrom;
									var _getTp3 = $('#section_layui').html(),
										section_show1 = $('#section_show_layui');
									laytpl(_getTp3).render(d, function(body) {
										section_show1.html(body);
									});
									if(d.persons != null) { // 显示人员列表
										$('#Bid_winning_unit').hide(); // 中标单位隐藏
										$('#Key_personnel_boxs').show(); // 显示人员列表
										RenYuanGongGong.Personnel_list(layero, d.persons);
										work_points_fun(layero, row.projectid, row.id);
									}
									Mydao.ajax({
										"id": row.contract
									}, "file/getNameById", function(result) {
										if(result.code == 200) {
											var data1 = result.result;
											var am1 = $('<a class="m-module-a" target="_blank"></a>'),
												showa1 = layero.find('.showa');
											showa1.empty().append(am1.append());
											am1.attr('href', MydaoFileDownPath + '?fileId=' + data1.id).html(data1.name);
										}
									});
									Mydao.ajax({
										"level": 2,
									}, "dictionary/region", function(result) {
										if(result.code == 200) {
											for(var i = 0; i < result.result.length; i++) {
												if(result.result[i].id == row.city) {
													$("#city").html(result.result[i].name);
												}
											}
										}
									});
									Mydao.ajax({
										"level": 1,
									}, "dictionary/region", function(result) {
										if(result.code == 200) {
											for(var j = 0; j < result.result.length; j++) {
												if(result.result[j].id == row.province) {
													$("#province").html(result.result[j].name);
												}
											}
										}
									});

									//获取施工标段列表
									section_show1.find('#designingdocuments_table').bootstrapTable({
										cache: true, //禁用缓存
										search: false, //禁用查询
										striped: true, //隔行变色
										uniqueId: "id", //唯一标识,
										data: d.ql,
										ajaxOptions: {
											ContentType: 'application/json',
											dataType: 'json'
										},
										columns: [{
												title: '序号',
												align: 'center',
												valign: 'middle',
												formatter: function(val, row, index) {
													return index + 1;
												},
											},
											{
												title: '文件名称',
												align: 'center',
												valign: 'middle',
												field: 'filename',
											},
											{
												title: '上传时间',
												align: 'center',
												valign: 'middle',
												field: 'uploadtime',
												formatter: function(val, row, index) {
													return Mydao.formatDate(row.uploadtime, "YYYY-MM-DD");
												}
											}
										]
									});
								});
							}
						});

					});
				},
				cancel: function(layero, index) {}
			});
		};

		//显示监理标段
		var showcsSection = function(e, value, row, index) {
			layer.open({
				type: 1,
				content: "",
				area: ["60%", "80%"],
				moveOut: true,
				success: function(layero, index) {
					layero.find('.layui-layer-content').load("view/ProjectInformation/section_edit.html", function(result) {
						$('.hlj-xzjlfw').show();
						$('.hlj-xzgclqd').hide();
						layero.find("select,input,textarea").attr("disabled", "disabled");
						layero.find(".group-input").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
						});
						//  select和标头的组合
						layero.find(".group-select").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 40);
						});
						Mydao.initselect(layero, null, function() {
							Mydao.setform(layero, row); //填充表单的值
						}); //加载select
						setTimeout(function() {
							layero.find(".layui-upload-button,.fa-times-circle").remove();
						}, 200);
						layero.find('.save').remove();
					});
				},
				cancel: function(layero, index) {}
			});
		};

		$('#project #project-table').bootstrapTable({
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
				Mydao.config.ajaxParams.page.orderField = 'p.updatetime';
				Mydao.config.ajaxParams.page.pageSize = p.pageSize;
				Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
				Mydao.config.ajaxParams.page.orderDirection = 'desc';
				Mydao.config.ajaxParams.params.name = $('#project #searchor [name="name"]').val();
				Mydao.config.ajaxParams.params.status = $('#project #searchor [name="status"]').val();
				Mydao.config.ajaxParams.params.supervisetype = $('#project #searchor [name="supervisetype"]').val();
				Mydao.config.ajaxParams.params.clientid = Mydao.clientid;
				return Mydao.config.ajaxParams;
			},
			columns: [{
				title: '项目编号',
				field: 'code',
			}, {
				title: '项目名称',
				field: 'name',
				formatter: Mydao.nameFormatter,
				events: {
					'click a': showProject
				}
			}, {
				title: '项目类型',
				field: 'type',
			}, {
				title: '监督类型', //新增字段
				field: 'supervisetype',
				formatter: function(value, row, index) {
					var type = ["直管", "铁总", "地方政府"];
					return type[value - 1];
				}
			}, {
				title: '总投资（万元）',
				field: 'investment',
			}, {
				title: '线路长度（km）',
				field: 'length',
			}, {
				title: '操作',
				align: 'center',
				formatter: function(value, row, index) {
					var ctrls = [];
					if(Mydao.permissions['project_edit']) {
						ctrls.push('edit');
					}
					if(Mydao.permissions['project_del']) {
						ctrls.push('del');
					}
					if(Mydao.permissions['project_download']) {
						ctrls.push('download');
					}
					return Mydao.operator(ctrls);
				},
				events: Mydao.operatorEvents({
					edit: editProject,
					del: delProject,
					download: downloadProject //导出报告
				})
			}]
		});

		var xiangmuFuc = function() { //项目信息  数目 查询
			Mydao.ajaxNoPage({
				'name': $('#project #searchor [name="name"]').val(),
				'status': $('#project #searchor [name="status"]').val(),
				'supervisetype': $('#project #searchor [name="supervisetype"]').val()
			}, 'project/findAllNum', function(data) {
				if(data.code == 200) {
					var zongNum = 0;
					var _data = data.result;
					for(var i = 0; i < _data.length; i++) {
						zongNum += parseInt(_data[i].projectnum);
						switch(_data[i].code) {
							case 'GT':
								$('#project #gaotie').html(_data[i].projectnum);
								break;
							case 'PT':
								$('#project #putie').html(_data[i].projectnum);
								break;
							default:
								$('#project #qita').html(_data[i].projectnum);
								break;
						}
					}
					$('#zongshu').html(zongNum);
				}
			});
		};
		xiangmuFuc(); //项目信息  数目 查询
		$('#search').on('click', function(event) {
			xiangmuFuc();
			$("#project #project-table").bootstrapTable("refreshOptions", {
				pageNumber: 1
			}).bootstrapTable("refresh");
		});
		$('#save').on('click', function(event) {
			layer.open({
				type: 1,
				content: "",
				title: "新增工程项目",
				area: ["70%", "90%"],
				moveOut: true,
				success: function(layero, index) {
					layero.find('.layui-layer-content').load("view/ProjectInformation/Project_edit.html", function(result) {
						Mydao.currentPage.constructionsection = {}; //初始化施工标段
						Mydao.currentPage.supervisionsection = {}; //初始化监理标段
						init_step(index);
						//点击新建后然后监管机构有默认值
						var _val = $('#project-edit #supervisetype').val();
						var _this = $('#project-edit #hlj-superviseorg');
						Mydao.ajax({
							type: _val
						}, 'organization/findJDJGByType', function(data) {
							var currentTime = data.serverTime;
							if(data.code == 200) {
								//		 						_this.val('').empty().append('<option value="">--请选择--</option>');
								var result = data.result;
								for(var i = 0; i < result.length; i++) {
									_this.append($('<option value="' + result[i].id + '" >' + result[i].name + '</option>').data(result[i]));
								}
								//		 						if(row){  //编辑回填
								//		 							_this.val(row)
								//		 						}
							} else {
								layer.alert(data.msg);
							}
						});
						designdocument_change();
						layero.find(".group-input").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
						});
						//  select和标头的组合
						layero.find(".group-select").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 40);
						});
						Mydao.initselect(layero); //加载select(页面select获取列表项)
					});
				},
				cancel: function(layero, index) {
					//清空project对象
					Mydao.currentPage.project = undefined; //清空项目
					Mydao.currentPage.constructionsection = undefined; //清空项目ID
					Mydao.currentPage.supervisionsection = undefined; //清空项目ID
					//UE.getEditor('myEditor').destroy();
				}
			});
		});
		var init_step = function(curdialog) {
			var step_flag = false;
			//			$('#example-project').delegate('#project-form', 'valid.form', function(e, form) {
			//				Mydao.currentPage.project = $(form).serializeJson();
			//				Mydao.currentPage.project.createuserid = Mydao.config.ajaxParams.base.userid;
			//				Mydao.currentPage.project.clientid = Mydao.clientid;
			//				if(Mydao.currentPage.params.projectid) {
			//					Mydao.currentPage.project.id = Mydao.currentPage.params.projectid;
			//					Mydao.ajax(Mydao.currentPage.project, 'project/s1003', function(result) {
			//						var currentTime = result.serverTime;
			//						if(result.code == 200) {
			//							step_flag = true;
			//						} else {
			//							layer.msg(result.msg);
			//							step_flag = false;
			//						}
			//					}, false);
			//				} else {
			//					step_flag = true;
			//				}
			//				return step_flag;
			//			}).on('invalid.form', function(e, form, errors) {
			//				step_flag = false;
			//			})
			//			console.log($("#designingdocuments_table").steps())
			//			console.log($("#example-project").steps())
			//			console.log($("#example-project").steps())
			$("#example-project").steps({
				transitionEffect: "fade",
				//				showFinishButtonAlways:Mydao.currentPage.params.projectid,//开启完成
				//初始化向导时触发
				onInit: function(event, currentIndex) {
					//获取施工标段
					$(event.currentTarget).find('#sgbd').bootstrapTable({
						method: 'post',
						url: Mydao.config.path + 'constructionSection/s1001',
						striped: true, //隔行变色
						uniqueId: "id", //唯一标识,
						responseHandler: function(res) { //设置返回数据
							//console.log(res)							
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
							title: '标段编号',
							field: 'serialnum',
						}, {
							title: '标段名称',
							field: 'name',
							formatter: Mydao.nameFormatter,
							events: {
								'click a': showssSection
								//								'click a': showssOutSection
							}
						}, {
							title: '起始里程',
							field: 'startmileage',
						}, {
							title: '终点里程',
							field: 'endmileage',
						}, {
							title: '权重', //新增加字段（修改部分）
							field: 'weight', //等接口调试
						}, {
							title: '操作　<i id="csadd" class="fa fa-plus-square-o" title="新增"></i>',
							align: 'center',
							formatter: function(value, row, index) {
								return Mydao.operator(['edit', 'del']);
							},
							events: Mydao.operatorEvents({
								edit: editConstructionSection,
								del: delConstructionSection
							})
						}]
					});
					//获取监理标段
					$(event.currentTarget).find('#jlbd').bootstrapTable({
						method: 'post',
						url: Mydao.config.path + '/supervisionSection/s1001',
						striped: true, //隔行变色
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
							return Mydao.config.ajaxParams;
						},
						columns: [{
							title: '标段编号',
							field: 'serialnum',
						}, {
							title: '标段名称',
							field: 'name',
							formatter: Mydao.nameFormatter,
							events: {
								'click a': showcsSection
							}
						}, {
							title: '起始里程',
							field: 'startmileage',
						}, {
							title: '终点里程',
							field: 'endmileage',
						}, {
							title: '操作　<i id="ssadd" class="fa fa-plus-square-o" title="新增"></i>',
							align: 'center',
							formatter: function(value, row, index) {
								return Mydao.operator(['edit', 'del']);
							},
							events: Mydao.operatorEvents({
								edit: editSupervisionSection,
								del: delSupervisionSection
							})
						}]
					});
					//施工标段信息新增按钮
					$('#csadd').on('click', function(e) {
						layer.open({
							type: 1,
							content: "",
							area: ["60%", "80%"],
							title: ['添加施工标段'],
							moveOut: true,
							success: function(layero, index, indexr) {
								layero.find('.layui-layer-content').load("view/ProjectInformation/section_edit.html", function(result) {
									$('.hlj-xzjlfw').hide();
									$('.hlj-xzgclqd').show();
									designingdocuments_tableFn(); //加载列表								
									$('#section-edit').on('valid.form', function(e, f) {
										if(!Mydao.currentPage.params.projectid) {
											//临时保存\n
											Mydao.currentPage.params = {};
											//console.log(Mydao.currentPage.params)
											Mydao.currentPage.params.cs = $(f).serializeJson();

											Mydao.currentPage.params.cs.delid = new Date().getTime();

											Mydao.currentPage.params.cs.createuserid = Mydao.config.ajaxParams.base.userid;
											Mydao.currentPage.params.cs.clientid = Mydao.clientid;
											Mydao.currentPage.constructionsection[Mydao.currentPage.params.cs.name] = Mydao.currentPage.params.cs;
											Mydao.currentPage.constructionsection[Mydao.currentPage.params.cs.name].quantities = $('#designingdocuments_table').bootstrapTable('getData');
											//											Mydao.currentPage.constructionsection[Mydao.currentPage.params.quantities]=Mydao.currentPage.params.quantities												

											var flag = true,
												_datas = $('#sgbd').bootstrapTable('getData');
											if(_datas.length != 0) {
												for(var i = 0; i < _datas.length; i++) {
													if(_datas[i].serialnum == Mydao.currentPage.params.cs.serialnum) {
														layer.msg('标段标号已存在!');
														flag = false;
													}
													if(_datas[i].name == Mydao.currentPage.params.cs.name) {
														layer.msg('标段名称已存在!');
														flag = false;
													}
												}
											}
											if(flag) {
												$(event.currentTarget).find('#sgbd').bootstrapTable("append", Mydao.currentPage.params.cs);
												layer.close(index);
											}

										} else {
											//立即提交
											Mydao.currentPage.params.cs = $(f).serializeJson();
											Mydao.currentPage.params.cs.createuserid = Mydao.config.ajaxParams.base.userid;
											Mydao.currentPage.params.cs.clientid = Mydao.clientid;
											Mydao.currentPage.params.cs.projectid = Mydao.currentPage.params.projectid;
											Mydao.currentPage.params.quantities = $('#designingdocuments_table').bootstrapTable('getData');
											Mydao.ajax(Mydao.currentPage.params, 'constructionSection/s1003', function(result) {
												var currentTime = result.serverTime;
												if(result.code == 200) {
													var _result = result.result;
													$(event.currentTarget).find('#sgbd').bootstrapTable("refreshOptions", {
														pageNumber: 1
													}).bootstrapTable("refresh");
													layer.close(index);
												} else {
													layer.msg(result.msg);
												}

											});
										}
									});
									layero.find(".group-input").each(function(index, element) {
										//										$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22)
										$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
									});
									//  select和标头的组合
									layero.find(".group-select").each(function(index, element) {
										//										$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30)
										$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 40);
									});
									Mydao.initselect(layero); //加载select
									layero.find('.save').click(function() {
										$('#section-edit').trigger('validate');
									});
								});

							},
							cancel: function(layero, index) {},
							btn2: function(index, layero) {}
						});
					});
					//监理标段信息新增
					$('#ssadd').on('click', function(e) {
						layer.open({
							type: 1,
							content: "",
							area: ["60%", "80%"],
							title: ['添加监理标段', 'background-color:#D2DFEF;'],
							moveOut: true,
							success: function(layero, index) {
								layero.find('.layui-layer-content').load("view/ProjectInformation/section_edit.html", function(result) {
									$('.hlj-xzjlfw').show();
									$('.hlj-xzgclqd').hide();
									$('.quanzhong').hide();

									$('#section-edit').on('valid.form', function(e, f) {
										if(!Mydao.currentPage.params.projectid) {
											//临时保存
											var ss = $(f).serializeJson();
											ss.createuserid = Mydao.config.ajaxParams.base.userid;
											ss.clientid = Mydao.clientid;
											ss.projectid = Mydao.currentPage.params.projectid;
											Mydao.currentPage.supervisionsection[ss.name] = ss;

											ss.delid = new Date().getTime();

											var flag = true,
												_datas = $('#jlbd').bootstrapTable('getData');
											if(_datas.length != 0) {
												for(var i = 0; i < _datas.length; i++) {
													if(_datas[i].serialnum == ss.serialnum) {
														layer.msg('标段标号已存在!');
														flag = false;
													}
													if(_datas[i].name == ss.name) {
														layer.msg('标段名称已存在!');
														flag = false;
													}
												}
											}
											if(flag) {
												$(event.currentTarget).find('#jlbd').bootstrapTable("append", ss);
												layer.close(index);
											}
										} else {
											//立即提交
											var ssww = $(f).serializeJson();
											ssww.createuserid = Mydao.config.ajaxParams.base.userid;
											ssww.clientid = Mydao.clientid;
											ssww.projectid = Mydao.currentPage.params.projectid;
											Mydao.ajax(ssww, 'supervisionSection/s1003', function(result) {
												var currentTime = result.serverTime;
												if(result.code == 200) {
													var _result = result.result;
													$(event.currentTarget).find('#jlbd').bootstrapTable("refreshOptions", {
														pageNumber: 1
													}).bootstrapTable("refresh");
													layer.close(index);
												} else {
													layer.alert(result.msg);
												}

											});
										}
									});
									layero.find(".group-input").each(function(index, element) {
										//										$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22)
										$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
									});
									//  select和标头的组合
									layero.find(".group-select").each(function(index, element) {
										//										$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30)
										$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 40);
									});
									Mydao.initselect(layero); //加载select
									layero.find('.save').click(function() {
										$('#section-edit').trigger('validate');
									});
								});
							},
							cancel: function(layero, index) {
								//								UE.getEditor('section-edit1').destroy();
							},
							btn2: function(index, layero) {
								//								UE.getEditor('section-edit1').destroy();
							}
						});
					});
				},
				//在步骤更改之前触发，可用于防止由于返回而更改步骤false
				onStepChanging: function(event, currentIndex, newIndex) {
					if(currentIndex > newIndex) {
						console.log('上一页');
						return true;
					} else {
						if(currentIndex == 0) {
							//$('#project-form').trigger('validate');
							//return step_flag;							
							$(event.currentTarget).find('#project-form').trigger("validate");
							if(!$(event.currentTarget).find('#project-form').data("validator").isFormValid()) return false; //验证
							Mydao.currentPage.project = $("#project-form").serializeJson(); //序列化参数	
							if(Mydao.currentPage.project.planstarttime > Mydao.currentPage.project.planendtime) {
								layer.alert("开工日期不能大于竣工日期!");
								return false;
							}
							Mydao.currentPage.project.createuserid = Mydao.config.ajaxParams.base.userid;
							Mydao.currentPage.project.clientid = Mydao.clientid;
							if(Mydao.currentPage.params.projectid) {
								Mydao.currentPage.project.id = Mydao.currentPage.params.projectid;
								Mydao.ajax(Mydao.currentPage.project, 'project/s1003', function(result) {
									var currentTime = result.serverTime;
									if(result.code == 200) {
										step_flag = true;
									} else {
										layer.msg(result.msg);
										step_flag = false;
									}
								}, false);
							} else {
								return true;
							}
							return step_flag;
						} else {
							return true;
						}
					}
				},
				//在步骤更改后触发
				onStepChanged: function(event, currentIndex, priorIndex) {
					if(currentIndex < priorIndex) {
						console.log('上一页完成');
					} else {
						console.log('下一页完成');
					}
				},
				//在完成之前触发，可以通过返回来防止完成false
				onFinishing: function(event, currentIndex) { //完成 方法
					if(!Mydao.currentPage.params.projectid) {
						var params = {};
						params.project = Mydao.currentPage.project;
						params.constructionsection = []; //施工
						params.supervisionsection = []; //监理	

						for(var o in Mydao.currentPage.constructionsection) {
							params.constructionsection.push(Mydao.currentPage.constructionsection[o]);
						}
						for(var s in Mydao.currentPage.supervisionsection) {
							params.supervisionsection.push(Mydao.currentPage.supervisionsection[s]);
						}
						//新增项目
						var flag = false;
						Mydao.ajax(params, 'project/s1002', function(result) {
							var currentTime = result.serverTime;
							if(result.code == 200) {
								flag = true;
							} else {
								layer.alert(result.msg);
								flag = false;
							}
						}, false);

						return flag;
					} else {
						return true;
					}
				},
				//完成后触发
				onFinished: function(event, currentIndex) {
					Mydao.currentPage.params.projectid = undefined; //清空项目ID
					Mydao.currentPage.project = undefined; //清空项目
					Mydao.currentPage.constructionsection = undefined; //清空项目ID
					Mydao.currentPage.supervisionsection = undefined; //清空项目ID
					//					UE.getEditor('myEditor').destroy();
					xiangmuFuc();
					layer.close(curdialog); //完成
					$("#example-project").steps('destroy');
					$("#project #project-table").bootstrapTable("refreshOptions", {
						pageNumber: 1
					}).bootstrapTable("refresh");
				}
			});
		};
	})();
}(jQuery);