	(function() {
		'use strict';
		$('#supervise_lzh #supervise #dimension').change(function() {
			var val = $(this).val(),
				year = $('#supervise_lzh #cyear1'),
				month = $('#supervise_lzh #cmonth1'),
				quarter = $('#supervise_lzh #cquarter'),
				special = $('#supervise_lzh #cspecial1');
			var arr = [];
			arr.push(year, month, quarter, special);
			for(var i = 0; i < arr.length; i++) {
				arr[i].hide();
			}
			if(val == 1) {
				year.show();
			} else if(val == 3) {
				year.show();
				quarter.show();
			} else if(val == 2) {
				year.show();
				month.show();
			} else if(val == 4) {
				special.show();
			} else {
				for(var j = 0; j < arr.length; j++) {
					arr[j].find('select').val('');
					arr[j].find('input').val('');
					arr[j].hide();
				}
			}
		});

		//获取部门
		var params = {
			clientid: 1,
		};
		var _selurl = 'centerPlan/findDepartment';
		Mydao.ajax(params, _selurl, function(data) {
			var currentTime = data.serverTime;
			if(data.code == 200) {
				var result = data.result;
				$('#supervise_lzh #cneterselect222').append('<option value="">--请选择--</option>');
				$.each(result, function(index, val) {
					//只显示一级部门
					if(val.parentid == 1) {
						$('#supervise_lzh #cneterselect222').append('<option value=' + val.id + '>' + val.name + '</option>');
					}
				});
			}
		});
		//新建和编辑页面获取部门列表
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
		//新建
		$('#supervise_lzh').find('#savej').on('click', function(event) {
			$.get("view/CenterWork/monewBuilt.html", function(result) {
				layer.open({
					type: 1,
					content: result,
					btn: ['保存', '取消'], //底部按钮
					btnAlign: 'c', //按钮居中
					title: '新建监督计划',
					area: ['70%', '90%'],
					moveOut: true,
					success: function(layero, index) {
						cneterselect();
					},
					//确定按钮
					yes: function(index, layero) {
						layero.find("form").trigger("validate");
						if(!layero.find("form").data("validator").isFormValid()) return false;
						//序列化数组
						var checkexpert = layero.find("form").serializeJson();
						//定义参数
						var flag = checkexpert.dimension;
						if(flag == 4) {
							var d1 = new Date(checkexpert.starttime.replace(/\-/g, "\/")),
								d2 = new Date(checkexpert.endtime.replace(/\-/g, "\/"));
							if(d1 > d2) {
								layer.alert("结束时间不能小于开始时间！");
								return false;
							}
						}
						Mydao.ajax(checkexpert, 'supervisePlan/add', function(result) {
							var resultForm = result.result;
							if(result.code == 200) {
								layer.close(index); //如果设定了yes回调，需进行手工关闭
								layer.alert("操作成功！");
								//刷新页面
								$("#EnterpriseTable-jd").bootstrapTable("refreshOptions", {
									pageNumber: 1
								}).bootstrapTable("refresh");
								layer.close(index);
							} else {
								layer.alert("操作失败！");
							}
						});
					},
					//取消按钮
					cancel: function(layero, index) {},
					btn2: function(index, layero) {}
				});
			});
		});
		//编辑
		var mo_edit = function(e, value, row, index) {
			layer.open({
				type: 1,
				content: "",
				btn: ['保存', '取消'], //底部按钮
				btnAlign: 'c', //按钮居中
				title: '编辑监督计划',
				area: ['70%', '90%'],
				success: function(layero, index) {
					layero.find('.layui-layer-content').load('view/CenterWork/monewBuilt.html', function() {
						cneterselect();
						Mydao.initselect(null, null, function() {
							Mydao.ajax({
								"id": row.id
							}, "supervisePlan/show", function(result) {
								var resultForm = result.result;
								if(result.code == 200) {
									Mydao.setform(layero, resultForm, function() {
										var flag = resultForm.dimension;
										if(flag == 1) {
											$("#year").val(resultForm.year);
										} else if(flag == 2) {
											$("#month-y").val(resultForm.year);
											$("#month-m").val(resultForm.month);
										} else if(flag == 3) {
											$("#quarter-y").val(resultForm.year);
											$("#quarter-m").val(resultForm.quarter);
										} else {
											$("#specialstarttime").val(resultForm.starttime);
											$("#specialendtime").val(resultForm.endtime);
										}

									});
								}
							});

						});

					});
				},
				//确定按钮
				yes: function(index, layero) {
					layero.find("form").trigger("validate");
					if(!layero.find("form").data("validator").isFormValid()) {
						return false;
					}
					//序列化数组
					var checkexpert = layero.find("form").serializeJson();
					//定义参数
					var flag = checkexpert.dimension;
					if(flag == 4) {
						var d1 = new Date(checkexpert.starttime.replace(/\-/g, "\/")),
							d2 = new Date(checkexpert.endtime.replace(/\-/g, "\/"));
						if(d1 > d2) {
							layer.alert("结束时间不能小于开始时间！");
							return false;
						}
					}
					checkexpert.id = row.id;
					Mydao.ajax(checkexpert, 'supervisePlan/edit', function(result) {
						var resultForm = result.result;
						if(result.code == 200) {
							layero.find("input").val("");
							layer.close(index); //如果设定了yes回调，需进行手工关闭
							layer.alert("操作成功！");
							//刷新页面
							$("#EnterpriseTable-jd").bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						} else {
							layer.msg(result.msg);
						}
					});
				},
				//取消按钮
				cancel: function(layero, index) {},
				btn2: function(index, layero) {}
			});

		};
		var mo_show = function(e, value, row, index) {
			layer.open({
				type: 1,
				content: "",
				btn: ['关闭'], //底部按钮
				btnAlign: 'c', //按钮居中
				title: '监督计划',
				area: ['80%', '90%'],
				moveOut: true,
				success: function(layero, index) {
					layero.find('.layui-layer-content').load('view/CenterWork/monewBuiltCheck.html', function() {
						$('#nametitle').html(row.name);
						$('#bumen').html(row.organizationname);
						if(row.dimension == 1) {
							$('#shijian').html(row.year + "年");
						} else if(row.dimension == 2) {
							$('#shijian').html(row.year + "年" + row.month + "月");
						} else if(row.dimension == 3) {
							$('#shijian').html(row.year + "年" + row.quarter + "季度");
						} else {
							var d = new Date();
							$('#shijian').html(Mydao.formatDate(row.starttime) + "至" + Mydao.formatDate(row.endtime));
						}
						//回填
						Mydao.ajax({
							"type": 2,
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
								//									$('#cerfujian').append('<iframe src="' + MydaoFileShowPath + '?fileId=' + row.attachment + '"  frameborder="0" style="padding: 0px; width: 100%; min-height: 1000px"></iframe>');
								//								}
							}
						});
					});
				},
				yes: function(index, layero) {
					layer.close(index);
				},
				cancel: function(layero, index) {},
			});
		};
		//删除
		var mo_del = function(e, value, row, index) {
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
					}, 'supervisePlan/delete', function(result) {
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						var currentTime = result.serverTime;
						if(result.code == 200) {
							layer.alert("操作成功！");
							//刷新页面
							$("#EnterpriseTable-jd").bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						} else {
							layer.alert(result.msg);
						}

					});
				}
			});

		};

		//留言
		var mo_message = function(e, value, row, index) {
			//弹框
			layer.open({
				type: 1,
				content: "",
				title: '留言',
				btn: ['取消'], //底部按钮
				btnAlign: 'c', //按钮居中
				area: ['70%', '90%'],
				moveOut: true,
				success: function(layero, index) {
					layero.find("input").val("");
					layero.find('.layui-layer-content').load('view/CenterWork/monewBuiltMessage.html', function() {
						$('#nametitle').html(row.name);
						$('#bumen').html(row.organizationname);
						if(row.dimension == 1) {
							$('#shijian').html(row.year + "年");
						} else if(row.dimension == 2) {
							$('#shijian').html(row.year + "年" + row.month + "月");
						} else if(row.dimension == 3) {
							$('#shijian').html(row.year + "年" + row.quarter + "季度");
						} else {
							var d = new Date();
							$('#shijian').html(Mydao.formatDate(row.starttime) + "至" + Mydao.formatDate(row.endtime));
						}
						var dims = ["待执行", "执行中", "已完成"];
						$('#zhuangtai').append(dims[row.state - 1]);
						//回填
						Mydao.ajax({
							"type": 2,
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
										CreTDliuyan.html("<p class='w80 tl'>" + result.result[i].content + "</p>");
									} else {
										CreTDliuyan.html("<p class='w80 fl tl'>" + result.result[i].content + "</p>");
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
												$('<textarea  class="w80 fl layui-textarea">' + _content + '</textarea>').appendTo(_td);
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
								linestr += "<td>" + Mydao.formatDate(d, 'YYYY-MM-DD hh:mm') + "</td>";
								linestr += "<td>" + JSON.parse(sessionStorage.MYDAO_USER).username + "</td>";
								linestr += "<td><textarea id='liuyans'class='w90 fl layui-textarea' data-rule='length[~150];'/></textarea><div class='fr tr w10 '><a class='dil mr10 save' title='保存'><i class='fa fa-lg fa-floppy-o' aria-hidden='true'></i></a></div></td>";
								linestr += "</tr>";
								liuyanTable.append(linestr);
								$('.save').click(function() {
									if($("#liuyans").val().length >= 150) {
										layer.msg('留言内容不能大于150个字符');
										return false;
									}
									var _content = $('#liuyans').val();
									if(_content.length > 0) {
										Mydao.ajax({
											"type": 2,
											"typeid": row.id,
											"content": _content,
										}, "planMessage/insertplanMessage", function(result) {
											if(result.code == 200) {
												layer.msg('保存成功');
											} else {
												layer.alert(result.msg);
											}
										});
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

		//下载
		var mo_download = function(e, value, row, index) {
			for(var i = 0; i < $('.download').length; i++) {
				$('.download')[i].href = MydaoFileDownPath + "?fileId=" + row.attachment;
				$('.download')[i].target = "_blank";
			}
		};
		var url = "supervisePlan/list"; //监督计划列表
		$('#supervise_lzh').find('#EnterpriseTable-jd').bootstrapTable({
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
			responseHandler: function(res) { //设置返回数据
				if(res.code == 200) {
					return res.result;
				}
			},
			//responseHandler：加载服务器数据之前的处理程序，可以用来格式化数据。参数：res为从服务器请求到的数据。
			ajaxOptions: {
				ContentType: 'application/json',
				dataType: 'json'
			}, //提交ajax请求时的附加参数，可用参数列请查看http://api.jquery.com/jQuery.ajax
			queryParams: function(p) {
				Mydao.config.ajaxParams.params = {}; //queryParams请求服务器数据时，你可以通过重写参数的方式添加一些额外的参数，例如 toolbar 中的参数 如果 queryParamsType = 'limit' ,返回参数必须包含limit, offset, search, sort, order 否则, 需要包含: pageSize, pageNumber, searchText, sortName, sortOrder. 返回false将会终止请求
				//分页mydao-init.js
				Mydao.config.ajaxParams.page.orderField = 'cp.createtime'; //定义排序列,通过url方式获取数据填写字段名，否则填写下标
				Mydao.config.ajaxParams.page.pageSize = p.pageSize; //如果设置了分页，页面数据条数，默认10
				Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber; //如果设置了分页，首页页码，默认1
				Mydao.config.ajaxParams.page.orderDirection = 'desc'; //定义排序方式 'asc' 或者 'desc'，默认 'asc'
				Mydao.config.ajaxParams.params.organizationid = $('#cneterselect').val();
				Mydao.config.ajaxParams.params.dimension = $('#dimension').val();
				Mydao.config.ajaxParams.params.year = $('#year').val();
				Mydao.config.ajaxParams.params.quarter = $('#quarter-m').val();
				Mydao.config.ajaxParams.params.month = $('#month-m').val();
				//				Mydao.config.ajaxParams.params.specialstarttime1 = $('#specialstarttime1').val();
				//				Mydao.config.ajaxParams.params.specialendtime1 = $('#specialendtime1').val();				
				Mydao.config.ajaxParams.params.starttime = $('#specialstarttime1').val();
				Mydao.config.ajaxParams.params.endtime = $('#specialendtime1').val();
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
					var dims = ["年度", "月度", "季度", "专项"];
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
						return row.year + "年" + row.month + "月";
					} else if(row.dimension == 3) {
						return row.year + "年" + row.quarter + "季度";
					} else {
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
					'click a': mo_show
				}
			}, {
				title: '创建人',
				field: 'createusername',
				align: 'center',
				valign: 'middle'
			}, {
				title: '编辑时间',
				field: 'createtime',
				formatter: function(value, row, index) {
					return Mydao.formatDate(value, "YYYY-MM-DD");
				},
				events: Mydao.operatorEvents({}),
				align: 'center',
				valign: 'middle'
			}, {
				title: '操作',
				align: 'center',
				formatter: function(value, row, index) {
					var ctrls = [];

					if(Mydao.permissions['superviseplan_message']) {
						ctrls.push('message');
					}
					if(Mydao.permissions['superviseplan_download']) {
						if(row.attachment != null) {
							ctrls.push('download');
						}
					}
					if(Mydao.permissions['superviseplan_edit']) {
						ctrls.push('edit');
					}
					if(Mydao.permissions['superviseplan_del']) {
						ctrls.push('del');
					}
					return Mydao.operator(ctrls);
				},
				events: Mydao.operatorEvents({
					message: mo_message,
					download: mo_download,
					edit: mo_edit, //编辑的函数
					del: mo_del, //删除的函数
					view: mo_show
				})

			}]
		});
		//查询
		$('#supervise_lzh').find('#searchj').on('click', function(event) {
			$("#EnterpriseTable-jd").bootstrapTable("refreshOptions", {
				pageNumber: 1
			}).bootstrapTable("refresh");
		});
	})();