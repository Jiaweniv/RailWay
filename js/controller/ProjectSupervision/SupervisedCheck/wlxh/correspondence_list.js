//检查人员
(function() {
	'use strict';
	$('#correspondence_top select').each(function(a, b) {
		var p = $(b).data().params,
			p1 = (p.toObj && p.toObj()) || {};
		p1.projectid = $('#SupervisedCheck #projectid').val();
		$(b).data('params', JSON.stringify(p1).replace(/"/g, "'")).attr('data-params', JSON.stringify(p1).replace(/"/g, "'"));
	});

	Mydao.initselect('#correspondence_top');

	//编辑
	var editCorrespondence = function(e, value, row, index) {
		layer.open({
			type: 1,
			title: '编辑往来函件',
			btnAlign: 'c',
			content: "",
			area: ["70%", "90%"],
			moveOut: true,
			cancel: function(layero, index) {},
			btn: ['保存', '返回'],
			success: function(layero, index) {

				layero.find('.sidebar-collapse').slimScroll({
					height: '100%',
				});

				layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/Correspondence_edit.html', function() {
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
						Mydao.setform(layero, row); //填充表单的值
					}); //加载select
				});
			},
			yes: function(index, layero) {
				layero.find("form").trigger("validate");
				if(!layero.find("form").data("validator").isFormValid()) return false;
				var form = layero.find("form").serializeJson();
				form.id = row.id;
				if(form.letter != "") {

					Mydao.ajax(form, 'correspondence/edit', function(result) {
						if(result.code == 200) {
							layero.find("input").val("");
							layer.alert("操作成功");
							layer.close(index); //如果设定了yes回调，需进行手工关闭
							//刷新页面
							$('#SupervisedCheck #correspondence').bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						} else {
							layer.alert("操作失败！");
						}
					});
				} else {
					layer.alert("请上传附件");
				}
			}
		});
	};
	//删除
	var delCorrespondence = function(e, value, row, index) {
		//询问框
		layer.open({
			title: '消息提示', //标题
			content: '确定要删除该往来函件吗？', //内容
			icon: 3,
			btn: ['确认', '取消'], //按钮
			btnAlign: 'c', //按钮居中
			yes: function(index, layero) { //回调
				Mydao.ajax({
					"id": row.id
				}, 'correspondence/delete', function(result) {
					layer.close(index); //如果设定了yes回调，需进行手工关闭
					var currentTime = result.serverTime;
					if(result.code == 200) {
						layer.alert("操作成功！");
						//刷新页面
						$('#SupervisedCheck #correspondence').bootstrapTable("refreshOptions", {
							pageNumber: 1
						}).bootstrapTable("refresh");
					} else {
						layer.alert("操作失败！");
					}

				});
			}
		});
	};

	var viewCorrespondence = function(e, value, row, index) {
		layer.open({
			type: 1,
			title: '查看往来函件',
			btnAlign: 'c',
			content: "",
			area: ["70%", "90%"],
			moveOut: true,
			cancel: function(layero, index) {},
			success: function(layero, index) {

				layero.find('.sidebar-collapse').slimScroll({
					height: '100%',
				});

				layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/Correspondence_edit.html', function() {
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
						Mydao.setform(layero, row); //填充表单的值
					}); //加载select

					layero.find("select,input,textarea").attr("disabled", "disabled");
					setTimeout(function() {
						layero.find(".layui-upload-button,.fa-times-circle").remove();
						layero.find(".layui-layer-btn").remove();
					}, 500);
				});
			},
		});
	};

	//表格
	var url = "correspondence/list";
	$('#SupervisedCheck #correspondence').bootstrapTable({
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
			Mydao.config.ajaxParams.page.orderField = 'a.createtime';
			Mydao.config.ajaxParams.page.pageSize = p.pageSize;
			Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
			Mydao.config.ajaxParams.page.orderDirection = 'desc';
			Mydao.config.ajaxParams.params.checkprogramid = $('#correspondence_top [name="checkprogramid"]').val();
			Mydao.config.ajaxParams.params.projectid = $('#SupervisedCheck [name="projectid"]').val();
			return Mydao.config.ajaxParams;
		},
		columns: [{
			title: '函件标题',
			field: 'title',
			align: 'center'
		}, {
			title: '文号',
			field: 'documentnumber',
			align: 'center',
			valign: 'middle'
		}, {
			title: '发文单位',
			field: 'sendgroupname',
			align: 'center',
		}, {
			title: '收文单位',
			field: 'receivedgroupname',
			align: 'center',
		}, {
			title: '操作',
			align: 'center',
			formatter: function(value, row, index) {
				var ctrls = [];
				if(Mydao.permissions['correspondence_edit']) {
					ctrls.push('edit');
				}
				if(Mydao.permissions['correspondence_del']) {
					ctrls.push('del');
				}
				ctrls.push('view');
				return Mydao.operator(ctrls);
			},
			events: Mydao.operatorEvents({
				edit: editCorrespondence,
				del: delCorrespondence,
				view: viewCorrespondence
			})
		}]
	});

	//查询
	$('#correspondence_top #searchCorrespondence').on('click', function(event) {
		$('#correspondence_top #correspondence').bootstrapTable("refreshOptions", {
			pageNumber: 1
		}).bootstrapTable("refresh");
	});

	//新建
	$('#correspondence_top #addCorrespondence').on('click', function(event) {
		layer.open({
			type: 1,
			title: '新建往来函件',
			btnAlign: 'c',
			content: "",
			area: ["70%", "90%"],
			moveOut: true,
			cancel: function(layero, index) {},
			btn: ['保存', '取消'],
			success: function(layero, index) {

				layero.find('.sidebar-collapse').slimScroll({
					height: '100%',
				});

				layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/Correspondence_edit.html', function() {
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

					Mydao.initselect(layero); //加载select
				});

			},
			yes: function(index, layero) {
				layero.find("form").trigger("validate");
				if(!layero.find("form").data("validator").isFormValid()) return false;
				var correspondence = layero.find("form").serializeJson();
				if(correspondence.letter != "") {
					Mydao.ajax(correspondence, 'correspondence/add', function(result) {

						if(result.code == 200) {
							layero.find("input").val("");
							layer.close(index); //如果设定了yes回调，需进行手工关闭

							layer.alert("操作成功！");

							//刷新页面
							$('#SupervisedCheck #correspondence').bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						} else {
							layer.alert("操作失败！");
						}
					});
				} else {
					layer.alert("请上传附件");
				}

			}
		});
	});
})();