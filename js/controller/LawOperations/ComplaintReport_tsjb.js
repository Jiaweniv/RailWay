(function() {
	'use strict';
	var editer = {};
	//调整input宽度
	var resizeInput = function(layero) {
		$(layero).find(".group-input").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
		});
		//  select和标头的组合
		$(layero).find(".group-select").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
		});

		$(layero).find('.sidebar-collapse').slimScroll({
			height: '100%',
		});
	};

	var pena_edit = function(e, value, row, index) {
		Mydao.ajax({
			"id": row.id
		}, 'complaintReport/getComplaintReport', function(result) {
			var currentTime = result.serverTime;
			if(result.code == 200) {
				var resultForm = result.result;
				layer.open({
					type: 1,
					content: '',
					btn: ['保存', '返回'], //按钮
					title: '投诉举报',
					shadeClose: 'true', //遮罩
					btnAlign: 'c', //按钮居中
					area: ["70%", "90%"],
					moveOut: true,
					success: function(layero, index) {
						layero.find('.layui-layer-content').load('view/LawOperations/ComplaintChildr.html', function() {
							$('#toacceptOut').hide();
							editer = UE.getEditor('myEditor');
							var _content;
							resizeInput(layero);

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
						Mydao.ajax({
							"id": row.id,
							"title": $("#ComplaintChildr #title").val(),
							"reporttype": $("#ComplaintChildr #reporttype").val(),
							"reportuser": $("#ComplaintChildr #reportuser").val(),
							"reporttime": $("#ComplaintChildr #reporttime").val(),
							"reportorg": $("#ComplaintChildr #reportorg").val(),
							"source": $("#ComplaintChildr #source").val(),
							"objecttype": $("#ComplaintChildr #objecttype").val(),
							"reportobject": $("#ComplaintChildr #reportobject").val(),
							"section": $("#ComplaintChildr #section").val(),
							"type": $("#ComplaintChildr #type").val(),
							//								"content": $("#ComplaintChildr #content").val(),
							"content": editer.getContent(),
							"file": $("#ComplaintChildr input[name='file']").val(),
							"divGroupSel": $("#ComplaintChildr #divGroupSel option:selected").val(),
							"divProjectSel": $("#ComplaintChildr #divProjectSel option:selected").val(),
							"divPersonSel": $("#ComplaintChildr #divPersonSel option:selected").val(),
							"ispublish": $("#ComplaintChildr #ispublish").val(),
							"results": $("#ComplaintChildr #results").val(),
							"toaccept": $("#ComplaintChildr #toaccept").val()
						}, 'complaintReport/updateComplaintReport', function(result) {
							layer.close(index); //如果设定了yes回调，需进行手工关闭
							var currentTime = result.serverTime;
							if(result.code == 200) {
								UE.getEditor('myEditor').destroy();
								layer.alert("操作成功！");
								//刷新页面
								$('#ComplaintReport_tsjb #tsjb_table').bootstrapTable("refreshOptions", {
									pageNumber: 1
								}).bootstrapTable("refresh");
							} else {
								layer.alert(result.msg);
							}
						});
					},
					cancel: function(layero, index) {
						UE.getEditor('myEditor').destroy();
					}
				});
				//});
				//						});
			} else {
				layer.alert(result.msg);
			}

		});
	};

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
				}, 'complaintReport/deleteComplaintReport', function(result) {
					layer.close(index); //如果设定了yes回调，需进行手工关闭
					var currentTime = result.serverTime;
					if(result.code == 200) {
						layer.alert("操作成功！");
						//刷新页面
						$('#ComplaintReport_tsjb #tsjb_table').bootstrapTable("refreshOptions", {
							pageNumber: 1
						}).bootstrapTable("refresh");
					} else {
						layer.msg(result.msg);
					}

				});
			}
		});
	};

	var pena_view = function(e, value, row, index) {
		Mydao.ajax({
			"id": row.id
		}, 'complaintReport/getComplaintReport', function(result) {
			var currentTime = result.serverTime;
			if(result.code == 200) {
				var resultForm = result.result;
				layer.open({
					type: 1,
					content: '',
					shadeClose: 'true', //遮罩
					title: '投诉举报',
					btnAlign: 'c', //按钮居中
					area: ["70%", "90%"],
					moveOut: true,
					success: function(layero, index) {
						layero.find('.layui-layer-content').load('view/LawOperations/ComplaintChildr.html', function() {
							editer = UE.getEditor('myEditor');
							var _content;

							resizeInput(layero);

							Mydao.initselect(layero, null, function() {
								Mydao.setform(layero, resultForm); //填充表单的值
							}); //加载select

							_content = resultForm.content;
							editer.ready(function() {
								editer.execCommand('inserthtml', _content, true);
								editer.setDisabled();
								layero.find("select,input,textarea").attr("disabled", "disabled");
							});

							setTimeout(function() {
								layero.find(".layui-upload-button,.fa-times-circle").remove();
								layero.find(".layui-layer-btn").remove();
							}, 500);

						});
					},
					cancel: function(layero, index) {
						UE.getEditor('myEditor').destroy();
					}
				});
			} else {
				layer.alert(result.msg);
			}
		});
	};

	//		职务级别列表
	var url = 'complaintReport/findAllComplaintReport';

	$('#ComplaintReport_tsjb #tsjb_table').bootstrapTable({
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
			Mydao.config.ajaxParams.params.reporttype = "0";
			Mydao.config.ajaxParams.params.title = $('#ComplaintReport input[name=title]').val();
			Mydao.config.ajaxParams.params.starttime = $('#ComplaintReport input[name=starttime]').val();
			Mydao.config.ajaxParams.params.endtime = $('#ComplaintReport input[name=endtime]').val();
			return Mydao.config.ajaxParams;
		},
		columns: [{
			title: '序号',
			formatter: function(val, row, index) {
				return index + 1;
			}
		}, {
			title: '标题',
			field: 'title',
		}, {
			title: '举报对象',
			field: 'reportobjectname'
		}, {
			title: '举报时间',
			field: 'reporttime',
		}, {
			title: '操作',
			formatter: function(value, row, index) {
				var ctrls = [];
				if(Mydao.permissions['complaintreport_edit']) {
					ctrls.push('edit');
				}
				//删除
				if(Mydao.permissions['complaintreport_del']) {
					ctrls.push('del');
				}
				if(Mydao.permissions['complaintreport_look']) {
					ctrls.push('view');
				}
				return Mydao.operator(ctrls);
			},
			events: Mydao.operatorEvents({
				edit: pena_edit,
				del: pena_del,
				view: pena_view
			})
		}]
	});
	//查询
	$('#ComplaintReport #JobInquireBtn').on('click', function(event) {
		$('#ComplaintReport_tsjb #tsjb_table').bootstrapTable("refreshOptions", {
			pageNumber: 1
		}).bootstrapTable("refresh");
	});
})();