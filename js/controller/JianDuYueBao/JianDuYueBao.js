/*
 * 监督月报 2017-03-21  by li
 * */
(function() {
	'use strict';

	Mydao.initselect('#JianDuYueBao'); //初始化页面select

	//生成报告
	$('#JianDuYueBao #SCBG_Btn').on('click', function() {
		var SCBG_organization = $('#JianDuYueBao #SCBG_organization').val(),
			SCBG_starttime = $('#JianDuYueBao #SCBG_starttime').val(),
			SCBG_endtime = $('#JianDuYueBao #SCBG_endtime').val();
		if(SCBG_organization && SCBG_starttime && SCBG_endtime) {
			if(SCBG_starttime > SCBG_endtime) {
				layer.alert("结束时间不能小于开始时间!");
				return false;
			}
			Mydao.ajax({
				"orgid": SCBG_organization,
				"starttime": SCBG_starttime,
				"endtime": SCBG_endtime
			}, 'supervisionMonthly/s1001', function(result) {
				var currentTime = result.serverTime;
				if(result.code == 200) {
					layer.alert('添加成功!');
					$('#JianDuYueBao #jdyb_table').bootstrapTable("refresh");
				} else {
					layer.msg(result.msg);
				}
			});
		} else {
			layer.alert('请填写监督机构和生成报告时间!');
		}
	});
	//		监督检查报告查看
	var _view = function(e, value, row, index) {
		Mydao.ajax({
			"id": row.id
		}, 'supervisionMonthly/s1005', function(result) {
			var currentTime = result.serverTime;
			if(result.code == 200) {
				var d = result.result;
				layer.open({
					type: 1,
					title: '监管月报预览',
					btn: ['导出', '返回'], //按钮
					btnAlign: 'c',
					area: ["70%", "90%"],
					moveOut: true,
					success: function(layero, index) {
						d.complaint_lenght = Object.keys(d.complaint).length; //统计投诉举报个数
						var itemnum_FL = [],
							disciplinenum_ZY = [];
						for(var i = 0; i < d.itemnum.length; i++) { //问题分类
							var item = d.itemnum[i];
							itemnum_FL.push(item.name + item.num + "个、");
						}
						for(var j = 0; j < d.disciplinenum.length; j++) { //问题专业
							var item2 = d.disciplinenum[j];
							disciplinenum_ZY.push(item2.name + item2.num + "个、");
						}
						d.itemnum_FL = itemnum_FL;
						d.disciplinenum_ZY = disciplinenum_ZY;
						layui.use(['laytpl'], function() {
							var laytpl = layui.laytpl;
							layero.find('.layui-layer-content').load('view/JianDuYueBao/JianDuYueBao_Export.html', function() {
								var _getTpl = layero.find('#JDYB_template').html(),
									project_show = layero.find('#JDYB_container');
								laytpl(_getTpl).render(d, function(html) {
									project_show.html(html);
								});
								//1.监督手续表格
								layero.find('#jdsx').bootstrapTable({
									data: d.procedures,
									columns: [{
										title: '序号',
										formatter: function(val, row, index) {
											return index + 1;
										}
									}, {
										title: '项目名称',
										field: 'projectname',
									}, {
										title: '建设单位',
										field: 'participatename',
									}, {
										title: '监督手续办理时间',
										field: 'transacttime',
									}, {
										title: '计划开工时间',
										field: 'planstarttime',
										formatter: function(value, row, index) {
											return Mydao.formatDate(value, 'YYYY-MM-DD');
										}
									}, {
										title: '项目性质<br/>（国、总、地、专）',
									}, {
										title: '监督机构',
										field: 'superviseorgname',
									}, ]
								});
								//2.监督检查表格
								layero.find('#jdjc').bootstrapTable({
									data: d.correction,
									columns: [{
										title: '通知单编号',
										field: 'number',
									}, {
										title: '检查时间',
										field: 'checktime',
									}, {
										title: '检查人员',
										field: 'checkusername',
									}, {
										title: '被检项目',
										field: 'projectname',
									}, {
										title: '被检单位',
										field: 'groupname',
									}, {
										title: '责任单位',
										field: 'groupname',
									}, {
										title: '相关责任单位',
										field: 'relatedunits',
									}, {
										title: '发现问题',
										field: 'description',
									}, {
										title: '处理情况',
									}, {
										title: '问题性质',
									}, {
										title: '问题分类',
										field: 'itemname',
									}, {
										title: '问题专业',
										field: 'disciplinename',
									}, ]
								});

								//3.投诉举报表格
								layero.find('#tsjb').bootstrapTable({
									data: d.complaint,
									columns: [{
										title: '编号',
									}, {
										title: '受理时间',
										field: 'reporttime',
									}, {
										title: '来源<br/>（信件、电话、电子邮件、国家局转等）',
										field: 'source',
									}, {
										title: '投诉举报内容',
										field: 'content',
									}, {
										title: '被举报投诉的项目',
										field: 'projectname',
									}, {
										title: '被举报投诉的单位',
										field: 'orgname',
									}, {
										title: '调查结果<br/>(属实、部分属实、不属实、正在调查)',
									}, {
										title: '处理情况',
									}]
								});
								//4.质量安全事故表格
								layero.find('#zlaqsg').bootstrapTable({

								});
								//5.质量检测表格
								layero.find('#zljc').bootstrapTable({

								});
								//6.验收备案表格
								layero.find('#ysba').bootstrapTable({

								});
								//7.行政处罚表格
								layero.find('#xzcf').bootstrapTable({

								});
							});
						});
					},
					yes: function(index, layero) { //导出
						window.location.href = MydaoFileDownPath + "?fileId=" + d.supervisionmonthly.reportfile;
					},
					cancel: function(layero, index) {

					},
					btn2: function(index, layero) {},
				});
			} else {
				layer.msg(result.msg);
			}
		});
	};
	//		导出
	var _export = function(e, value, row, index) {
		window.location.href = MydaoFileDownPath + "?fileId=" + row.reportfile;
	};
	//		删除
	var _delete = function(e, value, row, index) {
		layer.confirm('确定删除？', {
			icon: 3,
			title: '提示'
		}, function(index) {
			Mydao.ajax({
				id: row.id
			}, 'supervisionMonthly/s1006', function(result) {
				var currentTime = result.serverTime;
				if(result.code == 200) {
					$('#JianDuYueBao #jdyb_table').bootstrapTable("refresh");
				} else {
					layer.msg(result.msg);
				}
			});
			layer.close(index);
		});
	};
	//		监督月报列表
	var url = "supervisionMonthly/s1004";
	$('#JianDuYueBao #jdyb_table').bootstrapTable({
		pagination: true,
		sidePagination: 'server',
		queryParamsType: "undefined",
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
			Mydao.config.ajaxParams.params.orgid = $('#JianDuYueBao #CX_organization').val();
			Mydao.config.ajaxParams.params.starttime = $('#JianDuYueBao #CX_starttime').val();
			Mydao.config.ajaxParams.params.endtime = $('#JianDuYueBao #CX_endtime').val();
			return Mydao.config.ajaxParams;
		},
		columns: [{
			title: '序号',
			align: 'center',
			valign: 'middle',
			formatter: function(val, row, index) {
				return index + 1;
			}
		}, {
			title: '生成时间',
			field: 'createtime',
			align: 'center',
			formatter: function(value, row, index) {
				return Mydao.formatDate(value, 'YYYY.MM.DD');
			}
		}, {
			title: '机构',
			field: 'orgname',
			align: 'center',
		}, {
			title: '监督检查报告',
			field: 'title',
			align: 'center',
			formatter: Mydao.nameFormatter,
			events: {
				'click a': _view
			}
		}, {
			title: '操作',
			align: 'center',
			formatter: function(value, row, index) {
				var ctrls = [];
				if(row.reportfile){
					//导出
					if(Mydao.permissions['JDYB_export']) {
						ctrls.push('export');
					}
				}
				
				//删除
				if(Mydao.permissions['JDYB_delete']) {
					ctrls.push('del');
				}
				return Mydao.operator(ctrls);
			},
			events: Mydao.operatorEvents({
				export: _export, //导出
				del: _delete, //删除
				view: _view, //查看
			})
		}]
	});
	//		查询
	$('#JianDuYueBao #CX_Btn').on('click', function(event) {
		$('#JianDuYueBao #jdyb_table').bootstrapTable("refreshOptions", {
			pageNumber: 1
		}).bootstrapTable("refresh");
	});
})();