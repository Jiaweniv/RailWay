//监督检查列表
//	检查记录
(function() {
	'use strict';
	var editer = {};
	var resizeInput = function(layero) {

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
		},
		//编辑
		editCheckReply = function(e, value, row, index) {
			Mydao.ajax({
				"id": row.id
			}, 'checkCorrection/show', function(result) {
				layer.open({
					type: 1,
					title: '编辑整改回复',
					btnAlign: 'c',
					content: "",
					area: ["70%", "90%"],
					moveOut: true,
					btn: ['保存', '返回'],
					success: function(layero, index) {
						layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/checkReply_edit.html', function() {
							editer = UE.getEditor('myEditor');
							var _replydetail;
							resizeInput(layero);
							Mydao.initselect(layero, null, function() {
								Mydao.setform(layero, result.result.checkCorrection); //填充表单的值
								_replydetail = row.replydetail;
								editer.ready(function() {
									editer.execCommand('inserthtml', _replydetail, true);
								});
							}); //加载select
							$('#checkCorrection-layer #correctionDetail').bootstrapTable("load", result.result.checkDetail);
						});
					},
					yes: function(index, layero) {
						layero.find("form").trigger("validate");
						if(!layero.find("form").data("validator").isFormValid()) return false;
						var correction = layero.find("form").serializeJson();
						correction.id = row.id;
						correction.content = editer.getContent();
						Mydao.ajax(correction, 'checkCorrection/checkReply', function(result) {
							if(result.code == 200) {
								layer.alert("操作成功");
								UE.getEditor('myEditor').destroy();
								layer.close(index); //如果设定了yes回调，需进行手工关闭
								//刷新页面
								$('#SupervisedCheck #check_reply_table').bootstrapTable("refreshOptions", {
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

			});
		},
		viewCheckReply = function(e, value, row, index) {
			Mydao.ajax({
				"id": row.id
			}, 'checkCorrection/show', function(result) {
				layer.open({
					type: 1,
					title: '查看整改回复',
					btnAlign: 'c',
					content: "",
					area: ["70%", "90%"],
					moveOut: true,
					cancel: function(layero, index) {},
					success: function(layero, index) {
						layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/checkReply_edit.html', function() {
							//								editer = UE.getEditor('myEditor');
							//								var _replydetail;
							$('#checkCorrection-layer #correctionDetail').bootstrapTable("load", result.result.checkDetail);
							resizeInput(layero);
							Mydao.initselect(layero, null, function() {
								$("#replydetail").html(result.result.checkCorrection.replydetail);
								Mydao.setform(layero, result.result.checkCorrection); //填充表单的值
								//									_replydetail = result.result.checkCorrection.replydetail;
								//										editer.ready(function() {
								//											editer.execCommand('inserthtml',_replydetail,true);
								//										});
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
	//检查记录列表
	$('#ZGHF_Out #check_reply_table').bootstrapTable({
		pagination: true,
		sidePagination: 'server',
		queryParamsType: "undefined", //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  //设置为limit可以获取limit, offset, search, sort, order  
		method: 'post',
		pageNumber: 1,
		url: Mydao.config.path + 'checkCorrection/list',
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
			Mydao.config.ajaxParams.params.checkstart = $('#ZGHF_Out [name="checkstart"]').val();
			Mydao.config.ajaxParams.params.checkend = $('#ZGHF_Out [name="checkend"]').val();
			Mydao.config.ajaxParams.params.projectid = $('#SupervisedCheck #projectid').val();
			return Mydao.config.ajaxParams;
		},
		columns: [{
			title: '方案名称',
			field: 'checkprogramname',
			align: 'center'
		}, {
			title: '标题',
			field: 'title',
			align: 'center',
			valign: 'middle'
		}, {
			title: '下载',
			align: 'center',
			formatter: function(value, row, index) {
				return '<a href="' + MydaoFileDownPath + "?fileId=" + row.replyid + '" target="_blank">' + (row.replyfilename == null ? "" : row.replyfilename) + '</a>';

			}
		}, {
			title: '操作',
			align: 'center',
			formatter: function(value, row, index) {
				var ctrls = [];
				if(Mydao.permissions['checkreply_edit']) {
					ctrls.push('edit');
				}
				ctrls.push('view');
				return Mydao.operator(ctrls);
			},
			events: Mydao.operatorEvents({
				edit: editCheckReply,
				view: viewCheckReply
			})
		}]
	});
	//查询
	$('#ZGHF_Out #searchCheckReply').on('click', function(event) {
		$('#SupervisedCheck #check_reply_table').bootstrapTable("refreshOptions", {
			pageNumber: 1
		}).bootstrapTable("refresh");
	});

})();