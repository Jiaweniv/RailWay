/*
 * 问题总览
 * 2017 - 7 - 5 by li
 * 
 */
//显示详情
var show_problem_detail_id = function(e, value, row, index) {
	Mydao.ajax({
		id: row.id
	}, 'checkDetail/s1002', function(data) {
		var currentTime = data.serverTime;
		if(data.code == 200) {
			var result = data.result;
			$.ajax({
				type: 'get',
				dataType: 'html',
				url: 'view/Problem/detail.html',
				success: function(resp) {
					var dialog = layer.open({
						type: 1,
						content: resp,
						area: ["70%", "90%"],
						moveOut: true,
						success: function(layero, index) {

						},
						cancel: function(layero, index) {

						}
					});
				},
				dataFilter: function(data) {
					data = Mydao.setcontent(data, result);
					return data;
				}
			});
		} else {
			layer.alert(data.msg);
		}

	});
};

//显示详情
var show_problem_detail = function(projectid, itemid, sectionid, datetype, year, datevalue) {
	layer.open({
		type: 1,
		title: '问题列表',
		btnAlign: 'c',
		content: "",
		btn: ['关闭'],
		area: ["70%", "80%"],
		moveOut: true,
		cancel: function(layero, index) {},
		btn2: function(index, layero) {},
		success: function(layero, index) {
			layero.find('.sidebar-collapse').slimScroll({
				height: '100%',
			});
			layero.find('.layui-layer-content').load('view/SupervisePandect/ProblemPandectTable.html', function() {
				Mydao.ajaxNoPage({
					'projectid': projectid,
					'sectionid': sectionid,
					'checkitemsid': itemid,
					'year': year,
					'datetype': datetype,
					'datevalue': datevalue
				}, 'checkDetail/problemTable', function(data) {
					console.log(data.result)
					//渲染表格
					$('#ProblemPandectTable_lzh #ProblemPandectTable_lzh_table').bootstrapTable({
						data: data.result,
						uniqueId: "id", //唯一标识,
						columns: [{
							title: '序号',
							align: 'center',
							formatter: function(value, row, index) {
								return index + 1;
							},
						}, {
							title: '年度',
							align: 'center',
							field: 'year'
						}, {
							title: '项目名称',
							align: 'center',
							field: 'projectname'
						}, {
							title: '施工标段',
							align: 'center',
							field: 'sectionname'
						}, {
							title: '检查事项',
							align: 'center',
							field: 'name'
						}, {
							title: '检查时间',
							align: 'center',
							field: 'checktime'
						}, {
							title: '问题描述',
							align: 'center',
							field: 'description',
							formatter: function(val, row, index) {
								return Mydao.valueFormatter(val, 20);
							}
						}, {
							title: '详情',
							align: 'center',
							formatter: function(value, row, index) {
								return Mydao.operator(['view']);
							},
							events: Mydao.operatorEvents({
								view: show_problem_detail_id
							})
						}]
					});
				});
			});
		}
	});
}

//显示详情
$(function() {
	'use strict';
	Mydao.initselect('#ProblemPandect_lzh');
	$("#ProblemPandect_lzh #ProblemPandect_projectid").change(); //第一次查询工点
	//检查时间变更
	$('#ProblemPandect_time_select > select').change(function() {
		var _thisVal = $(this).val();
		if(_thisVal == 1) {
			$('#ProblemPandect_time_years').show();
			$('#ProblemPandect_time_quarters').find('select').val('');
			$('#ProblemPandect_time_quarters').hide();
			$('#ProblemPandect_time_months').find('select').val('');
			$('#ProblemPandect_time_months').hide();
		} else if(_thisVal == 2) {
			$('#ProblemPandect_time_years').show();
			$('#ProblemPandect_time_quarters').find('select').val('');
			$('#ProblemPandect_time_quarters').hide();
			$('#ProblemPandect_time_months').show();
		} else {
			$('#ProblemPandect_time_years').show();
			$('#ProblemPandect_time_quarters').show();
			$('#ProblemPandect_time_months').find('select').val('');
			$('#ProblemPandect_time_months').hide();
		}
	});

	//处理问题数
	var item_problem_num = function(data, field) {
		var num = parseInt(0);
		$.each(data, function(a, b) {
			num += parseInt(b[field]);
		});
		return num + '';
	}

	//处理问题总览列表数据
	var load_table = function() {

		Mydao.ajaxNoPage({
			'projectid': $('#ProblemPandect_lzh #ProblemPandect_projectid').val(),
			'sectionid': $('#ProblemPandect_lzh #ProblemPandect_section').val(),
			'year': $('#ProblemPandect_lzh #ProblemPandect_time_years select').val(),
			'datetype': $('#ProblemPandect_lzh #ProblemPandect_time_select select').val(),
			'datevalue': $('#ProblemPandect_lzh #ProblemPandect_time_months select').val() != '' ? $('#ProblemPandect_lzh #ProblemPandect_time_months select').val() : $('#ProblemPandect_lzh #ProblemPandect_time_quarters select').val()
		}, 'checkDetail/allProblem', function(data) {
			if(data.code == 200) {
				//处理表格列
				if(data.result.items) {
					var _columns_arr = [];
					var params = data.result.params;
					$.each(data.result.items, function(a, b) {
						var temp_columns = {
							title: b.name,
							field: b.key,
							align: 'center',
							valign: 'middle',
							footerFormatter: function(data) {
								return item_problem_num(data, b.key);
							},
							formatter: function(value, row, index) {
								var sectionid = params.sectionid ? params.sectionid : '\'\'';
								var datetype = params.datetype ? params.datetype : '\'\'';
								var datevalue = params.datevalue ? params.datevalue : '\'\'';
								var year = params.year ? params.year : '\'\'';
								var projectid = '\'' + row.projectid + '\'';
								var itemid = '\'' + b.key + '\'';
								return '<a href="javascript:show_problem_detail(' + projectid + ',' + itemid + ',' + sectionid + ',' + datetype + ',' + year + ',' + datevalue + ');" title=' + value + '  class="To-view" >' + value + '</a> ';
							}
						}
						_columns_arr.push(temp_columns);
					});

					//渲染表格
					$("#ProblemPandect_lzh #ProblemPandect_lzh_table").bootstrapTable({
						data: data.result.details,
						cache: false, //禁用缓存
						search: false, //禁用查询
						striped: true, //隔行变色
						uniqueId: "projectid",
						showFooter: true, //显示列脚
						ajaxOptions: {
							ContentType: 'application/json',
							dataType: 'json'
						},
						columns: [
							[{
								title: '序号',
								align: 'center',
								valign: 'middle',
								rowspan: 2,
								formatter: function(val, row, index) {
									return index + 1;
								},
								footerFormatter: function() {
									return '合计';
								}
							}, {
								title: '项目名称',
								align: 'center',
								rowspan: 2,
								valign: 'middle',
								field: 'projectname',
								footerFormatter: function(data) {
									return data.length + '';
								}
							}, {
								title: '施工标段数',
								align: 'center',
								rowspan: 2,
								valign: 'middle',
								field: 'sectionnum',
								footerFormatter: function(data) {
									var num = 0;
									$.each(data, function(a, b) {
										num += parseInt(b.sectionnum);
									});
									return num + '';
								}
							}, {
								title: '工点数',
								align: 'center',
								rowspan: 2,
								valign: 'middle',
								field: 'workpointnum',
								footerFormatter: function(data) {
									var num = 0;
									$.each(data, function(a, b) {
										num += parseInt(b.workpointnum);
									});
									return num + '';
								}
							}, {
								title: '风险工点数',
								align: 'center',
								rowspan: 2,
								valign: 'middle',
								field: 'problempointnum',
								footerFormatter: function(data) {
									var num = 0;
									$.each(data, function(a, b) {
										num += parseInt(b.problempointnum);
									});
									return num + '';
								}
							}, {
								title: '问题类型',
								align: 'center',
								colspan: _columns_arr.length,
								valign: 'middle'
							}, {
								title: '通知单数',
								align: 'center',
								rowspan: 2,
								valign: 'middle',
								field: 'correctionnum',
								footerFormatter: function(data) {
									var num = 0;
									$.each(data, function(a, b) {
										num += parseInt(b.correctionnum);
									});
									return num + '';
								}
							}], _columns_arr
						]
					});

				}
			} else {
				layer.alert(data.msg)
			}
		}, false);
	}

	//查询
	$('#ProblemPandect_lzh #ProblemPandect_search').on('click', function(event) {
		$("#ProblemPandect_lzh #ProblemPandect_lzh_table").bootstrapTable('destroy');
		load_table();
	});

	var doExport = function(selector, params) {
		var options = {
			tableName: '问题库总览',
			worksheetName: '问题库总览',
			fileName:'问题库总览'
		};
		$.extend(true, options, params);
		$(selector).tableExport(options);
	}
	//导出
	$('#ProblemPandect_lzh #ProblemPandect_daochu').on('click', function(event) {
		doExport('#ProblemPandect_lzh #ProblemPandect_lzh_table', {
			type: 'excel'
		});
	});

	//初始化
	load_table();

});