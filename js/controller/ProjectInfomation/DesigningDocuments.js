//菜单管理
+ function($) {
	'use strict';
	(function() {
		
		var initUpload = function() {
			//上传文件
			$("#designingdocuments #designingdocuments_file_btn").on('click', function() {
				var tree = $.fn.zTree.getZTreeObj("designingdocuments_folder_tree");
				var _selectNode = tree.getSelectedNodes();
				if(_selectNode.length == 0) {
					layer.msg("请选择要操作的文件夹");
					return false;
				} else {
					_selectNode = _selectNode[0];
				}
				if(_selectNode.level != 1) {
					layer.msg("该目录不能上传文件");
					return false;
				}

				layer.open({
					id: "designingdocuments_file_btn_1",
					type: 1,
					title: '上传文件',
					btnAlign: 'c',
					content: '',
					area: ["400px", "400px"],
					btn: ['上传', '取消'],
					success: function(layero, index) {
						layero.find('.sidebar-collapse').slimScroll({
							height: '100%',
						});
						layero.find('.layui-layer-content').load('view/ProjectInformation/DesigningUpload.html', function() {
							layero.find('.sidebar-collapse').slimScroll({
								height: '100%',
							});
							layero.find(".group-input").each(function(index, element) {
								$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
							});
							//  select和标头的组合
							layero.find(".group-select").each(function(index, element) {
								$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
							});
						});
					},
					yes: function(index, layero) {
						var fileinput = $("#designingdocumentsfile_hlj [name='designingdocumentsfile']"),
							fileid = fileinput.val(),
							filename = fileinput.attr("filename"),
							folderid = _selectNode.id;

						Mydao.ajax({
							"folderid": folderid,
							"fileid": fileid,
							"filename": filename
						}, 'design/insertDesign', function(result) {
							if(result.code == 200) {
								layer.alert("操作成功！");
								$("#designingdocumentsfile_hlj #designingdocumentsfile").em;
								$("#designingdocuments_table_lzh").bootstrapTable("refreshOptions", {
									pageNumber: 1,
									queryParams: function(p) {
										Mydao.config.ajaxParams.params = {};
										Mydao.config.ajaxParams.page.orderField = p.sortName;
										Mydao.config.ajaxParams.page.pageSize = p.pageSize;
										Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
										Mydao.config.ajaxParams.page.orderDirection = p.sortOrder;
										Mydao.config.ajaxParams.params.folderid = folderid;
										return Mydao.config.ajaxParams;
									}
								});
								$("#designingdocuments #designingdocuments_file_btn").show();
								initUpload();
								layer.close(index);
							} else {
								layer.alert(result.msg);
							}

						});
					},
					cancel: function(index, layero) {
						layero.find("input").val("");
					}
				});
			});
		};

		//定义右侧内容区宽度
		$('#designingdocuments .module-right-box').width(function(index, width) {
				return(width, $(this).parent().width() - $(this).parent().find('.module-left-box').outerWidth(true) - 32);
		});
			//tree setting
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
					var folderid = '',
						dictid = '';
					if(treeNode.level == 0) {
						dictid = treeNode.id;
					} else {
						folderid = treeNode.id;
					}

					$("#designingdocuments_table_lzh").bootstrapTable("refreshOptions", {
						pageNumber: 1,
						queryParams: function(p) {
							Mydao.config.ajaxParams.params = {};
							Mydao.config.ajaxParams.page.orderField = p.sortName;
							Mydao.config.ajaxParams.page.pageSize = p.pageSize;
							Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
							Mydao.config.ajaxParams.page.orderDirection = p.sortOrder;
							Mydao.config.ajaxParams.params.dictid = dictid;
							Mydao.config.ajaxParams.params.folderid = folderid;
							return Mydao.config.ajaxParams;
						}
					});
					if(treeNode.level == 0) {
						$("#designingdocuments_file_btn").hide();
					} else {
						$("#designingdocuments_file_btn").show();
					}
					initUpload();

				}
			}
		};

		//初始化树
		var initTree = function(projectid, sectionid, folderid) {
			//获取文件夹
			var zNodes = [];
			Mydao.ajax({
				"projectid": projectid,
				"sectionid": sectionid
			}, 'designFolder/findDesignFolder', function(result) {
				var currentTime = result.serverTime;
				if(result.code == 200) {
					var data = result.result;
					if(data) {
						$.each(data, function(index, val) {
							zNodes.push({
								id: val.id,
								name: val.name,
								type: val.type,
								pId: val.type,
								projectid: val.projectid,
								sectionid: val.sectionid
							});
						});
					}
					$("#designingdocuments #designingdocuments_folder_tree").children().remove();
					$.fn.zTree.init($("#designingdocuments #designingdocuments_folder_tree"), setting, zNodes);
				} else {
					layer.alert("操作失败！");
				}

			});
		};

		//下载
		var designdocument_download = function(e, value, row, index) {
			window.open(MydaoFileDownPath + "?fileId=" + row.fileid);
		};

		//删除
		var designdocument_del = function(e, value, row, index) {
			//询问框
			layer.open({
				title: '消息提示', //标题
				content: '确定要删除该文件吗？', //内容
				icon: 3,
				btn: ['确认', '取消'], //按钮
				btnAlign: 'c', //按钮居中
				yes: function(index, layero) {
					Mydao.ajax({
						"id": row.id
					}, 'design/deleteDesign', function(result) {
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						var currentTime = result.serverTime;
						if(result.code == 200) {
							layer.alert("操作成功！");
							var projectid = $("#designingdocuments select[name='projectid']").val(),
								sectionid = $("#designingdocuments select[name='sectionid']").val(),
								folderid = '',
								dictid = '';

							var tree = $.fn.zTree.getZTreeObj("designingdocuments_folder_tree");
							var treeNode = tree.getSelectedNodes()[0];
							if(treeNode) {
								if(treeNode.level == 0) {
									dictid = treeNode.id;
								} else {
									folderid = treeNode.id;
								}
							}
							$("#designingdocuments_table_lzh").bootstrapTable("refreshOptions", {
								pageNumber: 1,
								queryParams: function(p) {
									Mydao.config.ajaxParams.params = {};
									Mydao.config.ajaxParams.page.orderField = p.sortName;
									Mydao.config.ajaxParams.page.pageSize = p.pageSize;
									Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
									Mydao.config.ajaxParams.page.orderDirection = p.sortOrder;
									Mydao.config.ajaxParams.params.projectid = projectid;
									Mydao.config.ajaxParams.params.sectionid = sectionid;
									Mydao.config.ajaxParams.params.folderid = folderid;
									Mydao.config.ajaxParams.params.dictid = dictid;
									return Mydao.config.ajaxParams;
								}
							});
							if(treeNode && treeNode.level == 1) {
								$("#designingdocuments_file_btn").show();
							}
							initUpload();
						} else {
							layer.alert(result.msg);
						}

					});
				}
			});

		};

		//初始化列表
		var initTable = function(folderid) {
			//表格
			var url = "designFolder/findAllDesignPage";
			$('#designingdocuments #designingdocuments_table_lzh').bootstrapTable({
				pagination: true,
				sidePagination: 'server',
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
					title: '文件名称',
					field: 'filename',
					align: 'center',
					valign: 'middle'
				}, {
					title: '上传时间',
					field: 'createtime',
					align: 'center',
					formatter: function(val, row, index) {
						return Mydao.formatDate(row.createtime,"YYYY-MM-DD hh:mm:ss");
					}
				}, {
					title: '操作<permission opt="design_upload"><a id="designingdocuments_file_btn" herf="javascript:;" class="ml10 " title="上传文件" style="display:none;"><i class="fa fa-upload"></i></a></permission>',
					align: 'center',
					formatter: function(value, row, index) {
						var ctrls = [];
						//下载
						if(Mydao.permissions['design_down']) {
							ctrls.push('download');
						}
						//删除
						if(Mydao.permissions['design_del']) {
							ctrls.push('del');
						}
						return Mydao.operator(ctrls);
					},
					events: Mydao.operatorEvents({
						download: designdocument_download,
						del: designdocument_del
					})
				}]
			});
		};

		//初始化下拉框
		Mydao.initselect($("#designingdocuments"), null, function() {
			initTree();
			initTable();
		});

		//监听项目改变
		$("#designingdocuments select[name='projectid']").on('change', function() {
			initTree($("#designingdocuments select[name='projectid']").val());
//			$("#designingdocuments_folder_add").hide();
			$("#designingdocuments_table_lzh").bootstrapTable("refreshOptions", {
				pageNumber: 1,
				queryParams: function(p) {
					Mydao.config.ajaxParams.params = {};
					Mydao.config.ajaxParams.page.orderField = p.sortName;
					Mydao.config.ajaxParams.page.pageSize = p.pageSize;
					Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
					Mydao.config.ajaxParams.page.orderDirection = p.sortOrder;
					Mydao.config.ajaxParams.params.projectid = $("#designingdocuments select[name='projectid']").val();
					return Mydao.config.ajaxParams;
				}
			});
		});

		//监听标段改变
		$("#designingdocuments select[name='sectionid']").on('change', function() {
//			if($("#designingdocuments select[name='sectionid']").val()) {
//				$("#designingdocuments_folder_add").show();
//			} else {
//				$("#designingdocuments_folder_add").hide();
//			}
			initTree($("#designingdocuments select[name='projectid']").val(), $("#designingdocuments select[name='sectionid']").val());
			$("#designingdocuments_table_lzh").bootstrapTable("refreshOptions", {
				pageNumber: 1,
				queryParams: function(p) {
					Mydao.config.ajaxParams.params = {};
					Mydao.config.ajaxParams.page.orderField = p.sortName;
					Mydao.config.ajaxParams.page.pageSize = p.pageSize;
					Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
					Mydao.config.ajaxParams.page.orderDirection = p.sortOrder;
					Mydao.config.ajaxParams.params.projectid = $("#designingdocuments select[name='projectid']").val();
					Mydao.config.ajaxParams.params.sectionid = $("#designingdocuments select[name='sectionid']").val();
					return Mydao.config.ajaxParams;
				}
			});
		});

		//添加文件夹
		$("#designingdocuments_folder_add").on("click", function() {
			if(!$("#designingdocuments select[name='sectionid']").val()){
				layer.msg("请选择标段");
				return false;
			}
			
			layer.open({
				type: 1,
				title: '添加文件夹',
				btnAlign: 'c',
				content: $("#designingdocuments_create"),
				area: ["455px", "300px"],
				cancel: function(index, layero) {
					layero.find("input").val("");
				},
				btn: ['保存', '取消'],
				success: function(layero, index) {
					layero.find("form span").filter(".myClass").remove();
					$("#designingdocuments_create select[name='type']").children().remove();
					var tree = $.fn.zTree.getZTreeObj("designingdocuments_folder_tree");
					//获取所有一级菜单
					var nodes = tree.getNodesByParam("level", 0, null);
					$.each(nodes, function(index, val) {
						$("#designingdocuments_create select[name='type']").append('<option value="' + val.id + '">' + val.name + '</option>');
					});
				},
				yes: function(index, layero) {
					layero.find("form").trigger("validate");
					if(!layero.find("form").data("validator").isFormValid()) return false;
					var fname = $("#designingdocuments_create input[name=name]").val(),
						projectid = $("#designingdocuments select[name='projectid']").val(),
						sectionid = $("#designingdocuments select[name='sectionid']").val(),
						type = $("#designingdocuments_create select[name='type']").val();
					Mydao.ajax({
						"name": fname,
						"projectid": projectid,
						"sectionid": sectionid,
						"type": type,
					}, 'designFolder/insertDesignFolder', function(result) {
						layero.find("input").val("");
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						var currentTime = result.serverTime;
						if(result.code == 200) {
							layer.alert("操作成功！");
							//刷新页面
							initTree($("#designingdocuments select[name='projectid']").val(), $("#designingdocuments select[name='sectionid']").val());
						} else {
							layer.alert(result.msg);
						}
					});
				},
				btn2: function(index, layero) {
					layero.find("input").val("");
				}
			});
		});

		//编辑文件夹
		$("#designingdocuments_folder_edit").on("click", function() {
			var tree = $.fn.zTree.getZTreeObj("designingdocuments_folder_tree");
			var _selectNode = tree.getSelectedNodes()[0];
			//解决什么都不选的时候直接点编辑报错问题
			if(_selectNode==null){
				layer.msg("请选择要编辑的目录！");
				return false;
			}
			if(_selectNode.level != 1) {
				layer.msg("该目录不能编辑");
				return false;
			}
			//打开窗口
			layer.open({
				type: 1,
				title: '编辑文件夹',
				btnAlign: 'c',
				content: $("#designingdocuments_edit"),
				area: ["26%", "150px"],
				cancel: function(index, layero) {
					layero.find("input").val("");
				},
				btn: ['保存', '取消'],
				success: function(layero, index) {
					layero.find("form span").filter(".myClass").remove();
					$("#designingdocuments_edit input[name=name]").val(_selectNode.name);
				},
				yes: function(index, layero) {
					layero.find("form").trigger("validate");
					if(!layero.find("form").data("validator").isFormValid()) return false;
					var fname = $("#designingdocuments_edit input[name=name]").val();
					Mydao.ajax({
						"id": _selectNode.id,
						"name": fname,
						"projectid": _selectNode.projectid,
						"sectionid": _selectNode.sectionid,
						"type": _selectNode.type,
					}, 'designFolder/updateDesignFolder', function(result) {
						layero.find("input").val("");
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						if(result.code == 200) {
							layer.alert("操作成功！");
							initTree($("#designingdocuments select[name='projectid']").val(), $("#designingdocuments select[name='sectionid']").val());
						} else {
							layer.alert(result.msg);
						}
					});
				},
				btn2: function(index, layero) {
					layero.find("input").val("");
				}
			});
		});

		//删除文件夹
		$("#designingdocuments_folder_del").on("click", function() {
			var tree = $.fn.zTree.getZTreeObj("designingdocuments_folder_tree");
			var _selectNode = tree.getSelectedNodes()[0];
			if(_selectNode.level == 0) {
				layer.msg(_selectNode.name + '不能被删除！');
				return false;
			}
			//询问框
			layer.open({
				title: '消息提示', //标题
				content: '确定要删除该文件夹吗？', //内容
				icon: 3,
				btn: ['确认', '取消'], //按钮
				btnAlign: 'c', //按钮居中
				yes: function(index, layero) {
					Mydao.ajax({
						"id": _selectNode.id
					}, 'designFolder/deleteDesignFolder', function(result) {
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						var currentTime = result.serverTime;
						if(result.code == 200) {
							layer.alert("操作成功！");
							//刷新页面
							initTree($("#designingdocuments select[name='projectid']").val(), $("#designingdocuments select[name='sectionid']").val());
						} else {
							layer.alert(result.msg);
						}

					});
				}
			});

		});
		
		//对项目赋值
//		$("#designingdocuments select[name='projectid']").val($("#base_projectid").val());
		$("#designingdocuments select[name='projectid']").change();
	})();
}(jQuery);