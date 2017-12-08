+ function($) {
	'use strict';
	(function() {
		var _params = $("#sectionid").data('params').toObj ? $("#sectionid").data('params').toObj() : {};
		_params.projectid = $("#project-overview #projectid").val();
		$("#sectionid").data('params', JSON.stringify(_params).replace(/"/g, "'")).attr('data-params', JSON.stringify(_params).replace(/"/g, "'"));
		Mydao.initselect("#cjdw-qtcjdw");
	})($);
	(function() {
		var editJswd = function(e, value, row, index) {
				//建设单位编辑
				Mydao.ajax({
					projectid: $("#project-overview #projectid").val()
				}, 'participateUnit/s1003', function(data) {
					var currentTime = data.serverTime;
					if(data.code == 200) {
						var result = data.result;
						editcjdw('participateUnit/s1002', result, function() {
							$('#jsdw').bootstrapTable('refresh');
						});
					} else {
						layer.alert(data.msg);
					}
				});
			},
			editQtcjdw = function(e, value, row, index) {
				//编辑其他参建单位
				Mydao.ajax({
					unitid: row.id,
					sectionid: $('#tab-5 #sectionid').val()
				}, 'sectionUnit/s1004', function(data) {
					var currentTime = data.serverTime;
					if(data.code == 200) {
						var result = data.result;
						editcjdw('sectionUnit/s1003', result, function() {
							$('#qtcjdw').bootstrapTable('refresh');
						});
					} else {
						layer.alert(data.msg);
					}
				});
			},
			delQtcjdw = function(e, value, row, index) {
				//删除其他参建单位
				layer.confirm('是否删除？', function(index) {
					$(this).doajax({
						url: 'sectionUnit/s1005',
						data: {
							unitid: row.id
						}
					}, function() {
						$('#qtcjdw').bootstrapTable('refresh');
					});
					layer.close(index);
				});
			};
		$('#jsdw').bootstrapTable({
			method: 'post',
			url: Mydao.config.path + 'participateUnit/s1001',
			uniqueId: "id", //唯一标识,
			responseHandler: function(res) { //设置返回数据
				if(res.code == 200) {
					if(res.result.length > 0) {
						$('#cjdwadd').remove();
					}
					return res.result;
				}
			},
			ajaxOptions: {
				ContentType: 'application/json',
				dataType: 'json'
			},
			queryParams: function(p) {
				Mydao.config.ajaxParams.params = {};
				Mydao.config.ajaxParams.params.projectid = $("#project-overview #projectid").val();
				return Mydao.config.ajaxParams;
			},
			columns: [{
				title: '机构类型',
				field: 'typename',
			}, {
				title: '机构名称',
				field: 'name',
				formatter: Mydao.nameFormatter,
				events: {
					'click a': function(e, value, row, index) {
						//显示机构
						Mydao.ajax({
							projectid: $("#project-overview #projectid").val()
						}, 'participateUnit/s1003', function(data) {
							var currentTime = data.serverTime;
							if(data.code == 200) {
								var result = data.result;
								showcjdw(result);
							} else {
								layer.alert(data.msg);
							}
						});
					}
				}
			}, {
				title: '联系人',
				field: 'contacts',
			}, {
				title: '手机号码',
				field: 'tel',
			}, {
				title: '操作　<i id="cjdwadd" class="fa fa-plus-square-o" title="新增"></i>',
				align: 'center',
				formatter: function(value, row, index) {
					return Mydao.operator(['edit']);
				},
				events: Mydao.operatorEvents({
					edit: editJswd
				})
			}]
		});
		//加载其他参建单位列表
		$('#qtcjdw').bootstrapTable({
			method: 'post',
			url: Mydao.config.path + 'sectionUnit/s1001',
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
				Mydao.config.ajaxParams.params.projectid = $("#project-overview #projectid").val();
				Mydao.config.ajaxParams.params.sectionid = $('#sectionid').val();
				return Mydao.config.ajaxParams;
			},
			columns: [{
				title: '机构类型',
				field: 'typename',
			}, {
				title: '机构名称',
				field: 'name',
				formatter: Mydao.nameFormatter,
				events: {
					'click a': function(e, value, row, index) {
						//显示机构
						Mydao.ajax({
							unitid: row.id,
							sectionid: $("#cjdw-qtcjdw #sectionid").val()
						}, 'sectionUnit/s1004', function(result) {
							var currentTime = result.serverTime;
							if(result.code == 200) {
								var _result = result.result;
								showcjdw(_result);
							} else {
								layer.alert(result.msg);
							}
						});
					}
				}
			}, {
				title: '联系人',
				field: 'contacts',
			}, {
				title: '手机号码',
				field: 'tel',
			}, {
				title: '操作　<i id="qtcjdwadd" class="fa fa-plus-square-o" title="新增"></i>',
				align: 'center',
				formatter: function(value, row, index) {
					var ctrls = [];
					if(Mydao.permissions['sectionunit_edit']) {
						ctrls.push('edit');
					}
					if(Mydao.permissions['sectionunit_del']) {
						ctrls.push('del');
					}
					return Mydao.operator(ctrls);
				},
				events: Mydao.operatorEvents({
					edit: editQtcjdw,
					del: delQtcjdw
				})
			}]
		});
		var editcjdw = function(url, data, _callback) {
				var unitid = data ? data.unit.unitid : undefined;
				layer.open({
					type: 1,
					content: "",
					title: "添加参建单位",
					area: ["70%", "90%"],
					moveOut: true,
					btn: ['保存'],
					success: function(layero, index) {
						layero.find('.layui-layer-content').load("view/ProjectInformation/overview/cjdw_edit.html", function(result) {
							$("[name='email']").attr('disabled', 'disabled').addClass('module-grays');
							$("[name='tel']").attr('disabled', 'disabled').addClass('module-grays');
							$("[name='contacts']").attr('disabled', 'disabled').addClass('module-grays');
							$("[name='fax']").attr('disabled', 'disabled').addClass('module-grays');
							layero.find(".group-input").each(function(index, element) {
								$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
							});
							//  select和标头的组合
							layero.find(".group-select").each(function(index, element) {
								$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
							});
							Mydao.initselect(layero); //加载select
							$('#cjdw-person-table').bootstrapTable({
								method: 'post',
								url: Mydao.config.path + 'organization/s1001',
								queryParams: function(p) {
									Mydao.config.ajaxParams.params = {};
									Mydao.config.ajaxParams.params.orgid = unitid;
									return Mydao.config.ajaxParams;
								},
								uniqueId: "personid", //唯一标识,
								responseHandler: function(res) { //设置返回数据
									if(res.code == 200) {
										return res.result;
									}
								},
								ajaxOptions: {
									ContentType: 'application/json',
									dataType: 'json'
								},
								columns: [{
									checkbox: true,
									title: '全选',
									formatter: function(value, row, index) {
										var fla = false;
										if(data) {
											$.each(data.persons, function(a, b) {
												if(b.personid == row.id) {
													fla = true;
												}
											});
										}
										return fla;
									}
								}, {
									title: '姓名',
									field: 'name',
								}, {
									title: '职务',
									field: 'post'
								}, {
									title: '办公电话',
									field: 'officephone',
								}, {
									title: '手机号码',
									field: 'phone',
								}]
							});
							if(data) {
								Mydao.setform(layero.find('#cjdw-form'), data.unit);
							}

							$('#cjdw-2search').on('click', function() {
								layer.open({
									type: 1,
									content: $("#org_seach_table").html(),
									title: "单位搜索",
									area: ["60%", "80%"],
									moveOut: true,
									success: function(layeroc, indexc) {
										layeroc.find(".group-input").each(function(index, element) {
											$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 40);
										});
										//  select和标头的组合
										layeroc.find(".group-select").each(function(index, element) {
											$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 35);
										});
										layeroc.find('#cjdw-org-table').bootstrapTable({
											method: 'post',
											url: Mydao.config.path + 'organization/s1004',
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
												Mydao.config.ajaxParams.params.clientid = Mydao.clientid;
												return Mydao.config.ajaxParams;
											},

											columns: [{
												title: '机构名称',
												field: 'name',
											}, {
												title: '联系人',
												field: 'contacts'
											}, {
												title: '联系电话',
												field: 'tel'
											}],
											onClickRow: function(row) {
												var _tyepval = layero.find('#cjdw-form #type').val();
												row.type = _tyepval;
												Mydao.initselect(layero.find('#cjdw-form'), null, function() {
													Mydao.setform(layero.find('#cjdw-form'), row);
												});
												$('#cjdw-person-table').bootstrapTable("refreshOptions", {
													url: Mydao.config.path + 'organization/s1001',
													queryParams: function(p) {
														Mydao.config.ajaxParams.params = {};
														Mydao.config.ajaxParams.params.orgid = row.id;
														return Mydao.config.ajaxParams;
													}
												});
												unitid = row.id;
												layeroc.find('#cjdw-org-table').bootstrapTable("destroy");
												layer.close(indexc);
											}
										});
										layeroc.find('#cjdw-search').on('click', function() {
											layeroc.find('#cjdw-org-table').bootstrapTable('refreshOptions', {
												url: Mydao.config.path + 'organization/s1004',
												queryParams: function(p) {
													Mydao.config.ajaxParams.params = {};
													Mydao.config.ajaxParams.params.grouptype = layeroc.find('#leixing').val();
													Mydao.config.ajaxParams.params.orgName = layeroc.find('#dwmc').val();
													Mydao.config.ajaxParams.params.clientid = Mydao.clientid;
													return Mydao.config.ajaxParams;
												}
											});
										});
									}
								});
							});
						});
					},
					cancel: function(layero, index) {
						Mydao.currentPage.params = {}; //清空当前页面参数
						Mydao.currentPage.params.projectid = undefined; //清空项目ID
					},
					yes: function(index, layero) {
						var rows = layero.find('#cjdw-person-table').bootstrapTable('getSelections');
						var type = layero.find('#type').val();
						if(!type) {
							layer.msg('请选择类型!');
							return false;
						}
						var unit = {
								id: data ? data.unit.id : undefined, //其他参建单位
								type: type,
								unitid: unitid,
								projectid: $('#project-overview #projectid').val(),
								clientid: Mydao.clientid,
								sectionid: $('#cjdw-qtcjdw #sectionid').val()
							},
							persons = [],
							rejson = {};
						$.each(rows, function(a, b) {
							var po = {
								unitid: unitid,
								personid: b.id,
								projectid: $('#project-overview #projectid').val(),
								clientid: Mydao.clientid
							};
							persons.push(po);
						});
						rejson = {
							unit: unit,
							persons: persons
						};
						$(this).doajax({
							url: url,
							data: rejson
						}, function() {
							layer.close(index);
							if(_callback) _callback.apply(this);
						});
					}
				});
			},
			showcjdw = function(data) {
				var unitid = data ? data.unit.unitid : undefined;
				layer.open({
					type: 1,
					content: "",
					title: "查看参建单位",
					area: ["70%", "90%"],
					moveOut: true,
					success: function(layero, index) {
						layero.find('.layui-layer-content').load("view/ProjectInformation/overview/cjdw_edit.html", function(result) {
							$("[name='email']").attr('disabled', 'disabled').addClass('module-grays');
							$("[name='tel']").attr('disabled', 'disabled').addClass('module-grays');
							$("[name='contacts']").attr('disabled', 'disabled').addClass('module-grays');
							$("[name='fax']").attr('disabled', 'disabled').addClass('module-grays');
							layero.find(".group-input").each(function(index, element) {
								$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
							});
							//  select和标头的组合
							layero.find(".group-select").each(function(index, element) {
								$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
							});
							$('#cjdwform-btn').remove();
							Mydao.initselect(layero); //加载select
							layero.find("select,input,textarea").attr("disabled", "disabled");
							$('#cjdw-person-table').bootstrapTable({
								method: 'post',
								uniqueId: "personid", //唯一标识,
								responseHandler: function(res) { //设置返回数据
									if(res.code == 200) {
										return res.result;
									}
								},
								ajaxOptions: {
									ContentType: 'application/json',
									dataType: 'json'
								},
								columns: [{
									title: '姓名',
									field: 'name',
								}, {
									title: '职务',
									field: 'post'
								}, {
									title: '办公电话',
									field: 'officephone',
								}, {
									title: '手机号码',
									field: 'phone',
								}]
							});
							if(data) {
								Mydao.setform(layero.find('#cjdw-form'), data.unit);
								$('#cjdw-person-table').bootstrapTable('load', {
									data: data.persons
								});
							}
						});
					},
					cancel: function(layero, index) {
						Mydao.currentPage.params = {}; //清空当前页面参数
						Mydao.currentPage.params.projectid = undefined; //清空项目ID
					}
				});
			};

		//建设单位添加
		$('#cjdwadd').on('click', function() {
			editcjdw('participateUnit/s1002', null, function() {
				$('#jsdw').bootstrapTable('refresh');
			});
		});
		//其他参见单位添加
		$('#qtcjdwadd').on('click', function() {
			if(!$('#sectionid').val()) {
				layer.msg('请选择施工标段！');
				return false;
			}
			editcjdw('sectionUnit/s1002', null, function() {
				$('#qtcjdw').bootstrapTable('refresh');
			});
		});
		//加载其他参建单位
		$('#sectionid').on('change', function() {
			$('#qtcjdw').bootstrapTable('refresh');
		});

	})($);
}(jQuery);