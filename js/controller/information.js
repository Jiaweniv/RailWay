(function() {
	'use strict';
	var editer = {};
	var url = '/document/findAllDocumentPage';
	var fileDownload = function(e, value, row, index) {
		Mydao.ajax({
			"id": row.id
		}, "document/getDocument", function(data) {
			var currentTime = data.serverTime;
			if(data.code) {
				var result = data.result;
				if(result.file && result.id == row.id) {
					window.location.href = MydaoFileDownPath + "?fileId=" + result.file;
				} else {
					layer.alert("该资料未上传附件");
				}
			}
		});

	};
	var editProject = function(e, value, row, index) {
			Mydao.ajax({
				"id": row.id
			}, 'document/getDocument', function(result) {
				var currentTime = result.serverTime;
				if(result.code == 200) {
					var resultForm = result.result;
					layer.open({
						type: 1,
						content: '',
						btn: ['保存', '返回'], //按钮
						shadeClose: false, //遮罩
						//							btnAlign: 'c', //按钮居中
						area: ["70%", "90%"],
						moveOut: true,
						success: function(layero, index) {
							layero.find('.layui-layer-content').load('view/Information_edit.html', function() {
								editer = UE.getEditor('myEditor');
								var _content;
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

								Mydao.initselect(layero, null, function() {
									Mydao.setform(layero, resultForm); //填充表单的值
									_content = resultForm.content;
									editer.ready(function() {
										editer.execCommand('inserthtml', _content, true);
									});
								}); //加载select
							});
						},
						yes: function(index, layero) { //回调
							layero.find("form").trigger("validate");
							if(!layero.find("form").data("validator").isFormValid()) return false;
							var _editorContent = editer.getContent().replace(/<.*?>/ig, "");
							//								if(_editorContent.length > 500) {
							//									layer.msg('不能超过500个字符')
							//									return false;
							//								}
							Mydao.ajax({
								"id": row.id,
								"title": $("#title").val(),
								"type": $("#information_type").val(),
								//									"content": $("#LAY_demo1").val(),
								"content": editer.getContent(),
								"file": $("#file").val()
							}, 'document/updateDocument', function(result) {
								UE.getEditor('myEditor').destroy();
								layer.close(index); //如果设定了yes回调，需进行手工关闭
								var currentTime = result.serverTime;
								if(result.code == 200) {
									layer.alert("操作成功！");
									//刷新页面
									$("#information #information-table").bootstrapTable("refreshOptions", {
										pageNumber: 1
									}).bootstrapTable("refresh");
								} else {
									layer.alert("操作失败！");
								}
							});
						},
						cancel: function(layero, index) {
							UE.getEditor('myEditor').destroy();
						},
						btn2: function(index, layero) {
							UE.getEditor('myEditor').destroy();
						}
					});
				} else {
					layer.alert(result.msg);
				}

			});
		},
		delProject = function(e, value, row, index) {
			layer.confirm('确定删除？', {
				icon: 3,
				title: '提示'
			}, function(index) {
				Mydao.ajax({
					id: row.id
				}, 'document/deleteDocument', function(result) {
					var currentTime = result.serverTime;
					if(result.code == 200) {
						$("#information #information-table").bootstrapTable("refreshOptions", {
							pageNumber: 1
						}).bootstrapTable("refresh");
					} else {
						layer.alert(result.msg);
					}
				});
				layer.close(index);
			});
		};
	var showProject = function(e, value, row, index) {
		Mydao.ajax({
			"id": row.id
		}, 'document/getDocument', function(result) {
			var currentTime = result.serverTime;
			if(result.code == 200) {
				var resultForm = result.result;
				layer.open({
					type: 1,
					content: '',
					shadeClose: false, //遮罩
					//						btnAlign: 'c', //按钮居中
					area: ["70%", "90%"],
					success: function(layero, index) {
						layero.find('.layui-layer-content').load('view/Information_show.html', function() {
							Mydao.ShowHuiTian(layero, resultForm);
							layero.find('#DOCUMENT').html(Data.DOCUMENT(resultForm.type));
						});
					},
					cancel: function(layero, index) {},
				});
			} else {
				layer.alert(result.msg);
			}
		});

	};
	$('#information #information-table').bootstrapTable({
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
			Mydao.config.ajaxParams.page.orderField = 'updatetime';
			Mydao.config.ajaxParams.page.pageSize = p.pageSize;
			Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
			Mydao.config.ajaxParams.page.orderDirection = 'desc';
			Mydao.config.ajaxParams.params.title = $('#information #searchor [name="title"]').val();
			Mydao.config.ajaxParams.params.starttime = $('#information #searchor [name="starttime"]').val();
			Mydao.config.ajaxParams.params.endtime = $('#information #searchor [name="endtime"]').val();
			return Mydao.config.ajaxParams;
		},
		columns: [{
			title: '类型',
			align: 'center',
			field: 'type',
		}, {
			title: '标题',
			align: 'center',
			field: 'title',
			formatter: Mydao.nameFormatter,
			events: {
				'click a': showProject
			}
		}, {
			title: '发布时间',
			align: 'center',
			field: 'updatetime',
			formatter: function(val, row, index) {
				return Mydao.formatDate(row.updatetime, "YYYY-MM-DD hh:mm:ss");
			}
		}, {
			title: '操作',
			align: 'center',
			formatter: function(value, row, index) {
				var ctrls = [];
				if(Mydao.permissions['document_edit']) {
					ctrls.push('edit');
				}
				//删除
				if(Mydao.permissions['document_del']) {
					ctrls.push('del');
				}
				if(Mydao.permissions['central_download']) {

					ctrls.push('download');

				}

				return Mydao.operator(ctrls);
			},
			events: Mydao.operatorEvents({
				edit: editProject,
				del: delProject,
				//view: showProject
				download: fileDownload
			})
		}]
	});

	$('#information_lzh').find('#search').on('click', function(event) {
		$("#information #information-table").bootstrapTable("refreshOptions", {
			pageNumber: 1
		}).bootstrapTable("refresh");
	});
	$('#information_lzh').find('#save').on('click', function(event) {
		layer.open({
			type: 1,
			content: '',
			btn: ['保存', '返回'], //按钮
			shadeClose: false, //遮罩
			//				btnAlign: 'c', //按钮居中
			area: ["70%", "90%"],
			moveOut: true,
			success: function(layero, index) {
				layero.find('.layui-layer-content').load('view/Information_edit.html', function() {
					editer = UE.getEditor('myEditor');
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
					Mydao.initselect(layero);
				});
			},
			yes: function(index, layero) { //回调
				layero.find("form").trigger("validate");
				if(!layero.find("form").data("validator").isFormValid()) return false;
				var _content = $("#document_information_mydao").serializeJson().content.replace(/<.*?>/ig, "");
				//备注后台限制496
				//					if(_content.length > 500) {
				//						layer.msg('不能超过500个字符')
				//						return false;
				//					}
				Mydao.ajax($("#document_information_mydao").serializeJson(), 'document/insertDocument', function(result) {
					layero.find("input").val("");
					UE.getEditor('myEditor').destroy();
					layer.close(index); //如果设定了yes回调，需进行手工关闭
					var currentTime = result.serverTime;
					if(result.code == 200) {
						layer.alert("操作成功！");
						//刷新页面
						$("#information #information-table").bootstrapTable("refreshOptions", {
							pageNumber: 1
						}).bootstrapTable("refresh");
					} else {
						layer.alert("操作失败！");
					}
				});
			},
			cancel: function(layero, index) {
				index.find("input").val("");
				UE.getEditor('myEditor').destroy();
			},
		});
	});
})();