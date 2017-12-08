	(function() {
		'use strict';
		var editer1 = {},
			editer2 = {},
			editer3 = {},
			editer4 = {},
			editer5 = {};
		//事件集
		var getSelectedTreeNode = function(ztree) {
				var treeObj = $.fn.zTree.getZTreeObj(ztree);
				if(treeObj.getSelectedNodes() && treeObj.getSelectedNodes().length > 0) {
					return treeObj.getSelectedNodes()[0];
				}
				return null;
			},
			getSelectedAllName = function(node, names) {
				names.unshift(node.name);
				var _p = node.getParentNode();
				if(_p) {
					getSelectedAllName(_p, names);
				}
			};
		$('#checkitems-add #items-form-add').on('valid.form', function() {
			var treeObj = $.fn.zTree.getZTreeObj('checkitems');
			var node = getSelectedTreeNode('checkitems');
			$(this).ajaxSubmit({
				url: 'checkItems/s1002',
				data: {
					'createuserid': Mydao.config.ajaxParams.base.userid,
					'clientid': Mydao.clientid,
					'name': $('#checkitems-add #items-form-add [name="name"]').val(),
					'level': node && node.level >= 0 ? Number(node.level) + 2 : 1,
					'parentid': node ? node.id : -1
				}
			}, function(result, form) {
				layer.close(Mydao.currentPage.dialog.index);
				$('#checkitems-add #items-form-add [name="name"]').val("");
				treeObj.addNodes(node, result.result);
			});
		});

		$('#checkitems-edit #items-form-edit').on('valid.form', function() {
			var treeObj = $.fn.zTree.getZTreeObj('checkitems');
			var node = getSelectedTreeNode('checkitems');
			$(this).ajaxSubmit({
				url: 'checkItems/s1003',
				data: {
					'id': node.id,
					'name': $('#checkitems-edit #items-form-edit [name="name"]').val()
				}
			}, function(result, form) {
				layer.close(Mydao.currentPage.dialog.index);
				node['name'] = $('#checkitems-edit #items-form-edit [name="name"]').val();
				$('#checkitems-edit #items-form-edit [name="name"]').val("");
				treeObj.updateNode(node);
			});
		});

		$(document.body).delegate('#checkinfo-form', 'valid.form', function() {
			var node = getSelectedTreeNode('checkitems');
			$(this).ajaxSubmit({
				url: 'checkInfo/add',
				data: {
					'id': Mydao.currentPage.dialog.id,
					'itemid': node ? node.id : undefined
				}
			}, function(result, form) {
				//编辑和新建点击确定以后再次编辑两一个的时候销毁
				UE.getEditor('myEditor1').destroy();
				UE.getEditor('myEditor2').destroy();
				UE.getEditor('myEditor3').destroy();
				UE.getEditor('myEditor4').destroy();
				UE.getEditor('myEditor5').destroy();
				layer.close(Mydao.currentPage.dialog.index);
				Mydao.currentPage.dialog.id = undefined;
				$("#check-items-nav #checkinfo-table").bootstrapTable("refreshOptions", {
					pageNumber: 1,
					queryParams: function(p) {
						Mydao.config.ajaxParams.params = {};
						Mydao.config.ajaxParams.page.orderField = p.sortName;
						Mydao.config.ajaxParams.page.pageSize = p.pageSize;
						Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
						Mydao.config.ajaxParams.page.orderDirection = p.sortOrder;
						Mydao.config.ajaxParams.params.itemid = node ? node.id : undefined;
						return Mydao.config.ajaxParams;
					}
				});
			});
		});
		/**
		 * 添加检查事项
		 */
		$('#check-items-nav #checkitems_add').on('click', function() {
			var node = getSelectedTreeNode('checkitems');
			var dialog = layer.open({
				type: 1,
				content: $("#checkitems-add"),
				area: ["280px", "200px"],
				btn: ['保存', '取消'],
				success: function(layero, index) {
					layero.find("form span").filter(".myClass").remove();
					Mydao.currentPage.dialog.index = index;
					this.content.find(".group-input").each(function(index, element) {
						$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
					});
					//  select和标头的组合
					this.content.find(".group-select").each(function(index, element) {
						$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
					});
					if(!node) {
						this.content.find('#items-level').html('事项类别：');
					} else {
						this.content.find('#items-level').html('抽查事项：');
					}

				},
				cancel: function() {
					this.content.find("input,textarea,select").val("");
				},
				yes: function(layero, index) {
					$('#check-items-nav #items-form-add').trigger('validate');
				}
			});
		});
		/**
		 * 编辑检查事项
		 */
		$('#check-items-nav #checkitems_edit').on('click', function() {
			var node = getSelectedTreeNode('checkitems');
			if(!node) {
				layer.msg('请选择一项');
				return false;
			}
			var dialog = layer.open({
				type: 1,
				content: $("#checkitems-edit"),
				area: ["280px", "200px"],
				btn: ['保存', '取消'],
				success: function(layero, index) {
					layero.find("form span").filter(".myClass").remove();
					Mydao.currentPage.dialog.index = index;
					
					$("#items-form-edit-name").val(node.name);

					this.content.find(".group-input").each(function(index, element) {
						$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
					});
					//  select和标头的组合
					this.content.find(".group-select").each(function(index, element) {
						$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
					});
					if(node.level == 0) {
						this.content.find('#items-level').html('事项类别：');
					} else {
						this.content.find('#items-level').html('抽查事项：');
					}

				},
				cancel: function() {
					this.content.find("input,textarea,select").val("");
				},
				yes: function(index, layero) {
					$('#checkitems-edit #items-form-edit').trigger('validate');
				}
			});
		});
		/**
		 * 删除检查事项
		 */
		$('#check-items-nav #checkitems_del').on('click', function() {
			var node = getSelectedTreeNode('checkitems');
			var treeObj = $.fn.zTree.getZTreeObj('checkitems');
			if(!node) {
				layer.msg('请选择一项');
				return false;
			} else if(node.isParent) {
				layer.msg('当前选中为父节点，无法删除');
				return false;
			}
			layer.confirm('是否删除？', function(index) {
				$(this).doajax({
					url: 'checkItems/s1004',
					data: {
						id: node.id
					}
				}, function() {
					treeObj.removeNode(node);
				});
				layer.close(index);
			});
		});
		/**
		 * 添加检查清单
		 */
		$('#check-items-nav').delegate('#checkinfoadd', 'click', function() {
			var node = getSelectedTreeNode('checkitems');
			if(!node) {
				layer.msg('请选择抽查事项');
				return false;
			} else if(node.isParent) {
				layer.msg('当前选中为父节点，无法操作！');
				return false;
			} else if(node.level == 0) {
				layer.msg('当前选中为事项类别，无法操作！');
				return false;
			}
			var dialog = layer.open({
				type: 1,
				content: "",
				btnAlign: 'c',
				title: $('#right_lab').html(),
				area: ["70%", "90%"],
				moveOut: true,
				btn: ['确认', '取消'],
				success: function(layero, index) {
					layero.find("form span").filter(".myClass").remove();
					Mydao.currentPage.dialog.index = index;
					layero.find('.layui-layer-content').load("view/SupervisedExtractionLibrary/checkinfo_edit.html", function(result) {
						editer1 = UE.getEditor('myEditor1');
						editer2 = UE.getEditor('myEditor2');
						editer3 = UE.getEditor('myEditor3');
						editer4 = UE.getEditor('myEditor4');
						editer5 = UE.getEditor('myEditor5');
						layero.find(".group-input").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
						});
						//  select和标头的组合
						layero.find(".group-select").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
						});
						//							$('#edit_lab').html($('#right_lab').html());
					});
				},
				cancel: function(layero, index) {
					UE.getEditor('myEditor1').destroy();
					UE.getEditor('myEditor2').destroy();
					UE.getEditor('myEditor3').destroy();
					UE.getEditor('myEditor4').destroy();
					UE.getEditor('myEditor5').destroy();
				},
				btn2: function(index, layero) {
					UE.getEditor('myEditor1').destroy();
					UE.getEditor('myEditor2').destroy();
					UE.getEditor('myEditor3').destroy();
					UE.getEditor('myEditor4').destroy();
					UE.getEditor('myEditor5').destroy();
				},
				yes: function(index, layero) {
					$('#checkinfo_out #checkinfo-form').trigger('validate');
				}
			});
		});
		/**
		 * 显示检查清单
		 */
		var showCheckInfo = function(e, value, row, index) {
				Mydao.ajax({
					id: row.id
				}, 'checkInfo/s1002', function(data) {
					var currentTime = data.serverTime;
					if(data.code == 200) {
						var result = data.result;
						var dialog = layer.open({
							type: 1,
							content: "",
							title: $('#right_lab').html(),
							area: ["70%", "90%"],
							moveOut: true,
							success: function(layero, index) {
								Mydao.currentPage.dialog.index = index;
								Mydao.currentPage.dialog.id = row.id;
								layero.find('.layui-layer-content').load("view/SupervisedExtractionLibrary/checkinfo_edit.html", function(result) {
									layero.find("input,select").attr('disabled', true);
									editer1 = UE.getEditor('myEditor1'),
										editer2 = UE.getEditor('myEditor2'),
										editer3 = UE.getEditor('myEditor3');
									editer4 = UE.getEditor('myEditor4');
									editer5 = UE.getEditor('myEditor5');
									layero.find(".group-input").each(function(index, element) {
										$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
									});
									//  select和标头的组合
									layero.find(".group-select").each(function(index, element) {
										$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
									});
									//									$('#edit_lab').html($('#right_lab').html());
									Mydao.setform($('#checkinfo_out #checkinfo-form'), row);
									var _foundation = row.foundation;
									var _content = row.content;
									var _mode = row.mode;
									var _originallaw = row.originallaw;
									editer1.ready(function() {
										editer1.execCommand('inserthtml', _foundation, true);
										editer1.setDisabled();
									});
									editer2.ready(function() {
										editer2.execCommand('inserthtml', _content, true);
										editer2.setDisabled();
									});
									editer3.ready(function() {
										editer3.execCommand('inserthtml', _mode, true);
										editer3.setDisabled();
									});
									editer4.ready(function() {
										editer4.execCommand('inserthtml', _originallaw, true);
										editer4.setDisabled();
									});
									editer5.ready(function() {
										editer5.execCommand('inserthtml', _originallaw, true);
										editer5.setDisabled();
									});
								});
							},
							cancel: function() {
								UE.getEditor('myEditor1').destroy();
								UE.getEditor('myEditor2').destroy();
								UE.getEditor('myEditor3').destroy();
								UE.getEditor('myEditor4').destroy();
								UE.getEditor('myEditor5').destroy();
							}
						});
					} else {
						layer.alert(data.msg);
					}

				});
			},
			/**
			 * 编辑检查清单
			 */
			editCheckInfo = function(e, value, row, index) {
				Mydao.ajax({
					id: row.id
				}, 'checkInfo/s1002', function(data) {
					var currentTime = data.serverTime;
					if(data.code == 200) {
						var result = data.result;
						var dialog = layer.open({
							type: 1,
							content: "",
							title: $('#check-items-nav #right_lab').html(),
							area: ["70%", "90%"],
							moveOut: true,
							btn: ['保存', '返回'],
							btnAlign: 'c',
							success: function(layero, index) {
								layero.find("form span").filter(".myClass").remove();
								Mydao.currentPage.dialog.index = index;
								Mydao.currentPage.dialog.id = row.id;
								layero.find('.layui-layer-content').load("view/SupervisedExtractionLibrary/checkinfo_edit.html", function(result) {
									editer1 = UE.getEditor('myEditor1'),
										editer2 = UE.getEditor('myEditor2'),
										editer3 = UE.getEditor('myEditor3');
									editer4 = UE.getEditor('myEditor4');
									editer5 = UE.getEditor('myEditor5');
									layero.find(".group-input").each(function(index, element) {
										$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
									});
									//  select和标头的组合
									layero.find(".group-select").each(function(index, element) {
										$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
									});
									//									$('#edit_lab').html($('#right_lab').html());
									Mydao.setform($('#checkinfo_out #checkinfo-form'), row);
									var _foundation = row.foundation;
									var _content = row.content;
									var _mode = row.mode;
									var _originallaw = row.originallaw;
									editer1.ready(function() {
										editer1.execCommand('inserthtml', _foundation, true);
									});
									editer2.ready(function() {
										editer2.execCommand('inserthtml', _content, true);
									});
									editer3.ready(function() {
										editer3.execCommand('inserthtml', _mode, true);
									});
									editer4.ready(function() {
										editer4.execCommand('inserthtml', _originallaw, true);
									});
									editer5.ready(function() {
										editer5.execCommand('inserthtml', _originallaw, true);
									});
								});
							},
							cancel: function(layero, index) {
								UE.getEditor('myEditor1').destroy();
								UE.getEditor('myEditor2').destroy();
								UE.getEditor('myEditor3').destroy();
								UE.getEditor('myEditor4').destroy();
								UE.getEditor('myEditor5').destroy();
							},
							btn2: function(index, layero) {
								UE.getEditor('myEditor1').destroy();
								UE.getEditor('myEditor2').destroy();
								UE.getEditor('myEditor3').destroy();
								UE.getEditor('myEditor4').destroy();
								UE.getEditor('myEditor5').destroy();
							},
							yes: function(index, layero) {
								$('#checkinfo_out #checkinfo-form').trigger('validate');
							}
						});
					} else {
						layer.alert(data.msg);
					}

				});
			},
			/**
			 * 删除检查清单
			 */
			delCheckInfo = function(e, value, row, index) {
				layer.confirm('是否删除？', function(index) {
					$(this).doajax({
						url: 'checkInfo/del',
						data: {
							id: row.id
						}
					}, function() {
						$("#check-items-nav #checkinfo-table").bootstrapTable("refreshOptions", {
							pageNumber: 1
						}).bootstrapTable('refresh');
					});
					layer.close(index);
				});
			};

		//初始化树
		Mydao.ajax({
			clientid: Mydao.clientid
		}, 'checkItems/s1001', function(data) {
			var currentTime = data.serverTime;
			if(data.code == 200) {
				var result = data.result;
				$.fn.zTree.init($("#checkitems"), {
					data: {
						simpleData: {
							enable: true,
							idKey: 'id',
							pIdKey: 'parentid'
						}
					},
					callback: {
						onClick: function(event, treeId, treeNode, clickFlag) {
							if(treeNode.isParent) {
								return false;
							}
							var names = [];
							getSelectedAllName(treeNode, names);
							$('#right_lab').html(names.join('-'));
							$("#check-items-nav #checkinfo-table").bootstrapTable("refreshOptions", {
								pageNumber: 1,
								queryParams: function(p) {
									Mydao.config.ajaxParams.params = {};
									Mydao.config.ajaxParams.page.orderField = p.sortName;
									Mydao.config.ajaxParams.page.pageSize = p.pageSize;
									Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
									Mydao.config.ajaxParams.page.orderDirection = p.sortOrder;
									Mydao.config.ajaxParams.params.itemid = treeNode.id;
									return Mydao.config.ajaxParams;
								}
							});
						}
					}
				}, result);
			} else {
				layer.alert(data.msg);
			}

		});
		//初始化表格
		$("#check-items-nav #checkinfo-table").bootstrapTable({
			pagination: true,
			sidePagination: 'server',
			queryParamsType: "undefined", //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  //设置为limit可以获取limit, offset, search, sort, order  
			method: 'post',
			pageNumber: 1,
			url: Mydao.config.path + 'checkInfo/list',
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
				Mydao.config.ajaxParams.params.clientid = Mydao.clientid;
				return Mydao.config.ajaxParams;
			},
			columns: [{
				title: '序号',
				align: 'center',
				formatter: function(value, row, index) {
					return index + 1;
				}
			}, {
				title: '抽查依据',
				align: 'center',
				field: 'foundation',
			}, {
				title: '法文依据',
				align: 'center',
				field: 'lawfoundation',
			}, {
				title: '法条依据',
				align: 'center',
				field: 'originallaw',
			}, {
				title: '抽查内容',
				align: 'center',
				field: 'content',
				formatter: Mydao.nameFormatter,
				events: {
					'click a': showCheckInfo
				}
			}, {
				title: '抽查对象',
				align: 'center',
				field: 'checkobject',
			}, {
				title: '抽查方式',
				align: 'center',
				field: 'mode',
			}, {
				title: '操作　<permission opt="checkInfo_create"><i id="checkinfoadd" class="fa fa-plus-square-o" title="新增"></i></permission>',
				align: 'center',
				formatter: function(value, row, index) {
					var ctrls = [];
					if(Mydao.permissions['checkInfo_edit']) {
						ctrls.push('edit');
					}
					if(Mydao.permissions['checkInfo_del']) {
						ctrls.push('del');
					}
					return Mydao.operator(ctrls);
				},
				events: Mydao.operatorEvents({
					edit: editCheckInfo,
					del: delCheckInfo
				})
			}]
		});
	})();