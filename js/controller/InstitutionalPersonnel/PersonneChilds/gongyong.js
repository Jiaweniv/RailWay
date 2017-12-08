/*
 * 公用js   
 * 别问我，我也需求绕蒙圈了。
 * 
 * js介绍   查看人员详情  显示参与项目和被处罚记录，参与项目列表  显示（项目或者标段），项目和标段 也可以查看详情。项目里面有施工标段和监理标段的话，也可以查看施工和监理的详情。
 * 监理标段里面有人员列表。人员列表页可以查看，人员详情。被处罚记录列表页可已查看详情。
 * 
 * 大概就是这样了把
 * 
 * */

////此对象 作用于 机构人员详情页   and 项目信息详情页  and 机构信息详情页
var RenYuanGongGong = {};

//机构详情页列表 参与项目查看
RenYuanGongGong.Org_entry_name = function(e, value, row, index) {
	Mydao.ajax({
		"id": row.id
	}, 'project/showProject', function(result) {
		var currentTime = result.serverTime;
		var d = result.result;
		if(result.code == 200) {
			layer.open({
				type: 1,
				content: "",
				area: ["60%", "80%"],
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
									title: '标段编号',
									field: 'serialnum',
								}, {
									title: '标段名称',
									field: 'name',
									formatter: Mydao.nameFormatter,
									events: {
										'click a': RenYuanGongGong.showssSection
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
										'click a': RenYuanGongGong.showcsSection
									}
								}, {
									title: '起点进程',
									field: 'startmileage',
								}, {
									title: '终点进程',
									field: 'endmileage',
								}, {
									title: '监理单位',
//									field: 'bidunitname',
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

//	根据监管类型 获取监管机构
RenYuanGongGong.edithljpersonal_change = function(row) {
	$('#Penalties-newbuilt #unittype').change(function() {
		var _val = $(this).val();
		var _this = $('#Penalties-newbuilt #punishedunits');
		Mydao.ajax({
			'typeid': _val
		}, 'organization/findOrgByType', function(data) {
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
//机构详情页 被处罚记录列表
RenYuanGongGong.Org_penalty_record = function(ele, data) {
	var show_Org_penalty_record = function(e, value, row, index) {
		Mydao.ajax({
			"id": row.id
		}, 'penalties/getPenalties', function(data) {
			var currentTime = data.serverTime;
			if(data.code == 200) {
				var resultForm = data.result;
				layer.open({
					type: 1,
					content: '',
					btn: ['返回'], //按钮
					btnAlign: 'c', //按钮居中
					title: '查看行政处罚',
					area: ['60%', '80%'],
					moveOut: true,
					success: function(layero, index) {
						layero.find('.layui-layer-content').load('view/LawOperations/PenaltiesNewbuilt.html', function() {
							
							RenYuanGongGong.edithljpersonal_change(resultForm.punishedunits);
							Mydao.initselect(layero, null, function() {
								Mydao.setform(layero, resultForm); //填充表单的值
							}); //加载select
							$('#hljpersonal_table').bootstrapTable({
								data: resultForm.penaltiesPost,
								method: 'post',
								uniqueId: "id", //唯一标识,
								contentType: 'application/json',
								dataType: 'json',

								columns: [{
									title: '职务',
									field: 'postname',
								}, {
									title: '处罚决定',
									field: 'decision'
								}, {
									title: '处罚金额（元）',
									field: 'money'
								}]
							});

							layero.find("select,input,textarea").attr("disabled", "disabled");
							setTimeout(function() {
								layero.find(".layui-upload-button,.fa-times-circle").remove();
								layero.find(".layui-layer-btn").remove();
							}, 500);
						});
					},
					cancel: function(layero, index) {}
				});
			} else {
				layer.alert(data.msg);
			}
		});
	};
	//			punishRecord
	$(ele).find('#Org_penalty_record').bootstrapTable({
		data: data,
		columns: [{
			title: '序号',
			formatter: function(val, row, index) {
				return index + 1;
			}
		}, {
			title: '处罚时间',
			field: 'penaltytime',
			formatter: function(value, row, index) {
				return Mydao.formatDate(value, 'YYYY-MM-DD');
			}
		}, {
			title: '项目名称',
			field: 'projectname',
			formatter: Mydao.nameFormatter,
			events: {
				'click a': show_Org_penalty_record
			}
		}]
	});
};

//工点列表
RenYuanGongGong.work_points = function(ele, rowid) {
	if(rowid) {
		Mydao.ajax({
			'projectid': '',
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
							align: 'center'
						}
					]
				});
			}
		});
	}
};

//人员列表
RenYuanGongGong.Personnel_list = function(ele, data) {
	$(ele).find('#Key_personnel_table').bootstrapTable({
		data: data,
		columns: [{
			title: '序号',
			formatter: function(val, row, index) {
				return index + 1;
			}
		}, {
			title: '单位',
			field: 'organizationname'
		}, {
			title: '职务',
			field: 'postname'
		}, {
			title: '姓名',
			field: 'name'
		}, {
			title: '职称',
			field: 'jobtitlename'
		}]
	});
};

//显示施工标段
RenYuanGongGong.showssSection = function(e, value, row, index) {
	layer.open({
		type: 1,
		content: "",
		area: ["60%", "80%"],
		moveOut: true,
		title: '查看施工标段',
		success: function(layero, index) {
			layui.use(['laytpl'], function() {
				var laytpl = layui.laytpl;
				//通过文件id获取文件名						
				layero.find('.layui-layer-content').load("view/ProjectInformation/section_edit_show.html", function(result) {
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
						if(d.persons) { // 显示人员列表
							$('#Bid_winning_unit').hide(); // 中标单位隐藏
							$('#Key_personnel_boxs').show(); // 显示人员列表
							RenYuanGongGong.Personnel_list(layero, d.persons);
							RenYuanGongGong.work_points(layero, row.id);
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
				});
			});
		},
		cancel: function(layero, index) {}
	});
};

//显示监理标段
RenYuanGongGong.showcsSection = function(e, value, row, index) {
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
//		参与项目 列表
RenYuanGongGong.Participation_project = function(ele, data) {
	var show_Participation_project = function(e, value, row, index) {
		var flag = false;
		if(row.type == 0) { // 0是项目  1是标段
			flag = true;
		}
		Mydao.ajax({
			"id": row.id
		}, flag ? 'project/showProject' : 'constructionSection/s1002', function(result) {
			var currentTime = result.serverTime;
			var d = result.result;
			if(result.code == 200) {
				if(flag) {
					layer.open({
						type: 1,
						content: "",
						area: ["60%", "80%"],
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
											title: '标段编号',
											field: 'serialnum',
										}, {
											title: '标段名称',
											field: 'name',
											formatter: Mydao.nameFormatter,
											events: {
												'click a': RenYuanGongGong.showssSection
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
												'click a': RenYuanGongGong.showcsSection
											}
										}, {
											title: '起点进程',
											field: 'startmileage',
										}, {
											title: '终点进程',
											field: 'endmileage',
										}, {
											title: '监理单位',
//											field: 'bidunitname',
										}]
									});

								});
							});
						},
						cancel: function(layero, index) {

						}
					});
				} else {
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

									var _getTp3 = $('#section_layui').html(),
										section_show1 = $('#section_show_layui');
									laytpl(_getTp3).render(d, function(body) {
										section_show1.html(body);
									});
									if(d.persons) { // 显示人员列表
										$('#Bid_winning_unit').hide(); // 中标单位隐藏
										$('#Key_personnel_boxs').show();// 显示人员列表
										RenYuanGongGong.Personnel_list(layero, d.persons);
										RenYuanGongGong.work_points(layero, row.id);
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
							});
						},
						cancel: function(layero, index) {}
					});
				}

			} else {
				layer.alert(result.msg);
			}
		});
	};
	$(ele).find('#canyuxiangmu').bootstrapTable({
		data: data,
		columns: [{
			title: '序号',
			formatter: function(val, row, index) {
				return index + 1;
			}
		}, {
			title: '项目名称',
			field: 'name',
			formatter: Mydao.nameFormatter,
			events: {
				'click a': show_Participation_project
			}
		}, {
			title: '单位',
			field: 'organizationname'

		}, {
			title: '职位',
			field: 'postname'
		}]
	});
};
//		被处罚记录
RenYuanGongGong.Penalty_record = function(ele, data) {
	var show_Penalty_record = function(e, value, row, index) {
		Mydao.ajax({
			"id": row.id
		}, 'penalties/getPenalties', function(result) {
			var currentTime = result.serverTime;
			if(result.code == 200) {
				var resultForm = result.result;
				layer.open({
					type: 1,
					content: '',
					btn: ['返回'], //按钮
					btnAlign: 'c', //按钮居中
					title: '查看行政处罚',
					area: ['60%', '80%'],
					moveOut: true,
					success: function(layero, index) {
						layero.find('.layui-layer-content').load('view/LawOperations/PenaltiesNewbuilt.html', function() {
							RenYuanGongGong.edithljpersonal_change(resultForm.punishedunits);
							
							Mydao.initselect(layero, null, function() {
								Mydao.setform(layero, resultForm); //填充表单的值
							}); //加载select
							$('#hljpersonal_table').bootstrapTable({
								data: resultForm.penaltiesPost,
								method: 'post',
								uniqueId: "id", //唯一标识,
								contentType: 'application/json',
								dataType: 'json',

								columns: [{
									title: '职务',
									field: 'postname',
								}, {
									title: '处罚决定',
									field: 'decision'
								}, {
									title: '处罚金额（元）',
									field: 'money'
								}]
							});

							layero.find("select,input,textarea").attr("disabled", "disabled");
							setTimeout(function() {
								layero.find(".layui-upload-button,.fa-times-circle").remove();
								layero.find(".layui-layer-btn").remove();
							}, 500);
						});
					},
					cancel: function(layero, index) {}
				});
			} else {
				layer.alert(result.msg);
			}
		});
	};
	//			punishRecord
	$(ele).find('#beichufajilu').bootstrapTable({
		data: data,
		columns: [{
			title: '序号',
			formatter: function(val, row, index) {
				return index + 1;
			}
		}, {
			title: '处罚时间',
			field: 'penaltytime',
			formatter: function(value, row, index) {
				return Mydao.formatDate(value, 'YYYY-MM-DD');
			}
		}, {
			title: '所在项目',
			field: 'projectname',
			formatter: Mydao.nameFormatter,
			events: {
				'click a': show_Penalty_record
			}
		}, {
			title: '职务',
			field: 'postname'
		}]
	});
};