//监督检查列表
(function() {
	'use strict';

	//用户关闭检查检录结果添加时的二级弹框
	var _add_result_record_window;

	$('#checkrecord_top select').each(function(a, b) {
		var p = $(b).data().params,
			p1 = (p.toObj && p.toObj()) || {};
		p1.projectid = $('#SupervisedCheck #projectid').val();
		$(b).data('params', JSON.stringify(p1).replace(/"/g, "'")).attr('data-params', JSON.stringify(p1).replace(/"/g, "'"));
	});
	Mydao.initselect('#checkrecordOut');
	//		Mydao.initselect('#checkrecord_top');
	//根据方案加载标段
	$('#checkrecordOut #checkrecord_top #programid').change(function() {
		var _programid = $(this).val();
		var _sec = $('#checkrecordOut #checkrecord_top #sectionid');
		var _this = $('#checkrecordOut #checkrecord_top #workpointid');
		var params = {};
		params.checkprogramid = _programid;
		Mydao.ajax(params, 'constructionSection/getSectionByProgramId', function(result) {
			if(result.code == 200) {
				_sec.val('').empty().append('<option value="">--请选择--</option>');
				$.each(result.result, function(a, b) {
					_sec.append($('<option value="' + b.id + '">' + b.name + '</option>'));
				});
			} else {
				layer.msg(result.msg);
			}
		});
		_sec.val('');
		_this.val('');
	});
	//查询   根据标段查下面的工点
	$('#checkrecordOut #checkrecord_top #sectionid').change(function() {
		var _val = $(this).val();
		var _this = $('#checkrecord_top #workpointid');
		Mydao.ajax({
			'sectionid': _val
		}, 'workPoint/selectList', function(data) {
			var currentTime = data.serverTime;
			if(data.code == 200) {
				_this.val('').empty().append('<option value="">--非工点--</option>');
				var result = data.result;
				for(var i = 0; i < result.length; i++) {
					_this.append($('<option value="' + result[i].id + '" >' + result[i].name + '</option>').data(result[i]));
				}
			} else {
				layer.alert(data.msg);
			}
		});
	});

	var editCheckRecord = function(e, value, row, index) {
		//判断项目状态
		Mydao.ajax({
			"id": row.projectid,
		}, 'project/s1004', function(result) {
			if(result.result.status == 1) {
				layer.alert("项目已经完成，不能进行修改。");
				return false;
			}
			layer.open({
				type: 1,
				title: '编辑检查记录',
				btnAlign: 'c',
				content: "",
				area: ["70%", "90%"],
				moveOut: true,
				cancel: function(layero, index) {},
				btn: ['保存', '返回'],
				success: function(layero, index) {
					layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/CheckRecords_add.html', function() {
						resizeInput(layero);
						Mydao.initselect(layero, null, function() {
							Mydao.ajax({
								"id": row.id,
							}, 'checkRecord/get', function(recordResult) {
								if(recordResult.code == 200) {
									var crResult = recordResult.result;
									var checkrecord = recordResult.result.checkrecord;
									var details = crResult.checkDetail;
									$.each(details, function(a, b) {
										if(b.completion == 0) {
											var qualified = {
												division: b.division,
												description: b.description,
												images: b.images
											}
											b.qualified = qualified;
										} else {
											var unqualified = {
												type: b.type,
												level: b.level,
												division: b.division,
												description: b.description,
												images: b.images
											}
											b.unqualified = unqualified;
										}
									});
									//加载结果列表
									result_record(details);

									//根据方案加载标段
									$(layero).find('#InspectionRecordsAdd_out #programid').change(function() {
										var _programid = $(this).val();
										if(_programid != '') {
											$(layero).find('#check_record_result_btn').attr("disabled", false);
											var params = {};
											params.checkprogramid = _programid;
											Mydao.ajax(params, 'constructionSection/getSectionByProgramId', function(result) {
												if(result.code == 200) {
													var _sec = $(layero).find('#InspectionRecordsAdd_out #sectionid');
													_sec.val('').empty().append('<option value="">--请选择--</option>');
													$.each(result.result, function(a, b) {
														_sec.append($('<option value="' + b.id + '">' + b.name + '</option>'));
													});
												} else {
													layer.msg('加载标段列表失败');
												}
											}, false);
										} else {
											$(layero).find('#check_record_result_btn').attr("disabled", true);
											var _sec = $(layero).find('#InspectionRecordsAdd_out #sectionid');
											_sec.val('').empty().append('<option value="">--请选择--</option>');
											var _wp = $(layero).find('#InspectionRecordsAdd_out #workpointid');
											_wp.val('').empty().append('<option value="">--非工点--</option>');
										}
									});
									//根据方案加载检查人
									$(layero).find('#InspectionRecordsAdd_out #programid').change(function() {
										var _programid = $(this).val();
										if(_programid != '') {
											var params = {};
											params.id = _programid;
											Mydao.ajax(params, 'checkRecord/selectperson', function(result) {
												if(result.code == 200) {
													var _sec = $(layero).find('#InspectionRecordsAdd_out #checkuser');
													_sec.val('').empty().append('<option value="">--请选择--</option>');
													$.each(result.result, function(a, b) {
														_sec.append($('<option value="' + b.id + '">' + b.name + '</option>'));
													});
												} else {
													layer.msg('加载检查人列表失败');
												}
											}, false);
										}
									});

									//根据标段选择工点
									$(layero).find('#InspectionRecordsAdd_out #sectionid').change(function() {
										var _programid = $(layero).find('#InspectionRecordsAdd_out #programid').val();
										var _sectionid = $(this).val();
										if(_sectionid != '') {
											var params = {};
											params.checkprogramid = _programid;
											params.sectionid = _sectionid;
											Mydao.ajax(params, 'workPoint/getWorkpointByProgramId', function(result) {
												if(result.code == 200) {
													var _wp = $(layero).find('#InspectionRecordsAdd_out #workpointid');
													_wp.val('').empty().append('<option value="">--非工点--</option>');
													$.each(result.result, function(a, b) {
														_wp.append($('<option value="' + b.id + '">' + b.name + '</option>'));
													});
												} else {
													layer.msg('加载标段列表失败');
												}
											}, false);
										} else {
											var _wp = $(layero).find('#InspectionRecordsAdd_out #workpointid');
											_wp.val('').empty().append('<option value="">--非工点--</option>');
										}
									});
									//根据标段选择受检单位
									$(layero).find('#InspectionRecordsAdd_out #sectionid').change(function() {
										var projectid = $(layero).find('#InspectionRecordsAdd_out #projectid').val();
										var _sectionid = $(this).val();
										if(_sectionid != '') {
											var params = {};
											params.projectid = projectid;
											params.sectionid = _sectionid;
											Mydao.ajax(params, 'checkRecord/fingUnitidList', function(result) {
												if(result.code == 200) {
													var _wp = $(layero).find('#InspectionRecordsAdd_out #group');
													_wp.val('').empty().append('<option value="">--请选择--</option>');
													$.each(result.result, function(a, b) {
														_wp.append($('<option value="' + b.id + '">' + b.name + '</option>'));
													});
												} else {
													layer.msg('加载受检单位列表失败');
												}
											}, false);
										}
									});

									//添加结果记录
									$(layero).find("#check_record_result_btn").click(function() {
										_add_result_record_window = layer.open({
											type: 1,
											title: '选择检查内容',
											btnAlign: 'c',
											content: "",
											area: ["60%", "70%"],
											moveOut: true,
											cancel: function(layero, index) {},
											success: function(layero_r_r, index_r_r) {
												layero_r_r.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/CheckRecords_Check_Result.html', function() {
													$('.sidebar-collapse').slimScroll({
														width: '100%', //可滚动区域宽度
														height: '100%', //可滚动区域高度
														railVisible: true, //是否 显示轨道
														alwaysVisible: true, //是否 始终显示组件
														borderRadius: '7px', //滚动条圆角
														railBorderRadius: '7px', //轨道圆角
														allowPageScroll: true, //是否 使用滚轮到达顶端/底端时，滚动窗口
														wheelStep: 20, //滚轮滚动量s
														touchScrollStep: 200, //滚动量当用户使用手势
													});
													_init_checkItems_tree();
													_init_checkInfos_table();
												});
											}
										});
									});
									//记录id
									$(layero).find('#InspectionRecordsAdd_out #check_record_id').val(checkrecord.id);
									//渲染项目
									$(layero).find('#InspectionRecordsAdd_out #projectid').val(checkrecord.projectid).trigger('change');
									//方案
									$(layero).find('#InspectionRecordsAdd_out #programid').val(checkrecord.checkprogramid).trigger('change');
									//标段
									$(layero).find('#InspectionRecordsAdd_out #sectionid').val(checkrecord.sectionid).trigger('change');
									//工点
									$(layero).find('#InspectionRecordsAdd_out #workpointid').val(checkrecord.workpointid);
									//单位
									$(layero).find('#InspectionRecordsAdd_out #group').val(checkrecord.group);
									//检查时间
									$(layero).find('#InspectionRecordsAdd_out #checktime').val(Mydao.formatDate(checkrecord.checktime));
									//检查人
									$(layero).find('#InspectionRecordsAdd_out #check_record_check_user_input').val(checkrecord.checkuser);
									$(layero).find('#InspectionRecordsAdd_out #check_record_check_user_textarea').val(checkrecord.usernames);
								} else {
									layer.msg('加载检查记录详情失败');
								}
							}, false);
						});
					});
				},
				yes: function(index, layero) {
					layero.find("form").trigger("validate");
					if(!layero.find("form").data("validator").isFormValid()) return false;
					var loading = layer.load(2, {
						time: 60 * 1000
					});
					var paramsRecord = layero.find("form").serializeJson();
					var paramsDetail = $('#InspectionRecordsAdd_out #InspectionRecords-layer #checkInfoList').bootstrapTable('getData');
					var params = {};
					params.paramsDetail = paramsDetail;
					params.paramsRecord = paramsRecord;

					Mydao.ajax(params, 'checkRecord/edit', function(result) {
						if(result.code == 200) {
							layero.find("input").val("");
							layer.close(index); //如果设定了yes回调，需进行手工关闭
							layer.alert("操作成功！");
							//刷新页面
							$('#SupervisedCheck #check_record').bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
							layer.close(loading);
							layer.close(index);
						} else {
							layer.close(loading);
							layer.alert(result.msg);
						}
					});

				}
			});

		});

	};
	var delCheckRecord = function(e, value, row, index) {
		layer.confirm('确定删除？', {
			icon: 3,
			title: '提示'
		}, function(index) {
			Mydao.ajax({
				id: row.id
			}, 'checkRecord/delete', function(result) {
				var currentTime = result.serverTime;
				if(result.code == 200) {
					$('#SupervisedCheck #check_record').bootstrapTable("refreshOptions", {
						pageNumber: 1
					}).bootstrapTable("refresh");
				} else {
					layer.alert(result.msg);
				}
			});
			layer.close(index);
		});
	};
	var show_flag = false;
	var showCheckRecord = function(e, value, row, index) {
		show_flag = true;
		Mydao.ajax({
			"id": row.id
		}, 'checkRecord/look', function(result) {
			if(result.code == 200) {
				var data = result.result;
				Mydao.currentPage.params.id = row.id; //保存项目ID
				layer.open({
					type: 1,
					title: '查看检查记录',
					btnAlign: 'c',
					btn: ['导出'],
					content: "",
					area: ["70%", "90%"],
					moveOut: true,
					cancel: function(layero, index) {
						show_flag = false;
					},
					success: function(layero, index) {
						layero.find('.layui-layer-content').load("view/ProjectSupervision/SupervisedCheck_childs/CheckRecords_show.html", function(result) {
							resizeInput(layero);
							layero.find("#checkrecordShow_out span[data-name='projectname']").html(data.checkrecord.projectname);
							layero.find("#checkrecordShow_out span[data-name='sectionname']").html(data.checkrecord.sectionname);
							layero.find("#checkrecordShow_out span[data-name='jsdw']").html(data.JSDW);
							layero.find("#checkrecordShow_out span[data-name='jldw']").html(data.JLDW);
							layero.find("#checkrecordShow_out span[data-name='sjdw']").html(data.SJDW);
							layero.find("#checkrecordShow_out span[data-name='sgdw']").html(data.SGDW);
							layero.find("#checkrecordShow_out span[data-name='JCR']").html(data.checkrecord.checkusername);
							layero.find("#checkrecordShow_out span[data-name='JCRQ']").html(data.checkrecord.checktime);
							$("#checkrecordShow_out #checkrecord_content").bootstrapTable({
								data: data.content,
								checkboxHeader: true,
								uniqueId: "id",
								columns: [{
									title: '序号',
									align: 'center',
									valign: 'middle',
									formatter: function(val, row, index) {
										return index + 1;
									}
								}, {
									title: '检查对象',
									field: 'checkobject',
									align: 'center',
									valign: 'middle',
								}, {
									title: '检查内容',
									field: 'content',
									align: 'center',
									valign: 'middle',
								}]
							});
							$("#checkrecordShow_out #checkrecord_pass").bootstrapTable({
								data: data.pass,
								checkboxHeader: true,
								uniqueId: "id",
								columns: [{
									title: '序号',
									align: 'center',
									valign: 'middle',
									formatter: function(val, row, index) {
										return index + 1;
									}
								}, {
									title: '检查对象',
									field: 'checkobject',
									align: 'center',
									valign: 'middle',
								}, {
									title: '工点',
									field: 'workpointname',
									align: 'center',
									valign: 'middle',
								}, {
									title: '抽查事项',
									field: 'itemnames',
									align: 'center',
									valign: 'middle',
									formatter: function(val, row, index) {
										return Mydao.valueFormatter(val, 20);
									}
								}, {
									title: '检查内容',
									field: 'content',
									align: 'center',
									valign: 'middle',
									formatter: function(val, row, index) {
										return Mydao.valueFormatter(val, 20);
									}
								}, {
									title: '检查描述',
									field: 'description',
									align: 'center',
									valign: 'middle',
									formatter: function(val, row, index) {
										return Mydao.valueFormatter(val, 20);
									}
								}, {
									title: '图像',
									field: 'images',
									align: 'center',
									valign: 'middle',
									formatter: function(value, row, index) {
										if(value)
											return '<img style="width:40px;height:40px;" src="' + MydaoFileDownPath + '?fileId=' + value + '">';
										else
											return '';
									}
								}]
							});
							$("#checkrecordShow_out #checkrecord_problem").bootstrapTable({
								data: data.problem,
								checkboxHeader: true,
								uniqueId: "id",
								columns: [{
									title: '序号',
									align: 'center',
									valign: 'middle',
									formatter: function(val, row, index) {
										return index + 1;
									}
								}, {
									title: '检查对象',
									field: 'checkobject',
									align: 'center',
									valign: 'middle',
								}, {
									title: '工点',
									field: 'workpointname',
									align: 'center',
									valign: 'middle',
								}, {
									title: '抽查事项',
									field: 'itemnames',
									align: 'center',
									valign: 'middle',
									formatter: function(val, row, index) {
										return Mydao.valueFormatter(val, 20);
									}
								}, {
									title: '检查内容',
									field: 'content',
									align: 'center',
									valign: 'middle',
									formatter: function(val, row, index) {
										return Mydao.valueFormatter(val, 20);
									}
								}, {
									title: '检查描述',
									field: 'description',
									align: 'center',
									valign: 'middle',
									formatter: function(val, row, index) {
										return Mydao.valueFormatter(val, 20);
									}
								}, {
									title: '图像',
									field: 'images',
									align: 'center',
									valign: 'middle',
									formatter: function(value, row, index) {
										if(value)
											return '<img style="width:40px;height:40px;" src="' + MydaoFileDownPath + '?fileId=' + value + '">';
										else
											return '';
									}
								}]
							});
						});
					},
					yes: function(index, layero) {
						window.location.href = MydaoFileDownPath + "?fileId=" + data.checkrecord.reportfileid;
						layer.close(index);
					}
				});
			} else {
				layer.msg(result.msg);
			}

		});
	};

	//检查记录列表
	$('#SupervisedCheck #check_record').bootstrapTable({
		pagination: true,
		sidePagination: 'server',
		queryParamsType: "undefined", //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  //设置为limit可以获取limit, offset, search, sort, order  
		method: 'post',
		pageNumber: 1,
		sortName: "updatetime",
		sortOrder: "desc",
		url: Mydao.config.path + 'checkRecord/list',
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
			Mydao.config.ajaxParams.params.projectid = $('#SupervisedCheck #projectid').val();
			Mydao.config.ajaxParams.params.sectionid = $('#SupervisedCheck #sectionid').val();
			Mydao.config.ajaxParams.params.workpointid = $('#SupervisedCheck #workpointid').val();
			Mydao.config.ajaxParams.params.starttime = $('#SupervisedCheck [name="starttime"]').val();
			Mydao.config.ajaxParams.params.endtime = $('#SupervisedCheck [name="endtime"]').val();
			Mydao.config.ajaxParams.params.checkprogramid = $('#SupervisedCheck #programid').val();
			Mydao.config.ajaxParams.params.clientid = Mydao.clientid;
			return Mydao.config.ajaxParams;
		},
		columns: [{
			title: '方案名称',
			align: 'center',
			field: 'programname'
		}, {
			title: '标段名称',
			align: 'center',
			field: 'sectionname'
		}, {
			title: '受检单位',
			align: 'center',
			field: 'groupname'
		}, {
			title: '工点名称',
			align: 'center',
			field: 'pointname'
		}, {
			title: '检查时间',
			field: 'checktime',
			align: 'center',
			formatter: function(val, row, index) {
				return Mydao.formatDate(val);
			}
		}, {
			title: '操作',
			align: 'center',
			formatter: function(value, row, index) {
				var ctrls = [];
				if(Mydao.permissions['checkrecord_edit']) {
					ctrls.push('edit');
				}
				if(Mydao.permissions['checkrecord_del']) {
					ctrls.push('del');
				}
				if(Mydao.permissions['checkrecord_look']) {
					ctrls.push('view');
				}
				return Mydao.operator(ctrls);
			},
			events: Mydao.operatorEvents({
				edit: editCheckRecord,
				del: delCheckRecord,
				view: showCheckRecord
			})
		}]
	});
	//		查询
	$('#checkrecordOut #searchCheckRecord').on('click', function(event) {
		$('#SupervisedCheck #check_record').bootstrapTable("refreshOptions", {
			pageNumber: 1
		}).bootstrapTable("refresh");
	});

	var resizeInput = function(layero) {

		layero.find('.sidebar-collapse').slimScroll({
			height: '100%',
		});
		layero.find(".group-input").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 28);
		});
		//  select和标头的组合
		layero.find(".group-select").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 32);
		});
		//  textarea和标头的组合
		layero.find(".group-textarea").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
		});
	};
	//新建
	$('#addCheckRecord').on('click', function(event) {
		layer.open({
			type: 1,
			title: '新建检查记录',
			btnAlign: 'c',
			content: "",
			area: ["70%", "90%"],
			moveOut: true,
			cancel: function(layero, index) {},
			btn: ['保存', '返回'],
			success: function(layero, index) {
				layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/CheckRecords_add.html', function() {
					resizeInput(layero);
					Mydao.initselect(layero); //加载select

					layero.find('#InspectionRecordsAdd_out').find('#projectid').val($('#SupervisedCheck .projetc_li_val_xuanzhong> select').val()).change();
					//加载结果列表
					result_record();
					//根据方案加载标段
					$(layero).find('#InspectionRecordsAdd_out #programid').change(function() {
						var _programid = $(this).val();
						if(_programid != '') {
							$(layero).find('#check_record_result_btn').attr("disabled", false);
							var params = {};
							params.checkprogramid = _programid;
							Mydao.ajax(params, 'constructionSection/getSectionByProgramId', function(result) {
								if(result.code == 200) {
									var _sec = $(layero).find('#InspectionRecordsAdd_out #sectionid');
									_sec.val('').empty().append('<option value="">--请选择--</option>');
									$.each(result.result, function(a, b) {
										_sec.append($('<option value="' + b.id + '">' + b.name + '</option>'));
									});
								} else {
									layer.msg('加载标段列表失败');
								}
							});
						} else {
							$(layero).find('#check_record_result_btn').attr("disabled", true);
							var _sec = $(layero).find('#InspectionRecordsAdd_out #sectionid');
							_sec.val('').empty().append('<option value="">--请选择--</option>');
							var _wp = $(layero).find('#InspectionRecordsAdd_out #workpointid');
							_wp.val('').empty().append('<option value="">--非工点--</option>');
						}
					});
					//根据方案加载检查人
					$(layero).find('#InspectionRecordsAdd_out #programid').change(function() {
						var _programid = $(this).val();
						if(_programid != '') {
							var params = {};
							params.id = _programid;
							Mydao.ajax(params, 'checkRecord/selectperson', function(result) {
								if(result.code == 200) {
									var _sec = $(layero).find('#InspectionRecordsAdd_out #checkuser');
									_sec.val('').empty().append('<option value="">--请选择--</option>');
									$.each(result.result, function(a, b) {
										_sec.append($('<option value="' + b.id + '">' + b.name + '</option>'));
									});
								} else {
									layer.msg('加载检查人列表失败');
								}
							});
						}
					});

					//根据标段选择工点
					$(layero).find('#InspectionRecordsAdd_out #sectionid').change(function() {
						var _programid = $(layero).find('#InspectionRecordsAdd_out #programid').val();
						var _sectionid = $(this).val();
						if(_sectionid != '') {
							var params = {};
							params.checkprogramid = _programid;
							params.sectionid = _sectionid;
							Mydao.ajax(params, 'workPoint/getWorkpointByProgramId', function(result) {
								if(result.code == 200) {
									var _wp = $(layero).find('#InspectionRecordsAdd_out #workpointid');
									_wp.val('').empty().append('<option value="">--非工点--</option>');
									$.each(result.result, function(a, b) {
										_wp.append($('<option value="' + b.id + '">' + b.name + '</option>'));
									});
								} else {
									layer.msg('加载标段列表失败');
								}
							});
						} else {
							var _wp = $(layero).find('#InspectionRecordsAdd_out #workpointid');
							_wp.val('').empty().append('<option value="">--非工点--</option>');
						}
					});
					//根据标段选择受检单位
					$(layero).find('#InspectionRecordsAdd_out #sectionid').change(function() {
						var projectid = $(layero).find('#InspectionRecordsAdd_out #projectid').val();
						var _sectionid = $(this).val();
						if(_sectionid != '') {
							var params = {};
							params.projectid = projectid;
							params.sectionid = _sectionid;
							Mydao.ajax(params, 'checkRecord/fingUnitidList', function(result) {
								if(result.code == 200) {
									var _wp = $(layero).find('#InspectionRecordsAdd_out #group');
									_wp.val('').empty().append('<option value="">--请选择--</option>');
									$.each(result.result, function(a, b) {
										_wp.append($('<option value="' + b.id + '">' + b.name + '</option>'));
									});
								} else {
									layer.msg('加载受检单位列表失败');
								}
							});
						}
					});

					//添加结果记录
					$(layero).find("#check_record_result_btn").click(function() {
						_add_result_record_window = layer.open({
							type: 1,
							title: '选择检查内容',
							btnAlign: 'c',
							content: "",
							area: ["60%", "70%"],
							moveOut: true,
							cancel: function(layero, index) {},
							success: function(layero_r_r, index_r_r) {
								layero_r_r.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/CheckRecords_Check_Result.html', function() {
									$('.sidebar-collapse').slimScroll({
										width: '100%', //可滚动区域宽度
										height: '100%', //可滚动区域高度
										railVisible: true, //是否 显示轨道
										alwaysVisible: true, //是否 始终显示组件
										borderRadius: '7px', //滚动条圆角
										railBorderRadius: '7px', //轨道圆角
										allowPageScroll: true, //是否 使用滚轮到达顶端/底端时，滚动窗口
										wheelStep: 20, //滚轮滚动量s
										touchScrollStep: 200, //滚动量当用户使用手势
									});
									_init_checkItems_tree();
									_init_checkInfos_table();
								});
							}
						});
					});

				});
			},
			yes: function(index, layero) {
				layero.find("form").trigger("validate");
				if(!layero.find("form").data("validator").isFormValid()) return false;
				var loading = layer.load(2, {
					time: 60 * 1000
				});
				var paramsRecord = layero.find("form").serializeJson();
				var paramsDetail = $('#InspectionRecordsAdd_out #InspectionRecords-layer #checkInfoList').bootstrapTable('getData');
				var params = {};
				params.paramsDetail = paramsDetail;
				params.paramsRecord = paramsRecord;

				Mydao.ajax(params, 'checkRecord/add', function(result) {
					if(result.code == 200) {
						layero.find("input").val("");
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						layer.alert("操作成功！");
						//刷新页面
						$('#SupervisedCheck #check_record').bootstrapTable("refreshOptions", {
							pageNumber: 1
						}).bootstrapTable("refresh");
						layer.close(loading);
						layer.close(index);
					} else {
						layer.close(loading);
						layer.alert(result.msg);
					}
				});

			}
		});
	});

	//初始化树
	var _init_checkItems_tree = function(checkprogramid) {
		Mydao.ajax({
			clientid: Mydao.clientid,
			checkprogramid: checkprogramid
		}, checkprogramid ? 'programCheckitem/getItem' : 'checkItems/s1001', function(data) {
			var currentTime = data.serverTime;
			if(data.code == 200) {
				var result = data.result;
				$.fn.zTree.init($("#CheckRecords_Check_Result_checkitems_tree"), {
					data: {
						simpleData: {
							enable: true,
							idKey: 'id',
							pIdKey: 'parentid'
						}
					},
					callback: {
						onClick: function(event, treeId, treeNode) {
							_select_checkInfos_table(treeNode.id);
						}
					}
				}, result);
			} else {
				layer.alert(data.msg);
			}

		});
	};

	// 检查合格
	var _checkInfos_true = function(e, value, row, index) {
		row.completion = 0;
		var thisWindow = layer.open({
			type: 1,
			title: '合格',
			btnAlign: 'c',
			content: "",
			btn: ['保存', '取消'],
			area: ["40%", "50%"],
			moveOut: true,
			cancel: function(layero, index) {},
			btn2: function(index, layero) {},
			success: function(layero, index) {
				layero.find('.sidebar-collapse').slimScroll({
					height: '100%',
				});
				layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/CheckRecordsDetailhg.html', function() {
					resizeInput(layero)
				});
			},
			yes: function(index, layero) {
				layero.find("form").trigger("validate");
				if(!layero.find("form").data("validator").isFormValid()) return false;
				row.qualified = layero.find("form").serializeJson();
				row.division = row.qualified.division;
				row.description = row.qualified.description;
				row.images = row.qualified.images;
				$('#InspectionRecords-layer #checkInfoList').bootstrapTable('append', row);
				layer.close(thisWindow);
				layer.close(_add_result_record_window);
			}
		});
	}

	// 检查不合格
	var _checkInfos_false = function(e, value, row, index) {
		row.completion = 1;
		var thisWindow = layer.open({
			type: 1,
			title: '不合格',
			btnAlign: 'c',
			content: "",
			btn: ['保存', '取消'],
			area: ["40%", "50%"],
			moveOut: true,
			cancel: function(layero, index) {},
			btn2: function(index, layero) {},
			success: function(layero, index) {
				layero.find('.sidebar-collapse').slimScroll({
					height: '100%',
				});
				layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/CheckRecordsDetailbhg.html', function() {
					Mydao.initselect(layero);
					resizeInput(layero);
					var itemZtree = $.fn.zTree.getZTreeObj("CheckRecords_Check_Result_checkitems_tree");
					var selectNode = itemZtree.getSelectedNodes();
					if(selectNode.length > 0) {
						$(layero).find("select[name='type']").val(selectNode[0].getPath()[0].id);
					}
				});
			},
			yes: function(index, layero) {
				layero.find("form").trigger("validate");
				if(!layero.find("form").data("validator").isFormValid()) return false;
				row.unqualified = layero.find("form").serializeJson();
				row.type = row.unqualified.type;
				row.level = row.unqualified.level;
				row.division = row.unqualified.division;
				row.description = row.unqualified.description;
				row.images = row.unqualified.images;
				console.log(row);
				$('#InspectionRecords-layer #checkInfoList').bootstrapTable('append', row);
				layer.close(thisWindow);
				layer.close(_add_result_record_window);
			}
		});

	}

	// 初始化检查清单
	var _init_checkInfos_table = function() {
		$('#CheckRecords_Check_Result_checkinfos_table').bootstrapTable({
			uniqueId: "checkinfoid",
			search: true,
			cache: true, //禁用缓存
			searchAlign: 'left',
			buttonsAlign: 'right',
			striped: true, //隔行变色
			columns: [{
				title: '序号',
				align: 'center',
				valign: 'middle',
				formatter: function(val, row, index) {
					return index + 1;
				}
			}, {
				title: '抽查依据',
				field: 'foundation',
				align: 'center',
				valign: 'middle',
				formatter: function(val, row, index) {
					return Mydao.valueFormatter(val, 20);
				}
			}, {
				title: '抽查内容',
				field: 'content',
				align: 'center',
				valign: 'middle',
				formatter: function(val, row, index) {
					return Mydao.valueFormatter(val, 20);
				}
			}, {
				title: '抽查对象',
				field: 'checkobject',
				align: 'center',
				valign: 'middle',
				formatter: function(val, row, index) {
					return Mydao.valueFormatter(val, 20);
				}
			}, {
				title: '抽查方式',
				field: 'mode',
				align: 'center',
				valign: 'middle',
				formatter: function(val, row, index) {
					return Mydao.valueFormatter(val, 20);
				}
			}, {
				title: '操作',
				align: 'center',
				valign: 'middle',
				width: '80px',
				formatter: function(value, row, index) {
					var ctrls = [];
					ctrls.push('qualified');
					ctrls.push('unqualified');
					return Mydao.operator(ctrls);
				},
				events: Mydao.operatorEvents({
					qualified: _checkInfos_true,
					unqualified: _checkInfos_false
				})
			}]
		});
	}

	// 初始化检查清单
	var _select_checkInfos_table = function(itemid) {
		var _checkinfo_url = 'checkInfo/getAllNew',
			checkprogramid = $("#InspectionRecordsAdd_out #programid").val();
		//判断是否方案
		if($('#CheckRecords_Check_Result_checkbox')[0].checked) {
			_checkinfo_url = 'programCheckinfoKey/getAll';
		}
		Mydao.ajax({
			checkprogramid: checkprogramid,
			itemid: itemid
		}, _checkinfo_url, function(data) {
			if(data.code == 200) {
				//判断是否已经有记录
				var _temp_r = new Array();

				for(var i = 0; i < data.result.length; i++) {
					var flag = true;
					$.each($('#InspectionRecords-layer #checkInfoList').bootstrapTable('getData'), function(a, b) {
						if(data.result[i].checkinfoid == b.checkinfoid) {
							flag = false;
						}
					});
					if(flag) {
						_temp_r.push(data.result[i]);
					}
				}
				$('#CheckRecords_Check_Result_checkinfos_table').bootstrapTable('load', _temp_r);
			} else {
				layer.alert(data.msg);
			}
		});
	}

	//绑定方案检查事项按钮
	$('body').delegate("#CheckRecords_Check_Result_checkbox", "change", function() {
		if(this.checked) {
			var checkprogramid = $("#InspectionRecordsAdd_out #programid").val();
			if(checkprogramid) {
				_init_checkItems_tree(checkprogramid);
			} else {
				this.checked = false;
				layer.msg("请选择方案");
			}
		} else {
			_init_checkItems_tree();
		}
		//清空检查清单
		$('#CheckRecords_Check_Result_checkinfos_table').bootstrapTable('load', []);
	});

	//初始化人员表格
	var _init_check_user_table = function() {
		var _checkuserids = $('#check_record_check_user_input').val();
		$('#CheckRecords_Check_User_table').bootstrapTable({
			method: 'post',
			url: Mydao.config.path + 'programPersonKey/list',
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
				Mydao.config.ajaxParams.params.checkprogramid = $('#InspectionRecordsAdd_out #programid').val();
				return Mydao.config.ajaxParams;
			},
			uniqueId: "id",
			checkboxHeader: true,
			columns: [{
				checkbox: true,
				formatter: function(value, row, index) {
					var check = false;
					//判断是否选中
					if(_checkuserids) {
						$.each(_checkuserids.split(','), function(a, b) {
							if(row.id == b) {
								check = true;
								return {
									checked: check
								};
							}
						});
					}
					return {
						checked: check
					};
				}
			}, {
				title: '姓名',
				align: 'center',
				field: 'name'
			}, {
				title: '人员类型',
				align: 'center',
				field: 'persontype',
				formatter: function(value, row, index) {
					return value == 0 ? "检查人员" : "检查专家";
				}
			}, {
				title: '性别',
				align: 'center',
				field: 'gender',
				formatter: function(value, row, index) {
					return value == 1 ? "男" : "女";
				}
			}, {
				title: '手机号码',
				align: 'center',
				field: 'phone'
			}, {
				title: '选择方式',
				align: 'center',
				field: 'selecttype',
				formatter: function(value, row, index) {
					return value == 0 ? "选择" : "抽取";
				}
			}]
		});

	}

	//绑定方案选择人员按钮
	$('body').delegate("#check_record_check_user_btn", "click", function() {
		if($('#InspectionRecordsAdd_out #programid').val()) {
			layer.open({
				id: 'check_record_check_user_form',
				type: 1,
				title: '选择检查人',
				btnAlign: 'c',
				content: "",
				btn: ['保存', '取消'],
				area: ["40%", "50%"],
				moveOut: true,
				cancel: function(layero, index) {},
				btn2: function(index, layero) {},
				success: function(layero, index) {
					layero.find('.sidebar-collapse').slimScroll({
						height: '100%',
					});
					layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/CheckRecordsUser.html', function() {
						//初始化人员表格
						_init_check_user_table();
					});
				},
				yes: function(index, layero) {
					var checkusers = $('#CheckRecords_Check_User_table').bootstrapTable('getSelections');
					var ids = '',
						names = '';
					$.each(checkusers, function(a, b) {
						ids += b.id + ',';
						names += b.name + ',';
					});
					if(ids.length > 0) {
						ids = ids.substring(0, ids.length - 1);
						names = names.substring(0, names.length - 1);
					}
					$('#check_record_check_user_input').val(ids);
					$('#check_record_check_user_textarea').val(names);
					layer.close(index);
				}
			});
		} else {
			layer.msg('请先选择检查方案');
		}
	});

	//编辑合格记录
	var edit_result_record_hege = function(e, value, row, rowindex) {
		var thisWindow;
		//判断是合格还是不合格
		if(row.completion == 0) {
			thisWindow = layer.open({
				type: 1,
				title: '合格',
				btnAlign: 'c',
				content: "",
				btn: ['保存', '取消'],
				area: ["40%", "50%"],
				moveOut: true,
				cancel: function(layero, index) {},
				btn2: function(index, layero) {},
				success: function(layero, index) {
					layero.find('.sidebar-collapse').slimScroll({
						height: '100%',
					});
					layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/CheckRecordsDetailhg.html', function() {
						resizeInput(layero)
						Mydao.setform(layero, row.qualified);
					});
				},
				yes: function(index, layero) {
					layero.find("form").trigger("validate");
					if(!layero.find("form").data("validator").isFormValid()) return false;
					row.qualified = layero.find("form").serializeJson();
					row.division = row.qualified.division;
					row.description = row.qualified.description;
					row.images = row.qualified.images;
					$('#InspectionRecords-layer #checkInfoList').bootstrapTable('updateRow', {
						index: rowindex,
						row: row
					});
					layer.close(thisWindow);
				}
			});
		} else {
			thisWindow = layer.open({
				type: 1,
				title: '不合格',
				btnAlign: 'c',
				content: "",
				btn: ['保存', '取消'],
				area: ["40%", "50%"],
				moveOut: true,
				cancel: function(layero, index) {},
				btn2: function(index, layero) {},
				success: function(layero, index) {
					layero.find('.sidebar-collapse').slimScroll({
						height: '100%',
					});
					layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/CheckRecordsDetailbhg.html', function() {
						Mydao.initselect(layero);
						resizeInput(layero)
						Mydao.setform(layero, row.unqualified);
					});
				},
				yes: function(index, layero) {
					layero.find("form").trigger("validate");
					if(!layero.find("form").data("validator").isFormValid()) return false;
					row.unqualified = layero.find("form").serializeJson();
					row.type = row.unqualified.type;
					row.level = row.unqualified.level;
					row.division = row.unqualified.division;
					row.description = row.unqualified.description;
					row.images = row.unqualified.images;
					$('#InspectionRecords-layer #checkInfoList').bootstrapTable('updateRow', {
						index: rowindex,
						row: row
					});
					layer.close(thisWindow);
				}
			});
		}
	}

	//删除检查记录
	var _del_result_record = function(e, value, row, index) {
		$('#InspectionRecords-layer #checkInfoList').bootstrapTable('removeByUniqueId', row.checkinfoid);
	}

	//渲染结果记录列表
	var result_record = function(data) {
		$('#InspectionRecords-layer #checkInfoList').bootstrapTable({
			data: data,
			cache: false, //禁用缓存
			search: false, //禁用查询
			striped: true, //隔行变色
			uniqueId: "checkinfoid",
			ajaxOptions: {
				ContentType: 'application/json',
				dataType: 'json'
			},
			columns: [{
				title: '序号',
				align: 'center',
				valign: 'middle',
				formatter: function(value, row, index) {
					return index + 1;
				}
			}, {
				title: '检查对象',
				align: 'center',
				field: 'checkobject',
				formatter: function(val, row, index) {
					return Mydao.valueFormatter(val, 30);
				}
			}, {
				title: '检查内容',
				align: 'center',
				field: 'content',
				formatter: function(val, row, index) {
					return Mydao.valueFormatter(val, 30);
				}
			}, {
				title: '检查描述',
				align: 'center',
				field: 'description',
				formatter: function(val, row, index) {
					return Mydao.valueFormatter(val, 30);
				}
			}, {
				title: '结论',
				align: 'center',
				width: '130px',
				field: 'completion',
				formatter: function(val, row, index) {
					return val == 0 ? '合格' : '不合格';
				}
			}, {
				title: '操作',
				align: 'center',
				valign: 'middle',
				width: '80px',
				formatter: function(value, row, index) {
					var ctrls = [];
					ctrls.push('edit');
					ctrls.push('del');
					return Mydao.operator(ctrls);
				},
				events: Mydao.operatorEvents({
					edit: edit_result_record_hege,
					del: _del_result_record
				})
			}]
		});
	};
})();