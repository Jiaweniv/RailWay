//菜单管理
	(function() {
		'use strict';
		//		定义右侧内容区宽度
		$('#menumanagement .module-right-box').width(function(index, width) {
			return(width, $(this).parent().width() - $(this).parent().find('.module-left-box').outerWidth(true) - 32);
		});
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
					//功能列表
					var url = "function/findAllFunction";
					Mydao.ajax({
						menuid: treeNode.id
					}, url, function(data) {
						if(data.code == 200) {
							$('#menumanagement #menumanagement_table').bootstrapTable("load", {
								data: data.result
							});
						} else {
							layer.alert(data.msg);
						}

					});
				}
			}
		};

		//获取所有菜单
		var zNodes = [];
		Mydao.ajax({}, 'menu/findAllMenu', function(result) {
			var currentTime = result.serverTime;
			if(result.code == 200) {
				var data = result.result;
				if(data) {
					$.each(data, function(index, val) {
						zNodes.push({
							id: val.id,
							name: val.name,
							code: val.code,
							myurl: val.url,
							myicon: val.icon,
							sort: val.sort,
							parentid: val.parentid,
							pId: val.parentid
						});
					});
				}
				$(document).ready(function() {
					$.fn.zTree.init($("#menumanagement #menumanagement_tree"), setting, zNodes);
				});
			} else {
				layer.alert("操作失败！");
			}

		});

		//编辑
		var function_edit = function(e, value, row, rindex) {
			layer.open({
				type: 1,
				title: '编辑功能',
				btnAlign: 'c',
				content: $("#menumanagement #menumanagement_add_function"),
				area: ["350px", "300px"],
				cancel: function() {
					this.content.find("input").val("");
				},
				btn: ['保存', '取消'],
				success: function(layero, index) {
					$("#menumanagement_add_function input[name=name]").val(row.name);
					$("#menumanagement_add_function input[name=code]").val(row.code);
					$("#menumanagement_add_function input[name=url]").val(row.url);
					$("#menumanagement_add_function input[name=icon]").val(row.icon);
					$("#menumanagement_add_function input[name=sort]").val(row.sort);
				},
				yes: function(index, layero) {
					var fname = $("#menumanagement_add_function input[name=name]").val(),
						fcode = $("#menumanagement_add_function input[name=code]").val(),
						furl = $("#menumanagement_add_function input[name=url]").val(),
						icon = $("#menumanagement_add_function input[name=icon]").val(),
						fsort = $("#menumanagement_add_function input[name=sort]").val();
					Mydao.ajax({
						"id": row.id,
						"name": fname,
						"code": fcode,
						"url": furl,
						"icon": icon,
						"sort": fsort
					}, 'function/updateFunction', function(result) {
						layero.find("input").val("");
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						var currentTime = result.serverTime;
						if(result.code == 200) {
							layer.alert("操作成功！");
							//刷新页面
							var url = "function/findAllFunction";
							Mydao.ajax({
								menuid: row.menuid
							}, url, function(data) {
								if(data.code == 200) {
									$('#menumanagement #menumanagement_table').bootstrapTable("load", {
										data: data.result
									});
								} else {
									layer.alert('哎呀，服务器异常了');
								}

							});
						} else {
							layer.alert("操作失败！");
						}
					});
				},
				btn2: function(index, layero) {
					this.content.find("input").val("");
				}
			});

		};

		//删除
		var function_del = function(e, value, row, index) {
			//询问框
			layer.open({
				title: '消息提示', //标题
				content: '确定要删除该功能吗？', //内容
				icon: 3,
				btn: ['确认', '取消'], //按钮
				btnAlign: 'c', //按钮居中
				yes: function(index, layero) {
					Mydao.ajax({
						"id": row.id
					}, 'function/deleteFunction', function(result) {
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						var currentTime = result.serverTime;
						if(result.code == 200) {
							layer.alert("操作成功！");
							//刷新页面
							var url = "function/findAllFunction";
							Mydao.ajax({
								menuid: row.menuid
							}, url, function(data) {
								if(data.code == 200) {
									$('#menumanagement #menumanagement_table').bootstrapTable("load", {
										data: data.result
									});
								} else {
									layer.alert('哎呀，服务器异常了');
								}

							});
						} else {
							layer.alert("操作失败！");
						}

					});
				}
			});
		};

		$('#menumanagement #menumanagement_table').bootstrapTable({
			data: {},
			columns: [{
				title: '序号',
				align: 'center',
				valign: 'middle',
				formatter: function(val, row, index) {
					return index + 1;
				}
			}, {
				title: '功能名称',
				field: 'name',
				align: 'center',
				valign: 'middle',
			}, {
				title: '功能编号',
				field: 'code',
				align: 'center'
			}, {
				title: '操作<permission opt="function_add"><a id="menumanagement_add_function_btn" herf="javascript:;" class="ml10 " title="添加"><i class="fa fa-plus-square-o"></i></a></permission>',
				align: 'center',
				formatter: function(value, row, index) {
					var ctrls = [];
					//编辑
					if(Mydao.permissions['function_edit']) {
						ctrls.push('edit');
					}
					//删除
					if(Mydao.permissions['function_del']) {
						ctrls.push('del');
					}
					return Mydao.operator(ctrls);
				},
				events: Mydao.operatorEvents({
					edit: function_edit,
					del: function_del
				})
			}]
		});

		//添加功能
		$("#menumanagement_add_function_btn").on("click", function() {
			var tree = $.fn.zTree.getZTreeObj("menumanagement_tree");
			var selectNode = tree.getSelectedNodes();
			if(selectNode[0]) {
				if(!selectNode[0].isParent) {
					layer.open({
						type: 1,
						title: '添加功能',
						btnAlign: 'c',
						content: $("#menumanagement #menumanagement_add_function"),
						area: ["350px", "300px"],
						cancel: function() {
							this.content.find("input").val("");
						},
						btn: ['保存', '取消'],
						yes: function(index, layero) {
							var fname = $("#menumanagement_add_function input[name=name]").val(),
								fcode = $("#menumanagement_add_function input[name=code]").val(),
								furl = $("#menumanagement_add_function input[name=url]").val(),
								fsort = $("#menumanagement_add_function input[name=sort]").val(),
								menuid = selectNode[0].id;
							Mydao.ajax({
								"name": fname,
								"code": fcode,
								"url": furl,
								"sort": fsort,
								"menuid": menuid
							}, 'function/insertFunction', function(result) {
								layero.find("input").val("");
								layer.close(index); //如果设定了yes回调，需进行手工关闭
								var currentTime = result.serverTime;
								if(result.code == 200) {
									layer.alert("操作成功！");
									//刷新页面
									var url = "function/findAllFunction";
									Mydao.ajax({
										menuid: menuid
									}, url, function(data) {
										if(data.code == 200) {
											$('#menumanagement #menumanagement_table').bootstrapTable("load", {
												data: data.result
											});
										} else {
											layer.alert('哎呀，服务器异常了');
										}

									});
								} else {
									layer.alert("操作失败！");
								}
							});
						},
						btn2: function(index, layero) {
							this.content.find("input").val("");
						}
					});
				} else {
					layer.msg("请选择叶子菜单操作");
				}
			} else {
				layer.msg("请选择要操作的菜单");
			}
		});

		//添加菜单
		$("#menumanagement_menu_add").on("click", function() {
			layer.open({
				type: 1,
				title: '添加菜单',
				btnAlign: 'c',
				content: $("#menumanagement #menumanagement_menu"),
				area: ["350px", "380px"],
				cancel: function() {
					$("#menumanagement_parentmenu").empty();
					this.content.find("input").val("");
				},
				btn: ['保存', '取消'],
				success: function() {
					var tree = $.fn.zTree.getZTreeObj("menumanagement_tree");
					//获取所有一级菜单
					var nodes = tree.getNodesByParam("level", 0, null);
					$("#menumanagement_parentmenu").append('<option value="-1">--根菜单--</option>');
					$.each(nodes, function(index, val) {
						$("#menumanagement_parentmenu").append('<option value="' + val.id + '">' + val.name + '</option>');
					});
				},
				yes: function(index, layero) {
					var fname = $("#menumanagement_menu input[name=name]").val(),
						fcode = $("#menumanagement_menu input[name=code]").val(),
						furl = $("#menumanagement_menu input[name=url]").val(),
						fsort = $("#menumanagement_menu input[name=sort]").val(),
						parentid = $("#menumanagement_menu select[name=parentid]").val();
					$("#menumanagement_parentmenu").empty();
					Mydao.ajax({
						"name": fname,
						"code": fcode,
						"url": furl,
						"sort": fsort,
						"parentid": parentid
					}, 'menu/insertMenu', function(result) {
						layero.find("input").val("");
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						var currentTime = result.serverTime;
						if(result.code == 200) {
							layer.alert("操作成功！");
							//刷新页面
							var url = "menu/findAllMenu";
							Mydao.ajax({

							}, url, function(data) {
								if(data.code == 200) {
									var _data = data.result;
									if(_data) {
										var nodes = [];
										$.each(_data, function(index, val) {
											nodes.push({
												id: val.id,
												name: val.name,
												code: val.code,
												myurl: val.url,
												myicon: val.icon,
												sort: val.sort,
												parentid: val.parentid,
												pId: val.parentid
											});
										});
										$("#menumanagement #menumanagement_tree").children().remove();
										$.fn.zTree.init($("#menumanagement #menumanagement_tree"), setting, nodes);
									}

								} else {
									layer.alert('哎呀，服务器异常了');
								}
							});
						} else {
							layer.alert("操作失败！");
						}
					});
				},
				btn2: function(index, layero) {
					this.content.find("input").val("");
					$("#menumanagement_parentmenu").empty();
				}
			});
		});

		//编辑菜单
		$("#menumanagement_menu_edit").on("click", function() {
			var tree = $.fn.zTree.getZTreeObj("menumanagement_tree");
			var selectNode = tree.getSelectedNodes();
			if(selectNode && selectNode[0]) {
				var checkNode = selectNode[0];
				layer.open({
					type: 1,
					title: '添加菜单',
					btnAlign: 'c',
					content: $("#menumanagement #menumanagement_menu"),
					area: ["350px", "380px"],
					cancel: function() {
						$("#menumanagement_parentmenu").empty();
						this.content.find("input").val("");
					},
					btn: ['保存', '取消'],
					success: function() {
						var tree = $.fn.zTree.getZTreeObj("menumanagement_tree");
						//获取所有一级菜单
						var nodes = tree.getNodesByParam("level", 0, null);
						$("#menumanagement_parentmenu").append('<option value="-1">--根菜单--</option>');
						$.each(nodes, function(index, val) {
							if(val.id != checkNode.id) {
								$("#menumanagement_parentmenu").append('<option value="' + val.id + '">' + val.name + '</option>');
							}
						});
						//赋值
						$("#menumanagement_menu input[name=name]").val(checkNode.name);
						$("#menumanagement_menu input[name=code]").val(checkNode.code);
						$("#menumanagement_menu input[name=url]").val(checkNode.myurl);
						$("#menumanagement_menu input[name=icon]").val(checkNode.myicon);
						$("#menumanagement_menu input[name=sort]").val(checkNode.sort);
						$("#menumanagement_menu select[name=parentid]").val(checkNode.parentid);

					},
					yes: function(index, layero) {
						var fname = $("#menumanagement_menu input[name=name]").val(),
							fcode = $("#menumanagement_menu input[name=code]").val(),
							furl = $("#menumanagement_menu input[name=url]").val(),
							fsort = $("#menumanagement_menu input[name=sort]").val(),
							ficon = $("#menumanagement_menu input[name=icon]").val(),
							parentid = $("#menumanagement_menu select[name=parentid]").val();
						$("#menumanagement_parentmenu").empty();
						Mydao.ajax({
							"id": checkNode.id,
							"name": fname,
							"code": fcode,
							"url": furl,
							"sort": fsort,
							"icon": ficon,
							"parentid": parentid
						}, 'menu/editMenu', function(result) {
							layero.find("input").val("");
							layer.close(index); //如果设定了yes回调，需进行手工关闭
							var currentTime = result.serverTime;
							if(result.code == 200) {
								layer.alert("操作成功！");
								//刷新页面
								var url = "menu/findAllMenu";
								Mydao.ajax({

								}, url, function(data) {
									if(data.code == 200) {
										var _data = data.result;
										if(_data) {
											var nodes = [];
											$.each(_data, function(index, val) {
												nodes.push({
													id: val.id,
													name: val.name,
													code: val.code,
													myurl: val.url,
													myicon: val.icon,
													sort: val.sort,
													parentid: val.parentid,
													pId: val.parentid
												});
											});
											$("#menumanagement #menumanagement_tree").children().remove();
											$.fn.zTree.init($("#menumanagement #menumanagement_tree"), setting, nodes);
										}

									} else {
										layer.alert('哎呀，服务器异常了');
									}
								});
							} else {
								layer.alert("操作失败！");
							}
						});
					},
					btn2: function(index, layero) {
						$("#menumanagement_parentmenu").empty();
						this.content.find("input").val("");
					}
				});
			} else {
				layer.alert("请选择要操作的菜单");
			}
		});

		//删除菜单
		$("#menumanagement_menu_del").on("click", function() {
			var tree = $.fn.zTree.getZTreeObj("menumanagement_tree");
			var selectNode = tree.getSelectedNodes();
			//询问框
			layer.open({
				title: '消息提示', //标题
				content: '确定要删除该菜单吗？', //内容
				icon: 3,
				btn: ['确认', '取消'], //按钮
				btnAlign: 'c', //按钮居中
				yes: function(index, layero) { //回调
					Mydao.ajax({
						"id": selectNode[0].id,
					}, 'menu/deleteMenu', function(result) {
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						var currentTime = result.serverTime;
						if(result.code == 200) {
							layer.alert("操作成功！");
							//刷新页面
							var url = "menu/findAllMenu";
							Mydao.ajax({

							}, url, function(data) {
								if(data.code == 200) {
									var _data = data.result;
									if(_data) {
										var nodes = [];
										$.each(_data, function(index, val) {
											nodes.push({
												id: val.id,
												name: val.name,
												code: val.code,
												myurl: val.url,
												myicon: val.icon,
												sort: val.sort,
												parentid: val.parentid,
												pId: val.parentid
											});
										});
										$("#menumanagement #menumanagement_tree").children().remove();
										$.fn.zTree.init($("#menumanagement #menumanagement_tree"), setting, nodes);
									}

								} else {
									layer.alert('哎呀，服务器异常了');
								}
							});
						} else {
							layer.alert("操作失败！");
						}

					});
				}
			});
		});

	})();