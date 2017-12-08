//机构信息
+ function($) {
	'use strict';
	var editer = new Object();
	var resizeInput = function(parent) {
		$(parent).find(".group-input").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
		});
		//  select和标头的组合
		$(parent).find(".group-select").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
		});

		$(parent).find('.sidebar-collapse').slimScroll({
			height: '100%',
		});
	};
	var showOrg = function(e, value, row, index) {
			Mydao.ajax({
				orgid: row.id
			}, 'organization/s1003 ', function(result) {
				var currentTime = result.serverTime;
				if(result.code == 200) {
					var _result = result.result;
					layer.open({
						type: 1,
						content: "",
						title: "查看机构信息",
						area: ["70%", "90%"],
						moveOut: true,
						success: function(layero, index) {
							layero.find('.layui-layer-content').load("view/InstitutionalPersonnel/AgencyChilds/AgencyInformation_show.html", function() {
								init_showstep(index, row.id);
								resizeInput(layero);
								Mydao.initselect(layero, null, function() {
									Mydao.setform($('#jcjg_jgxxShow #org-form1'), _result.info);
									Mydao.setform($('#jcjg_jgxxShow #org-form2'), _result.traffic);
									var identityfront = _result.traffic.identityfront;
									if(identityfront) {
										var identityfront_array = identityfront.split(",");
										for(var i = 0; i < identityfront_array.length; i++) {
											$('#jcjg_jgxxShow #identityfront').append("<img src='" + MydaoFileDownPath + "?fileId=" + identityfront_array[i] + "' width='100px'/>");
										}
									}
									var identityback = _result.traffic.identityback;
									if(identityback) {
										var identityback_array = identityback.split(",");
										for(var j = 0; j < identityback_array.length; j++) {
											$('#jcjg_jgxxShow #identityback').append("<img src='" + MydaoFileDownPath + "?fileId=" + identityback_array[j] + "' width='100px'/>");
										}
									}

									var licensefront = _result.traffic.licensefront;
									if(licensefront) {
										var licensefront_array = licensefront.split(",");
										for(var n = 0; n < licensefront_array.length; n++) {
											$('#jcjg_jgxxShow #licensefront').append("<img src='" + MydaoFileDownPath + "?fileId=" + licensefront_array[n] + "' width='100px'/>");
										}
									}
									var licenseback = _result.traffic.licenseback;
									if(licenseback) {
										var licenseback_array = licenseback.split(",");
										for(var k = 0; k < licenseback_array.length; k++) {
											$('#jcjg_jgxxShow #licenseback').append("<img src='" + MydaoFileDownPath + "?fileId=" + licenseback_array[k] + "' width='100px'/>");
										}
									}
								});
								$('#jcjg_jgxxShow #QualificationTable').bootstrapTable('load', _result.qualification);
								layero.find("select,input,textarea").attr("disabled", "disabled");
							});
						},
						cancel: function(layero, index) {
							//							UE.getEditor('myEditor').destroy();
						}
					});
				} else {
					layer.alert(result.msg);
				}

			});
		},
		init_showstep = function(curdialog, rowid) {
			$("#jcjg_jgxxShow #example-embed").steps({
				transitionEffect: "none",
				enableFinishButton: false,
				enablePagination: false,
				enableAllSteps: true,
				cssClass: "tabcontrol",
				onInit: function(event, currentIndex) {
					$(event.currentTarget).find('#QualificationTable').bootstrapTable({
						uniqueId: 'code',
						columns: [{
							title: '序号',
							align: 'center',
							formatter: function(val, row, index) {
								return index + 1;
							}
						}, {
							title: '证书编号',
							align: 'center',
							field: 'code'
						}, {
							title: '资质类别',
							align: 'center',
							field: 'qualificationcategory',
							formatter: function(val, row, index) {
								return row.qualificationcategoryvalue;
							}
						}, {
							title: '资质类型',
							align: 'center',
							field: 'qualificationtype',
							formatter: function(val, row, index) {
								return row.qualificationtypevalue;
							}
						}, {
							title: '资质来源',
							align: 'center',
							field: 'qualificationsource',
							formatter: function(val, row, index) {
								return row.qualificationsourcevalue;
							}
						}]
					});
					$(event.currentTarget).find('#relatedProject').bootstrapTable({
						pagination: true,
						sidePagination: 'server',
						queryParamsType: "undefined", //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  //设置为limit可以获取limit, offset, search, sort, order  
						method: 'post',
						pageNumber: 1,
						url: Mydao.config.path + 'project/s1007',
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
							Mydao.config.ajaxParams.params.unitid = rowid;
							return Mydao.config.ajaxParams;
						},
						columns: [{
							title: '序号',
							align: 'center',
							formatter: function(val, row, index) {
								return index + 1;
							}
						}, {
							title: '项目名称',
							field: 'name',
							align: 'center',
							formatter: Mydao.nameFormatter,
							events: {
								'click a': function(e, value, row, index) {
									//显示标段
									var showSection = function(e, value, row, index) {
										layer.open({
											type: 1,
											content: "",
											area: ["50%", "70%"],
											moveOut: true,
											success: function(layero, index) {
												layero.find('.layui-layer-content').load("view/ProjectInformation/section_edit.html", function(result) {
													layero.find(".group-input").each(function(index, element) {
														$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
													});
													//  select和标头的组合
													layero.find(".group-select").each(function(index, element) {
														$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
													});
													Mydao.initselect(layero, null, function() {
														Mydao.setform(layero, row); //填充表单的值

													}); //加载select
													$('#sectionUpload #designingdocuments_table').bootstrapTable({
														cache: true, //禁用缓存
														search: false, //禁用查询
														striped: true, //隔行变色
														uniqueId: "id", //唯一标识,
														data: row.ql,
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

													layero.find('.save').remove();
												});
											},
											cancel: function(layero, index) {},
											btn2: function(index, layero) {}
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
													$('#sectionUpload .hlj-xzjlfw').show();
													$('LawOperations .hlj-xzgclqd').hide();
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

									Mydao.ajax({
										"id": row.id
									}, 'project/s1004', function(result) {
										var currentTime = result.serverTime;
										if(result.code == 200) {
											var resultForm = result.result;
											layer.open({
												type: 1,
												content: "",
												area: ["60%", "80%"],
												moveOut: true,
												//												cancel: function(layero, index) {},
												success: function(layero, index) {
													layero.find('.layui-layer-content').load("view/ProjectInformation/Project_edit.html", function(result) {
														$("#project-edit form input,#project-edit form input textarea").attr("readonly", "readonly");
														$("#project-edit form select").attr("disabled", "disabled");
														var _val = resultForm.supervisetype;
														//														var _this = $('#project-edit #hlj-superviseorg');
														Mydao.ajax({
															type: _val
														}, 'organization/findJDJGByType', function(result) {
															var currentTime = result.serverTime;
															if(result.code == 200) {
																//																_this.val('').empty().append('<option value="">--请选择--</option>');
																var _result = result.result;
																for(var i = 0; i < _result.length; i++) {
																	//																	_this.append($('<option value="' + result[i].id + '" >' + result[i].name + '</option>').data(result[i]));
																	var _this = $('#project-edit #hlj-superviseorg');
																	var opt = $("<option></option>");
																	opt.html(_result[i].name);
																	opt.val(_result[i].id);
																	_this.append(opt);
																}
																if(opt.val() == resultForm.superviseorg) {
																	$(this).attr("selected", "selected");
																}

																if(_result.name) { //编辑回填
																	_this.val(_result.name);
																}

															} else {
																layer.alert(result.msg);
															}
														});
														$("#project-edit #example-project").steps({
															transitionEffect: "fade",
															//															enableFinishButton: false,
															//															enablePagination: false,
															//															enableAllSteps: true,
															//															titleTemplate: "#title#",
															onInit: function(event, currentIndex) {
																//获取施工标段
																$(event.currentTarget).find('#project-edit #sgbd').bootstrapTable({
																	method: 'post',
																	url: Mydao.config.path + 'constructionSection/s1001',
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
																		Mydao.config.ajaxParams.params.projectid = row.id;
																		Mydao.config.ajaxParams.params.clientid = Mydao.clientid;
																		return Mydao.config.ajaxParams;
																	},
																	columns: [{
																		title: '标段编号',
																		align: 'center',
																		field: 'serialnum',
																	}, {
																		title: '标段名称',
																		align: 'center',
																		field: 'name',
																		formatter: Mydao.nameFormatter,
																		events: {
																			'click a': showSection
																		}
																	}, {
																		title: '起始里程',
																		align: 'center',
																		field: 'startmileage',
																	}, {
																		title: '终点里程',
																		align: 'center',
																		field: 'endmileage',
																	}]
																});
																//获取监理标段
																$(event.currentTarget).find('#project-edit #jlbd').bootstrapTable({
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
																		Mydao.config.ajaxParams.params.projectid = row.id;
																		Mydao.config.ajaxParams.params.clientid = Mydao.clientid;
																		return Mydao.config.ajaxParams;
																	},
																	columns: [{
																		title: '标段编号',
																		align: 'center',
																		field: 'serialnum',
																	}, {
																		title: '标段名称',
																		align: 'center',
																		field: 'name',
																		formatter: Mydao.nameFormatter,
																		events: {
																			'click a': showcsSection
																		}
																	}, {
																		title: '起始里程',
																		align: 'center',
																		field: 'startmileage',
																	}, {
																		title: '终点里程',
																		align: 'center',
																		field: 'endmileage',
																	}]
																});
															},
															onFinished: function(event, currentIndex) {
																layer.close(index);
																$("#project-edit #example-project").steps('destroy');
															}
														}); //加载tab切换表单
														layero.find(".group-input").each(function(index, element) {
															$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
														});
														//														//  select和标头的组合
														layero.find(".group-select").each(function(index, element) {
															$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
														});
														layero.showimage();

														Mydao.initselect(layero, null, function() {
															Mydao.setform(layero, resultForm); //填充表单的值
														}); //加载select

													});
												},
												cancel: function(layero, index) {
													Mydao.currentPage.params = {}; //清空当前页面参数
													Mydao.currentPage.params.projectid = undefined; //清空项目ID
												}
											});
										} else {
											layer.alert(result.msg);
										}

									});
								}
							}
						}]
					});
				},
				onFinished: function(event, currentIndex) {
					Mydao.currentPage.params = {};
					layer.close(curdialog);
				}
			});
		};

	//	相关企业
	(function() {
		var url = 'organization/s1004';
		$('#testingfacility #testingfacility-table').bootstrapTable({
			method: 'post',
			url: Mydao.config.path + url,
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
				Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
				Mydao.config.ajaxParams.page.pageSize = p.pageSize;
				Mydao.config.ajaxParams.page.orderField = p.sortName;
				Mydao.config.ajaxParams.page.orderDirection = p.sortOrder;
				Mydao.config.ajaxParams.params.grouptype = 106;
				return Mydao.config.ajaxParams;
			},
			columns: [{
				title: '序号',
				align: 'center',
				formatter: function(val, row, index) {
					return index + 1;
				}
			}, {
				title: '机构名称',
				align: 'center',
				field: 'name',
				formatter: Mydao.nameFormatter,
				events: {
					'click a': showOrg
				}
			}, {
				title: '注册资本金',
				align: 'center',
				field: 'registeredcapital',
			}, {
				title: '法人代表',
				align: 'center',
				field: 'legalperson',
			}]
		});
		$('#testingfacility #search').on('click', function() {
			$('#testingfacility #testingfacility-table').bootstrapTable('refreshOptions', {
				queryParams: function(p) {
					Mydao.config.ajaxParams.params = {};
					Mydao.config.ajaxParams.params.clientid = Mydao.clientid;
					Mydao.config.ajaxParams.params.orgName = $('#orgName').val();
					Mydao.config.ajaxParams.params.grouptype = 106;
					return Mydao.config.ajaxParams;
				}
			});
		});
	})();
}(jQuery);