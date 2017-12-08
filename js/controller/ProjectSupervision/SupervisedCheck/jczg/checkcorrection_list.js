//检查人员
(function() {
	var resizeInput = function(layero) {

		layero.find('.sidebar-collapse').slimScroll({
			height: '100%',
		});
		layero.find(".group-input").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 35);
		});
		//  select和标头的组合
		layero.find(".group-select").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 40);
		});
	};
	//编辑
	var editCheckCorrection = function(e, value, row, index) {
		//判断项目状态
		Mydao.ajax({
			"id": row.projectid,
		}, 'project/s1004', function(result) {
			if(result.result.status == 1) {
				layer.alert("项目已经完成，不能进行修改。");
				return false;
			}
			Mydao.ajax({
				"id": row.id,
				"checkprogramid": row.checkprogramid
			}, 'checkCorrection/show', function(result) {
				layer.open({
					type: 1,
					title: '编辑检查整改',
					btnAlign: 'c',
					content: "",
					area: ["70%", "90%"],
					moveOut: true,
					cancel: function(layero, index) {},
					btn: ['保存', '返回'],
					success: function(layero, index) {

						layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/CheckCorrection_edit.html', function() {
							//解决受检单位回填
							Mydao.ajax({
								'projectid': result.result.checkCorrection.projectid,
								'sectionid': result.result.checkCorrection.sectionid
							}, 'checkRecord/fingUnitidList', function(result) {
								if(result.code == 200) {
									var _wp = $("#CheckCorrectionEditOut #checkCorrection-layer #group");
									_wp.val('').empty().append('<option value="">--请选择--</option>');
									$.each(result.result, function(a, b) {
										_wp.append($('<option value="' + b.id + '">' + b.name + '</option>'));
									});
								} else {
									layer.msg('加载受检单位列表失败');
								}
							});
							resizeInput(layero);
							Mydao.initselect(layero, null, function() {
								Mydao.setform(layero, result.result.checkCorrection); //填充表单的值
							}); //加载select
							correctionDetail_edit();
							$('#CheckCorrectionEditOut #checkCorrection-layer #correctionDetail').bootstrapTable("load", result.result.checkDetail);
						});
					},
					yes: function(index, layero) {
						layero.find("form").trigger("validate");
						if(!layero.find("form").data("validator").isFormValid()) return false;
						var correction = layero.find("form").serializeJson();
						var detail = [];
						var detail_check_row = $('#CheckCorrectionEditOut #checkCorrection-layer #correctionDetail').bootstrapTable('getSelections');
						for(var i = 0; i < detail_check_row.length; i++) {
							var detail_json = {};
							detail_json.detailid = detail_check_row[i].id;
							detail.push(detail_json);
						}
						var params = {};
						params.correction = correction;
						params.detail = detail;
						Mydao.ajax(params, 'checkCorrection/edit', function(result) {
							if(result.code == 200) {
								layero.find("input").val("");
								layer.alert("操作成功");
								layer.close(index); //如果设定了yes回调，需进行手工关闭
								//刷新页面
								$('#SupervisedCheck #checkCorrection').bootstrapTable("refreshOptions", {
									pageNumber: 1
								}).bootstrapTable("refresh");
							} else {
								layer.alert(result.msg);
							}
						});
					}
				});

			});
		});

	};
	//删除
	var delCheckCorrection = function(e, value, row, index) {
		//询问框
		layer.open({
			title: '消息提示', //标题
			content: '确定要删除该检查整改吗？', //内容
			icon: 3,
			btn: ['确认', '取消'], //按钮
			btnAlign: 'c', //按钮居中
			yes: function(index, layero) { //回调
				Mydao.ajax({
					"id": row.id
				}, 'checkCorrection/delete', function(result) {
					var currentTime = result.serverTime;
					if(result.code == 200) {
						//刷新页面
						$('#SupervisedCheck #checkCorrection').bootstrapTable("refreshOptions", {
							pageNumber: 1
						}).bootstrapTable("refresh");
						layer.close(index); //如果设定了yes回调，需进行手工关闭
					} else {
						layer.alert(result.msg);
					}

				});
			}
		});
	};

	var viewCheckCorrection = function(e, value, row, index) {
		Mydao.ajax({
			"id": row.id,
			"checkprogramid": row.checkprogramid
		}, 'checkCorrection/show', function(result) {
			layer.open({
				type: 1,
				title: '查看检查整改',
				btnAlign: 'c',
				content: "",
				area: ["70%", "90%"],
				moveOut: true,
				cancel: function(layero, index) {},
				success: function(layero, index) {

					layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/CheckCorrection_edit.html', function() {
						//解决受检单位回填
						Mydao.ajax({
							'projectid': result.result.checkCorrection.projectid,
							'sectionid': result.result.checkCorrection.sectionid
						}, 'checkRecord/fingUnitidList', function(result) {
							if(result.code == 200) {
								var _wp = $("#CheckCorrectionEditOut #checkCorrection-layer #group");
								_wp.val('').empty().append('<option value="">--请选择--</option>');
								$.each(result.result, function(a, b) {
									_wp.append($('<option value="' + b.id + '">' + b.name + '</option>'));
								});
							} else {
								layer.msg('加载受检单位列表失败');
							}
						});

						correctionDetail_edit();
						$('#CheckCorrectionEditOut #checkCorrection-layer #correctionDetail').bootstrapTable("load", result.result.checkDetail);

						resizeInput(layero);

						Mydao.initselect(layero, null, function() {
							Mydao.setform(layero, result.result.checkCorrection); //填充表单的值
						}); //加载select

						layero.find("select,input,textarea").attr("disabled", "disabled");
						setTimeout(function() {
							layero.find(".layui-upload-button,.fa-times-circle").remove();
							layero.find(".layui-layer-btn").remove();
						}, 500);
					});
				},
			});

		});

	};

	//表格
	var url = "checkCorrection/list";
	$('#SupervisedCheck #checkCorrection').bootstrapTable({
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
		onLoadSuccess: function() {
			var popoverid = false;
			$("[data-toggle='popover']").each(function(a, b) {
				var row = $('#SupervisedCheck #checkCorrection').bootstrapTable("getData")[a];
				var content = '<ul>' +
					'<li><a href="' + MydaoFileDownPath + "?fileId=" + row.reportid + '" target="_blank">检查报告</a></li>' +
					'<li><a href="' + MydaoFileDownPath + "?fileId=" + row.noticefile + '" target="_blank">整改通知单</a></li>' +
					'<li><a href="' + MydaoFileDownPath + "?fileId=" + row.replyid + '" target="_blank">整改回复</a></li>' +
					'</ul>';
				$(b).popover({
					container: 'body',
					placement: 'bottom',
					content: content,
					trigger: 'manual',
					html: true,
				});
			});
			$("body").click(function() {
				if(popoverid) {
					$("[data-toggle='popover']").popover('hide');
					popoverid = false;
				}
			});
			$("[data-toggle='popover']").click(function() {
				$(this).popover('show');
				setTimeout(function() {
					popoverid = true;
				}, 100);
			});
			//				$("[data-toggle='popover']").on('hide.bs.popover', function () {
			//					setTimeout(function(){
			//						popoverid = false;
			//					},100)
			//				})

		},

		queryParams: function(p) {
			Mydao.config.ajaxParams.params = {};
			Mydao.config.ajaxParams.page.orderField = p.sortName;
			Mydao.config.ajaxParams.page.pageSize = p.pageSize;
			Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
			Mydao.config.ajaxParams.page.orderDirection = p.sortOrder;
			Mydao.config.ajaxParams.params.checkstart = $('#SupervisedCheck [name="checkstart"]').val();
			Mydao.config.ajaxParams.params.checkend = $('#SupervisedCheck [name="checkend"]').val();
			Mydao.config.ajaxParams.params.projectid = $('#SupervisedCheck #projectid').val();
			return Mydao.config.ajaxParams;
		},
		columns: [{
			title: '方案名称',
			field: 'checkprogramname',
			align: 'center'
		}, {
			title: '通知单编号',
			field: 'number',
			align: 'center',
			valign: 'middle'
		}, {
			title: '下发时间',
			field: 'noticetime',
			align: 'center',
			formatter: function(value, row, index) {
				return Mydao.formatDate(value, "YYYY-MM-DD");
			}
		}, {
			title: '系统生成通知单',
			align: 'center',
			formatter: function(value, row, index) {

				return '<a href="' + MydaoFileDownPath + "?fileId=" + row.noticefilehtml + '" target="_blank">预览</a> <a href="' + MydaoFileDownPath + "?fileId=" + row.noticefiledoc + '" target="_blank">下载</a>';

			}
		}, {
			title: '整改通知单',
			align: 'center',
			formatter: function(value, row, index) {
				if(row.noticefile)
					return '<a href="' + MydaoFileDownPath + "?fileId=" + row.noticefile + '" target="_blank">' + row.noticefilename + '</a>';
				else
					return '';

			}
		}, {
			title: '操作',
			align: 'center',
			formatter: function(value, row, index) {
				var ctrls = [];
				if(Mydao.permissions['checkcorrection_edit']) {
					ctrls.push('edit');
				}
				if(Mydao.permissions['checkcorrection_del']) {
					ctrls.push('del');
				}
				ctrls.push('view');
				return Mydao.operator(ctrls);
			},
			events: Mydao.operatorEvents({
				edit: editCheckCorrection,
				del: delCheckCorrection,
				view: viewCheckCorrection
			})
		}]
	});

	//查询
	$('#JCZG_Out #searchCheckCorrection').on('click', function(event) {
		$('#SupervisedCheck #checkCorrection').bootstrapTable("refreshOptions", {
			pageNumber: 1
		}).bootstrapTable("refresh");
	});

	//新建
	$('#JCZG_Out #addCheckCorrection').on('click', function(event) {
		layer.open({
			type: 1,
			title: '新建检查整改',
			btnAlign: 'c',
			content: "",
			area: ["70%", "90%"],
			moveOut: true,
			cancel: function(layero, index) {},
			btn: ['保存', '返回'],
			success: function(layero, index) {

				layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/CheckCorrection_edit.html', function() {
					resizeInput(layero);
					Mydao.initselect(layero); //加载select

				});

			},
			yes: function(index, layero) {
				layero.find("form").trigger("validate");
				if(!layero.find("form").data("validator").isFormValid()) return false;
				var correction = layero.find("form").serializeJson();
				var detail = [];
				var detail_check_row = $('#CheckCorrectionEditOut #checkCorrection-layer #correctionDetail').bootstrapTable('getSelections');
				for(var i = 0; i < detail_check_row.length; i++) {
					var detail_json = {};
					detail_json.detailid = detail_check_row[i].id;
					detail.push(detail_json);
				}
				var params = {};
				params.correction = correction;
				params.detail = detail;
				if(params.correction.noticefile==""){
					layer.alert("整改通知单文件不能为空！");
					return false;
				};
				Mydao.ajax(params, 'checkCorrection/add', function(result) {
					if(result.code == 200) {
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						//刷新页面
						$('#SupervisedCheck #checkCorrection').bootstrapTable("refreshOptions", {
							pageNumber: 1
						}).bootstrapTable("refresh");
					} else {
						layer.alert(result.msg);
					}
				});
			}
		});
	});

	//结果记录列表
	$('body').delegate(".layui-layer-content #programid", "change", function() {
		var id = $(this).val();
		if(!id) return;
		var ccid = $("#checkCorrection-layer input[name='id']").val();
		var sectionid = $("#checkCorrection-layer #sectionid").val();
		Mydao.ajax({
			"id": ccid,
			"checkprogramid": id,
			"sectionid": sectionid
		}, 'checkCorrection/show', function(result) {
			if(result.code == 200) {
				correctionDetail_edit();
				$('#checkCorrection-layer #correctionDetail').bootstrapTable("load", result.result.checkDetail);
			}
		});

	});

	//结果记录列表
	$('body').delegate(".layui-layer-content #sectionid", "change", function() {
		var id = $(this).val();
		if(!id) return;
		var ccid = $("#checkCorrection-layer input[name='id']").val();
		var programid = $("#checkCorrection-layer #programid").val();
		var projectid = $("#checkCorrection-layer #projectid").val();
		if(id != '') {
			var params = {};
			params.projectid = projectid;
			params.sectionid = id;
			Mydao.ajax(params, 'checkRecord/fingUnitidList', function(result) {
				if(result.code == 200) {
					var _wp = $("#checkCorrection-layer #group");
					_wp.val('').empty().append('<option value="">--请选择--</option>');
					$.each(result.result, function(a, b) {
						_wp.append($('<option value="' + b.id + '">' + b.name + '</option>'));
					});
				} else {
					layer.msg('加载受检单位列表失败');
				}
			});
		}
		Mydao.ajax({
			"id": ccid,
			"checkprogramid": programid,
			"sectionid": id
		}, 'checkCorrection/show', function(result) {
			if(result.code == 200) {
				correctionDetail_edit();
				$('#checkCorrection-layer #correctionDetail').bootstrapTable("load", result.result.checkDetail);
			}
		});

	});

	var correctionDetail_edit = function() {
		$('#checkCorrection-layer #correctionDetail').bootstrapTable({
			columns: [{
				checkbox: true,
				align: 'center',
				valign: 'middle',
				formatter: function(val, row, index) {
					if(row.checked == 1) {
						return {
							disabled: false,
							checked: true
						};
					}
				}
			}, {
				title: '检查事项',
				align: 'center',
				field: 'itemname'
			}, {
				title: '检查内容',
				align: 'center',
				field: 'content'
			}, {
				title: '详情',
				align: 'center',
				field: 'type',
				formatter: function(value, row, index) {
					return Mydao.operator(['view']);
				},
				events: Mydao.operatorEvents({
					view: viewCheckDetail
				})
			}]
		});

	};

	var viewCheckDetail = function(e, value, row, index) {
		console.log(row)
		layer.open({
			type: 1,
			title: '不合格记录详情',
			btnAlign: 'c',
			content: "",
			area: ["60%", "80%"],
			moveOut: true,
			cancel: function(layero, index) {},
			success: function(layero, index) {

				layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/CheckRecordsDetailbhg.html', function() {
					resizeInput(layero);
					layero.find('#xinjian_tupian_lzh').hide()
					layero.find('#chakan_tupian_lzh').show().find('div').html(Mydao.imgName(row.images))
					
					Mydao.initselect(layero, null, function() {
						Mydao.setform(layero, row); //填充表单的值
					}); //加载select
					layero.find("select,input,textarea").attr("disabled", "disabled");
//					setTimeout(function() {
//						layero.find(".layui-upload-button,.fa-times-circle").remove();
//						layero.find(".layui-layer-btn").remove();
//					}, 500);
					
				});
			},
		});
	};

})();