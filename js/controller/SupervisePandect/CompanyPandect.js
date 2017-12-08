/*
 * 单位总览
 * 2017 - 7 - 5 by li
 * 
 */
$(function() {
	'use strict';
	//	先计算一下高度
	//	$('#companyPandect').find('.companyPandect_bottom').css('height', $('.companyPandect_bottom').parent().height() - $('.companyPandect_bottom').prev().outerHeight(true));
	//计算一下右侧栏目的宽度
	$('#companyPandect').find('.companyPandect_bottom .module-right-box').css('width', $('.companyPandect_bottom .module-right-box').parent().width() - $('.companyPandect_bottom .module-right-box').prev().outerWidth(true) - 20);

	//	左侧单位列表
	var _url = 'organization/findTotalJSDW';
	$('#companyPandect').find('#companyPandect_tree').bootstrapTable({
		method: 'post',
		url: Mydao.config.path + _url,
		cache: true, //禁用缓存
		search: true, //禁用查询
		striped: true, //隔行变色
		uniqueId: "id", //唯一标识,
		showHeader: false,
		searchAlign: 'left',
		clickToSelect: true,
		checkboxHeader: true,
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
			Mydao.config.ajaxParamsNoPage.params = {};
			Mydao.config.ajaxParamsNoPage.params.finish = $('#companyPandect').find('[name="finish2"]:checked').val();
			return Mydao.config.ajaxParamsNoPage;
		},
		columns: [
			//		{
			//				radio: true
			//			},
			{
				formatter: function(val, row, index) {
					return index + 1;
				}
			},
			{
				field: 'name',
				formatter: function(val, row, index) {
					return '<a >' + val + '</a>';
				}
			}
		],
		onLoadSuccess: function(data) {
			if($('.companyPandect_bottom .bootstrap-table').find('.fixed-table-toolbar .pull-right')){
				$('.companyPandect_bottom .bootstrap-table').find('.fixed-table-toolbar .pull-right').remove()
			}
			$('.companyPandect_bottom .bootstrap-table').find('.pull-left.search input[type="text"]').attr('placeholder', '请输入单位名称');
			$('.companyPandect_bottom .bootstrap-table').find('#companyPandect_tree input[type="radio"]').attr('name', 'companyPandect');
			$('.companyPandect_bottom .bootstrap-table').find('#companyPandect_tree tbody tr:first').addClass('success');

			$('.companyPandect_bottom .bootstrap-table').find('.fixed-table-toolbar').append('<div class="pull-right mt10 "><button type="button" id="companyPandect_daochu" class="btn btn-primary ml15">导出</button></div>')

			var rowid = $('.companyPandect_bottom .bootstrap-table').find('#companyPandect_tree tbody tr:first').attr('data-uniqueid'),
				rowname = $('.companyPandect_bottom .bootstrap-table').find('#companyPandect_tree tbody tr:first').find('a').text();
			//表格加载完之后，在计算下宽度
			$('#companyPandect').find('.companyPandect_bottom .module-right-box').css('width', $('.companyPandect_bottom .module-right-box').parent().width() - $('.companyPandect_bottom .module-right-box').prev().outerWidth(true) - 20);
			projectData(rowid, rowname);

			//导出
			$('#companyPandect_daochu').click(function(e) {
				window.location.href = MyDaoRequestPath + "/RailWayInvoker/project/exportByOrg?finish=" + $('#companyPandect').find('[name="finish2"]:checked').val();
			});
		},
		onClickRow: function(row) {
			if(row.id) {
				projectData(row.id, row.name);
			}
		}
	});

	$('#companyPandect').find('#companyPandect_tree').on('click-row.bs.table', function(e, row, $element) {
		$('#companyPandect').find('#companyPandect_tree').find('.success').removeClass('success');
		$($element).addClass('success');
	});

	var projectBox = $('#companyPandect .companyPandect_bottom').find('.module-right-box'); //容器

	function projectData(rowid, rowname) {
		projectBox.html('');
		if(rowid) {
			Mydao.ajaxNoPage({
				'organizationid': rowid,
				'finish': $('#companyPandect').find('[name="finish2"]:checked').val()
			}, 'organization/findTotalProject', function(data) {
				if(data.code == 200) {
					var _str = '<div class="module-line-box">';
					if(data.result.length != 0) {
						_str += '<div class="module-line-box clear"><div class="fl"><span>' + rowname + '</span> > <span>承建项目（' + data.result.length + '个）</span></div>';
						_str += '<div class="fr"></div>';
						_str += '</div>';
						for(var i = 0; i < data.result.length; i++) {
							_str += '<div class="panel-group" ><div class="panel panel-default">';
							_str += '<div class="panel-heading ">';
							_str += '<div class="panel-title row  clear">';
							_str += '<div class="fl ml10"><a class="showProjectBtn" data-projectid="' + data.result[i].id + '"><i class="fa fa-sitemap mr5"></i>' + data.result[i].name + '</a></div>';
							_str += '<div class="fl ml30">总投资 丨 ' + data.result[i].investment + '万元</div>';
							_str += '<div class="fl ml30">建设工期 丨 ' + data.result[i].schedule + '个月</div>';
							_str += '<div class="fl ml30">线路长度 丨 ' + data.result[i].length + 'km</div>';
							_str += '<div class="mr10 tr project_btn" data-index="projectid_' + i + '"; data-projectid="' + data.result[i].id + '"><span class="fa fa-caret-down fa-lg" ></span></div>';
							_str += '</div>';
							_str += '</div>';
							_str += '<div class="panel-collapse collapse " id="projectid_' + i + '">';
							_str += '<div class="panel-body">';
							_str += '<table></table>';
							_str += '</div>';
							_str += '</div>';
							_str += '</div></div>';
						}
					} else {
						_str += '<p class="tc">无记录</p>';
					}
					_str += '</div>';
					projectBox.append(_str);
				} else {
					layer.msg(data.msg);
				}
			}, false);

			//项目查看
			$(projectBox).find('.showProjectBtn').on('click', function(e) {
				showproject($(this).attr('data-projectid'));
			});

			if($(projectBox).find('#projectid_0')) { // 默认显示第一条
				var _this = $(projectBox).find('#projectid_0'),
					_projectid = $(projectBox).find('[data-index="projectid_0"]');
				_projectid.find('span').toggleClass(' fa-flip-vertical');
				_this.addClass('in');
				Mydao.ajaxNoPage({
					'projectid': _projectid.attr('data-projectid')
				}, 'organization/findOrgByProject', function(data) {
					if(data.code == 200) {
						var result = data.result;
						var sectionid = null,
							sectionname = null,
							sgdw = [],
							sjdw = [],
							jldw = [],
							all = [];
						for(var i = 0; i < result.length; i++) {
							if(sectionid == null) {
								sectionid = result[i].sid;
								sectionname = result[i].sname;
							}
							if(sectionid != null && sectionid != result[i].sid) {
								var temp = {};
								temp.sectionid = sectionid;
								temp.sectionname = sectionname;
								temp.sgdw = sgdw;
								temp.sjdw = sjdw;
								temp.jldw = jldw;
								all.push(temp);
								sectionid = result[i].sid;
								sectionname = result[i].sname;
								sgdw = [];
								sjdw = [];
								jldw = [];
							}
							switch(result[i].tcode) {
								case "SGDW":
									sgdw.push({
										'id': result[i].oid,
										'name': result[i].oname
									});
									break;
								case "SJDW":
									sjdw.push({
										'id': result[i].oid,
										'name': result[i].oname
									});
									break;
								default:
									jldw.push({
										'id': result[i].oid,
										'name': result[i].oname
									});
									break;
							}
							if(i == result.length - 1) {
								var temp2 = {};
								temp2.sectionid = sectionid;
								temp2.sectionname = sectionname;
								temp2.sgdw = sgdw;
								temp2.sjdw = sjdw;
								temp2.jldw = jldw;
								all.push(temp2);
							}
						}

						var datares = [];
						$.each(all, function(a, b) {
							var length = b.sgdw.length;
							if(b.sjdw.length > length) {
								length = b.sjdw.length;
							}
							if(b.jldw.length > length) {
								length = b.jldw.length;
							}
							for(var i = 0; i < length; i++) {
								var row = {};
								row.sectionid = b.sectionid;
								row.sectionname = b.sectionname;
								if(i == 0) {
									row.merge = length;
								}
								if(b.sjdw.length > i) {
									row.sjdwid = b.sjdw[i].id;
									row.sjdwname = b.sjdw[i].name;
								} else {
									row.sjdwid = '';
									row.sjdwname = '';
								}
								if(b.sgdw.length > i) {
									row.sgdwid = b.sgdw[i].id;
									row.sgdwname = b.sgdw[i].name;
								} else {
									row.sgdwid = '';
									row.sgdwname = '';
								}
								if(b.jldw.length > i) {
									row.jldwid = b.jldw[i].id;
									row.jldwname = b.jldw[i].name;
								} else {
									row.jldwid = '';
									row.jldwname = '';
								}
								datares.push(row);
							}
						});
						_this.find('table').bootstrapTable({
							data: datares,
							striped: true, //隔行变色
							uniqueId: "id", //唯一标识,
							ajaxOptions: {
								ContentType: 'application/json',
								dataType: 'json'
							},
							columns: [{
									title: '序号',
									align: 'center',
									formatter: function(val, row, index) {
										return index + 1;
									},
								},
								{
									title: '施工标段',
									align: 'center',
									valign: 'middle',
									formatter: function(val, row, index) {
										if(row.sectionname) {
											return row.sectionname;
										}
									},
								},
								{
									title: '施工单位',
									align: 'center',
									formatter: function(val, row, index) {
										if(row.sgdwname) {
											return Mydao.nameFormatter(row.sgdwname);
										}
									},
									events: {
										'click a': showSectionSG
									}
								},
								{
									title: '设计单位',
									align: 'center',
									formatter: function(val, row, index) {
										if(row.sjdwname) {
											return Mydao.nameFormatter(row.sjdwname);
										}
									},
									events: {
										'click a': showSectionSJ
									}
								},

								{
									title: '监理单位',
									align: 'center',
									formatter: function(val, row, index) {
										if(row.jldwname) {
											return Mydao.nameFormatter(row.jldwname);
										}
									},
									events: {
										'click a': showSectionJL
									}
								}
							]
						});

						//							for(var s = 0; s < datares.length; s++) { // 合并单元格
						//								if(datares[s].merge) {
						//									$("#" + _data.index).find('table').bootstrapTable('mergeCells', {
						//										index: s,
						//										field: 'sectionname',
						//										rowspan: datares[s].merge
						//									});
						//								}
						//							}

					} else {
						layer.msg(data.msg);
					}
				}, false);

			}
			//btn 切换
			$(projectBox).find('.project_btn').on('click', function(e) {
				var _this = $(this),
					_data = _this.data();
				_this.find('span').toggleClass(' fa-flip-vertical');
				$("#" + _data.index).toggleClass('in');
				if($("#" + _data.index).hasClass('in')) {
					Mydao.ajaxNoPage({
						'projectid': _data.projectid
					}, 'organization/findOrgByProject', function(data) {
						if(data.code == 200) {
							var result = data.result;
							var sectionid = null,
								sectionname = null,
								sgdw = [],
								sjdw = [],
								jldw = [],
								all = [];
							for(var i = 0; i < result.length; i++) {
								if(sectionid == null) {
									sectionid = result[i].sid;
									sectionname = result[i].sname;
								}
								if(sectionid != null && sectionid != result[i].sid) {
									var temp = {};
									temp.sectionid = sectionid;
									temp.sectionname = sectionname;
									temp.sgdw = sgdw;
									temp.sjdw = sjdw;
									temp.jldw = jldw;
									all.push(temp);
									sectionid = result[i].sid;
									sectionname = result[i].sname;
									sgdw = [];
									sjdw = [];
									jldw = [];
								}
								switch(result[i].tcode) {
									case "SGDW":
										sgdw.push({
											'id': result[i].oid,
											'name': result[i].oname
										});
										break;
									case "SJDW":
										sjdw.push({
											'id': result[i].oid,
											'name': result[i].oname
										});
										break;
									default:
										jldw.push({
											'id': result[i].oid,
											'name': result[i].oname
										});
										break;
								}
								if(i == result.length - 1) {
									var temp2 = {};
									temp2.sectionid = sectionid;
									temp2.sectionname = sectionname;
									temp2.sgdw = sgdw;
									temp2.sjdw = sjdw;
									temp2.jldw = jldw;
									all.push(temp2);
								}
							}

							var datares = [];
							$.each(all, function(a, b) {
								var length = b.sgdw.length;
								if(b.sjdw.length > length) {
									length = b.sjdw.length;
								}
								if(b.jldw.length > length) {
									length = b.jldw.length;
								}
								for(var i = 0; i < length; i++) {
									var row = {};
									row.sectionid = b.sectionid;
									row.sectionname = b.sectionname;
									if(i == 0) {
										row.merge = length;
									}
									if(b.sjdw.length > i) {
										row.sjdwid = b.sjdw[i].id;
										row.sjdwname = b.sjdw[i].name;
									} else {
										row.sjdwid = '';
										row.sjdwname = '';
									}
									if(b.sgdw.length > i) {
										row.sgdwid = b.sgdw[i].id;
										row.sgdwname = b.sgdw[i].name;
									} else {
										row.sgdwid = '';
										row.sgdwname = '';
									}
									if(b.jldw.length > i) {
										row.jldwid = b.jldw[i].id;
										row.jldwname = b.jldw[i].name;
									} else {
										row.jldwid = '';
										row.jldwname = '';
									}
									datares.push(row);
								}
							});
							$("#" + _data.index).find('table').bootstrapTable({
								data: datares,
								striped: true, //隔行变色
								uniqueId: "id", //唯一标识,
								ajaxOptions: {
									ContentType: 'application/json',
									dataType: 'json'
								},
								columns: [{
										title: '序号',
										align: 'center',
										formatter: function(val, row, index) {
											return index + 1;
										},
									},
									{
										title: '施工标段',
										align: 'center',
										valign: 'middle',
										formatter: function(val, row, index) {
											if(row.sectionname) {
												return row.sectionname;
											}
										},
									},
									{
										title: '施工单位',
										align: 'center',
										formatter: function(val, row, index) {
											if(row.sgdwname) {
												return Mydao.nameFormatter(row.sgdwname);
											}
										},
										events: {
											'click a': showSectionSG
										}
									},
									{
										title: '设计单位',
										align: 'center',
										formatter: function(val, row, index) {
											if(row.sjdwname) {
												return Mydao.nameFormatter(row.sjdwname);
											}
										},
										events: {
											'click a': showSectionSJ
										}
									},

									{
										title: '监理单位',
										align: 'center',
										formatter: function(val, row, index) {
											if(row.jldwname) {
												return Mydao.nameFormatter(row.jldwname);
											}
										},
										events: {
											'click a': showSectionJL
										}
									}
								]
							});

							//							for(var s = 0; s < datares.length; s++) { // 合并单元格
							//								if(datares[s].merge) {
							//									$("#" + _data.index).find('table').bootstrapTable('mergeCells', {
							//										index: s,
							//										field: 'sectionname',
							//										rowspan: datares[s].merge
							//									});
							//								}
							//							}

						} else {
							layer.msg(data.msg);
						}
					}, false);
				}
			}); // 切换结束

		}
	}

	//			查看项目
	var showproject = function(rowid) {
		Mydao.ajax({
			"id": rowid
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
										//										field: 'bidunitname',
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
				"orderField": "",
				"orderDirection": ""
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
								align: 'center'
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

	//			查看项目end
	var showSectionSJ = function(e, value, row, index) {
		showSection(row.sjdwid);
	};
	var showSectionSG = function(e, value, row, index) {
		showSection(row.sgdwid);
	};
	var showSectionJL = function(e, value, row, index) {
		showSection(row.jldwid);
	};

	function showSection(e) { //查看单位
		Mydao.ajax({
			orgid: e
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
										for(var j = 0; j < identityback_array.length; j++) {
											$('#identityfront').append("<img src='" + MydaoFileDownPath + "?fileId=" + identityback_array[j] + "' width='100px'/>");
										}
									}
									var licensefront;
									d.traffic ? licensefront = d.traffic.licensefront : '';
									if(licensefront) {
										var licensefront_array = licensefront.split(",");
										for(var q = 0; q < licensefront_array.length; q++) {
											$('#licensefront').append("<img src='" + MydaoFileDownPath + "?fileId=" + licensefront_array[q] + "' width='100px'/>");
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

								$('#Org_penalty_record_boxs').show();
								Mydao.config.ajaxParams.page = {
									"pageCurrent": 1,
									"pageSize": 10000,
									"orderField": "",
									"orderDirection": ""
								};
								Mydao.ajax({
									'punishedunits': e
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

	}

	$('#companyPandect').find('[name="finish2"]').change(function() {
		$('#companyPandect #companyPandect_tree').bootstrapTable("refreshOptions", {
			pageNumber: 1
		}).bootstrapTable("refresh");
		$(projectBox).html('<p class="text-center">请先选择左侧单位.</p>');
	});

});