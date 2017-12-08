//机构信息
(function() {
	'use strict';
	
	$('#agency_information_lzh').find('#new').on('click', function(e) {
		layer.open({
			type: 1,
			content: "",
			area: ['70%', '90%'],
			moveOut: true,
			title: '新建机构信息',
			success: function(layero, index) {
				layero.find('.layui-layer-content').load("view/InstitutionalPersonnel/AgencyChilds/AgencyInformation_NewChild.html", function(result) {
					init_step(index);
					resizeInput(layero);
					var _tab = $('#agency_information .nav-tabs').find('li.active').find('a').attr('href');
					Mydao.initselect(layero, null, function() {
						switch(_tab) {
							case '#tab-gczljdzx':
								layero.find('#org-form1 #grouptype').val('101');
								break;
							case '#tab-xqjdjg':
								layero.find('#org-form1 #grouptype').val('101');
								Mydao.multiple(layero);
								layero.find('#org-form1 #JDJG_NB').show().find('[name="orgtype"]').val('1');
								break;
							case '#tab-xqjcjg':
								//默认选中'检测机构'
								layero.find('#org-form1 #grouptype').val('106');
								//有默认值时让监督机构默认显示
								$('#DW_LOW').show();
								break;
							case '#tab-tzjdjg':
								layero.find('#org-form1 #grouptype').val('101');
								Mydao.multiple(layero);
								layero.find('#org-form1 #JDJG_NB').show().find('[name="orgtype"]').val('2');
								break;
						}
					});
					//		企业类型选择
					$('[name="grouptype"]').change(function() {
						var _this = $(this).find("option:selected"),
							_jdjg = '监督机构',
							_jdjgLine = $('#JDJG_NB'),
							_dwLine = $('#DW_LOW');
						if(_this.text() == _jdjg) {
							_dwLine.hide();
							_jdjgLine.show();
							Mydao.multiple(layero);
						} else {
							_jdjgLine.hide();
							_dwLine.show();
						}
					});
				});
			},
			cancel: function(layero, index) {

			}
		});
	});
	$(document.body).delegate('#org-form1', 'valid.form', function() {
		Mydao.currentPage.flag = true;
		Mydao.currentPage.params.info = $(this).serializeJson();
	}).on('invalid.form', function() {
		Mydao.currentPage.flag = false;
	});
	$(document.body).delegate('#org-form2', 'valid.form', function() {
		Mydao.currentPage.flag = true;
		Mydao.currentPage.params.traffic = $(this).serializeJson();
	}).on('invalid.form', function() {
		Mydao.currentPage.flag = false;
	});
	var resizeInput = function(parent) {
		$(parent).find(".group-input").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
		});
		//  select和标头的组合
		$(parent).find(".group-select").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
		});
		
		//  textarea和标头的组合
		$(parent).find(".group-textarea").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
		});
		$(parent).find('.sidebar-collapse').slimScroll({
			height: '100%',
		});
	};
	var showOrg = function(e, value, row, index) {
			var flag = false;
			if(row.grouptype) { //查看详情  判断 grouptype 为101 监督机构时不显示    被处罚记录
				if(row.grouptype == '101')
					flag = true;
			}
			Mydao.ajax({
				orgid: row.id
			}, 'organization/s1003', function(result) {
				var currentTime = result.serverTime;
				if(result.code == 200) {
					var d = result.result;
					layer.open({
						type: 1,
						content: "",
						title: "机构信息",
						area: ["70%", "90%"],
						moveOut: true,
						success: function(layero, index) {
							layui.use(['laytpl'], function() {
								var laytpl = layui.laytpl;
								layero.find('.layui-layer-content').load("view/InstitutionalPersonnel/AgencyChilds/AgencyInformation_See.html", function() {
									var _getTpl = $('#AgencyInformation_layui').html(),
										project_show = $('#AgencyInformation_See');
									laytpl(_getTpl).render(d, function(html) {
										var project_url = '';
										project_show.html(html);
										//修改监督机构的时候是监督项目，其他的是参建项目
										if(d.info.grouptype == 101) {
											$('#jdxmtitle').show();
											$('#cjxmtitle').hide();
											project_url = 'project/findallproject';
										} else {
											$('#jdxmtitle').hide();
											$('#cjxmtitle').show();
											project_url = 'project/findRelationProject';
										}
										//监督辖区和监督标签的回填
										if(d.info.orgtype != null) {
											if(d.info.orgtype == 1) {
												d.info.orgtype = "辖区";
												$("#orgtype").html(d.info.orgtype);
											} else {
												d.info.orgtype = "铁总";
												$("#orgtype").html(d.info.orgtype);
											}
										} else {
											$("#orgtype").parent().css("display", "none");
										}
										if(d.info.supervisedarea != null) {
											var arr = d.info.supervisedarea.split(",");
											Mydao.ajax({
												"level": 1
											}, "dictionary/region", function(result) {
												for(var i = 0; i < arr.length; i++) {
													for(var j = 0; j < result.result.length; j++) {
														if(arr[i] == result.result[j].id) {
															arr[i] = result.result[j].name;
														}
													}
												}
												$("#supervisedarea").html(arr.join(","));
											});

										} else {
											$("#supervisedarea").parent().css("display", "none");
										}
										//监督辖区和监督标签的回填end
										var identityfront;
										d.traffic ? identityfront = d.traffic.identityfront : '';
										if(identityfront) {
											var identityfront_array = identityfront.split(",");
											for(var i = 0; i < identityfront_array.length; i++) {
												$('#identityfront').append("<img src='" + MydaoFileDownPath + "?fileId=" + identityfront_array[i] + "' width='100px'/>");
											}
										}
										var identityback;
										d.traffic ? identityback = d.traffic.identityback : '';
										if(identityback) {
											var identityback_array = identityback.split(",");
											for(var w = 0; w < identityback_array.length; w++) {
												$('#identityfront').append("<img src='" + MydaoFileDownPath + "?fileId=" + identityback_array[w] + "' width='100px'/>");
											}
										}
										var licensefront;
										d.traffic ? licensefront = d.traffic.licensefront : '';
										if(licensefront) {
											var licensefront_array = licensefront.split(",");
											for(var x = 0; x < licensefront_array.length; x++) {
												$('#licensefront').append("<img src='" + MydaoFileDownPath + "?fileId=" + licensefront_array[x] + "' width='100px'/>");
											}
										}
										var licenseback;
										d.traffic ? licenseback = d.traffic.licenseback : '';
										if(licenseback) {
											var licenseback_array = licenseback.split(",");
											for(var f = 0; f < licenseback_array.length; f++) {
												$('#licensefront').append("<img src='" + MydaoFileDownPath + "?fileId=" + licenseback_array[f] + "' width='100px'/>");
											}
										}
										$('#qiyezizhi').bootstrapTable({
											data: d.qualification,
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
											}, {
												title: '有效期',
												align: 'center',
												field: 'validity',
												formatter: function(val, row, index) {
													return Mydao.formatDate(val);
												}
											}, {
												title: '资质扫描',
												align: 'center',
												field: 'file',
												formatter: function(val, row, index) {
													return Mydao.imgName(row.file);
												}
											}]
										});
										Mydao.ajax({
											"superviseorg": d.info.orgid,
											"unitid": d.info.orgid
										}, project_url, function(result) {
											$('#jianduxiangmu').bootstrapTable({
												data: result.result,
												columns: [{
														title: '序号',
														align: 'center',
														formatter: function(val, row, index) {
															return index + 1;
														}
													},
													{
														title: '项目名称',
														align: 'center',
														field: 'name',
														formatter: Mydao.nameFormatter,
														events: {
															'click a': RenYuanGongGong.Org_entry_name
														}
													}, {
														title: '线路长度',
														align: 'center',
														field: 'length',
														formatter: function(val, row, index) {
															return row.length;
														}
													}, {
														title: '总工期',
														align: 'center',
														field: 'schedule',
														formatter: function(val, row, index) {
															return row.schedule;
														}
													}, {
														title: '总投资(万元)',
														align: 'center',
														field: 'investment',
														formatter: function(val, row, index) {
															return row.investment;
														}
													}
												]
											});
										});
									});

									//	判断机构被处罚记录是否 显示
									if(!flag) { //显示
										$('#Org_penalty_record_boxs').show();
										Mydao.config.ajaxParams.page = {
											"pageCurrent": 1,
											"pageSize": 10000,
											"orderField": "",
											"orderDirection": ""
										};
										Mydao.ajax({
											'punishedunits': row.id
										}, "penalties/findAllPenalties", function(resultFrom) {
											if(resultFrom.code == 200) {
												RenYuanGongGong.Org_penalty_record(layero, resultFrom.result.rows);
											}
										});
										Mydao.config.ajaxParams.page = {
											"pageCurrent": 1,
											"pageSize": 30,
											"orderField": "",
											"orderDirection": ""
										};

									}
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
		},
		editOrg = function(e, value, row, index) {
			Mydao.ajax({
				orgid: row.id
			}, 'organization/s1003 ', function(data) {
				var currentTime = data.serverTime;
				if(data.code == 200) {
					var result = data.result;

					layer.open({
						type: 1,
						title: '编辑机构信息',
						content: "",
						area: ["70%", "90%"],
						moveOut: true,
						success: function(layero, index) {
							layero.find('.layui-layer-content').load("view/InstitutionalPersonnel/AgencyChilds/AgencyInformation_NewChild.html", function() {
								init_step(index, row.id, result);
								resizeInput(layero);
								//解决回显问题
								var _jdjgLine = $('#JDJG_NB'),
									_dwLine = $('#DW_LOW');
								if(row.grouptype == '101' || result.info.grouptype == 101) {
									_jdjgLine.show();
									_dwLine.hide();
								} else {
									_dwLine.show();
									_jdjgLine.hide();
								}
								$('[name="grouptype"]').change(function() {
									var _this = $(this).find("option:selected"),
										_jdjg = '监督机构',
										_jdjgLine = $('#JDJG_NB'),
										_dwLine = $('#DW_LOW');
									if(_this.text() == _jdjg) {
										_dwLine.hide();
										_jdjgLine.show();
										Mydao.multiple(layero);
									} else {
										_jdjgLine.hide();
										_dwLine.show();
									}
								});
								Mydao.initselect(layero, null, function() {
									Mydao.setform($('#org-form1'), result.info);
									Mydao.setform($('#org-form2'), result.traffic);
								});
								if(_jdjgLine.is(':visible')) {
									if(result.info.supervisedarea != null) {
										Mydao.multiple(layero);
										var str = result.info.supervisedarea.split(",");
										$("#supervisedarea").val(str).trigger("change");
									}
								}
							});
						},
						cancel: function(layero, index) {

						}
					});
				} else {
					layer.alert(data.msg);
				}

			});
		},
		delOrg1 = function(e, value, row, index) {
			layer.confirm('是否删除？', function(index) {
				$(this).doajax({
					url: 'organization/s1007',
					data: {
						orgid: row.id
					}
				}, function() {
					$('#agency_information #XQJDTable,#agency_information #TZJDTable,#agency_information #ZZQYTable,#agency_information #JDDXTable').bootstrapTable('refresh');
				});
				layer.close(index);
			});
		},
		delOrg2 = function(e, value, row, index) {
			layer.confirm('是否删除？', function(index) {
				$(this).doajax({
					url: 'organization/s1008',
					data: {
						id: row.id
					}
				}, function() {
					$('#agency_information #ZZQYTable').bootstrapTable('refresh');
				});
				layer.close(index);
			});
		},
		editZiZhi = function(e, value, row, indexr) {
			layer.open({
				type: 1,
				content: "",
				area: ["70%", "90%"],
				moveOut: true,
				btn: ['保存'],
				success: function(layero, index) {
					layero.find('.layui-layer-content').load("view/InstitutionalPersonnel/AgencyChilds/add_Scanning.html", function() {
						resizeInput(layero);
						Mydao.initselect(layero, null, function() {
							Mydao.setform(layero, row);
						});
					});
				},
				cancel: function(layero, index) {

				},
				yes: function(index, layero) {
					layero.find('#org-form3').trigger('validate');
					if(layero.find('#org-form3').data("validator").isFormValid()) {
						layer.alert("保存成功！", function(inx2) {
							layer.close(inx2);
							var rs = layero.find('#org-form3').serializeJson();
							rs.file = $(layero).find('[name="file"]').val();
							rs.qualificationcategoryvalue = $(layero).find('[name="qualificationcategory"] option:selected').text();
							rs.qualificationtypevalue = $(layero).find('[name="qualificationtype"] option:selected').text();
							rs.qualificationsourcevalue = $(layero).find('[name="qualificationsource"] option:selected').text();
							//							rs.id = row.id;

							$('#QualificationTable').bootstrapTable('updateRow', {
								index: indexr,
								row: rs
							});
							layer.close(index);
						});
					}
				}
			});
		},
		delZiZhi = function(e, value, row, index) {
			layer.confirm("是否删除？", function(indexl) {
				$('#QualificationTable').bootstrapTable('remove', {
					field: 'id',
					values: [row.id]
				});
				layer.close(indexl);
			});
		},
		init_step = function(curdialog, rowid, data) {
			$("#example-embed").steps({
				transitionEffect: "fade",
				showFinishButtonAlways: rowid,
				labels: {
					finish: "保存",
				},
				onInit: function(event, currentIndex) { //第二步
					$(event.currentTarget).find('#QualificationTable').bootstrapTable({
						data: rowid ? data.qualification : [],
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
							title: '有效期',
							align: 'center',
							field: 'validity',
							formatter: function(val, row, index) {
								if(val && val.split('-').length == 1) {
									return Mydao.formatDate(val);
								} else {
									return val;
								}
							}
						}, {
							title: '资质来源',
							align: 'center',
							field: 'qualificationsource',
							formatter: function(val, row, index) {
								return row.qualificationsourcevalue;
							}
						}, {
							title: '操作　<i id="zizhiadd" class="fa fa-plus-square-o" title="新增"></i>',
							align: 'center',
							formatter: function(value, row, index) {
								return Mydao.operator(['edit', 'del']);
							},
							events: Mydao.operatorEvents({
								edit: editZiZhi,
								del: delZiZhi
							})
						}]
					});
					$('#zizhiadd').on('click', function() {
						layer.open({
							type: 1,
							content: "",
							area: ["600px", "400px"],
							title: "新增企业资质",
							btn: ['保存'],
							success: function(layero, index) {
								layero.find('.layui-layer-content').load("view/InstitutionalPersonnel/AgencyChilds/add_Scanning.html", function() {
									resizeInput(layero);
									Mydao.initselect(layero);
								});
							},
							cancel: function(layero, index) {

							},
							yes: function(index, layero) {
								layero.find('#org-form3').trigger('validate');
								if(layero.find('#org-form3').data("validator").isFormValid()) {
									layer.alert("保存成功！", function(inx2) {
										layer.close(inx2);
										var rs = layero.find('#org-form3').serializeJson();
										rs.file = $(layero).find('[name="file"]').val();
										rs.qualificationcategoryvalue = $(layero).find('[name="qualificationcategory"] option:selected').text();
										rs.qualificationtypevalue = $(layero).find('[name="qualificationtype"] option:selected').text();
										rs.qualificationsourcevalue = $(layero).find('[name="qualificationsource"] option:selected').text();
										rs.id = new Date().getTime();
										$(event.currentTarget).find('#QualificationTable').bootstrapTable('append', rs);
										layer.close(index);
									});
								}
							}
						});
					});
				},
				onStepChanging: function(event, currentIndex, newIndex) {
					if(currentIndex > newIndex) {
						console.log('上一页');
					} else {
						if(currentIndex == 0) {
							$('#org-form1').trigger('validate');
							return Mydao.currentPage.flag;
						} else if(currentIndex == 1) {
							$('#org-form2').trigger('validate');
							return Mydao.currentPage.flag;
						}
					}
					return true;
				},
				onStepChanged: function(event, currentIndex, priorIndex) {
					if(currentIndex < priorIndex) {
						console.log('上一页完成');
					} else {
						console.log('下一页完成');
					}
				},
				onFinishing: function(event, currentIndex) {
					var flag = false;
					//基本信息
					Mydao.currentPage.params.info = $("#org-form1").serializeJson();
					var supervisedarea = $("#org-form1").find('#supervisedarea').val();

					//					return Mydao.currentPage.flag;
					if(supervisedarea != null) {
						Mydao.currentPage.params.info.supervisedarea = supervisedarea.join(',');
					}
					if(currentIndex === 0) { //第一步点击完成
						//新增第一步单步保存的时候需要验证必填项												
						Mydao.currentPage.params.traffic = $("#org-form2").serializeJson();
						Mydao.currentPage.params.qualification = [];

						if(rowid) {
							Mydao.currentPage.params.info.orgid = rowid;
						}
						Mydao.ajax(Mydao.currentPage.params, rowid ? 'organization/s1006' : 'organization/s1005', function(data) {
							var currentTime = data.serverTime;
							if(data.code == 200) {
								var result = result.result;
								flag = true;
							} else {
								flag = false;
								layer.alert(data.msg);
							}
						}, false);
						return flag;
					}
					//营业执照信息
					Mydao.currentPage.params.traffic = $("#org-form2").serializeJson();

					if(currentIndex === 1) { //第二步点击完成 
						//新增第二步单步保存的时候需要验证必填项									
						Mydao.currentPage.params.qualification = [];
						if(rowid) {
							Mydao.currentPage.params.info.orgid = rowid;
						}
						Mydao.ajax(Mydao.currentPage.params, rowid ? 'organization/s1006' : 'organization/s1005', function(data) {
							var currentTime = data.serverTime;
							if(data.code == 200) {
								var result = data.result;
								flag = true;
							} else {
								flag = false;
								layer.alert(data.msg);
							}
						}, false);
						return flag;
						Mydao.currentPage.params.qualification = [];
						Mydao.ajax(Mydao.currentPage.params, 'organization/s1005', function(data) {
							var currentTime = data.serverTime;
							if(data.code == 200) {
								var result = data.result;
								flag = true;
							} else {
								flag = false;
								layer.alert(data.msg);
							}
						}, false);
						return flag;
						//					}
					}
					//企业资质
					Mydao.currentPage.params.qualification = $('#QualificationTable').bootstrapTable('getData');
					//添加 /第三步点击完成 
					if(rowid) {
						Mydao.currentPage.params.info.orgid = rowid;
					}

					Mydao.ajax(Mydao.currentPage.params, rowid ? 'organization/s1006' : 'organization/s1005', function(data) {
						var currentTime = data.serverTime;
						if(data.code == 200) {
							var result = data.result;
							flag = true;
						} else {
							flag = false;
							layer.alert(data.msg);
						}
					}, false);
					return flag;
				},
				onFinished: function(event, currentIndex) {
					layer.alert("保存成功！", function(inx) {
						Mydao.currentPage.params = {};
						layer.close(curdialog);
						//新建机构信息 刷新 所有列表
						$("#agency_information #leftorg,#XQJDTable,#XQJCTable,#TZJDTable,#JDDXTable,#ZZQYTable").bootstrapTable("refresh");
						layer.close(inx);
					});
				}
			});
		};
	//	子父表
	var oInit = {};
	oInit.InitSubTable = function(index, row, $detail) {
		var _list = row.son;
		var cur_table = $detail.html('<table></table>').find('table');
		$(cur_table).bootstrapTable({
			showHeader: false,
			data: _list,
			columns: [{
				field: 'bname',
				align: 'center',
				title: '机构名称',
				formatter: Mydao.nameFormatter,
				events: {
					'click a': showOrg //辖区检测机构查看
				}
			}, {
				field: 'bcontacts',
				align: 'center',
				title: '联系人'
			}, {
				field: 'btel',
				align: 'center',
				title: '联系电话'
			}, {
				title: '操作',
				align: 'center',
				formatter: function(value, row, index) {
					return Mydao.operator(['edit', 'del']);
				},
				events: Mydao.operatorEvents({
					edit: editOrg,
					del: delOrg1
				})
			}, ],
			//无线循环取子表，直到子表里面没有记录
			onExpandRow: function(index, row, $Subdetail) {
				oInit.InitSubTable(index, row, $Subdetail);
			}
		});
	};
	//	工程质量监督中心
	$(function() {

		Mydao.initselect('#agency_information_lzh'); //加载select

		//		机构总览
		var url = 'organization/findjlzl';
		$('#agency_information_lzh').find('#agency_information #JGZL_org').bootstrapTable({
			pagination: true, //是否分页
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
				Mydao.config.ajaxParams.page.orderField = ''; //定义排序列,通过url方式获取数据填写字段名，否则填写下标
				Mydao.config.ajaxParams.page.pageSize = p.pageSize; //如果设置了分页，页面数据条数，默认10
				Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber; //如果设置了分页，首页页码，默认1
				Mydao.config.ajaxParams.page.orderDirection = ''; //定义排序方式 'asc' 或者 'desc'，默认 'asc'
				//				企业类型
				Mydao.config.ajaxParams.params.grouptype = $('#agency_information #tab-jgzl #JGZLgroup').val();
				//				监督对象
				Mydao.config.ajaxParams.params.jddx = $('#agency_information #tab-jgzl #JGZLsupervise').val();
				//				企业名称
				Mydao.config.ajaxParams.params.name = $('#agency_information #tab-jgzl #JGZLname').val();
				return Mydao.config.ajaxParams;
			},
			columns: [{
				title: '序号',
				align: 'center',
				formatter: function(val, row, index) {
					return index + 1;
				}
			}, {
				title: '企业名称',
				align: 'center',
				field: 'name',
				formatter: Mydao.nameFormatter,
				events: {
					'click a': showOrg
				}
			}, {
				title: '单位类型',
				align: 'center',
				field: 'typename'
			}, {
				title: '参建项目数',
				align: 'center',
				field: 'projectnum'
			}]
		});

		var url1 = 'organization/findAllPage';
		$('#agency_information_lzh').find('#agency_information #leftorg').bootstrapTable({
			pagination: true, //是否分页
			//			sidePagination: 'server', //设置在哪里进行分页，可选值为 'client' 或者 'server'。设置 'server'时，必须设置 服务器数据地址（url）或者重写ajax方法
			queryParamsType: "undefined", //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  //设置为limit可以获取limit, offset, search, sort, order  
			method: 'post',
			pageNumber: 1,
			url: Mydao.config.path + url1,
			cache: true, //禁用缓存
			search: false, //禁用查询
			striped: true, //隔行变色
			uniqueId: "id", //唯一标识,
			responseHandler: function(res) { //设置返回数据
				if(res.code == 200) {
					return res.result.rows;
				}
			},
			ajaxOptions: {
				ContentType: 'application/json',
				dataType: 'json'
			},
			queryParams: function(p) {
				Mydao.config.ajaxParams.params = {};
				Mydao.config.ajaxParams.params.node = 2;
				Mydao.config.ajaxParams.params.type = 1;
				//分页mydao-init.js
				Mydao.config.ajaxParams.page.orderField = 'createtime'; //定义排序列,通过url方式获取数据填写字段名，否则填写下标
				Mydao.config.ajaxParams.page.pageSize = p.pageSize; //如果设置了分页，页面数据条数，默认10
				Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber; //如果设置了分页，首页页码，默认1
				Mydao.config.ajaxParams.page.orderDirection = 'desc'; //定义排序方式 'asc' 或者 'desc'，默认 'asc'
				return Mydao.config.ajaxParams;
			},
			columns: [{
				title: '序号',
				align: 'center',
				formatter: function(val, row, index) {
					return index + 1;
				}
			}, {
				title: '部门',
				align: 'center',
				field: 'name'
			}, {
				title: '部门职能',
				align: 'center',
				field: 'departmentexplain'
			}]
		});
		//	工程质量监督中心 end

		//	辖区监督机构
		var url2 = 'organization/findAllPage';
		$('#agency_information_lzh').find('#agency_information #XQJDTable').bootstrapTable({
			pagination: true, //是否分页
			//			sidePagination: 'server', //设置在哪里进行分页，可选值为 'client' 或者 'server'。设置 'server'时，必须设置 服务器数据地址（url）或者重写ajax方法
			queryParamsType: "undefined", //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  //设置为limit可以获取limit, offset, search, sort, order  
			method: 'post',
			pageNumber: 1,
			url: Mydao.config.path + url2,
			cache: true, //禁用缓存
			search: false, //禁用查询
			striped: true, //隔行变色
			uniqueId: "id", //唯一标识,
			responseHandler: function(res) { //设置返回数据
				if(res.code == 200) {
					return res.result.rows;
				}
			},
			ajaxOptions: {
				ContentType: 'application/json',
				dataType: 'json'
			},
			queryParams: function(p) {
				Mydao.config.ajaxParams.params = {};
				Mydao.config.ajaxParams.params.node = 1;
				Mydao.config.ajaxParams.params.orgtype = 1;
				Mydao.config.ajaxParams.params.name = $('#agency_information #tab-xqjdjg #orgName2').val();
				Mydao.config.ajaxParams.params.registerprovince = $('#agency_information #tab-xqjdjg [name="registerprovince"]').val();
				return Mydao.config.ajaxParams;
			},
			columns: [{
				title: '序号',
				align: 'center',
				formatter: function(val, row, index) {
					return index + 1;
				},
			}, {
				title: '机构名称',
				align: 'center',
				field: 'name',
				formatter: Mydao.nameFormatter,
				events: {
					'click a': showOrg //辖区监督机构查看
				}
			}, {
				title: '联系人',
				align: 'center',
				field: 'contacts'
			}, {
				title: '联系电话',
				align: 'center',
				field: 'tel'
			}, {
				title: '操作',
				align: 'center',
				formatter: function(value, row, index) {
					return Mydao.operator(['edit', 'del']);
				},
				events: Mydao.operatorEvents({
					edit: editOrg,
					del: delOrg1
				})
			}]
		});
		//	辖区监督机构 end

		//	辖区检测机构
		var url3 = 'organization/fingxqjcjg';
		$('#agency_information_lzh').find('#agency_information  #XQJCTable').bootstrapTable({
			pagination: true, //是否分页
			//			sidePagination: 'server', //设置在哪里进行分页，可选值为 'client' 或者 'server'。设置 'server'时，必须设置 服务器数据地址（url）或者重写ajax方法
			queryParamsType: "undefined", //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  //设置为limit可以获取limit, offset, search, sort, order  
			method: 'post',
			pageNumber: 1,
			url: Mydao.config.path + url3,
			cache: true, //禁用缓存
			search: false, //禁用查询
			striped: true, //隔行变色
			uniqueId: "id", //唯一标识,
			detailView: true,
			responseHandler: function(res) { //设置返回数据
				if(res.code == 200) {
					return res.result.rows;
				}
			},
			ajaxOptions: {
				ContentType: 'application/json',
				dataType: 'json'
			},
			queryParams: function(p) {
				Mydao.config.ajaxParams.params = {};
				Mydao.config.ajaxParams.params.node = 1;
				Mydao.config.ajaxParams.params.channl = 1;
				Mydao.config.ajaxParams.params.name = $('#agency_information #tab-xqjcjg #orgName2').val();
				Mydao.config.ajaxParams.params.registerprovince = $('#agency_information #tab-xqjcjg [name="registerprovince"]').val();
				return Mydao.config.ajaxParams;
			},
			columns: [{
				title: '序号',
				align: 'center',
				formatter: function(val, row, index) {
					return index + 1;
				},
			}, {
				title: '机构名称',
				align: 'center',
				field: 'aname',

			}, {
				title: '联系人',
				align: 'center',
				field: 'acontacts'
			}, {
				title: '联系电话',
				align: 'center',
				field: 'atel'
			}, {
				title: '操作',
				align: 'center',
				formatter: function(value, row, index) {
					//					return Mydao.operator(['edit', 'del']);
				},
				events: Mydao.operatorEvents({
					//					edit: editOrg,
					//					del: delOrg1
				})
			}, ],
			onExpandRow: function(index, row, $detail) {
				oInit.InitSubTable(index, row, $detail);
			},
		});
		//	辖区检测机构end

		//	铁总监督机构
		var url4 = 'organization/findAllPage';
		$('#agency_information_lzh').find('#agency_information  #TZJDTable').bootstrapTable({
			pagination: true, //是否分页
			//			sidePagination: 'server', //设置在哪里进行分页，可选值为 'client' 或者 'server'。设置 'server'时，必须设置 服务器数据地址（url）或者重写ajax方法
			queryParamsType: "undefined", //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  //设置为limit可以获取limit, offset, search, sort, order  
			method: 'post',
			pageNumber: 1,
			url: Mydao.config.path + url4,
			cache: true, //禁用缓存
			search: false, //禁用查询
			striped: true, //隔行变色
			uniqueId: "id", //唯一标识,
			responseHandler: function(res) { //设置返回数据
				if(res.code == 200) {
					return res.result.rows;
				}
			},
			ajaxOptions: {
				ContentType: 'application/json',
				dataType: 'json'
			},
			queryParams: function(p) {
				Mydao.config.ajaxParams.params = {};
				Mydao.config.ajaxParams.params.node = 1;
				Mydao.config.ajaxParams.params.orgtype = 2;
				Mydao.config.ajaxParams.params.name = $('#agency_information #tab-tzjdjg #orgName2').val();
				Mydao.config.ajaxParams.params.registerprovince = $('#agency_information #tab-tzjdjg [name="registerprovince"]').val();
				return Mydao.config.ajaxParams;
			},
			columns: [{
				title: '序号',
				align: 'center',
				formatter: function(val, row, index) {
					return index + 1;
				},
			}, {
				title: '机构名称',
				align: 'center',
				field: 'name',
				formatter: Mydao.nameFormatter,
				events: {
					'click a': showOrg
				}
			}, {
				title: '联系人',
				align: 'center',
				field: 'contacts'
			}, {
				title: '联系电话',
				align: 'center',
				field: 'tel'
			}, {
				title: '操作',
				align: 'center',
				formatter: function(value, row, index) {
					return Mydao.operator(['edit', 'del']);
				},
				events: Mydao.operatorEvents({
					edit: editOrg,
					del: delOrg1
				})
			}]
		});
		//	铁总监督机构end

		//	监督对象
		var url5 = 'organization/fingxqjcjg';
		$('#agency_information_lzh').find('#agency_information  #JDDXTable').bootstrapTable({
			pagination: true, //是否分页
			//			sidePagination: 'server', //设置在哪里进行分页，可选值为 'client' 或者 'server'。设置 'server'时，必须设置 服务器数据地址（url）或者重写ajax方法
			queryParamsType: "undefined", //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  //设置为limit可以获取limit, offset, search, sort, order  
			method: 'post',
			pageNumber: 1,
			url: Mydao.config.path + url5,
			cache: true, //禁用缓存
			search: false, //禁用查询
			striped: true, //隔行变色
			uniqueId: "id", //唯一标识,
			detailView: true,
			responseHandler: function(res) { //设置返回数据
				if(res.code == 200) {
					return res.result.rows;
				}
			},
			ajaxOptions: {
				ContentType: 'application/json',
				dataType: 'json'
			},
			queryParams: function(p) {
				Mydao.config.ajaxParams.params = {};
				Mydao.config.ajaxParams.params.node = 1;
				Mydao.config.ajaxParams.params.channl = 2;
				Mydao.config.ajaxParams.params.name = $('#agency_information #tab-jddx #orgName2').val();
				Mydao.config.ajaxParams.params.registerprovince = $('#agency_information #tab-jddx [name="registerprovince"]').val();
				return Mydao.config.ajaxParams;
			},
			columns: [{
				title: '序号',
				align: 'center',
				formatter: function(val, row, index) {
					return index + 1;
				},
			}, {
				title: '机构名称',
				align: 'center',
				field: 'aname',

			}, {
				title: '联系人',
				align: 'center',
				field: 'acontacts'
			}, {
				title: '联系电话',
				align: 'center',
				field: 'atel'
			}, {
				title: '操作',
				align: 'center',
				formatter: function(value, row, index) {
					//					return Mydao.operator(['edit', 'del']);
				},
				events: Mydao.operatorEvents({
					//					edit: editOrg,
					//					del: delOrg1
				})
			}],
			onExpandRow: function(index, row, $detail) {
				oInit.InitSubTable(index, row, $detail);
			},
		});
		//	监督对象end

		//	驻在企业
		var url_6 = 'organization/findzzqy';
		$('#agency_information_lzh').find('#agency_information #ZZQYTable').bootstrapTable({
			pagination: true, //是否分页
			//			sidePagination: 'server', //设置在哪里进行分页，可选值为 'client' 或者 'server'。设置 'server'时，必须设置 服务器数据地址（url）或者重写ajax方法
			queryParamsType: "undefined", //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  //设置为limit可以获取limit, offset, search, sort, order  
			method: 'post',
			pageNumber: 1,
			url: Mydao.config.path + url_6,
			cache: true, //禁用缓存
			search: false, //禁用查询
			striped: true, //隔行变色
			uniqueId: "id", //唯一标识,
			detailView: true,
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
				Mydao.config.ajaxParams.params.name = $('#agency_information #orgName3').val();
				Mydao.config.ajaxParams.params.node = 1;
				Mydao.config.ajaxParams.params.registerprovince = $('#agency_information #tab-zzqy [name="registerprovince"]').val();
				//				Mydao.config.ajaxParams.params.registercity = $('#agency_information #tab-zzqy [name="registercity"]').val();
				Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
				Mydao.config.ajaxParams.page.pageSize = p.pageSize;
				Mydao.config.ajaxParams.page.orderField = p.sortName;
				Mydao.config.ajaxParams.page.orderDirection = p.sortOrder;
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
				field: 'aname',

			}, {
				title: '联系人',
				align: 'center',
				field: 'acontacts',

			}, {
				title: '联系电话',
				align: 'center',
				field: 'atel'
			}, {
				title: '操作',
				align: 'center',
				formatter: function(value, row, index) {
					//					return Mydao.operator(['edit', 'del']);
				},
				events: Mydao.operatorEvents({
					//					edit: editOrg,
					//					del: delOrg1
				})
			}, ],
			onExpandRow: function(index, row, $detail) {
				oInit.InitSubTable(index, row, $detail);
			},
		});

		//驻在企业	 end

		//		机构总览查询
		$('#agency_information_lzh').find('#JGZLSearch').on('click', function() {
			danweiFuc();
			$("#agency_information #tab-jgzl #JGZL_org").bootstrapTable("refreshOptions", {
				pageNumber: 1
			}).bootstrapTable("refresh");
		});

		//		辖区监督机构查询
		$('#agency_information_lzh').find('#XQJDSearch').on('click', function() {
			$("#agency_information #tab-xqjdjg #XQJDTable").bootstrapTable("refreshOptions", {
				pageNumber: 1
			}).bootstrapTable("refresh");
		});
		//		辖区检测机构查询
		$('#agency_information_lzh').find('#XQJCSearch').on('click', function() {
			$("#agency_information #tab-xqjcjg #XQJCTable").bootstrapTable("refreshOptions", {
				pageNumber: 1
			}).bootstrapTable("refresh");
		});
		//		铁总监督机构查询
		$('#agency_information_lzh').find('#TZJDSearch').on('click', function() {
			$("#agency_information #tab-tzjdjg #TZJDTable").bootstrapTable("refreshOptions", {
				pageNumber: 1
			}).bootstrapTable("refresh");
		});
		//		监督对象查询
		$('#agency_information_lzh').find('#JDDXSearch').on('click', function() {
			$("#agency_information #tab-jddx #JDDXTable").bootstrapTable("refreshOptions", {
				pageNumber: 1
			}).bootstrapTable("refresh");
		});

		//		驻在企业查询
		$('#agency_information_lzh').find('#ZZQYSearch').on('click', function() {
			$("#agency_information #tab-zzqy #ZZQYTable").bootstrapTable("refreshOptions", {
				pageNumber: 1
			}).bootstrapTable("refresh");
		});

		//导入
		$('#agency_information_lzh').find(".import_btn").click(function() {
			layer.open({
				type: 1,
				content: '',
				area: ["200px", "150px"],
				title: "导入",
				success: function(layero, index) {
					layero.find('.layui-layer-content').load("import.html", function() {

					});
				}
			});
		});

		var danweiFuc = function() { //机构总览 数目 查询
			$('#agency_information #DW_zongshu').html('0');
			$('#agency_information #SG_danwei').html('0');
			$('#agency_information #JL_danwei').html('0');
			$('#agency_information #SJ_danwei').html('0');
			Mydao.ajaxNoPage({
				"grouptype": $('#agency_information #tab-jgzl #JGZLgroup').val(),
				"jddx": $('#agency_information #tab-jgzl #JGZLsupervise').val(),
				"name": $('#agency_information #tab-jgzl #JGZLname').val()
			}, 'organization/findjlzlnum', function(data) {
				if(data.code == 200) {
					var zongNum = 0;
					var _data = data.result;
					var _newData = [];
					for(var i = 0; i < _data.length; i++) {
						if(_data[i].typenum) {
							zongNum += parseInt(_data[i].typenum);
						}
						switch(_data[i].code) {
							case 'SGDW': //施工单位
								_newData.push(_data[i]);
								break;
							case 'JLDW': //施工单位
								_newData.push(_data[i]);
								break;
							case 'SJDW': //施工单位
								_newData.push(_data[i]);
								break;
						}
					}
					for(var j = 0; j < _newData.length; j++) {
						switch(_newData[j].code) {
							case 'SGDW': //施工单位
								$('#agency_information #SG_danwei').html(_newData[j].typenum);
								break;
							case 'JLDW': //施工单位
								$('#agency_information #JL_danwei').html(_newData[j].typenum);
								break;
							case 'SJDW': //施工单位
								$('#agency_information #SJ_danwei').html(_newData[j].typenum);
								break;
						}
					}
					$('#agency_information #DW_zongshu').html(zongNum);
				}
			});
		};
		danweiFuc();
		//切换刷新列表
		$('#agency_information_lzh').find('#agency_information [data-toggle="tab"]').on('click', function() {
			var _obj = $(this);
			if(_obj.attr('href') == '#tab-jgzl') {
				danweiFuc();
			}
			$(_obj.attr('href')).find('table').bootstrapTable("refreshOptions", {
				pageNumber: 1
			}).bootstrapTable("refresh");
		});
	});
})();