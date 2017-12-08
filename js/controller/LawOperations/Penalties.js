(function() {
	'use strict';
	//调整input宽度
	Mydao.initselect('#Penalties_lzh');
	var resizeInput = function(parent) {
		$(parent).find(".group-input").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
		});
		//  select和标头的组合
		$(parent).find(".group-select").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
		});

		$(parent).find('.sidebar-collapse').slimScroll({
			height: '100%',
		});
	};

	var workpoint_sgdl_add_btn = function() {
		layer.open({
			type: 1,
			title: '添加',
			content: $("#hljpersonal_table_layer").html(),
			btn: ['确认', '取消'],
			btnAlign: 'c',
			area: ['420px', '350px'],
			success: function(layero, index) {
				resizeInput(layero);
				layero.find('#post').change(function() {
					var _val = $(this).val(); //职务
					var _this = $('#Penalties-newbuilt #punishedunits').val(); // 被处罚单位
					var _postid = layero.find('#personid'); // 人员
					_postid.val('').empty().append('<option value="">--请选择--</option>');
					Mydao.ajax({
						'organizationid': _this,
						'postid': _val
					}, 'person/m1001', function(data) {
						var currentTime = data.serverTime;
						if(data.code == 200) {
							var result = data.result;
							for(var i = 0; i < result.length; i++) {
								_postid.append($('<option value="' + result[i].id + '" >' + result[i].name + '</option>').data(result[i]));
							}
						} else {
							layer.alert(data.msg);
						}
					});
				});
			},
			yes: function(index, layero) {
				layero.find("form").trigger("validate");
				if(!layero.find("form").data("validator").isFormValid()) return false;
				var setform = layero.find('#hljpersonal_from2').serializeJson();
				if(setform.post == '' || setform.decision == '' || setform.money == '') {
					return false;
				} else {
					setform.id = Date.parse(new Date());
					setform.postname = layero.find("#post option:selected").text();
					setform.personname = layero.find("#personid option:selected").text();
					$('#hljpersonal_table').bootstrapTable("append", setform);
					layer.close(index);
				}

			},
			cancel: function(layero, index) {

			}
		});
	};

	//	根据监管类型 获取监管机构
	var edithljpersonal_change = function(row) {
		$('#Penalties-newbuilt #unittype').change(function() {
			var _val = $(this).val();
			var _this = $('#Penalties-newbuilt #punishedunits');
			Mydao.ajax({
				'typeid': _val
			}, 'organization/findOrgByType', function(data) {
				var currentTime = data.serverTime;
				if(data.code == 200) {
					_this.val('').empty().append('<option value="">--请选择--</option>');
					var result = data.result;
					for(var i = 0; i < result.length; i++) {
						_this.append($('<option value="' + result[i].id + '" >' + result[i].name + '</option>').data(result[i]));
					}
					if(row) { //编辑回填
						_this.val(row);
					}
				} else {
					layer.alert(data.msg);
				}
			});
		});
	};
	//		编辑
	var edithljpersonal_table = function(e, value, row, indexr) {
		layer.open({
			type: 1,
			title: '编辑',
			content: $("#hljpersonal_table_layer").html(),
			btn: ['确认', '取消'],
			btnAlign: 'c',
			area: ['420px', '350px'],
			success: function(layero, index) {
				resizeInput(layero);
				Mydao.setform(layero, row);
				var _postid = layero.find('#personid'); // 人员
				layero.find('#post').change(function() {
					var _val = $(this).val(); //职务
					var _this = $('#Penalties-newbuilt #punishedunits').val(); // 被处罚单位
					_postid.val('').empty().append('<option value="">--请选择--</option>');
					Mydao.ajax({
						'organizationid': _this,
						'postid': _val
					}, 'person/m1001', function(data) {
						var currentTime = data.serverTime;
						if(data.code == 200) {
							var result = data.result;
							for(var i = 0; i < result.length; i++) {
								_postid.append($('<option value="' + result[i].id + '" >' + result[i].name + '</option>').data(result[i]));
							}
						} else {
							layer.alert(data.msg);
						}
					}, false);
				});
				_postid.val(row.personname);
			},
			yes: function(index, layero) {
				layero.find("form").trigger("validate");
				if(!layero.find("form").data("validator").isFormValid()) return false;
				var setform = layero.find('#hljpersonal_from2').serializeJson();
				if(setform.post == '' || setform.decision == '' || setform.money == '') {
					return false;
				} else {
					setform.id = Date.parse(new Date());
					setform.postname = layero.find("#post option:selected").text();
					setform.personname = layero.find("#personid option:selected").text();
					$('#hljpersonal_table').bootstrapTable("updateRow", {
						index: indexr,
						row: setform

					});
					layer.close(index);
				}
			},
			cancel: function(layero, index) {

			}
		});
	};
	// 		删除
	var delhljpersonal_table = function(e, value, row, index) {
		layer.confirm('确定删除？', {
			icon: 3,
			titlle: "提示"
		}, function(index) {

			$("#hljpersonal_table").bootstrapTable('remove', {
				field: "id",
				values: [row.id]
			});
			layer.close(index);

		});
	};

	//新建 行政处罚
	$('#Penalties_lzh').find('#JobNewBtn').on('click', function(event) {
		layer.open({
			type: 1,
			content: '',
			title: '新建行政处罚',
			btn: ['保存', '返回'], //按钮
			btnAlign: 'c', //按钮居中
			area: ['70%', '90%'],
			moveOut: true,
			success: function(layero, index) {
				layero.find('.layui-layer-content').load('view/LawOperations/PenaltiesNewbuilt.html', function(result) {
				resizeInput(layero);
					Mydao.initselect(layero); //加载select
					edithljpersonal_change();
					//		查询
					$('#hljpersonal_table').bootstrapTable({
						method: 'post',
						uniqueId: "id", //唯一标识,
						contentType: 'application/json',
						dataType: 'json',
						columns: [{
							title: '职务',
							field: 'postname',
						}, {
							title: '人员',
							field: 'personname'
						}, {
							title: '处罚决定',
							field: 'decision'
						}, {
							title: '处罚金额（元）',
							field: 'money'
						}, {
							title: '操作　<i id="workpoint_sgdl_add_btn" class="fa fa-plus-square-o" title="新增"></i>',
							align: 'center',
							formatter: function(value, row, index) {
								return Mydao.operator(['edit', 'del']);
							},
							events: Mydao.operatorEvents({
								edit: edithljpersonal_table,
								del: delhljpersonal_table
							})
						}]
					});

					layero.find('#workpoint_sgdl_add_btn').on('click', function() {
						if(!layero.find('#Penalties-newbuilt #punishedunits').val()) {
							layer.msg('请先选择被处罚单位！');
							return false;
						}
						workpoint_sgdl_add_btn();
					});
				});
			},
			yes: function(index, layero) {
				layero.find("form").trigger("validate");
				if(!layero.find("form").data("validator").isFormValid()) return false;
				Mydao.ajax({
					"title": $("#Penalties-newbuilt #title").val(),
					"supervisionid": $("#Penalties-newbuilt #supervisionid").val(),
					"section": $("#Penalties-newbuilt #section").val(),
					"projectid": $("#Penalties-newbuilt #projectid").val(),
					"penaltytime": $("#Penalties-newbuilt #penaltytime").val(),
					"penaltynumber": $("#Penalties-newbuilt #penaltynumber").val(),
					"unitengineering": $("#Penalties-newbuilt #unitengineering").val(),
					"punishedunits": $("#Penalties-newbuilt #punishedunits").val(),
					"unittype": $("#Penalties-newbuilt #unittype").val(),
					"ispublish": $("#Penalties-newbuilt #ispublish").val(),
					"violationterms": $("#Penalties-newbuilt #violationterms").val(),
					"violationfact": $("#Penalties-newbuilt #violationfact").val(),
					"violationtype": $("#Penalties-newbuilt #violationtype").val(),
					"penaltyterms": $("#Penalties-newbuilt #penaltyterms").val(),
					"penaltydecision": $("#Penalties-newbuilt #penaltydecision").val(),
					"penaltydecisiontime": $("#Penalties-newbuilt #penaltydecisiontime").val(),
					"penaltydecisionfile": $("#Penalties-newbuilt #penaltydecisionfile").val(),
					"reconsiderationtime": $("#Penalties-newbuilt #reconsiderationtime").val(),
					"reconsiderationfile": $("#Penalties-newbuilt #reconsiderationfile").val(),
					"litigationtime": $("#Penalties-newbuilt #litigationtime").val(),
					"litigationfile": $("#Penalties-newbuilt #litigationfile").val(),
					"penaltymoney": $("#Penalties-newbuilt #penaltymoney").val(),
					"type": $("#Penalties-newbuilt #type").val(),
					"paramsPenaltiesPost": $('#hljpersonal_table').bootstrapTable("getData")
				}, 'penalties/insertPenalties', function(result) {
					layer.close(index); //如果设定了yes回调，需进行手工关闭
					var currentTime = result.serverTime;
					if(result.code == 200) {
						layer.alert("操作成功！");
						//刷新页面
						$('#Penalties #PenaltiesTable').bootstrapTable("refreshOptions", {
							pageNumber: 1
						}).bootstrapTable("refresh");
					} else {
						layer.alert("操作失败！");
					}
				});
			},
			cancel: function(layero, index) {},
			btn2: function(index, layero) {}
		});
	});

	var pena_edit = function(e, value, row, index) {
		Mydao.ajax({
			"id": row.id
		}, 'penalties/getPenalties', function(result) {
			var currentTime = result.serverTime;
			if(result.code == 200) {
				var resultForm = result.result;
				layer.open({
					type: 1,
					content: '',
					btn: ['保存', '返回'], //底部按钮
					btnAlign: 'c', //按钮居中
					title: '编辑行政处罚',
					area: ['70%', '90%'],
					moveOut: true,
					success: function(layero, index) {
						layero.find('.layui-layer-content').load('view/LawOperations/PenaltiesNewbuilt.html', function() {
							resizeInput(layero);
							edithljpersonal_change(resultForm.punishedunits);
							Mydao.initselect(layero, null, function() {
								Mydao.setform(layero, resultForm); //填充表单的值
							}); //加载select
							$('#hljpersonal_table').bootstrapTable({
								data: resultForm.penaltiesPost,
								method: 'post',
								uniqueId: "id", //唯一标识,
								contentType: 'application/json',
								dataType: 'json',

								columns: [{
									title: '职务',
									field: 'postname',
								}, {
									title: '人员',
									field: 'personname',
								}, {
									title: '处罚决定',
									field: 'decision'
								}, {
									title: '处罚金额（元）',
									field: 'money'
								}, {
									title: '操作　<i id="workpoint_sgdl_add_btn" class="fa fa-plus-square-o" title="新增"></i>',
									align: 'center',
									formatter: function(value, row, index) {
										return Mydao.operator(['edit', 'del']);
									},
									events: Mydao.operatorEvents({
										edit: edithljpersonal_table,
										del: delhljpersonal_table
									})
								}]
							});

							layero.find('#workpoint_sgdl_add_btn').on('click', function() {
								if(!layero.find('#Penalties-newbuilt #punishedunits').val()) {
									layer.msg('请先选择被处罚单位！');
									return false;
								}
								workpoint_sgdl_add_btn();
							});
						});
					},
					yes: function(index, layero) { //回调
						layero.find("form").trigger("validate");
						if(!layero.find("form").data("validator").isFormValid()) return false;
						Mydao.ajax({
							"id": row.id,
							"title": $("#Penalties-newbuilt #title").val(),
							"source": $("#Penalties-newbuilt select[name='source']").val(),
							"supervisionid": $("#Penalties-newbuilt #supervisionid").val(),
							"section": $("#Penalties-newbuilt #section").val(),
							"projectid": $("#Penalties-newbuilt #projectid").val(),
							"penaltytime": $("#Penalties-newbuilt #penaltytime").val(),
							"penaltynumber": $("#Penalties-newbuilt #penaltynumber").val(),
							"unitengineering": $("#Penalties-newbuilt #unitengineering").val(),
							"punishedunits": $("#Penalties-newbuilt #punishedunits").val(),
							"unittype": $("#Penalties-newbuilt #unittype").val(),
							"ispublish": $('#Penalties-newbuilt #ispublish').val(),
							"violationterms": $("#Penalties-newbuilt #violationterms").val(),
							"violationfact": $("#Penalties-newbuilt #violationfact").val(),
							"violationtype": $("#Penalties-newbuilt #violationtype").val(),
							"penaltyterms": $("#Penalties-newbuilt #penaltyterms").val(),
							"penaltydecision": $("#Penalties-newbuilt #penaltydecision").val(),
							"penaltydecisiontime": $("#Penalties-newbuilt #penaltydecisiontime").val(),
							"penaltydecisionfile": $("#Penalties-newbuilt #penaltydecisionfile").val(),
							"reconsiderationtime": $("#Penalties-newbuilt #reconsiderationtime").val(),
							"reconsiderationfile": $("#Penalties-newbuilt #reconsiderationfile").val(),
							"litigationtime": $("#Penalties-newbuilt #litigationtime").val(),
							"litigationfile": $("#Penalties-newbuilt #litigationfile").val(),
							"penaltymoney": $("#Penalties-newbuilt #penaltymoney").val(),
							"type": $("#Penalties-newbuilt #type").val(),
							"paramsPenaltiesPost": $('#hljpersonal_table').bootstrapTable("getData")
						}, 'penalties/updatePenalties', function(result) {
							layer.close(index); //如果设定了yes回调，需进行手工关闭
							var currentTime = result.serverTime;
							if(result.code == 200) {
								layer.alert("操作成功！");
								//刷新页面
								$('#Penalties #PenaltiesTable').bootstrapTable("refreshOptions", {
									pageNumber: 1
								}).bootstrapTable("refresh");
							} else {
								layer.alert("操作失败！");
							}
						});
					},
					cancel: function(layero, index) {}
				});
				//});
				//						});
			} else {
				layer.alert(result.msg);
			}

		});
	};
	//	$('#hljpersonal_table').bootstrapTable('hideColumn', 'post');
	//		删除
	var pena_del = function(e, value, row, index) {
		//询问框
		layer.open({
			title: '消息提示', //标题
			content: '确定要删除该数据吗？', //内容
			btn: ['确认', '取消'], //按钮
			btnAlign: 'c', //按钮居中
			success: function(layero, index) {},
			yes: function(index, layero) { //回调
				Mydao.ajax({
					"id": row.id
				}, 'penalties/deletePenalties', function(result) {
					layer.close(index); //如果设定了yes回调，需进行手工关闭
					var currentTime = result.serverTime;
					if(result.code == 200) {
						layer.alert("操作成功！");
						//刷新页面
						$('#Penalties #PenaltiesTable').bootstrapTable("refreshOptions", {
							pageNumber: 1
						}).bootstrapTable("refresh");
					} else {
						layer.msg("操作失败！");
					}

				});
			}
		});
	};

	var pena_view = function(e, value, row, index) {
		Mydao.ajax({
			"id": row.id
		}, 'penalties/getPenalties', function(result) {
			var currentTime = result.serverTime;
			if(result.code == 200) {
				var resultForm = result.result;
				layer.open({
					type: 1,
					content: '',
					btn: ['返回'], //按钮
					btnAlign: 'c', //按钮居中
					title: '查看行政处罚',
					area: ['70%', '90%'],
					moveOut: true,
					success: function(layero, index) {
						layero.find('.layui-layer-content').load('view/LawOperations/PenaltiesNewbuilt.html', function() {
							resizeInput(layero);
							edithljpersonal_change(resultForm.punishedunits);
							Mydao.initselect(layero, null, function() {
								Mydao.setform(layero, resultForm); //填充表单的值
							}); //加载select
							$('#hljpersonal_table').bootstrapTable({
								data: resultForm.penaltiesPost,
								method: 'post',
								uniqueId: "id", //唯一标识,
								contentType: 'application/json',
								dataType: 'json',

								columns: [{
									title: '职务',
									field: 'postname',
								}, {
									title: '处罚决定',
									field: 'decision'
								}, {
									title: '处罚金额（元）',
									field: 'money'
								}]
							});

							layero.find("select,input,textarea").attr("disabled", "disabled");
							setTimeout(function() {
								layero.find(".layui-upload-button,.fa-times-circle").remove();
								layero.find(".layui-layer-btn").remove();
							}, 500);
						});
					},
					cancel: function(layero, index) {}
				});
			} else {
				layer.alert(result.msg);
			}

		});
	};

	//行政处罚列表
	var url = 'penalties/findAllPenalties';
	$('#Penalties_lzh #PenaltiesTable').bootstrapTable({
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
			Mydao.config.ajaxParams.params.punishedunits = $('#Penalties select[name=punishedunits] option:selected').val();
			Mydao.config.ajaxParams.params.starttime = $('#Penalties input[name=starttime]').val();
			Mydao.config.ajaxParams.params.endtime = $('#Penalties input[name=endtime]').val();
			return Mydao.config.ajaxParams;
		},
		columns: [{
			title: '序号',
			align: 'center',
			valign: 'middle',
			formatter: function(val, row, index) {
				return index + 1;
			}
		}, {
			title: '标题',
			field: 'title',
			align: 'center',
			valign: 'middle'

		}, {
			title: '被处罚单位',
			field: 'groupname',
			align: 'center',
			valign: 'middle'
		}, {
			title: '项目',
			align: 'center',
			valign: 'middle',
			field: 'projectname'
		}, {
			title: '日期',
			align: 'center',
			valign: 'middle',
			field: 'penaltytime',
			formatter: function(val, row, index) {
				return Mydao.formatDate(val);
			}
		}, {
			title: '操作',
			align: 'center',
			valign: 'middle',
			formatter: function(value, row, index) {
				return Mydao.operator(['edit', 'del', 'view']);
			},
			events: Mydao.operatorEvents({
				edit: pena_edit,
				del: pena_del,
				view: pena_view
			})
		}]
	});
	//查询
	$('#Penalties_lzh #JobInquireBtn').on('click', function(event) {
		$('#Penalties_lzh #PenaltiesTable').bootstrapTable("refreshOptions", {
			pageNumber: 1
		}).bootstrapTable("refresh");
	});

})();