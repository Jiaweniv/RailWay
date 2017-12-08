+ function($) {
	'use strict';
	(function() {
		var editer = {};
		var url = 'information/s1001',
			initInput = function(layero) {
				layero.find(".group-input").each(function(index, element) {
					$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
				});
				//  select和标头的组合
				layero.find(".group-select").each(function(index, element) {
					$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
				});
			},
			//编辑信息
			editDisclosure = function(e, value, row, index) {
				Mydao.ajax({
					id: row.id
				}, 'information/s1006', function(data) {
					var currentTime = data.serverTime;
					if(data.code == 200) {
						var result = data.result;
						layer.open({
							type: 1,
							content: "",
							title: "信息公开",
							area: ["70%", "90%"],
							moveOut: true,
							btn: ['保存', '返回'],
							btnAlign: 'c', //按钮居中
							success: function(layero, index) {
								layero.find('.layui-layer-content').load("view/disclosure/disclosure_edit.html", function() {
									editer = UE.getEditor('myEditor');
									var _content;
									Mydao.initselect(layero, null, function() {
										layero.find('#type option:contains("行政处罚"),#type option:contains("投诉举报")').remove();
										Mydao.setform($('#disclosure-edit'), result);
										_content = result.content;
										editer.ready(function() {
											editer.execCommand('inserthtml', _content, true);
										});
									}); //加载select
									initInput(layero);
								});
							},
							cancel: function(layero, index) {
								UE.getEditor('myEditor').destroy();
							},
							btn2: function(index, layero) {
								UE.getEditor('myEditor').destroy();
							},
							yes: function(index, layero) {
								$('#disclosure-edit').trigger('validate');
								if($('#disclosure-edit').data('validator').isFormValid()) {
									var dataf = $('#disclosure-edit').serializeJson();
									dataf.id = row.id;
									dataf.content = editer.getContent();
									$(this).doajax({
										url: 'information/s1005',
										data: dataf
									}, function() {
										UE.getEditor('myEditor').destroy();
										layer.close(index);
										$('#disclosure #disclosure-table').bootstrapTable("refreshOptions", {
											pageNumber: 1
										}).bootstrapTable("refresh");
									});
								}
							}
						});
					} else {
						layer.alert(data.msg);
					}

				});
			},
			//删除信息
			delDisclosure = function(e, value, row, index) {
				layer.confirm('确定删除？', {
					icon: 3,
					title: '提示'
				}, function(index) {
					Mydao.ajax({
						id: row.id
					}, 'information/s1007', function(result) {
						var currentTime = result.serverTime;
						if(result.code == 200) {
							$('#disclosure #disclosure-table').bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						} else {
							layer.alert(result.msg);
						}
					});
					layer.close(index);
				});
			},
			//显示信息
			showDisclosure = function(e, value, row, index) {
				if(row.type == '行政处罚') {
					Mydao.ajax({
						id: row.id
					}, 'information/s1002', function(data) {
						var currentTime = data.serverTime;
						if(data.code == 200) {
							var result = data.result;
							$.ajax({
								type: 'get',
								dataType: 'html',
								url: 'view/disclosure/showpenalties.html',
								success: function(resp) {
									layer.open({
										type: 1,
										content: resp,
										title: '查看',
										btn: ['返回'],
										btnAlign: 'c', //按钮居中
										area: ["70%", "90%"],
										moveOut: true,
										tipsMore: true,
										success: function(layero, index) {
											layero.find('#post').bootstrapTable({
												data: result.posts,
												columns: [{
													title: '职务',
													field: 'post',
													align: 'center'
												}, {
													title: '处罚决定',
													field: 'decision',
													align: 'center'
												}, {
													title: '处罚金额（元）',
													field: 'money',
													align: 'center'
												}]
											});
											initInput(layero);
										},
										cancel: function(layero, index) {
											//清空project对象
										},
									});
								},
								dataFilter: function(data) {
									return Mydao.setcontent(data, result);
								}
							});
						} else {
							layer.alert(data.msg);
						}

					});
				} else if(row.type == '投诉举报') {
					Mydao.ajax({
						id: row.id
					}, 'information/s1003', function(data) {
						var currentTime = data.serverTime;
						if(data.code == 200) {
							var result = data.result;
							$.ajax({
								type: 'get',
								dataType: 'html',
								url: 'view/disclosure/showreport.html',
								success: function(resp) {
									layer.open({
										type: 1,
										content: resp,
										btn: ['返回'],
										btnAlign: 'c', //按钮居中
										area: ["70%", "90%"],
										moveOut: true,
										success: function(layero, index) {
											editer = UE.getEditor('myEditor');
											initInput(layero);
											editer.ready(function() {
												editer.execCommand('inserthtml', result.content, true);
												editer.setDisabled();
											});

										},
										cancel: function(layero, index) {
											UE.getEditor('myEditor').destroy();
										}
									});
								},

								dataFilter: function(data) {
									return Mydao.setcontent(data, result);

								}
							});
						} else {
							layer.alert(data.msg);
						}

					});
				} else {
					Mydao.ajax({
						id: row.id
					}, 'information/s1006', function(data) {
						var currentTime = data.serverTime;
						if(data.code == 200) {
							var result = data.result;
							layer.open({
								type: 1,
								content: "",
								title: "信息公开",
								area: ["70%", "90%"],
								moveOut: true,
								success: function(layero, index) {
									layero.find('.layui-layer-content').load("view/disclosure/disclosure_edit.html", function() {
										editer = UE.getEditor('myEditor');
										Mydao.initselect(layero, null, function() {
											Mydao.setform($('#disclosure-edit'), result);
											editer.ready(function() {
												editer.execCommand('inserthtml', result.content, true);
												editer.setDisabled();
											});
										}); //加载select
										initInput(layero);
										layero.find("select,input,textarea").attr("disabled", "disabled");
										setTimeout(function() {
											layero.find(".layui-upload-button,.fa-times-circle").remove();
											layero.find(".layui-layer-btn").remove();
										}, 500);
									});
								},
								cancel: function(layero, index) {
									//清空project对象
									UE.getEditor('myEditor').destroy();
								},
							});
						} else {
							layer.alert(data.msg);
						}

					});
				}
			};
		$('#disclosure #disclosure-table').bootstrapTable({
			pagination: true,
			sidePagination: 'server',
			queryParamsType: "undefined", //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  //设置为limit可以获取limit, offset, search, sort, order  
			method: 'post',
			pageNumber: 1,
			url: Mydao.config.path + url,
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
				Mydao.config.ajaxParams.params.title = $('#disclosure #title').val();
				Mydao.config.ajaxParams.params.type = $('#disclosure #type').val() ? $('#disclosure #type option:selected').text() : '';
				return Mydao.config.ajaxParams;
			},
			columns: [{
				title: '类型',
				field: 'type',
				align: 'center'
			}, {
				title: '标题',
				align: 'center',
				field: 'title',
				formatter: Mydao.nameFormatter,
				events: {
					'click a': showDisclosure
				}
			}, {
				title: '发布时间',
				field: 'createtime',
				align: 'center'
			}, {
				title: '操作',
				align: 'center',
				formatter: function(value, row, index) {
					if(row.type != '行政处罚' && row.type != '投诉举报') {
						var ctrls = [];
						if(Mydao.permissions['disclosure_edit']) {
							ctrls.push('edit');
						}
						if(Mydao.permissions['disclosure_del']) {
							ctrls.push('del');
						}
						return Mydao.operator(ctrls);
					}
				},
				events: Mydao.operatorEvents({
					edit: editDisclosure,
					del: delDisclosure
				})
			}]
		});
		$('#Disclosure_lzh').find("#type").change(function() {
			$('#disclosure #disclosure-table').bootstrapTable("refreshOptions", {
				pageNumber: 1
			}).bootstrapTable("refresh");
		});
		$('#Disclosure_lzh').find('#search').on('click', function(event) {
			$('#disclosure #disclosure-table').bootstrapTable("refreshOptions", {
				pageNumber: 1
			}).bootstrapTable("refresh");
		});
		$('#Disclosure_lzh').find('#save').on('click', function(event) {
			layer.open({
				type: 1,
				content: "",
				title: "信息公开",
				area: ["70%", "90%"],
				moveOut: true,
				btn: ['保存', '返回'],
				btnAlign: 'c', //按钮居中
				success: function(layero, index) {
					layero.find('.layui-layer-content').load("view/disclosure/disclosure_edit.html", function() {
						editer = UE.getEditor('myEditor');
						Mydao.initselect(layero, null, function() {
							layero.find('#type option:contains("行政处罚"),#type option:contains("投诉举报")').remove();
						}); //加载select
						initInput(layero);
					});
				},
				yes: function(index, layero) {
					$('#disclosure-edit').trigger('validate');
					if($('#disclosure-edit').data('validator').isFormValid()) {
						$(this).doajax({
							url: 'information/s1004',
							data: $('#disclosure-edit').serializeJson()
						}, function() {
							UE.getEditor('myEditor').destroy();
							layer.close(index);
							$('#disclosure #disclosure-table').bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						});
					}
				},
				cancel: function(layero, index) {
					//清空project对象
					UE.getEditor('myEditor').destroy();
				},
				btn2: function(layero, index) {
					UE.getEditor('myEditor').destroy();
				}

			});
		});

		Mydao.initselect('#Disclosure_lzh #disclosure');
	})();
}(jQuery);