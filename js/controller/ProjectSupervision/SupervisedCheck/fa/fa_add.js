/**
 * 监督检查方案添加
 */
(function() {
	'use strict';
	//初始化下拉框
	Mydao.initselect(Mydao.currentPage.params.layero);

	//标识是否已经抽取
	//	var _section_has_extract = false;
	var _workpoint_has_extract = false;
	var _checkinfo_has_extract = false;
	//选择范围
	var _check_user_area = [];
	var _check_expert_area = [];
	//选择的人员
	var _select_jcry_data = [];
	var _select_jczj_data = [];
	//抽取的人员
	var _extract_temp_data = [];

	//初始化step页
	$("#checkprogram_faStepOut #checkprogram_fa_step").steps({
		transitionEffect: "fade",
		enableAllSteps: false,
		onInit: function(event, currentIndex) {

		},
		onStepChanging: function(event, currentIndex, newIndex) {
			if(currentIndex > newIndex) {
				//上一页
				return true;
			} else {
				//下一页
				if(newIndex == 1) { //选择工点
					//校验
					//验证
					$('#checkprogram_faStepOut #checkprogram_one_step').trigger('validate');
					if(!$('#checkprogram_faStepOut #checkprogram_one_step').data('validator').isFormValid()) {
						return false;
					}

					if(!_workpoint_has_extract) {
						_init_workpoint_table();
					}

					//检查事项
				} else if(newIndex == 2) {
					//校验
					var workpointData = $('#checkprogram_faStepOut #checkprogram_fa_workpoint_table').bootstrapTable('getData');
					var flag = false;
					$.each(workpointData, function(a, b) {
						if(!b.selectworkpointids && !b.extractworkpointids) {
							flag = true;
							layer.msg(b.name + "没有选择工点");
							return false;
						}
					});
					if(flag) {
						return false;
					}
					console.log(_checkinfo_has_extract)
					if(!_checkinfo_has_extract) {
						//初始化检查事项页
						_init_checkItems_tree();
						_init_checkItems_table();
					}
					//检查清单
				} else if(newIndex == 3) {
					//校验
					//					var itemData = $('#checkprogram_faStepOut #checkprogram_fa_checkitems_table').bootstrapTable('getData');
					//					if(itemData.length < 1) {
					//						layer.msg("请选择检查事项");
					//						return false;
					//					}
					if(!_checkinfo_has_extract) {
						//初始化检查清单页
						var _check_item_data = $('#checkprogram_faStepOut #checkprogram_fa_checkitems_table').bootstrapTable('getData');
						_init_checkInfos_table(_check_item_data);
					}
					//检查人
				} else if(newIndex == 4) {
					//					var flag = false;
					//校验
					//					var checkinfoData = $('#checkprogram_faStepOut #checkprogram_fa_checkinfos_table').bootstrapTable('getData');
					//					$.each(checkinfoData, function(a, b) {
					//						if(!b.selectcheckinfoids && !b.extractcheckinfoids) {
					//						   flag = true;
					//							layer.msg(b.childrencheckitemname + "没有选择检查清单");
					//							return false;
					//						}
					//					});
					//					if(flag) {
					//						return false;
					//					}

					_init_checkperson_table();
				}

			}
			return true;
		},
		onStepChanged: function(event, currentIndex, priorIndex) {
			return true;
		},
		onFinishing: function(event, currentIndex) {

			layer.load(2, {
				shade: [0.4, '#000']
			});
			//组装数据提交后台
			$('#checkprogram_faStepOut #checkprogram_five_step').trigger('validate');
			if(!$('#checkprogram_faStepOut #checkprogram_five_step').data('validator').isFormValid()) {
				layer.closeAll('loading');
				return false;
			}

			var _checkusers = $("#checkprogram_faStepOut #checkprogram_fa_person_table").bootstrapTable("getData");
			if(_checkusers.length < 1) {
				layer.closeAll('loading');
				layer.msg("请选择检查人员");
				return false;
			}

			//				
			var checkProgram = {};
			checkProgram = $("#checkprogram_faStepOut #checkprogram_one_step").serializeJson();
			checkProgram.projectid = $("#checkprogram_faStepOut #checkprogram_one_step_projectid").val();
			checkProgram.sections = $("#checkprogram_faStepOut #checkprogram_fa_workpoint_table").bootstrapTable("getData");
			checkProgram.checkitems = $("#checkprogram_faStepOut #checkprogram_fa_checkinfos_table").bootstrapTable("getData");
			checkProgram.checkuserarea = _check_user_area;
			checkProgram.checkexpertarea = _check_expert_area;
			checkProgram.checkusers = $("#checkprogram_faStepOut #checkprogram_fa_person_table").bootstrapTable("getData");
			checkProgram.extractworkpointnum = $("#checkprogram_faStepOut #checkprogram_two_step_num").val();
			checkProgram.extractcheckinfonum = $("#checkprogram_faStepOut #checkprogram_four_step_num").val();
			checkProgram.extractusernum = $("#checkprogram_faStepOut #checkprogram_five_step_jcry_num").val();
			checkProgram.extractexpertnum = $("#checkprogram_faStepOut #checkprogram_five_step_jczj_num").val();
			checkProgram.checkstart = $("#checkprogram_faStepOut #checkprogram_checkstart").val();
			checkProgram.checkend = $("#checkprogram_faStepOut #checkprogram_checkend").val();
			//此处演示关闭
			var flag = false;
			Mydao.ajax({
				"checkProgram": checkProgram
			}, "checkProgram/newadd", function(data) {
				if(data.code == 200) {
					flag = true;
				} else {
					layer.closeAll('loading');
					layer.msg(data.msg);
				}
			}, false);
			return flag;

			//			$('#checkprogram_faStepOut #checkprogram_five_step').trigger('validate');
			//			if(!$('#checkprogram_faStepOut #checkprogram_five_step').data('validator').isFormValid()) {
			//				return false;
			//			}
			//
			//			var _checkusers = $("#checkprogram_faStepOut #checkprogram_fa_person_table").bootstrapTable("getData");
			//			if(_checkusers.length < 1) {
			//				layer.closeAll('loading');
			//				layer.msg("请选择检查人员");
			//				return false;
			//			}
			//			var baocun = layer.open({
			//				type: 1,
			//				btnAlign: 'c',
			//				content: "<p class='p10' style='font-size:16px;text-align:center;'>确认保存？保存成功后项目和标段不能编辑!</p>",
			//				area: ["350px", "150px"],
			//				btn: ['保存', '取消'], //按钮
			//				success: function(layero, index) {
			//
			//				},
			//				yes: function(index, layero) {
			//					layer.close(baocun)
			//					//组装数据提交后台
			//					var checkProgram = {};
			//					checkProgram = $("#checkprogram_faStepOut #checkprogram_one_step").serializeJson();
			//					checkProgram.projectid = $("#checkprogram_faStepOut #checkprogram_one_step_projectid").val();
			//					checkProgram.sections = $("#checkprogram_faStepOut #checkprogram_fa_workpoint_table").bootstrapTable("getData");
			//					checkProgram.checkitems = $("#checkprogram_faStepOut #checkprogram_fa_checkinfos_table").bootstrapTable("getData");
			//					checkProgram.checkuserarea = _check_user_area;
			//					checkProgram.checkexpertarea = _check_expert_area;
			//					checkProgram.checkusers = $("#checkprogram_faStepOut #checkprogram_fa_person_table").bootstrapTable("getData");
			//					checkProgram.extractworkpointnum = $("#checkprogram_faStepOut #checkprogram_two_step_num").val();
			//					checkProgram.extractcheckinfonum = $("#checkprogram_faStepOut #checkprogram_four_step_num").val();
			//					checkProgram.extractusernum = $("#checkprogram_faStepOut #checkprogram_five_step_jcry_num").val();
			//					checkProgram.extractexpertnum = $("#checkprogram_faStepOut #checkprogram_five_step_jczj_num").val();
			//					checkProgram.checkstart = $("#checkprogram_faStepOut #checkprogram_checkstart").val();
			//					checkProgram.checkend = $("#checkprogram_faStepOut #checkprogram_checkend").val();
			//					var loading = layer.load(2, {time: 60*1000});
			//					//此处演示关闭
			//					Mydao.ajax({
			//						"checkProgram": checkProgram
			//					}, "checkProgram/newadd", function(data) {
			//						if(data.code == 200) {
			//							layer.close(loading);
			//							layer.msg("保存成功!");
			//							//刷新页面
			//							$("#checkprogram_fa #checkprogram_fa_table").bootstrapTable("refreshOptions", {
			//								pageNumber: 1
			//							}).bootstrapTable("refresh");
			//						} else {
			//							layer.close(loading);
			//							layer.msg(data.msg);
			//						}
			//					}, false);
			//				},
			//				cancel: function(layero, index) {
			//
			//				}
			//			});
		},
		onFinished: function(event, currentIndex) {
			setTimeout(function() {
				layer.closeAll('loading');
				layer.close(Mydao.currentPage.params.window);
				//刷新页面
				layer.msg("保存成功!");
				$("#checkprogram_fa #checkprogram_fa_table").bootstrapTable("refreshOptions", {
					pageNumber: 1
				}).bootstrapTable("refresh");
			}, 2000);
		}
		//		onFinished: function(event, currentIndex) {
		//			//刷新页面
		//			$("#checkprogram_fa #checkprogram_fa_table").bootstrapTable("refreshOptions", {
		//				pageNumber: 1
		//			}).bootstrapTable("refresh");
		//		}
	});

	/*--------------------------------------选择标段Start------------------------------------------------*/
	//项目改变，检测标段数据，判断是否需要抽取
	var _checkProgramProject = $("#checkprogram_one_step select[name='projectid']");
	//保存获取的标段信息，防止重复获取浪费流量
	var _tempSectionData;
	_checkProgramProject.change(function() {

		//如果修改项目重新初始化数据
		//		_section_has_extract = false;
		$("#checkprogram_one_step_sectionids").val('');
		$("#checkprogram_one_step_sectionnames").val('');
		$("#checkprogram_one_step_sectionids_select").val('');
		$("#checkprogram_one_step_sectionnames_select").val('');
		$("#checkprogram_one_step_sectionids_extract").val('');
		$("#checkprogram_one_step_sectionnames_extract").val('');
		//当前选中项目
		var _projectId = _checkProgramProject.val();
		//如果有项目id判断标段
		if(_projectId) {
			Mydao.ajax({
				"projectid": _projectId
			}, "constructionSection/s1006", function(data) {
				if(data.code == 200) {
					var _data = data.result;
					_tempSectionData = _data;
					//如果小于3条数据直接选中
					if(_data.length > 0 && _data.length < 3) {
						$("#checkprogram_fa_select_section_btn").attr("disabled", true);
						$("#checkprogram_fa_extract_section_btn").attr("disabled", true);
						var _bd_ids = "",
							_bd_names = "";
						$.each(_data, function(a, b) {
							_bd_ids += b.id + ",";
							_bd_names += b.name + ",";
						});
						_bd_ids = _bd_ids.substring(0, _bd_ids.length - 1);
						_bd_names = _bd_names.substring(0, _bd_names.length - 1);
						$("#checkprogram_one_step_sectionids").val(_bd_ids);
						$("#checkprogram_one_step_sectionnames").val(_bd_names);
						layer.msg("施工标段数量少于3条，无需选择和抽取！");
					} else {
						//清空选择的标段
						$("#checkprogram_one_step_sectionids").val("");
						$("#checkprogram_one_step_sectionnames").val("");
						//显示选择按钮
						$("#checkprogram_fa_select_section_btn").attr("disabled", false);
						$("#checkprogram_fa_extract_section_btn").attr("disabled", false);
					}
				} else {
					layer.msg('请求标段信息失败!');
				}
			});
		}
	});

	//选择标段
	$("#checkprogram_fa_select_section_btn").click(function() {
		layer.open({
			type: 1,
			title: '选择标段',
			btnAlign: 'c',
			content: "",
			area: ["620px", "540px"],
			btn: ['确定', '取消'], //按钮
			success: function(layero, index) {
				layero.find('.sidebar-collapse').slimScroll({
					height: '100%',
				});
				layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/CheckProgram_section.html', function() {
					layero.find('.sidebar-collapse').slimScroll({
						height: '100%',
					});

					layero.find(".group-input").each(function(index, element) {
						$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
					});

					//加载标段列表
					$('#checkprogram_select_section').bootstrapTable({
						data: _tempSectionData,
						checkboxHeader: true,
						uniqueId: "id",
						columns: [{
							checkbox: true,
							formatter: function(value, row, index) {
								var check = false;
								var disabled = false;
								//判断是否选中
								var _sectionids = $("#checkprogram_one_step_sectionids_select").val();
								if(_sectionids) {
									$.each(_sectionids.split(','), function(a, b) {
										if(b == row.id) {
											check = true;
											return;
										}
									});
								}

								//判断是否禁用
								var _extractids = $("#checkprogram_one_step_sectionids_extract").val();
								if(_extractids) {
									$.each(_extractids.split(','), function(a, b) {
										if(b == row.id) {
											disabled = true;
											return;
										}
									});
								}

								return {
									checked: check,
									disabled: disabled
								};
							}
						}, {
							title: '序号',
							align: 'center',
							valign: 'middle',
							formatter: function(val, row, index) {
								return index + 1;
							}
						}, {
							title: '标段',
							field: 'name',
							align: 'center',
							valign: 'middle',
						}, {
							title: '权重',
							field: 'weight',
							align: 'center',
							valign: 'middle',
						}]
					});
				});

			},
			yes: function(index, layero) {
				var _ids = '',
					_names = '';

				//抽取的数据
				var _extractIds = $("#checkprogram_one_step_sectionids_extract").val();
				var _extractNames = $("#checkprogram_one_step_sectionnames_extract").val();
				//选择的数据
				var _tempSeclects = $('#checkprogram_select_section').bootstrapTable('getSelections');
				//总记录数
				var _allNum = _tempSectionData.length;
				//选择的记录个数
				var _selectNum = _tempSeclects.length;
				//判断是否已经抽取
				//				if(_extractIds) { //已经抽取
				//					var _extractNum = _extractIds.split(",").length;
				//					
				//					//判断是否总数的1/3是否小于3条
				//					if((_allNum / 3) < 3) { //只能选择3条
				//						if(_extractNum + _selectNum < 3) {
				//							layer.msg("最少选择3条记录");
				//							return false;
				//						}
				//					} else { //抽取+选择的不能大于1/3
				//						if((_extractNum + _selectNum) - 1 < (_allNum / 3)) {
				//							layer.msg("选择和抽取的记录不能小于总数的1/3");
				//							return false;
				//						}
				//					}
				//				}

				//拼接数据
				if(_tempSeclects.length > 0) {
					$.each(_tempSeclects, function(index, val) {
						_ids += val.id + ",";
						_names += val.name + ",";
					});
					_ids = _ids.length > 1 ? _ids.substr(0, _ids.length - 1) : '';
					_names = _names.length > 1 ? _names.substr(0, _names.length - 1) : '';
					//保存选择的值
					$("#checkprogram_one_step_sectionids_select").val(_ids);
					$("#checkprogram_one_step_sectionnames_select").val(_names);
					console.log(_extractIds)
					//拼接显示列表
					if(_extractIds) {
						$("#checkprogram_one_step_sectionids").val(_ids + "," + _extractIds);
						$("#checkprogram_one_step_sectionnames").val(_names + "," + _extractNames);
					} else {
						$("#checkprogram_one_step_sectionids").val(_ids);
						$("#checkprogram_one_step_sectionnames").val(_names);
					}
				} else {
					//赋值
					$("#checkprogram_one_step_sectionids").val(_extractIds);
					$("#checkprogram_one_step_sectionnames").val(_extractNames);
				}
				//选择完成后显示抽取按钮
				//				if(_tempSeclects.length > 0 && !_section_has_extract) {
				//					if(((_allNum / 3) < 3 && _selectNum < 3) || ((_allNum / 3) > _selectNum + 1)) {
				//						$("#checkprogram_fa_extract_section_btn").attr("disabled", false);
				//					} else {
				//						$("#checkprogram_fa_extract_section_btn").attr("disabled", true);
				//					}
				//				} else {
				//					$("#checkprogram_fa_extract_section_btn").attr("disabled", true);
				//				}
				//关闭页面
				layer.close(index);
			}
		});
	});

	//抽取标段
	$("#checkprogram_fa_extract_section_btn").click(function() {
		var lzh_extractIds = $("#checkprogram_one_step_sectionids_extract").val(); //保存一下 已抽取的数据
		$("#checkprogram_one_step_sectionids_extract").val('');
		$("#checkprogram_one_step_sectionnames_extract").val('');
		//提示信息，正在抽取中
		var extract_warn = layer.open({
			type: 3
		});
		//过滤已经选择的标段
		var _select_ids = $("#checkprogram_one_step_sectionids_select").val(),
			_select_names = $("#checkprogram_one_step_sectionnames_select").val();
		//抽取标段信息，传入已经选择的标段信息
		Mydao.ajax({
			"projectid": _checkProgramProject.val(),
			"selectIds": _select_ids
		}, "constructionSection/s1007", function(data) {
			if(data.code == 200) {
				var extData = data.result;
				if(extData.length == 0) {
					$("#checkprogram_one_step_sectionids_extract").val(lzh_extractIds);
					$("#checkprogram_fa_extract_section_btn").attr("disabled", true);
				} else {
					var _ids = '',
						_names = '';
					$.each(extData, function(index, val) {
						_ids += val.id + ",";
						_names += val.name + ",";
					});
					_ids = _ids.length > 1 ? _ids.substr(0, _ids.length - 1) : '';
					_names = _names.length > 1 ? _names.substr(0, _names.length - 1) : '';
					//保存选择的值
					$("#checkprogram_one_step_sectionids_extract").val(_ids);
					$("#checkprogram_one_step_sectionnames_extract").val(_names);
					//组装数据
					if(_ids != '') {
						if(_select_ids != '') {
							$("#checkprogram_one_step_sectionnames").val(_select_names + "," + _names);
							$("#checkprogram_one_step_sectionids").val(_select_ids + "," + _ids);
						} else {
							$("#checkprogram_one_step_sectionnames").val(_names);
							$("#checkprogram_one_step_sectionids").val(_ids);
						}
					}
				}
				layer.close(extract_warn);
			} else {
				layer.close(extract_warn);
				layer.msg('抽取标段失败!');
			}
		});

		//		//只能抽取一次
		//		_section_has_extract = true;
		//		$("#checkprogram_fa_extract_section_btn").attr("disabled", true);
		//		//抽取后项目不能更改
		//		_checkProgramProject.attr("disabled", true);
	});

	/*--------------------------------------选择标段End------------------------------------------------*/

	/*--------------------------------------选择工点Start------------------------------------------------*/
	//初始化检查事项页面
	var _init_workpoint_table = function() {

		//获取选择的标段信息
		var _chooseSectionIds = $("#checkprogram_one_step_sectionids").val().split(","),
			_chooseSectionNames = $("#checkprogram_one_step_sectionnames").val().split(","),
			_temp_extract_sectionids = $("#checkprogram_one_step_sectionids_extract").val().split(",");
		var _workpoint_array = [];

		//遍历数据，组装选择工点的JSON
		for(var i = 0; i < _chooseSectionIds.length; i++) {
			_workpoint_array.push({
				"id": _chooseSectionIds[i],
				"name": _chooseSectionNames[i],
				"selecttype": $.inArray(_chooseSectionIds[i], _temp_extract_sectionids) == -1 ? 0 : 1,
				"selectworkpointids": "",
				"selectworkpointnames": "",
				"extractworkpointids": "",
				"extractworkpointnames": "",
				"workpointids": "",
				"workpointnames": "",
				"importantnum": 0,
				"hasExtract": false
			});
		}
		//加载页面
		$("#checkprogram_fa_workpoint_table").bootstrapTable("load", _workpoint_array);
	};

	//选择工点
	var _select_work_point = function(e, value, row, index) {
		layer.open({
			type: 1,
			title: '选择工点',
			btnAlign: 'c',
			content: "",
			area: ["620px", "540px"],
			btn: ['确定', '取消'], //按钮
			success: function(layero, index) {
				layero.find('.sidebar-collapse').slimScroll({
					height: '100%',
				});
				layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/CheckProgram_section.html', function() {
					layero.find('.sidebar-collapse').slimScroll({
						height: '100%',
					});

					layero.find(".group-input").each(function(index, element) {
						$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
					});

					//根据标段选择工点
					Mydao.ajax({
						"projectid": _checkProgramProject.val(),
						"sectionid": row.id
					}, "workPoint/selectList", function(data) {
						//加载标段列表
						$('#checkprogram_select_section').bootstrapTable({
							data: data.result,
							checkboxHeader: true,
							uniqueId: "id",
							columns: [{
								checkbox: true,
								formatter: function(value1, row1, index1) {
									var _check = false;
									var _disabled = false;
									if(row.selectworkpointids) {
										$.each(row.selectworkpointids.split(","), function(a, b) {
											if(b == row1.id) {
												_check = true;
												return;
											}
										});
									}
									if(row.extractworkpointids) {
										$.each(row.extractworkpointids.split(","), function(a, b) {
											if(b == row1.id) {
												_disabled = true;
												return;
											}
										});
									}
									return {
										checked: _check,
										disabled: _disabled
									};
								}
							}, {
								title: '序号',
								align: 'center',
								valign: 'middle',
								formatter: function(val, row, index) {
									return index + 1;
								}
							}, {
								title: '工点名称',
								field: 'name',
								align: 'center',
								valign: 'middle'
							}, {
								title: '重点工点',
								field: 'isimportant',
								align: 'center',
								valign: 'middle',
								formatter: function(val, row, index) {
									return val == 0 ? '否' : '是';
								}
							}, {
								title: '权重',
								field: 'weight',
								align: 'center',
								valign: 'middle'
							}]
						});
					});
				});

			},
			yes: function(index1, layero) {
				var _tempSeclects = $('#checkprogram_select_section').bootstrapTable('getSelections');
				var _wpids = '',
					_wpnames = '',
					_importantnum = 0;
				if(_tempSeclects.length != 0) {
					$.each(_tempSeclects, function(index, val) {
						_wpids += val.id + ",";
						_wpnames += val.name + ",";
						if(val.isimportant == 1) {
							_importantnum++;
						}
					});
					_wpids = _wpids.length > 1 ? _wpids.substr(0, _wpids.length - 1) : '';
					_wpnames = _wpnames.length > 1 ? _wpnames.substr(0, _wpnames.length - 1) : '';
					row.selectworkpointids = _wpids;
					row.selectworkpointnames = _wpnames;
					row.importantnum = _importantnum;
					if(row.hasExtract && row.extractworkpointids) {
						if(row.extractworkpointids) {
							row.workpointids = _wpids + "," + row.extractworkpointids;
							row.workpointnames = _wpnames + "," + row.extractworkpointnames;
						}
					} else {
						row.workpointids = _wpids;
						row.workpointnames = _wpnames;
					}
					$('#checkprogram_fa_workpoint_table').bootstrapTable('updateRow', {
						index: index,
						row: row
					});
				}
				//关闭页面
				layer.close(index1);
			}
		});
	};

	//初始化工点表
	$('#checkprogram_fa_workpoint_table').bootstrapTable({
		cache: true, //禁用缓存
		search: false, //禁用查询
		striped: true, //隔行变色
		uniqueId: "id",
		ajaxOptions: {
			ContentType: 'application/json',
			dataType: 'json'
		},
		columns: [{
			title: '标段',
			align: 'center',
			field: 'name'
		}, {
			title: '工点',
			align: 'center',
			field: 'workpointnames'
		}, {
			title: '操作',
			align: 'center',
			width: 20,
			formatter: function(value, row, index) {
				var ctrls = [];
				ctrls.push('save');
				return Mydao.operator(ctrls);
			},
			events: Mydao.operatorEvents({
				save: _select_work_point
			})
		}]
	});

	//抽取工点
	$("#checkprogram_two_step_extract").click(function() {
		//获取已经选择的数据
		var _all_workpoint = $('#checkprogram_fa_workpoint_table').bootstrapTable('getData');
		//对每个标段抽取工点
		$.each(_all_workpoint, function(a, b) {
			var _this = $(b);

			(function(_this) { //解决异步请求只执行一次的问题   
				Mydao.ajax({
					"sectionid": b.id,
					"selectworkpointids": b.selectworkpointids,
					"importantnum": b.importantnum,
					"extractnum": $("#checkprogram_two_step_num").val()
				}, "workPoint/s1007", function(data) {
					var _extractData = data.result;
					if(_extractData.length > 0) {
						var _wids = '',
							_wnames = '',
							_wimportantnum = 0;
						$.each(_extractData, function(a1, b1) {
							_wids += b1.id + ",";
							_wnames += b1.name + ",";
							if(b1.isimportant == 1) {
								_wimportantnum++;
							}
							b.importantnum = b.importantnum + _wimportantnum;
						});
						//截取字符
						_wids = _wids.length > 1 ? _wids.substr(0, _wids.length - 1) : '';
						_wnames = _wnames.length > 1 ? _wnames.substr(0, _wnames.length - 1) : '';
						//设置抽取的数据
						b.extractworkpointids = _wids;
						b.extractworkpointnames = _wnames;
						//设置已经抽取的标识
						b.hasExtract = true;
						//有选择数据
						if(b.selectworkpointids && _wids) {
							b.workpointids = b.selectworkpointids + "," + _wids;
							b.workpointnames = b.selectworkpointnames + "," + _wnames;
						} else {
							b.workpointids = _wids;
							b.workpointnames = _wnames;
						}
						//更新表格
						$("#checkprogram_fa_workpoint_table").bootstrapTable("updateRow", {
							index: a,
							row: b
						});
					}
				});
			})(_this);
		});

		//		//抽取禁止再次抽取
		//		$("#checkprogram_two_step_num").attr("disabled", true);
		//		$("#checkprogram_two_step_extract").attr("disabled", true);
		//		_workpoint_has_extract = true;
		//		//抽取工点后标段不能更改
		//		$("#checkprogram_fa_select_section_btn").attr("disabled", true);
	});

	//抽取上限限制
	$("#checkprogram_two_step_num").change(function() {
		var _num = $(this).val();
		var _num1 = Math.floor(_num);
		if(!(_num1 == _num)) {
			$(this).val(_num1);
		}
		if(_num1 < 2) {
			layer.msg("抽取数目必须大于2");
			$(this).val(2);
		}
	});

	/*--------------------------------------选择工点End------------------------------------------------*/

	/*--------------------------------------选择检查事项Start------------------------------------------------*/

	//查询是子节点的过滤器
	function _search_leaf_filter(node) {
		return(!node.isParent && node.checked);
	}

	//拼接子节点的名称
	var _splitChildrenName = function(data, path) {
		var _temp_name = '';
		var _allids = "";
		for(var i = 0; i < path.length; i++) {
			if(i == 0) {
				data.rootcheckitemid = path[i].id;
				data.rootcheckitemname = path[i].name;
				_allids += path[i].id + "_";
			} else if(i == path.length - 1) {
				_temp_name += path[i].name;
				_allids += path[i].id;
				data.childrencheckitemname = _temp_name;
				data.checkitemid = path[i].id;
				data.allids = _allids;
			} else {
				_temp_name += path[i].name + "-";
				_allids += path[i].id + "_";
			}
		}
	};

	//初始化树
	var _init_checkItems_tree = function() {
		Mydao.ajax({
			clientid: Mydao.clientid
		}, 'checkItems/s1001', function(data) {
			var currentTime = data.serverTime;
			if(data.code == 200) {
				var result = data.result;
				$.fn.zTree.init($("#checkprogram_fa_checkitems_tree"), {
					check: {
						enable: true,
						chkStyle: "checkbox"
					},
					data: {
						simpleData: {
							enable: true,
							idKey: 'id',
							pIdKey: 'parentid'
						}
					},
					callback: {
						beforeCheck: function(event, treeId, treeNode) {
							if(_checkinfo_has_extract) {
								layer.msg("已经抽取检查清单，无法变更检查事项");
								return false;
							}
						},
						onCheck: function(event, treeId, treeNode) {
							var _checkItemsTree = $.fn.zTree.getZTreeObj("checkprogram_fa_checkitems_tree");
							//查询选中的子节点
							var _checkItemNodes = _checkItemsTree.getNodesByFilter(_search_leaf_filter);
							var _checkItemData = [];
							//遍历组装数据
							$.each(_checkItemNodes, function(a, b) {
								var _data_row = {};
								_data_row.extractcheckinfo = 0;
								_data_row.selectcheckinfo = 0;
								_data_row.extractcheckinfoids = "";
								_data_row.selectcheckinfoids = "";
								_data_row.extractcheckinfodata = null;
								//查询子节点的路径
								var _node_path = b.getPath();
								//拼接数据
								_splitChildrenName(_data_row, _node_path);
								//放入数据
								_checkItemData.push(_data_row);
							});

							//加载选择的检查事项
							$("#checkprogram_fa_checkitems_table").bootstrapTable("load", _checkItemData);
						}
					}
				}, result);
			} else {
				layer.alert(data.msg);
			}

		});
	};

	//初始化检查事项表格
	var _init_checkItems_table = function() {
		$('#checkprogram_fa_checkitems_table').bootstrapTable({
			cache: true, //禁用缓存
			search: false, //禁用查询
			striped: true, //隔行变色
			uniqueId: "id",
			ajaxOptions: {
				ContentType: 'application/json',
				dataType: 'json'
			},
			columns: [{
				title: '事项类别',
				align: 'center',
				field: 'rootcheckitemname'
			}, {
				title: '检查事项',
				align: 'center',
				field: 'childrencheckitemname'
			}]
		});
	};

	/*--------------------------------------选择检查事项End------------------------------------------------*/

	/*--------------------------------------选择检查清单Start------------------------------------------------*/
	//抽查清单
	var _extract_checkInfo_btn = function(e, value, row, index) {
		if(row.extractcheckinfo > 0) {
			//选择抽查清单
			layer.open({
				type: 1,
				title: '抽取的抽查清单',
				btnAlign: 'c',
				content: "",
				area: ["50%", "70%"],
				btn: ['关闭'], //按钮
				success: function(layero, index1) {
					layero.find('.sidebar-collapse').slimScroll({
						height: '100%',
					});
					layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/CheckProgram_section.html', function() {
						layero.find('.sidebar-collapse').slimScroll({
							height: '100%',
						});

						layero.find(".group-input").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
						});

						//加载抽查清单
						$('#checkprogram_select_section').bootstrapTable({
							data: row.extractcheckinfodata,
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
								title: '抽查依据',
								field: 'foundation',
								align: 'center',
								valign: 'middle'
							}, {
								title: '抽查内容',
								field: 'content',
								align: 'center',
								valign: 'middle'
							}, {
								title: '抽查对象',
								field: 'checkobject',
								align: 'center',
								valign: 'middle'
							}, {
								title: '抽查方式',
								field: 'mode',
								align: 'center',
								valign: 'middle'
							}]
						});
					});

				},
				yes: function(index2, layero2) {
					//关闭页面
					layer.close(index2);
				}
			});
		} else {
			layer.msg("没有抽取数据");
		}
	};

	//选择清单
	var _select_checkInfo_btn = function(e, value, row, index) {
		//查询抽查清单
		Mydao.ajax({
			itemid: row.checkitemid,
			notin: row.extractcheckinfoids
		}, 'checkInfo/getAll', function(data) {
			var currentTime = data.serverTime;
			if(data.code == 200) {
				var result = data.result;
				//选择抽查清单
				layer.open({
					type: 1,
					title: '选择抽查清单',
					btnAlign: 'c',
					content: "",
					area: ["50%", "70%"],
					btn: ['确定', '取消'], //按钮
					success: function(layero, index1) {
						layero.find('.sidebar-collapse').slimScroll({
							height: '100%',
						});
						layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/CheckProgram_section.html', function() {
							layero.find('.sidebar-collapse').slimScroll({
								height: '100%',
							});

							layero.find(".group-input").each(function(index, element) {
								$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
							});

							//加载抽查清单
							$('#checkprogram_select_section').bootstrapTable({
								data: result,
								checkboxHeader: true,
								uniqueId: "id",
								columns: [{
									checkbox: true,
									formatter: function(value2, row2, index2) {
										var _check = false,
											_disabled = false;
										if(row.selectcheckinfoids) {
											$.each(row.selectcheckinfoids.split(","), function(a, b) {
												if(b == row2.id) {
													_check = true;
													return;
												}
											});
										}
										if(row.extractcheckinfoids) {
											$.each(row.extractcheckinfoids.split(","), function(a, b) {
												if(b == row2.id) {
													_disabled = true;
													return;
												}
											});
										}
										return {
											checked: _check,
											disabled: _disabled
										};
									}
								}, {
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
									valign: 'middle'
								}, {
									title: '抽查内容',
									field: 'content',
									align: 'center',
									valign: 'middle'
								}, {
									title: '抽查对象',
									field: 'checkobject',
									align: 'center',
									valign: 'middle'
								}, {
									title: '抽查方式',
									field: 'mode',
									align: 'center',
									valign: 'middle'
								}]
							});
						});

					},
					yes: function(index2, layero2) {
						//处理选择的数据
						var _tempSeclects = $('#checkprogram_select_section').bootstrapTable('getSelections');
						var _wpids = '';
						$.each(_tempSeclects, function(index, val) {
							_wpids += val.id + ",";
						});
						_wpids = _wpids.length > 1 ? _wpids.substr(0, _wpids.length - 1) : '';
						row.selectcheckinfoids = _wpids;
						row.selectcheckinfo = _tempSeclects.length;
						$('#checkprogram_fa_checkinfos_table').bootstrapTable('updateRow', {
							index: index,
							row: row
						});
						//关闭页面
						layer.close(index2);
					}
				});
			} else {
				layer.alert(data.msg);
			}
		});
	};

	//绑定抽查清单的抽查按钮
	$("#checkprogram_four_step_extract").click(function() {
		//获取已经选择的数据
		var _all_checkinfos = $('#checkprogram_fa_checkinfos_table').bootstrapTable('getData');
		//对每个标段抽取工点
		$.each(_all_checkinfos, function(a, b) {
			var _this = $(b);

			(function(_this) { //解决异步请求只执行一次的问题   
				Mydao.ajax({
					"checkitemid": b.checkitemid,
					"selectcheckinfos": b.selectcheckinfoids,
					"extractnum": $("#checkprogram_four_step_num").val()
				}, "checkInfo/s1007", function(data) {
					var _extractData = data.result;
					var _wids = '';
					$.each(_extractData, function(a1, b1) {
						_wids += b1.id + ",";
					});
					//截取字符
					_wids = _wids.length > 1 ? _wids.substr(0, _wids.length - 1) : '';
					//设置抽取的数据
					b.extractcheckinfoids = _wids;
					b.extractcheckinfodata = _extractData;
					b.extractcheckinfo = _extractData.length;

					//更新表格
					$("#checkprogram_fa_checkinfos_table").bootstrapTable("updateRow", {
						index: a,
						row: b
					});
				});
			})(_this);
		});

		//抽取禁止再次抽取
		$("#checkprogram_four_step_num").attr("disabled", true);
		$("#checkprogram_four_step_extract").attr("disabled", true);
		_checkinfo_has_extract = true;
	});

	//初始化检查清单表格
	var _init_checkInfos_table = function(data) {
		var _temp_info_table_data = $('#checkprogram_fa_checkinfos_table').bootstrapTable('getData');
		if(_temp_info_table_data.length > 0) { //已经有数据load
			for(var i = 0; i < data.length; i++) {
				for(var j = 0; j < _temp_info_table_data.length; j++) {
					if(data[i].allids == _temp_info_table_data[j].allids) {
						data[i] = _temp_info_table_data[j];
					}
				}
			}
			$('#checkprogram_fa_checkinfos_table').bootstrapTable('load', data);
		} else { //没有数据则渲染
			$('#checkprogram_fa_checkinfos_table').bootstrapTable('load', data);
		}
	};

	//初始化检查清单
	$('#checkprogram_fa_checkinfos_table').bootstrapTable({
		cache: true, //禁用缓存
		search: false, //禁用查询
		striped: true, //隔行变色
		uniqueId: "id",
		ajaxOptions: {
			ContentType: 'application/json',
			dataType: 'json'
		},
		columns: [{
			title: '事项类别',
			align: 'center',
			field: 'rootcheckitemname'
		}, {
			title: '检查事项',
			align: 'center',
			field: 'childrencheckitemname'
		}, {
			title: '抽查清单',
			align: 'center',
			field: 'extractcheckinfo',
			formatter: Mydao.nameFormatter,
			events: {
				'click a': _extract_checkInfo_btn
			}
		}, {
			title: '选择清单',
			align: 'center',
			field: 'selectcheckinfo',
			formatter: Mydao.nameFormatter,
			events: {
				'click a': _select_checkInfo_btn
			}
		}]
	});

	/*--------------------------------------选择检查清单End------------------------------------------------*/

	/*--------------------------------------选择检查人End------------------------------------------------*/
	//查询所有的子节点
	function getChildren(arrays, treeNode) {
		if(treeNode.parentid != -1) {
			arrays.push(treeNode.id);
		}
		if(treeNode.children) {
			for(var i = 0; i < treeNode.children.length; i++) {
				var node = treeNode.children[i];
				arrays.push(node.id);
				if(node.isParent) {
					getChildren(arrays, node);
				}
			}
		}
	}

	//加载检查人员机构树
	var _init_jcry_tree = function() {
		Mydao.ajax({
			clientid: Mydao.clientid,
			dictType: "ORG",
			code: "JDJG"
		}, 'organization/selectList', function(data) {
			var currentTime = data.serverTime;
			if(data.code == 200) {
				var result = data.result;
				$.fn.zTree.init($("#checkprogram_fa_jcry_tree"), {
					data: {
						simpleData: {
							enable: true,
							idKey: 'id',
							pIdKey: 'parentid'
						}
					},
					callback: {
						onClick: function(event, treeId, treeNode, clickFlag) {
							var _orgids = [];
							_orgids.push(-1);
							getChildren(_orgids, treeNode);
							//查询人员
							Mydao.ajax({
								clientid: Mydao.clientid,
								orgid: _orgids
							}, 'person/findCheckUserByOrg', function(data) {
								if(data.code == 200) {
									var result = data.result;
									//刷新列表
									$('#checkprogram_fa_jcry_table').bootstrapTable("load", result);
								} else {
									layer.alert(data.msg);
								}

							});
						}
					}
				}, result);
			} else {
				layer.alert(data.msg);
			}

		});
	};

	//检查人员选中事件
	var _oncheck_jcry = function(row) {
		_check_user_area.push(row);
	};

	//取消勾选
	var _onuncheck_jcry = function(row) {
		for(var i = 0; i < _check_user_area.length; i++) {
			if(_check_user_area[i].id == row.id) {
				_check_user_area.splice(i);
				return;
			}
		}
	};

	//选中所有
	var _oncheckall_jcry = function() {
		$.each($('#checkprogram_fa_jcry_table').bootstrapTable('getData'), function(a, b) {
			var _flag = true;
			for(var i = 0; i < _check_user_area.length; i++) {
				if(_check_user_area[i].id == b.id) {
					_flag = false;
					return;
				}
			}
			if(_flag) {
				_check_user_area.push(b);
			}
		});
	};

	//移除所有
	var _onuncheckall_jcry = function() {
		for(var i = 0; i < _check_user_area.length; i++) {
			$.each($('#checkprogram_fa_jcry_table').bootstrapTable('getData'), function(a, b) {
				if(_check_user_area[i].id == b.id) {
					_check_user_area.splice(i);
					return;
				}
			});
		}
	};

	//初始化检查人员表
	var init_jcry_table = function() {
		$('#checkprogram_fa_jcry_table').bootstrapTable({
			checkboxHeader: true,
			uniqueId: "id",
			onCheck: _oncheck_jcry,
			onUncheck: _onuncheck_jcry,
			onCheckAll: _oncheckall_jcry,
			onUncheckAll: _onuncheckall_jcry,
			columns: [{
				checkbox: true,
				formatter: function(value, row, index) {
					var check = false;
					//判断是否选中
					if(_check_user_area.length > 0) {
						$.each(_check_user_area, function(a, b) {
							if(b.id == row.id) {
								check = true;
								return;
							}
						});
					}
					return {
						checked: check
					};
				}
			}, {
				title: '姓名',
				field: 'name',
				align: 'center',
				valign: 'middle'
			}, {
				title: '性别',
				field: 'gender',
				align: 'center',
				valign: 'middle',
				formatter: function(value, row, index) {
					return value == 1 ? "男" : "女";
				}
			}, {
				title: '手机号',
				field: 'phone',
				align: 'center',
				valign: 'middle'
			}]
		});
	};

	//加载检查专家机构树
	var _init_jczj_tree = function() {
		Mydao.ajax({
			clientid: Mydao.clientid,
			dictType: "ORG",
			code: "JDJG"
		}, 'organization/selectList', function(data) {
			var currentTime = data.serverTime;
			if(data.code == 200) {
				var result = data.result;
				$.fn.zTree.init($("#checkprogram_fa_jczj_tree"), {
					data: {
						simpleData: {
							enable: true,
							idKey: 'id',
							pIdKey: 'parentid'
						}
					},
					callback: {
						onClick: function(event, treeId, treeNode, clickFlag) {
							var _orgids = [];
							_orgids.push(-1);
							getChildren(_orgids, treeNode);
							//查询人员
							Mydao.ajax({
								clientid: Mydao.clientid,
								orgid: _orgids
							}, 'person/findCheckExpertByOrg', function(data) {
								if(data.code == 200) {
									var result = data.result;
									//刷新列表
									$('#checkprogram_fa_jczj_table').bootstrapTable("load", result);
								} else {
									layer.alert(data.msg);
								}

							});
						}
					}
				}, result);
			} else {
				layer.alert(data.msg);
			}

		});
	};

	//检查专家选中事件
	var _oncheck_jczj = function(row) {
		_check_expert_area.push(row);
	};

	//取消勾选
	var _onuncheck_jczj = function(row) {
		for(var i = 0; i < _check_expert_area.length; i++) {
			if(_check_expert_area[i].id == row.id) {
				_check_expert_area.splice(i);
				return;
			}
		}
	};

	//选中所有
	var _oncheckall_jczj = function() {
		$.each($('#checkprogram_fa_jczj_table').bootstrapTable('getData'), function(a, b) {
			var _flag = true;
			for(var i = 0; i < _check_expert_area.length; i++) {
				if(_check_expert_area[i].id == b.id) {
					_flag = false;
					return;
				}
			}
			if(_flag) {
				_check_expert_area.push(b);
			}

		});
	};

	//移除所有
	var _onuncheckall_jczj = function() {
		for(var i = 0; i < _check_expert_area.length; i++) {
			$.each($('#checkprogram_fa_jczj_table').bootstrapTable('getData'), function(a, b) {
				if(_check_expert_area[i].id == b.id) {
					_check_expert_area.splice(i);
					return;
				}
			});
		}
	};

	//初始化检查专家表
	var init_jczj_table = function() {
		$('#checkprogram_fa_jczj_table').bootstrapTable({
			checkboxHeader: true,
			uniqueId: "id",
			onCheck: _oncheck_jczj,
			onUncheck: _onuncheck_jczj,
			onCheckAll: _oncheckall_jczj,
			onUncheckAll: _onuncheckall_jczj,
			columns: [{
				checkbox: true,
				formatter: function(value, row, index) {
					var check = false;
					//判断是否选中
					if(_check_expert_area.length > 0) {
						$.each(_check_expert_area, function(a, b) {
							if(b.id == row.id) {
								check = true;
								return;
							}
						});
					}
					return {
						checked: check
					};
				}
			}, {
				title: '姓名',
				field: 'name',
				align: 'center',
				valign: 'middle'
			}, {
				title: '性别',
				field: 'gender',
				align: 'center',
				valign: 'middle',
				formatter: function(value, row, index) {
					return value == 1 ? "男" : "女";
				}
			}, {
				title: '手机号',
				field: 'phone',
				align: 'center',
				valign: 'middle'
			}]
		});
	};

	//人员范围
	$("#checkprogram_five_step_area").click(function() {
		//选择抽查清单
		layer.open({
			type: 1,
			title: '选择人员范围',
			btnAlign: 'c',
			content: "",
			area: ["60%", "70%"],
			btn: ['确定'], //按钮
			success: function(layero, index) {
				layero.find('.sidebar-collapse').slimScroll({
					height: '100%',
				});
				layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/CheckProgram_person.html', function() {
					layero.find('.sidebar-collapse').slimScroll({
						height: '100%',
					});

					layero.find(".group-input").each(function(index, element) {
						$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
					});
					//加载检查人员机构树
					_init_jcry_tree();

					//加载检查人员列表
					init_jcry_table();

					//加载检查人员机构树
					_init_jczj_tree();

					//加载检查人员列表
					init_jczj_table();

				});

			},
			yes: function(layero, index) {
				//关闭页面
				layer.close(layero);
			}
		});
	});

	//选择检查人员
	var _oncheck_jcry_data = function(row) {
		var _flag = false;
		var _has_select_jczj_temp = $('#checkprogram_select_jczj_table').bootstrapTable("getSelections");
		$.each(_has_select_jczj_temp, function(a, b) {
			if(b.id == row.id) {
				_flag = true;
				$("#checkprogram_select_jcry_table").bootstrapTable("uncheckBy", {
					field: "id",
					values: [b.id]
				});
			}
		});
		if(_flag) {
			layer.msg("已经在检查专家列表中的人员无法再次选中");
		}
	};

	//选择所有的检查人员
	var _oncheckall_jcry_data = function() {
		var _flag = false;
		//var _has_all_jcry_temp = $('#checkprogram_select_jczj_table').bootstrapTable("getData");
		//var _has_select_jcry_temp = $('#checkprogram_select_jczj_table').bootstrapTable("getSelections");
		//解决变量错误导致报错			
		var _has_all_jcry_temp = $('#checkprogram_select_jcry_table').bootstrapTable("getData");
		var _has_select_jczj_temp = $('#checkprogram_select_jczj_table').bootstrapTable("getSelections");
		$.each(_has_all_jcry_temp, function(a, b) {
			$.each(_has_select_jczj_temp, function(a1, b1) {
				if(b.id == b1.id) {
					_flag = true;
					$("#checkprogram_select_jcry_table").bootstrapTable("uncheckBy", {
						field: "id",
						values: [b.id]
					});
				}
			});
		});
		if(_flag) {
			layer.msg("已经在检查专家列表中的人员无法再次选中");
		}
	};

	//选择检查专家
	var _oncheck_jczj_data = function(row) {
		var _flag = false;
		var _has_select_jcry_temp = $('#checkprogram_select_jcry_table').bootstrapTable("getSelections");
		$.each(_has_select_jcry_temp, function(a, b) {
			if(b.id == row.id) {
				_flag = true;
				$("#checkprogram_select_jczj_table").bootstrapTable("uncheckBy", {
					field: "id",
					values: [b.id]
				});
			}
		});
		if(_flag) {
			layer.msg("已经在检查人员列表中的专家无法再次选中");
		}
	};

	//选择所有的检查专家
	var _oncheckall_jczj_data = function() {
		var _flag = false;
		var _has_all_jczj_temp = $('#checkprogram_select_jczj_table').bootstrapTable("getData");
		var _has_select_jcry_temp = $('#checkprogram_select_jcry_table').bootstrapTable("getSelections");
		$.each(_has_all_jczj_temp, function(a, b) {
			$.each(_has_select_jcry_temp, function(a1, b1) {
				if(b.id == b1.id) {
					_flag = true;
					$("#checkprogram_select_jczj_table").bootstrapTable("uncheckBy", {
						field: "id",
						values: [b.id]
					});
				}
			});
		});
		if(_flag) {
			layer.msg("已经在检查人员列表中的专家无法再次选中");
		}
	};

	//选择人员
	$("#checkprogram_five_step_select").click(function() {
		layer.open({
			type: 1,
			title: '选择检查人员',
			btnAlign: 'c',
			content: "",
			area: ["60%", "80%"],
			btn: ['确定', '取消'], //按钮
			success: function(layero, index) {
				layero.find('.sidebar-collapse').slimScroll({
					height: '100%',
				});
				layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/CheckProgram_select_person.html', function() {
					layero.find('.sidebar-collapse').slimScroll({
						height: '100%',
					});

					layero.find(".group-input").each(function(index, element) {
						$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
					});

					//获取已经选择人员
					var _has_select_data = $('#checkprogram_fa_person_table').bootstrapTable("getData");

					//检查人员
					$('#checkprogram_select_jcry_table').bootstrapTable({
						data: _check_user_area,
						checkboxHeader: true,
						uniqueId: "id",
						onCheck: _oncheck_jcry_data,
						onCheckAll: _oncheckall_jcry_data,
						columns: [{
							checkbox: true,
							formatter: function(value, row, index) {
								var _checked = false,
									_disabled = false;
								$.each(_has_select_data, function(a, b) {
									if(b.id == row.id) {
										//抽取的
										if(b.selecttype == 1) {
											_disabled = true;
										} else {
											_checked = true;
										}
									}
								});
								return {
									checked: _checked,
									disabled: _disabled
								};
							}
						}, {
							title: 'id',
							field: 'id'
						}, {
							title: '姓名',
							field: 'name',
							align: 'center',
							valign: 'middle'
						}, {
							title: '性别',
							field: 'gender',
							align: 'center',
							valign: 'middle',
							formatter: function(value, row, index) {
								return value == 1 ? "男" : "女";
							}
						}, {
							title: '手机号',
							field: 'phone',
							align: 'center',
							valign: 'middle'
						}]
					});

					$('#checkprogram_select_jcry_table').bootstrapTable('hideColumn', 'id');

					//检查专家
					$('#checkprogram_select_jczj_table').bootstrapTable({
						data: _check_expert_area,
						checkboxHeader: true,
						uniqueId: "id",
						onCheck: _oncheck_jczj_data,
						onCheckAll: _oncheckall_jczj_data,
						columns: [{
							checkbox: true,
							formatter: function(value, row, index) {
								var _checked = false,
									_disabled = false;
								$.each(_has_select_data, function(a, b) {
									if(b.id == row.id) {
										//抽取的
										if(b.selecttype == 1) {
											_disabled = true;
										} else {
											_checked = true;

										}
									}
								});
								return {
									checked: _checked,
									disabled: _disabled
								};
							}
						}, {
							title: 'id',
							field: 'id'
						}, {
							title: '姓名',
							field: 'name',
							align: 'center',
							valign: 'middle'
						}, {
							title: '性别',
							field: 'gender',
							align: 'center',
							valign: 'middle',
							formatter: function(value, row, index) {
								return value == 1 ? "男" : "女";
							}
						}, {
							title: '手机号',
							field: 'phone',
							align: 'center',
							valign: 'middle'
						}]
					});

					$('#checkprogram_select_jczj_table').bootstrapTable('hideColumn', 'id');

				});

			},
			yes: function(layero, index) {
				//填充数据
				_select_jcry_data = $('#checkprogram_select_jcry_table').bootstrapTable("getSelections");
				_select_jczj_data = $('#checkprogram_select_jczj_table').bootstrapTable("getSelections");
				var _select_user_data = [];
				$.each(_select_jcry_data, function(a, b) {
					b.persontype = 0;
					b.selecttype = 0;
					_select_user_data.push(b);
				});

				$.each(_select_jczj_data, function(a, b) {
					b.persontype = 1;
					b.selecttype = 0;
					_select_user_data.push(b);
				});

				if(_extract_temp_data.length > 0) {
					$.each(_extract_temp_data, function(a, b) {
						_select_user_data.push(b);
					});
				}

				//填充数据
				$('#checkprogram_fa_person_table').bootstrapTable("load", _select_user_data);

				layer.close(layero);
			}
		});
	});

	//抽取
	$("#checkprogram_five_step_extract").click(function() {

		//清空抽取数据
		_extract_temp_data = [];

		//临时保存所有人
		var _temp_all_data = [];
		$.each(_select_jcry_data, function(a1, b1) {
			_temp_all_data.push(b1);
		});
		$.each(_select_jczj_data, function(a1, b1) {
			_temp_all_data.push(b1);
		});
		//抽取数目
		var _jcry_num = $("#checkprogram_five_step_jcry_num").val();
		var _jczj_num = $("#checkprogram_five_step_jczj_num").val();

		//拼接人员ids
		var _check_user_area_ids = "";
		$.each(_check_user_area, function(a, b) {
			var _flag = true;
			//过滤检查人员
			$.each(_select_jcry_data, function(a1, b1) {
				if(b.id == b1.id) {
					_flag = false;
					return;
				}
			});
			//过滤检查专家
			$.each(_select_jczj_data, function(a1, b1) {
				if(b.id == b1.id) {
					_flag = false;
					return;
				}
			});
			if(_flag) {
				_check_user_area_ids += b.id + ",";
			}
		});
		if(_check_user_area_ids.length > 0) {
			_check_user_area_ids = _check_user_area_ids.substring(0, _check_user_area_ids.length - 1);
		}

		//抽取 检查人员
		if(_check_user_area_ids.length < 1) {
			return false;
		}
		Mydao.ajax({
			"ids": _check_user_area_ids,
			"extractnum": _jcry_num
		}, "person/extractJCRY", function(data) {
			if(data.code == 200) {
				var extData = data.result;
				$.each(extData, function(a, b) {
					b.persontype = 0;
					b.selecttype = 1;
					_temp_all_data.push(b);
					_extract_temp_data.push(b);
				});

				//拼接专家
				var _check_expert_area_ids = "";
				$.each(_check_expert_area, function(a, b) {
					var _flag = true;

					//拼装抽查专家
					$.each(_select_jczj_data, function(a1, b1) {
						if(b.id == b1.id) {
							_flag = false;
							return;
						}
					});

					//拼装检查人员
					$.each(_select_jcry_data, function(a1, b1) {
						if(b.id == b1.id) {
							_flag = false;
							return;
						}
					});

					//排除已经选中的人员
					$.each(extData, function(a1, b1) {
						if(b.id == b1.id) {
							_flag = false;
							return;
						}
					});

					if(_flag) {
						_check_expert_area_ids += b.id + ",";
					}
				});

				if(_check_expert_area_ids.length > 0) {
					_check_expert_area_ids = _check_expert_area_ids.substring(0, _check_expert_area_ids.length - 1);
				}

				if(_check_expert_area_ids.length < 1) {
					return false;
				}
				//抽取检查专家
				Mydao.ajax({
					"ids": _check_expert_area_ids,
					"extractnum": _jczj_num
				}, "person/extractJCZJ", function(data) {
					if(data.code == 200) {
						var extData = data.result;
						$.each(extData, function(a, b) {
							b.persontype = 1;
							b.selecttype = 1;
							_temp_all_data.push(b);
							_extract_temp_data.push(b);
						});
						$('#checkprogram_fa_person_table').bootstrapTable("load", _temp_all_data);
					} else {
						layer.msg('抽取检查专家失败!');
					}
				});
			} else {
				layer.msg('抽取检查人员失败!');
			}
		});
	});

	//初始化检查清单表格
	var _init_checkperson_table = function(data) {
		$('#checkprogram_fa_person_table').bootstrapTable({
			cache: true, //禁用缓存
			search: false, //禁用查询
			striped: true, //隔行变色
			uniqueId: "id",
			ajaxOptions: {
				ContentType: 'application/json',
				dataType: 'json'
			},
			columns: [{
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
	};

	/*--------------------------------------选择检查人End------------------------------------------------*/

})();