	(function() {
		'use strict';

		$('#center_lzh #center #dimension').change(function() {
			var val = $(this).val(),
				year = $('#center_lzh #cyear1'),
				month = $('#center_lzh #cmonth1'),
				quarter = $('#center_lzh #cquarter'),
				week = $('#center_lzh #cweek1'),
				special = $('#center_lzh #cspecial1');
			var arr = [];
			arr.push(year, month, quarter, week, special);
			for(var i = 0; i < arr.length; i++) {
				arr[i].hide();
			}
			if(val == 1) {
				year.show();
			} else if(val == 2) {
				year.show();
				quarter.show();
			} else if(val == 4) {
				week.show();
			} else if(val == 5) {
				special.show();
			} else if(val == 3) {
				year.show();
				month.show();
			} else {
				for(var s = 0; s < arr.length; s++) {
					arr[s].find('input').val('');
					arr[s].find('select').val('');
					arr[s].hide();
				}
			}
		});

		//首页获取处室列表的方法
		var editer = {};
		var params = {
			clientid: 1,
		};
		var _selurl = 'centerPlan/findDepartment';
		Mydao.ajax(params, _selurl, function(data) {
			var currentTime = data.serverTime;
			if(data.code == 200) {
				var result = data.result;
				$('#center_lzh #cneterselect').append('<option value="">--请选择--</option>');
				$.each(result, function(index, val) {
					//只显示一级部门
					if(val.parentid == 1) {
						$('#center_lzh #cneterselect').append('<option value=' + val.id + '>' + val.name + '</option>');
					}
				});
			}
		});

		//新建和编辑页面获取处室列表
		var cneterselect = function() {
			Mydao.ajax(params, _selurl, function(data) {
				var currentTime = data.serverTime;
				if(data.code == 200) {
					var result = data.result;
					$('#hlj-central-s1').append('<option value="">--请选择--</option>');
					$.each(result, function(index, val) {
						//只显示一级部门
						if(val.parentid == 1) {
							$('[name="organizationid"]').append('<option value=' + val.id + '>' + val.name + '</option>');
						}

					});
				}
			});
		};
		//编辑
		var central_edit = function(e, value, row, index) {
			layer.open({
				type: 1,
				content: "",
				btn: ['保存', '取消'], //底部按钮
				btnAlign: 'c', //按钮居中
				title: '编辑中心计划',
				moveOut: true,
				area: ['70%', '90%'],
				success: function(layero, index) {
					layero.find("input").val("");
					layero.find('.layui-layer-content').load('view/CenterWork/centerNewBuilt.html', function() {
						cneterselect();
						//回填
						Mydao.ajax({
							"id": row.id
						}, "centerPlan/getCenterPlan", function(result) {
							var resultForm = result.result;
							if(resultForm.starttime)
								resultForm.planstarttime = resultForm.starttime;
							if(resultForm.endtime)
								resultForm.planendtime = resultForm.endtime;
							if(result.code == 200) {
								Mydao.initselect(layero, null, function() {
									Mydao.setform(layero, resultForm); //填充表单的值
								});
							}
						});
					});
				},
				yes: function(index, layero) {
					layero.find("form").trigger("validate");
					if(!layero.find("form").data("validator").isFormValid()) return false;
					//序列化数组
					var checkexpert = layero.find("form").serializeJson();
					checkexpert.id = row.id; //必须传的参数					
					//定义参数
					var flag = checkexpert.dimension;
					if(flag == 4 || flag == 5) { //周和专项
						var d1 = new Date(checkexpert.starttime.replace(/\-/g, "\/")),
							d2 = new Date(checkexpert.endtime.replace(/\-/g, "\/")),
							diff = parseInt((d2 - d1) / (1000 * 60 * 60 * 24));
						if(d1 > d2) {
							layer.alert("结束时间不能小于开始时间！");
							return false;
						}
						if(diff != 6) {
							layer.alert("周期的开始时间到结束时间请控制一周！");
							return false;
						}
					}
					Mydao.ajax(checkexpert, 'centerPlan/updatecenterPlan', function(result) {
						if(result.code == 200) {
							//	UE.getEditor('myEditor').destroy();
							layer.alert("操作成功！");
							//刷新页面
							$("#EnterpriseTable-zs").bootstrapTable("refresh");
							layer.close(index); //如果设定了yes回调，需进行手工关闭
						} else {
							layer.alert("操作失败！");
						}
					});
				},
				cancel: function(layero, index) {},
				btn2: function(index, layero) {}
			});
		};

		//新建
		$('#center_lzh').find('#savec').on('click', function(event) {
			$.get("view/CenterWork/centerNewBuilt.html", function(result) {
				layer.open({
					type: 1,
					content: result,
					btn: ['保存', '取消'], //底部按钮
					btnAlign: 'c', //按钮居中
					title: '新建中心计划',
					moveOut: true,
					area: ['70%', '90%'],
					success: function(layero, index) {
						cneterselect();
						layero.find("input").val("");
						layero.find("select").val("");
					},
					//确定按钮
					yes: function(index, layero) {
						layero.find("form").trigger("validate");
						if(!layero.find("form").data("validator").isFormValid()) return false;
						//序列化数组
						var checkexpert = layero.find("form").serializeJson();
						//定义参数
						var flag = checkexpert.dimension;
						if(flag == 4 || flag == 5) { //周和专项
							var d1 = new Date(checkexpert.starttime.replace(/\-/g, "\/")),
								d2 = new Date(checkexpert.endtime.replace(/\-/g, "\/")),
								diff = parseInt((d2 - d1) / (1000 * 60 * 60 * 24));
							if(d1 > d2) {
								layer.alert("结束时间不能小于开始时间！");
								return false;
							}
							if(diff != 6) {
								layer.alert("周期的开始时间到结束时间请控制一周！");
								return false;
							}
						}
						Mydao.ajax(checkexpert, 'centerPlan/insertcenterPlan', function(result) {
							var resultForm = result.result;
							if(result.code == 200) {
								layer.close(index); //如果设定了yes回调，需进行手工关闭
								layer.alert("操作成功！");
								//刷新页面
								layero.find("#EnterpriseTable-zs").bootstrapTable("refreshOptions", {
									pageNumber: 1
								}).bootstrapTable("refresh");
								layer.close(index);
							} else {
								layer.alert("操作失败！");
							}
						});
					},

					//					//取消按钮
					cancel: function(layero, index) {},
					btn2: function(index, layero) {}
				});
			});
		});

		//删除
		var central_del = function(e, value, row, index) {
			//弹框
			layer.open({
				title: '消息提示', //标题
				content: '确定要删除该计划吗？', //内容
				btn: ['确认', '取消'], //按钮
				btnAlign: 'c', //按钮居中
				success: function(layero, index) {

				},
				yes: function(index, layero) { //回调
					Mydao.ajax({
						"id": row.id
					}, 'centerPlan/deletecenterPlan', function(result) {
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						var currentTime = result.serverTime;
						if(result.code == 200) {
							layer.msg("操作成功！");
							//刷新页面
							$("#EnterpriseTable-zs").bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						} else {
							layer.alert("操作失败！");
						}

					});
				}
			});
		};
		//留言
		var central_message = function(e, value, row, index) {
			//弹框
			layer.open({
				type: 1,
				content: "",
				title: '留言',
				btn: ['取消'], //底部按钮
				btnAlign: 'c', //按钮居中
				area: ['70%', '90%'],
				success: function(layero, index) {
					layero.find("input").val("");
					layero.find('.layui-layer-content').load('view/CenterWork/CenterNewBuiltMessage.html', function() {
						$('#nametitle').html(row.name);
						$('#bumen').html(row.organizationname);
						if(row.dimension == 1) {
							$('#shijian').html(row.year + "年");
						} else if(row.dimension == 2) {
							$('#shijian').html(row.year + "年" + row.quarter + "季度");
						} else if(row.dimension == 3) {
							$('#shijian').html(row.year + "年" + row.month + "月");
						} else {
							var d = new Date();
							$('#shijian').html(Mydao.formatDate(row.starttime) + "至" + Mydao.formatDate(row.endtime));
						}
						var dims = ["待执行", "执行中", "已完成"];
						$('#zhuangtai').append(dims[row.state - 1]);
						//回填
						Mydao.ajax({
							"type": 1,
							"typeid": row.id,
						}, "planMessage/findplanMessage", function(result) {
							if(result.code == 200) {
								var liuyanTable = $('#liuyanTable'),
									format = "YYYY-MM-DD hh:mm";
								for(var i = 0; i < result.result.length; i++) {
									var CreTR = $('<tr  id="' + result.result[i].id + '"></tr>'),
										CreTDtime = $('<td width="180px">' + Mydao.formatDate(result.result[i].updatetime, format) + '</td>'),
										CreTDname = $('<td width="180px">' + result.result[i].username + '</td>'),
										CreTDliuyan = $("<td class='clear' style='word-wrap:break-word;word-break:break-all'></td>");
									if(Mydao.config.ajaxParams.base.userid != result.result[i].userid) {
										CreTDliuyan.html("<p class='tl w80'>" + result.result[i].content + "</p>");
									} else {
										CreTDliuyan.html("<p class='fl tl w80'>" + result.result[i].content + "</p>");
										var edit = $('<a class="dil mr10 edit" title="编辑"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>'),
											del = $('<a class="dil mr10 del" title="删除"><i class="fa fa-trash-o" aria-hidden="true"></i></a>'),
											confirm = $('<a class="dil mr10 confirm" title="确定" style="display:none"><i class="fa fa-lg fa-check-square" aria-hidden="true"></i></a>');
										CreTDliuyan.append($('<div class="fr tr w20 "></div>').append(edit, del, confirm));
										del.click(function() {
											var eles = $(this);
											layer.open({
												title: '消息提示', //标题
												content: '确定要删除该留言吗？', //内容
												btn: ['确认', '取消'], //按钮
												btnAlign: 'c', //按钮居中
												success: function(layero, index) {},
												yes: function(index, layero) { //回调
													var _id = eles.parents('tr');
													Mydao.ajax({
														"id": _id.attr('id')
													}, "planMessage/deleteplanMessage", function(result) {
														if(result.code == 200) {
															_id.remove();
															layer.msg('删除成功！');
														} else {
															layer.alert(result.msg);
														}
													});
												}
											});

										});
										edit.click(function() {
											if(liuyanTable.hasClass("intro")) {
												layer.alert('请先更新当前打开的留言');
											} else {
												liuyanTable.addClass('intro');
												var eles = $(this),
													_td = eles.parent().parent(),
													_content = _td.find('p').text();
												eles.hide().next().hide().next().show();
												_td.find('p').remove();
												$('<textarea  class="w80 fl layui-textarea"  data-rule="length[~150]">' + _content + '</textarea>').appendTo(_td);
											}
										});
										confirm.click(function() {
											var eles = $(this),
												_id = eles.parents('tr');
											Mydao.ajax({
												"id": _id.attr('id'),
												"content": _id.find('textarea').val()
											}, "planMessage/updateplanMessage", function(result) {
												if(result.code == 200) {
													var _td = eles.parent().parent(),
														_content = _td.find('textarea').val();
													if(_content.length > 150) {
														layer.msg('正在编辑的留言内容不能大于150个字符');
														return false;
													}
													_td.find('textarea').remove();
													eles.hide().prev().show().prev().show();
													$('<p class="w80 fl tl">' + _content + '</p>').appendTo(_td);
													liuyanTable.removeClass('intro');
													layer.msg('更新成功！');
												} else {
													layer.alert(result.msg);
												}
											});
										});
									}
									CreTR.append(CreTDtime, CreTDname, CreTDliuyan).appendTo(liuyanTable);
								}
								var d = new Date();
								var linestr = "";
								linestr += "<tr>";
								linestr += "<td id='date_show'>" + Mydao.formatDate(d, 'YYYY-MM-DD hh:mm') + "</td>";
								linestr += "<td>" + JSON.parse(sessionStorage.MYDAO_USER).username + "</td>";
								linestr += "<td><textarea id='liuyans'class='w90 fl layui-textarea' data-rule='length[~150]'/></textarea><div class='fr tr w10 '><a class='dil mr10 save' title='保存'><i class='fa fa-lg fa-floppy-o' aria-hidden='true'></i></a></div></td>";
								linestr += "</tr>";
								liuyanTable.append(linestr);
								$('.save').click(function() {
									if($("#liuyans").val().length > 150) {
										layer.msg('留言内容不能大于150个字符');
										return false;
									}
									var _content = $('#liuyans').val();
									if(_content.length > 0) {
										Mydao.ajax({
											"type": 1,
											"typeid": row.id,
											"content": _content,
										}, "planMessage/insertplanMessage", function(result) {
											if(result.code == 200) {

											} else {
												layer.alert(result.msg);
											}
										});
										layer.msg('保存成功');
									} else {
										layer.msg('保存成功');
									}
									layer.close(index);
								});
							}
						});
					});
				},
				cancel: function(layero, index) {},
			});
		};

		//查看
		var central_show = function(e, value, row, index) {
			layer.open({
				type: 1,
				content: "",
				btn: ['关闭'], //底部按钮
				btnAlign: 'c', //按钮居中
				title: '中心计划',
				area: ['80%', '90%'],
				moveOut: true,
				success: function(layero, index) {
					layero.find("input").val("");
					layero.find('.layui-layer-content').load('view/CenterWork/CenterNewBuiltCheck.html', function() {
						$('#nametitle').html(row.name);
						$('#bumen').html(row.organizationname);
						if(row.dimension == 1) {
							$('#shijian').html(row.year + "年");
						} else if(row.dimension == 2) {
							$('#shijian').html(row.year + "年" + row.quarter + "季度");
						} else if(row.dimension == 3) {
							$('#shijian').html(row.year + "年" + row.month + "月");
						} else {
							var d = new Date();
							$('#shijian').html(Mydao.formatDate(row.starttime) + "至" + Mydao.formatDate(row.endtime));
						}
						var dims = ["待执行", "执行中", "已完成"];
						$('#zhuangtai').append(dims[row.state - 1]);
						//回填
						Mydao.ajax({
							"type": 1,
							"typeid": row.id,
						}, "planMessage/findplanMessage", function(result) {
							if(result.code == 200) {
								var liuyanTable = $('#liuyanTable'),
									format = "YYYY-MM-DD hh:ss";
								for(var i = 0; i < result.result.length; i++) {
									var linestr = "";
									linestr += "<tr>";
									linestr += "<td width='180'>" + Mydao.formatDate(result.result[i].updatetime, format) + "</td>";
									linestr += "<td width='180'>" + result.result[i].username + "</td>";
									linestr += "<td class='tl' style='word-wrap:break-word;word-break:break-all'>" + result.result[i].content + "</td>";
									linestr += "</tr>";
									liuyanTable.append(linestr);
								}
								//								if(row.attachment == null) {
								//									$('#cerfujian').css({ 'text-align': 'center', 'font-weight': 'bold' }).text('无附件');
								//								} else {
								//									$('#cerfujian').append('<iframe src="' + MydaoFileShowPath + '?fileId=' + row.attachment + '"  frameborder="0" style="padding: 0px; width: 100%; min-height: 1000px;"></iframe>');
								//								}
							}
						});
					});
				},
				yes: function(index, layero) {
					layer.close(index);
				},
				cancel: function(layero, index) {},
				btn2: function(index, layero) {},
			});
		};

		//下载
		var central_download = function(e, value, row, index) {
			for(var i = 0; i < $('.download').length; i++) {
				$('.download')[i].href = MydaoFileDownPath + "?fileId=" + row.attachment;
				$('.download')[i].target = "_blank";
			}
		};
		var url = "centerPlan/findAllCenterPlan"; // 获取中心计划列表
		$('#center_lzh').find('#EnterpriseTable-zs').bootstrapTable({
			pagination: true, //是否分页
			sidePagination: 'server', //设置在哪里进行分页，可选值为 'client' 或者 'server'。设置 'server'时，必须设置 服务器数据地址（url）或者重写ajax方法
			queryParamsType: "undefined", //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  //设置为limit可以获取limit, offset, search, sort, order  
			method: 'post',
			pageNumber: 1,
			url: Mydao.config.path + url,
			cache: true, //禁用缓存
			search: false, //禁用查询
			striped: true, //隔行变色
			uniqueId: "id", //唯一标识,
			//responseHandler：加载服务器数据之前的处理程序，可以用来格式化数据。参数：res为从服务器请求到的数据。
			responseHandler: function(res) { //设置返回数据
				if(res.code == 200) {
					return res.result;
				}
			},
			//提交ajax请求时的附加参数，可用参数列请查看http://api.jquery.com/jQuery.ajax
			ajaxOptions: {
				ContentType: 'application/json',
				dataType: 'json'
			},
			//queryParams请求服务器数据时，你可以通过重写参数的方式添加一些额外的参数，例如 toolbar 中的参数 如果 queryParamsType = 'limit' ,返回参数必须包含limit, offset, search, sort, order 否则, 需要包含: pageSize, pageNumber, searchText, sortName, sortOrder. 返回false将会终止请求				
			queryParams: function(p) {
				Mydao.config.ajaxParams.params = {}; //分页mydao-init.js
				Mydao.config.ajaxParams.page.orderField = 'cp.createtime'; //定义排序列,通过url方式获取数据填写字段名，否则填写下标
				Mydao.config.ajaxParams.page.pageSize = p.pageSize; //如果设置了分页，页面数据条数，默认10
				Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber; //如果设置了分页，首页页码，默认1
				Mydao.config.ajaxParams.page.orderDirection = 'desc'; //定义排序方式 'asc' 或者 'desc'，默认 'asc'
				Mydao.config.ajaxParams.params.organizationid = $('#cneterselect').val();
				Mydao.config.ajaxParams.params.state = $('#state').val();
				Mydao.config.ajaxParams.params.dimension = $('#dimension').val();
				Mydao.config.ajaxParams.params.year = $('#year').val();
				Mydao.config.ajaxParams.params.quarter = $('#quarter-m').val();
				Mydao.config.ajaxParams.params.month = $('#month-m').val();
				if($('#center_lzh #cweek1').is(':visible')) {
					Mydao.config.ajaxParams.params.starttime = $('#center_lzh #weekstarttime').val();
					Mydao.config.ajaxParams.params.endtime = $('#center_lzh #weekendtime').val();
				} else {
					Mydao.config.ajaxParams.params.starttime = $('#center_lzh #specialstarttime1').val();
					Mydao.config.ajaxParams.params.endtime = $('#center_lzh #specialendtime1').val();
				}
				return Mydao.config.ajaxParams;
			},
			columns: [{
				title: '部门',
				field: 'organizationname',
				align: 'center',
				valign: 'middle'
			}, {
				title: '类型',
				field: 'dimension',
				align: 'center',
				valign: 'middle',
				formatter: function(value, row, index) {
					var dims = ["年度", "季度", "月度", "周", "专项"];
					return dims[value - 1];
				}
			}, {
				title: '时间',
				align: 'center',
				valign: 'middle',
				formatter: function(value, row, index) {
					if(row.dimension == 1) {
						return row.year + "年";
					} else if(row.dimension == 2) {
						return row.year + "年" + row.quarter + "季度";
					} else if(row.dimension == 3) {
						return row.year + "年" + row.month + "月";
					} else {
						var d = new Date();
						return Mydao.formatDate(row.starttime) + "至" + Mydao.formatDate(row.endtime);
					}
				}

			}, {
				title: '名称',
				field: 'name',
				align: 'center',
				valign: 'middle',
				formatter: Mydao.nameFormatter,
				events: {
					'click a': central_show
				}
			}, {
				title: '创建人',
				field: 'createusername',
				align: 'center',
				valign: 'middle'
			}, {
				title: '编辑时间',
				field: 'updatetime',
				formatter: function(value, row, index) {
					return Mydao.formatDate(value, "YYYY-MM-DD hh:mm:ss");
				},
				//events: Mydao.operatorEvents({}),
				align: 'center',
				valign: 'middle'
			}, {
				title: '状态',
				field: 'state',
				align: 'center',
				valign: 'middle',
				formatter: function(value, row, index) {
					var dims = [];
					dims = ["待执行", "执行中", "已完成"];
					return dims[value - 1];
				}
			}, {
				title: '操作',
				align: 'center',
				formatter: function(value, row, index) {
					var ctrls = [];
					if(Mydao.permissions['central_message']) {
						ctrls.push('message');
					}
					if(Mydao.permissions['central_download']) {
						if(row.attachment != null) {
							ctrls.push('download');
						}
					}
					if(Mydao.permissions['centerplan_edit']) {
						ctrls.push('edit');
					}
					if(Mydao.permissions['centerplan_del']) {
						ctrls.push('del');
					}
					return Mydao.operator(ctrls);
				},
				events: Mydao.operatorEvents({
					edit: central_edit, //编辑的函数
					del: central_del, //删除的函数
					view: central_show,
					message: central_message,
					download: central_download
				})
			}]
		});

		//查询
		$('#center_lzh').find('#searchc').on('click', function(event) {
			$("#EnterpriseTable-zs").bootstrapTable("refreshOptions", {
				pageNumber: 1
			}).bootstrapTable("refresh");
		});
	})();