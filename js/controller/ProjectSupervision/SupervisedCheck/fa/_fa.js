/**
 * 监督检查方案
 */
	//	'use strict';
	$(function() {

		//编辑
		var _edit = function(e, value, row, index) {
			init_checkprogram_fa_page(e, value, row, index);
		};

		//显示
		var _show = function(e, value, row, index) {
			layer.open({
				type: 1,
				title: '',
				btnAlign: 'c',
				content: "",
				area: ["70%", "90%"],
				moveOut: true,
				cancel: function(layero, index) {},
				btn: ['返回'],
				success: function(layero, index) {
					layero.find('.layui-layer-content').load("view/ProjectSupervision/SupervisedCheck_childs/CheckProgram_show.html", function(result) {
						//基础信息
						Mydao.ajax({
								"id": row.id
							}, 'checkProgram/get', function(result) {
								result = result.result;
								layero.find("span[name='programname']").text(result.name);
								layero.find("span[name='projectname']").text(result.projectname);
								layero.find("span[name='checktime']").text(Mydao.formatDate(result.checkstart) + "到" + Mydao.formatDate(result.checkend));
								var checkusers = "";
								for(var i = 0; i < result.checkusers.length; i++) {
									if(i == 0)
										checkusers += result.checkusers[i].name;
									else
										checkusers += "," + result.checkusers[i].name;
								}
								layero.find("span[name='checkusers']").text(checkusers);

								layero.find("span[name='superviseplan']").text(result.planname);
							});
							//标段、工点信息表格
						Mydao.ajax({
							"checkprogramid": row.id
						}, 'checkProgram/sectionPointTable', function(result) {
							for(var i = 0; i < result.result.length; i++) {
								var val = result.result[i];
								var td_length = val.tr_length - 2;
								var obj = '<fieldset>' +
									'<legend>标段：' + val.sectionname + '　　工点：' + val.workpointname + '</legend>' +
									'	<table>' +
									'		<tr>' +
									'			<td colspan="' + td_length + '" align="center">检查事项</td>' +
									'			<td align="center">抽查依据</td>' +
									'			<td align="center">抽查内容</td>' +
									'			<td align="center">抽查对象</td>' +
									'			<td align="center">抽查方式</td>' +
//									'			<td align="center">抽查类型</td>' +
									'		</tr>';
								for(var j = 0; j < val.infos.length; j++) {
									var info = val.infos[j];
									obj += '<tr>';
									for(var k = 0; k < td_length; k++) {
										var item = info.items[k];
										if(item)
											obj += '<td id="' + info.items[k].itemid + '">' + info.items[k].name + '</td>';
										else
											obj += '<td class="blank"></td>';
									}
									obj += '<td>' + info.foundation + '</td>' +
										'<td>' + info.content + '</td>' +
										'<td>' + info.checkobject + '</td>' +
										'<td>' + info.mode + '</td>';
//									if(info.type == 0)
//										obj += '<td>必查</td>';
//									else
//										obj += '<td>抽查</td>';
//									obj += '</tr>';
								}

								obj += '	</table>' +
									'</legend>' +
									'</fieldset>';

								$("#checkProgram_show").append($(obj));
							}
						});
					});
				}
			});
		};

		//删除
		var _del = function(e, value, row, index) {
			//询问框
			layer.open({
				title: '消息提示', //标题
				content: '确定要删除该检查方案吗？', //内容
				btn: ['确认', '取消'], //按钮
				btnAlign: 'c', //按钮居中
				yes: function(index, layero) { //回调
					Mydao.ajax({
						"id": row.id
					}, 'checkProgram/delete', function(result) {
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						var currentTime = result.serverTime;
						if(result.code == 200) {
							layer.alert("操作成功！");
							//刷新页面
							$("#checkprogram_fa #checkprogram_fa_table").bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						} else {
							layer.alert("操作失败！");
						}
					});
				}
			});
		};

		//方案表格
		$('#checkprogram_fa #checkprogram_fa_table').bootstrapTable({
			pagination: true,
			sidePagination: 'server',
			queryParamsType: "undefined", //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  //设置为limit可以获取limit, offset, search, sort, order  
			method: 'post',
			pageNumber: 1,
			url: Mydao.config.path + "checkProgram/list",
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
				Mydao.config.ajaxParams.page.orderField = "cp.updatetime";
				Mydao.config.ajaxParams.page.pageSize = p.pageSize;
				Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
				Mydao.config.ajaxParams.page.orderDirection = "desc";
				Mydao.config.ajaxParams.params.projectid = $("#SupervisedCheck #projectid").val();
				Mydao.config.ajaxParams.params.name = $("#checkprogram_fa input[name='name']").val();
				return Mydao.config.ajaxParams;
			},
			columns: [{
				title: '序号',
				align: 'center',
				valign: 'middle',
				formatter: function(val, row, index) {
					return index + 1;
				},
			}, {
				title: '方案名称',
				field: 'name',
				align: 'center'
			}, {
				title: '检查时间',
				field: 'starttime',
				align: 'center',
				formatter: function(val, row, index) {
					return Mydao.formatDate(row.checkstart) + "到" + Mydao.formatDate(row.checkend);
				}
			}, {
				title: '方案附件',
				field: 'affix',
				align: 'center',
				formatter: function(value, row, index) {
					if(value) {
						if(row.affixname) {
							return '<a class="m-module-a" href="' + MydaoFileDownPath + '?fileId=' + value + '">' + row.affixname + '</a>';
						} else {
							return '<a class="m-module-a" href="' + MydaoFileDownPath + '?fileId=' + value + '">点击下载</a>';
						}
					}
				}
			}, {
				title: '操作',
				align: 'center',
				formatter: function(value, row, index) {
					var ctrls = [];
					//编辑
					if(Mydao.permissions['checkprogram_edit']) {
						ctrls.push('edit');
					}
					//删除
					if(Mydao.permissions['checkprogram_del']) {
						ctrls.push('del');
					}

					//查看
					if(Mydao.permissions['checkprogram_look']) {
						ctrls.push('view');
					}

					return Mydao.operator(ctrls);
				},
				events: Mydao.operatorEvents({
					edit: _edit,
					del: _del,
					view: _show
				})
			}]
		});

		//查询
		$("#checkprogram_fa button[name='search']").on("click", function() {
			//刷新页面
			$("#checkprogram_fa #checkprogram_fa_table").bootstrapTable("refreshOptions", {
				pageNumber: 1
			}).bootstrapTable("refresh");
		});

		//新建
		$("#checkprogram_fa button[name='create']").on("click", function() {
			init_checkprogram_fa_page();
		});

		//选择标段
		var select_section = function() {
			var _projectid = $("#checkprogram_fa_edit_one select[name='projectid']").val();
			if(!_projectid) {
				layer.msg("请先选择项目!");
				return false;
			}
			layer.open({
				type: 1,
				title: '选择标段',
				btnAlign: 'c',
				content: "",
				area: ["400px", "400px"],
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
					});
					//加载标段
					Mydao.ajax({
						"projectid": _projectid
					}, "constructionSection/s1006", function(data) {
						if(data.code == 200) {
							$('#checkprogram_select_section').bootstrapTable({
								data: data.result,
								checkboxHeader: true,
								uniqueId: "id",
								columns: [{
									checkbox: true,
									formatter: function(value, row, index) {
										var fla = false;
										var _tempids = $("#checkprogram_fa_edit_one input[name='sectionids']").val();
										if(_tempids) {
											$.each(_tempids.split(','), function(a, b) {
												if(b == row.id) {
													fla = true;
												}
											});
										}
										return fla;
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
								}]
							});
						} else {
							layer.msg('哎呀，服务器异常了');
						}

					});

				},
				yes: function(index, layero) {
					var _ids = '',
						_names = '';
					$.each($('#checkprogram_select_section').bootstrapTable('getSelections'), function(index, val) {
						_ids += val.id + ",";
						_names += val.name + ",";
					});
					_ids = _ids.length > 1 ? _ids.substr(0, _ids.length - 1) : '';
					_names = _names.length > 1 ? _names.substr(0, _names.length - 1) : '';
					$("#checkprogram_fa_edit_one input[name='sectionids']").val(_ids);
					$("#checkprogram_fa_edit_one textarea[name='sectionname']").val(_names);
					layer.close(index);
				}
			});
		};
		
		//抽取标段
		var extract_section = function() {
			//判断项目
			var _projectid = $("#checkprogram_fa_edit_one select[name='projectid']").val();
			if(!_projectid) {
				layer.msg("请先选择项目!");
				return false;
			}
			//判断是否需要抽取
			layer.msg("抽取标段");
		};
		

		//选中父节点ICON
		var checkParentIco = function(_itTree, treeNode) {
			treeNode.haschecked = true;
			_itTree.updateNode(treeNode);
			$("#" + treeNode.tId + "_ico").attr("class", "fa fa-star");
			if(treeNode.level > 0) {
				checkParentIco(_itTree, treeNode.getParentNode());
			}
		};

		//修改子节点ICON
		var changeChildrenIco = function(_itTree, treeNode) {
			treeNode.haschecked = false;
			_itTree.updateNode(treeNode);
			$("#" + treeNode.tId + "_ico").attr("class", "fa fa-star-o");
			if(treeNode.children) {
				$.each(treeNode.children, function(a, b) {
					changeChildrenIco(_itTree, b);
				});
			}
		};

		//判断父节点下面是否还有节点选中节点
		var clearParentIco = function(_itTree, treeNode) {
			treeNode.haschecked = false;
			_itTree.updateNode(treeNode);
			$("#" + treeNode.tId + "_ico").attr("class", "fa fa-star-o");
			if(treeNode.level > 0) {
				var parentNode = treeNode.getParentNode();
				if(parentNode) {
					var _cNode = parentNode.children;
					var _num = 0;
					$.each(_cNode, function(a, b) {
						if(b.haschecked) {
							_num++;
						}
					});
					if(_num == 0) {
						if(parentNode.level == 0) {
							$("#" + parentNode.tId + "_ico").attr("class", "fa fa-star-o");
						} else {
							clearParentIco(_itTree, parentNode);
						}
					}
				}
			}
		};

		//刷新后再次选中节点
		var checkTreeIco = function(_tree) {
			if(Mydao.currentPage.params.checkinfos) {
				$.each(Mydao.currentPage.params.checkinfos, function(a, b) {
					var cnds = _tree.getNodesByParam("tempid", a, null);
					if(cnds && cnds[0]) {
						checkParentIco(_tree, cnds[0]);
					}
				});
			}
		};

		//初始化step页面
		var init_step = function(curdialog, row) {
			$("#checkprogram_fa_step").steps({
				transitionEffect: "fade",
				onInit: function(event, currentIndex) {

				},
				onStepChanging: function(event, currentIndex, newIndex) {
					if(currentIndex > newIndex) {
						return true;
					} else {
						if(newIndex == 1) { //第二页 工点
							//验证
							$('#checkprogram_one_step').trigger('validate');
							if(!$('#checkprogram_one_step').data('validator').isFormValid()) {
								return false;
							}

							//设置
							var wp_setting = {
								view: {
									showLine: false
								},
								data: {
									simpleData: {
										enable: true
									}
								},
								callback: {
									onClick: function(event, treeId, treeNode) {
										if(treeNode.isParent) {
											layer.msg("该节点不能操作!");
										} else {
											$('#checkprogram_work_point_table').bootstrapTable("refreshOptions", {
												queryParams: function(p) {
													Mydao.config.ajaxParams.params.sectionid = treeNode.id;
													return Mydao.config.ajaxParams;
												}
											});
										}
									}
								}
							};

							var zNodes = [];
							//标段
							var _sectionnames = $("#checkprogram_fa_edit_one input[name='sectionname']").val().split(",");
							$.each($("#checkprogram_fa_edit_one input[name='sectionids']").val().split(","), function(a, b) {
								zNodes.push({
									id: b,
									name: _sectionnames[a]
								});
							});
							$.fn.zTree.init($("#checkprogram_fa_edit_panel #checkprogram_sections_tree"), wp_setting, zNodes);

							var _wp_Tree = $.fn.zTree.getZTreeObj("checkprogram_sections_tree");
							_wp_Tree.expandAll(true);

							//修改图标
							$.each(_wp_Tree.getNodes(), function(a, b) {
								changeChildrenIco(_wp_Tree, b);
							});

							//如果是编辑  反选
							if(row) {
								$.each(Mydao.currentPage.params.checkinfos, function(a, b) {
									var _wp_Tree = $.fn.zTree.getZTreeObj("checkprogram_sections_tree");
									var _wp_Node = _wp_Tree.getNodes();
									$.each(_wp_Node, function(c, d) {
										if(d.id == a.split("_")[0]) {
											checkParentIco(_wp_Tree, d);
										}
									});
								});
							}

							//工点表
							$('#checkprogram_work_point_table').bootstrapTable({
								queryParamsType: "undefined", //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  //设置为limit可以获取limit, offset, search, sort, order  
								method: 'post',
								url: Mydao.config.path + 'workPoint/getWorkPointBySection',
								cache: true, //禁用缓存
								search: false, //禁用查询
								striped: true, //隔行变色
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
									Mydao.config.ajaxParams.params.clientid = Mydao.clientid;
									Mydao.config.ajaxParams.params.sectionid = -1;
									return Mydao.config.ajaxParams;
								},
								columns: [{
									checkbox: true,
									formatter: function(value, row, index) {
										var _flag = false;
										$.each(Mydao.currentPage.params.checkinfos, function(a, b) {
											if(row.id == a.split("_")[1]) {
												_flag = true;
												return false;
											}
										});
										return _flag;
									}
								}, {
									title: '专业',
									align: 'center',
									field: 'disciplinename'
								}, {
									title: '名称',
									align: 'center',
									field: 'name'
								}, {
									title: '编号',
									align: 'center',
									field: 'code'
								}]
							});

							//如果是编辑需要判断标段是否变更，如果变更了需要删除相关的信息
							if(row) {
								var _tempSectionids = $("#checkprogram_fa_edit_one input[name='sectionids']").val().split(",");
								$.each(Mydao.currentPage.params.checkinfos, function(a, b) {
									var _tflag = false;
									var _tsectionid = a.split("_")[0];
									$.each(_tempSectionids, function(a1, b1) {
										if(_tsectionid == b1) {
											_tflag = true;
										}
									});
									if(!_tflag) {
										delete Mydao.currentPage.params.checkinfos[a];
									}
								});
							}
						} else if(newIndex == 2) { //第三页 抽查事项
							//判断是否所有标段都选择了工点
							var _wp_Tree2 = $.fn.zTree.getZTreeObj("checkprogram_sections_tree");
							var _wp_Node = _wp_Tree2.getNodes();
							var _tempFlag = true;
							$.each(_wp_Node, function(a, b) {
								if(!b.haschecked) {
									layer.msg(b.name + "没有选择工点信息");
									_tempFlag = false;
									return false;
								}
							});
							//如果是编辑删除已删除的工点信息
							if(row) {
								$.each(Mydao.currentPage.params.checkinfos, function(a, b) {
									var _ttflag = true;
									$.each(Mydao.currentPage.params.workpoints, function(c, d) {
										if(c == a.split("_")[1]) {
											_ttflag = false;
											return false;
										}
									});
									if(_ttflag) {
										delete Mydao.currentPage.params.checkinfos[a];
									}
								});
							}

							if(!_tempFlag) {
								return false;
							}

							//判断是否已经存在树
							var setting = {
								view: {
									showLine: false
								},
								data: {
									simpleData: {
										enable: true
									}
								},
								callback: {
									onClick: function(event, treeId, treeNode) {
										if(treeNode.isParent) {
											layer.msg("该节点不能操作!");
										} else {
											$('#checkprogram_check_info_table').bootstrapTable({
												itemid: treeNode.id
											});
											$("#checkprogram_check_info_table").bootstrapTable("refreshOptions", {
												queryParams: function(p) {
													Mydao.config.ajaxParams.params.itemid = treeNode.id;
													return Mydao.config.ajaxParams;
												}
											});
										}

									}
								}
							};
							//渲染树
							var zNodes2 = [];
							//组装workpointids
							var _tp_sectionids = "",
								_tp_workpointids = "";
							$.each(Mydao.currentPage.params.sections, function(a, b) {
								_tp_sectionids += a + ",";
							});
							$.each(Mydao.currentPage.params.workpoints, function(a, b) {
								_tp_workpointids += a + ",";
							});
							_tp_sectionids = _tp_sectionids.substr(0, _tp_sectionids.length - 1);
							_tp_workpointids = _tp_workpointids.substr(0, _tp_workpointids.length - 1);
							//请求标段、工点和检查事项
							Mydao.ajax({
								"sectionids": _tp_sectionids,
								"workpointids": _tp_workpointids
							}, 'workPoint/selectTreeBySections', function(result) {
								if(result.code == 200) {
									var _tempWorkPoint = result.result;
									$.each(_tempWorkPoint, function(a, b) {
										zNodes2.push({
											id: b.id,
											name: b.name,
											children: b.children
										});
									});
									$.fn.zTree.init($("#checkprogram_fa_edit_panel #checkprogram_item_tree"), setting, zNodes2);
									var _item_Tree = $.fn.zTree.getZTreeObj("checkprogram_item_tree");
									_item_Tree.expandAll(true);
									//修改图标
									$.each(_item_Tree.getNodes(), function(a, b) {
										changeChildrenIco(_item_Tree, b);
									});
									if(Mydao.currentPage.params.checkinfos) {
										//刷新后再次选中
										checkTreeIco(_item_Tree);
									}

								} else {
									layer.msg("获取工点信息失败！");
									return false;
								}

							});
						} else if(newIndex == 3) {
							if($.isEmptyObject(Mydao.currentPage.params.checkinfos)) {
								layer.msg("请选择检查清单！");
								return false;
							}
						}
					}
					return true;
				},
				onStepChanged: function(event, currentIndex, priorIndex) {
					if(currentIndex < priorIndex) {
						//上一页完成
												console.log("上一页完成");
					} else {
												console.log("下一页完成");
					}
				},
				onFinishing: function(event, currentIndex) {
					$('#checkprogram_three_step').trigger('validate');
					if(!$('#checkprogram_three_step').data('validator').isFormValid()) {
						return false;
					}
					var beginDate = $("#checkprogram_checkstart").val(),
						endDate = $("#checkprogram_checkend").val();
					var d1 = new Date(beginDate.replace(/\-/g, "\/")),
						d2 = new Date(endDate.replace(/\-/g, "\/"));
					if(d1 >= d2) {
						layer.alert("结束时间不能小于开始时间！");
						return false;
					}
					var _selectUsers = $('#checkprogram_all_checkuser').bootstrapTable('getSelections');

					if(_selectUsers.length < 1) {
						layer.msg("请选择检查人");
						return false;
					}

					//组装数据保存
					var checkProgram = $("#checkprogram_one_step").serializeJson(),
						_checkProgram1 = $("#checkprogram_three_step").serializeJson();
					Object.assign(checkProgram, _checkProgram1);
					checkProgram.checkinfos = Mydao.currentPage.params.checkinfos;
					checkProgram.checkuser = _selectUsers;
					checkProgram.id = row && row.id;
					//保存
					var flag = false;
					Mydao.ajax(checkProgram, row ? 'checkProgram/edit' : 'checkProgram/add', function(result) {
						var currentTime = result.serverTime;
						if(result.code == 200) {
							layer.msg("保存成功!");
							flag = true;
						} else {
							layer.msg(result.msg);
							flag = false;
						}
					}, false);
					return flag;

				},
				onFinished: function(event, currentIndex) {
					var _itTree = $.fn.zTree.getZTreeObj("checkprogram_item_tree");
					if(_itTree != null) {
						$.fn.zTree.destroy("checkprogram_item_tree");
					}
					//刷新页面
					$("#checkprogram_fa #checkprogram_fa_table").bootstrapTable("refreshOptions", {
						pageNumber: 1
					}).bootstrapTable("refresh");

					//清空临时数据
					Mydao.currentPage.params.checkinfos = undefined;
					layer.close(curdialog);
				}
			});
		};

		//渲染所有的检查人
		var init_all_check_user = function(row) {
			$('#checkprogram_all_checkuser').bootstrapTable({
				queryParamsType: "undefined", //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  //设置为limit可以获取limit, offset, search, sort, order  
				method: 'post',
				url: Mydao.config.path + 'person/findAllCheckUser',
				cache: true, //禁用缓存
				search: false, //禁用查询
				striped: true, //隔行变色
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
					Mydao.config.ajaxParams.params.clientid = Mydao.clientid;
					return Mydao.config.ajaxParams;
				},
				columns: [{
					checkbox: true,
					formatter: function(value, mrow, index) {
						var fla = false;
						if(row) {
							$.each($('#checkprogram_has_checkuser').bootstrapTable("getData"), function(a, b) {
								if(mrow.id == b.id) {
									fla = true;
								}
							});
						}
						return fla;
					}
				}, {
					title: '姓名',
					field: 'name',
					align: 'center'
				}, {
					title: '所属机构',
					field: 'organizationname',
					align: 'center',
					valign: 'middle'
				}, {
					title: '专业',
					field: 'professionname',
					align: 'center',
				}]
			});

		};

		//初始化编辑页面
		var init_checkprogram_fa_page = function(e, value, row, index) {
			layer.open({
				id: 'checkprogram_mydao',
				type: 1,
				title: '添加检查方案',
				btnAlign: 'c',
				content: "",
				area: ["70%", "90%"],
				moveOut: true,
				cancel: function(layero, index) {
					var _itTree = $.fn.zTree.getZTreeObj("checkprogram_item_tree");
					if(_itTree != null) {
						$.fn.zTree.destroy("checkprogram_item_tree");
					}
					//清空临时数据
					Mydao.currentPage.params.checkinfos = undefined;
				},
				success: function(layero, index) {
					//临时保存数据
					Mydao.currentPage.params.sections = {};
					Mydao.currentPage.params.workpoints = {};
					Mydao.currentPage.params.checkinfos = {};
					layero.find('.sidebar-collapse').slimScroll({
						height: '100%',
					});

					layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/CheckProgram_edit.html', function() {

						init_step(index, row);
						$(".wizard > .steps > ul > li").css("width", "25%");

						//已选择检查人表格
						$('#checkprogram_has_checkuser').bootstrapTable({
							data: {},
							columns: [{
								title: '姓名',
								field: 'name',
								align: 'center'
							}, {
								title: '所属机构',
								field: 'organizationname',
								align: 'center',
								valign: 'middle'
							}, {
								title: '专业',
								field: 'professionname',
								align: 'center',
							}]
						});

						Mydao.initselect(layero, null, function() {
							if(row) {
								//获取检查方案
								Mydao.ajax({
									"id": row.id
								}, "checkProgram/get", function(result) {
									if(result.code == 200) {
										var data = result.result;
										Mydao.setform(layero, data);
										Mydao.currentPage.params.checkinfos = data.checkinfos;
										$.each(data.checkinfos, function(a, b) {
											var _ts = a.split("_")[0],
												_wp = a.split("_")[1];
											Mydao.currentPage.params.sections[_ts] = _ts;
											Mydao.currentPage.params.workpoints[_wp] = _wp;
										});
										var _hascheckuser = [];
										$.each(data.checkusers, function(a, b) {
											_hascheckuser.push({
												"id": b.id,
												"name": b.name,
												"organizationname": b.organizationname,
												"professionname": b.professionname
											});
										});

										//显示已选择
										$('#checkprogram_has_checkuser').bootstrapTable("load", _hascheckuser);
										//渲染所有检查人
										init_all_check_user(row);
									} else {
										layer.msg(result.msg);
									}
								});
							}

							//选择标段
							$("#checkprogram_fa_select_section_btn").on("click", function() {
								select_section();
							});
							
							//抽取标段
							$("#checkprogram_fa_extract_section_btn").on("click", function() {
								extract_section();
							});
							
							

							//抽查清单表格
							$('#checkprogram_check_info_table').bootstrapTable({

								queryParamsType: "undefined", //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  //设置为limit可以获取limit, offset, search, sort, order  
								method: 'post',
								url: Mydao.config.path + 'checkInfo/getAll',
								cache: true, //禁用缓存
								search: false, //禁用查询
								striped: true, //隔行变色
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
									Mydao.config.ajaxParams.params.clientid = Mydao.clientid;
									return Mydao.config.ajaxParams;
								},
								columns: [{
									checkbox: true,
									formatter: function(value, row, index) {
										var fla = false;
										var _itTree = $.fn.zTree.getZTreeObj("checkprogram_item_tree");
										var _checkNode = _itTree.getSelectedNodes();
										if(_checkNode.length > 0) {
											var _swiId = _checkNode[0].tempid;
											if(Mydao.currentPage.params.checkinfos[_swiId]) {
												$.each(Mydao.currentPage.params.checkinfos[_swiId], function(a, b) {
													if(b.id == row.id) {
														fla = true;
														return true;
													}
												});
											} else {
												if(row.type == 0) {
													fla = true;
												}
											}
										} else {
											if(row.type == 0) {
												fla = true;
											}
										}
										return fla;
									}
								}, {
									title: '抽查依据',
									field: 'foundation'
								}, {
									title: '抽查内容',
									field: 'content',
								}, {
									title: '抽查对象',
									field: 'checkobject',
								}, {
									title: '抽查方式',
									field: 'mode',
								} 
//								{
//									title: '抽查类型',
//									field: 'type',
//									formatter: function(value, row, index) {
//										return value == 0 ? '必查' : '抽查';
//									}
//								}
								]
							});

							//如果不是编辑才渲染
							if(!row) {
								init_all_check_user();
							}

						});

						layero.find('.sidebar-collapse').slimScroll({
							height: '100%',
						});

						layero.find(".group-input").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
						});

						//select和标头的组合
						layero.find(".group-select").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
						});

						//给项目绑定一个改变事件用于清空标段
						$("#checkprogram_fa_edit_one select[name='projectid']").on('change', function() {
							$("#checkprogram_fa_edit_one input[name='sectionids']").val('');
							$("#checkprogram_fa_edit_one input[name='sectionname']").val('');
						});

						//工点清单确认按钮绑定事件
						$("#checkprogram_work_point_qr").on('click', function() {
							//判断检查事项
							var _sectionTree = $.fn.zTree.getZTreeObj("checkprogram_sections_tree");
							var _sectionNode = _sectionTree.getSelectedNodes();
							if(_sectionNode.length == 0) {
								layer.msg('请选择标段');
							} else {
								//获取选择的工点
								var selectInfos = $('#checkprogram_work_point_table').bootstrapTable('getSelections');
								_sectionNode = _sectionNode[0];
								//控制图标显示
								if(selectInfos.length == 0) {
									Mydao.currentPage.params.sections[_sectionNode.id] = undefined;
									clearParentIco(_sectionTree, _sectionNode);
								} else if(selectInfos.length > 0) {
									Mydao.currentPage.params.sections[_sectionNode.id] = _sectionNode.id;
									$.each(selectInfos, function(a, b) {
										Mydao.currentPage.params.workpoints[b.id] = b.id;
									});
									checkParentIco(_sectionTree, _sectionNode);
								}
							}
						});

						//清单确认按钮绑定事件
						$("#checkprogram_checkinfo_qr").on('click', function() {
							//判断检查事项
							var _itTree = $.fn.zTree.getZTreeObj("checkprogram_item_tree");
							var _checkNode = _itTree.getSelectedNodes();
							if(_checkNode.length == 0) {
								layer.msg('请选择检查事项');
							} else {
								//获取选择的清单
								var selectInfos = $('#checkprogram_check_info_table').bootstrapTable('getSelections');
								_checkNode = _checkNode[0];

								//获取标段工点检查项id
								var _swiId = _checkNode.tempid;

								//控制图标显示
								if(selectInfos.length == 0) {
									clearParentIco(_itTree, _checkNode);
									Mydao.currentPage.params.checkinfos[_swiId] = undefined;
								} else if(selectInfos.length > 0) {
									Mydao.currentPage.params.checkinfos[_swiId] = selectInfos;
									checkParentIco(_itTree, _checkNode);
								}
							}
						});

						//检查人员确认按钮绑定事件
						$("#checkprogram_checkuser_qr").on('click', function() {
							//获取选择的清单
							var _selectUsers = $('#checkprogram_all_checkuser').bootstrapTable('getSelections');
							//刷新已选择人员
							$("#checkprogram_has_checkuser").bootstrapTable("refreshOptions", {
								data: _selectUsers
							}).bootstrapTable("refresh");
						});

					});

				}
			});
		};

	});