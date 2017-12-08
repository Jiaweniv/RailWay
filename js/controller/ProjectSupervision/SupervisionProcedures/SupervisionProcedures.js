//监督手续
	
	(function() {
		'use strict';
		var resizeInput = function(parent) {
			$(parent).find(".group-input").each(function(index, element) {
				$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
			});
			$(parent).find(".group-select").each(function(index, element) {
				$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
			});
			$(parent).find(".group-textarea").each(function(index, element) {
				$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
			});
			$(parent).find('.sidebar-collapse').slimScroll({
				height: '100%',
			});
		};
		//初始化编辑页面
		var init_page = function(e, value, row, index) {
			layer.open({
				type: 1,
				title: '监督手续',
				btnAlign: 'c',
				content: "",
				btn: ['保存', '返回'], //按钮
				area: ["70%", "90%"],
				moveOut: true,
				cancel: function(layero, index) {},
				success: function(layero, index) {
					layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisionProcedures_edit.html', function() {
						resizeInput(layero);
						Mydao.initselect(layero, null, function() {
							if(row) {
								$("#SupervisionProcedures #xiangmumingcheng").val(row.projectid);
								Mydao.setform(layero, row);
							}
						});
					});
				},
				yes: function(index, layero) {
					layero.find("form").trigger("validate");
					if(!layero.find("form").data("validator").isFormValid()) return false;
					var cs = $("#SupervisionProcedures_edit").serializeJson();
					var url = 'supervisionProcedures/insertSupervisionProcedures';
					if(row) { //编辑
						url = 'supervisionProcedures/updateSupervisionProcedures';
						cs.id = row.id;
					} else { //新增	
						cs.projectid = $("#SupervisionProcedures_edit select[name='projectid']").val();
						$("#SupervisionProcedures #xiangmumingcheng").val(cs.projectid);
					}
//					if(cs.declareform != "") {
						Mydao.ajax(cs, url, function(result) {
							if(result.code == 200) {
								$("#SupervisionProcedures_table").bootstrapTable("refreshOptions", {
									pageNumber: 1
								}).bootstrapTable("refresh");
							} else {
								layer.msg(result.msg);
							}
							layer.close(index);
						});

//					}
				}
			});
	};

		//编辑
		var _edit = function(e, value, row, index) {
			init_page(e, value, row, index);
		};

		//删除
		var _del = function(e, value, row, index) {
			layer.confirm('确定删除？', {
				icon: 3,
				title: '提示'
			}, function(index) {
				Mydao.ajax({
					id: row.id
				}, 'supervisionProcedures/deleteSupervisionProcedures', function(result) {
					var currentTime = result.serverTime;
					if(result.code == 200) {
						$("#SupervisionProcedures #xiangmumingcheng").val(row.projectid);
						$("#SupervisionProcedures #SupervisionProcedures_table").bootstrapTable("refreshOptions", {
							pageNumber: 1
						}).bootstrapTable("refresh");
					} else {
						layer.msg(result.msg);
					}
				});
				layer.close(index);
			});
		};

		//查看
		var _view = function(e, value, row, index) {
			layer.open({
				type: 1,
				title: '监督手续详情',
				btnAlign: 'c',
				content: "",
				area: ["70%", "90%"],
				moveOut: true,
				cancel: function(layero, index) {},
				success: function(layero, index) {
					layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisionProcedures_view.html', function() {
						resizeInput(layero);
						Mydao.initselect(null, null, function() {
							Mydao.setform(layero, row);
							$("#SupervisionProcedures #xiangmumingcheng").val(row.projectid);
							setTimeout(function() {
								$("#SupervisionProcedures_view").find(".layui-upload-button").remove();
								$("#SupervisionProcedures_view").find(".pointer").remove();
							}, 400);
						});
					});
				}
			});

		};

		//表格
		var url = "supervisionProcedures/findAllSupervisionProcedures";
		$('#SupervisionProcedures #SupervisionProcedures_table').bootstrapTable({
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
				Mydao.config.ajaxParams.params.projectid = $("#SupervisionProcedures select[name='projectid']").val();
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
				title: '项目名称',
				field: 'projectname',
				align: 'center'
			}, {
				title: '申报时间',
				field: 'declaretime',
				align: 'center'
			}, {
				title: '申报书',
				field: 'declareform',
				align: 'center',
				formatter: function(value, row, index) {
					if(value) {
						if(row.declareformname) {
							return '<a class="m-module-a" target="_blank" href="' + MydaoFileDownPath + '?fileId=' + value + '">' + row.declareformname + '</a>';
						} else {
							return '<a class="m-module-a" target="_blank" href="' + MydaoFileDownPath + '?fileId=' + value + '">点击下载</a>';
						}
					}
				}
			}, {
				title: '办理时间',
				field: 'transacttime',
				align: 'center'
			}, {
				title: '监督书',
				field: 'transactform',
				align: 'center',
				formatter: function(value, row, index) {
					if(value) {
						if(row.transactform) {
							return '<a class="m-module-a" target="_blank" href="' + MydaoFileDownPath + '?fileId=' + value + '">' + row.transactformname + '</a>';
						} else {
							return '<a class="m-module-a" target="_blank" href="' + MydaoFileDownPath + '?fileId=' + value + '">点击下载</a>';
						}
					}
				}
			}, {
				title: '首次会议纪要',
				field: 'meetingsummary',
				align: 'center',
				formatter: function(value, row, index) {
					if(value) {
						if(row.meetingsummary) {
							return '<a class="m-module-a" target="_blank" href="' + MydaoFileDownPath + '?fileId=' + value + '">' + row.meetingsummaryname + '</a>';
						} else {
							return '<a class="m-module-a" target="_blank" href="' + MydaoFileDownPath + '?fileId=' + value + '">点击下载</a>';
						}
					}
				}
			}, {
				title: '操作',
				align: 'center',
				formatter: function(value, row, index) {
					var ctrls = [];
					//编辑
					if(Mydao.permissions['supervisionprocedures_edit']) {
						ctrls.push('edit');
					}
					//删除
					if(Mydao.permissions['supervisionprocedures_del']) {
						ctrls.push('del');
					}
					//查看
					if(Mydao.permissions['supervisionprocedures_look']) {
						ctrls.push('view');
					}
					return Mydao.operator(ctrls);
				},
				events: Mydao.operatorEvents({
					edit: _edit,
					del: _del,
					view: _view
				})
			}]
		});

		//新建
		$("#SupervisionProcedures button[name='create']").on("click", function() {

			init_page();
		});
		Mydao.initselect($("#SupervisionProcedures"));
		//绑定监督项目和历史项目切换事件
		$('#SupervisionProcedures [name="status"]').on('change', function() {
			var _projectselect = $("#SupervisionProcedures select[name='projectid']"),
				_params = _projectselect.data('params').toObj ? _projectselect.data('params').toObj() : {};
			_params.status = $(this).val();
			_projectselect.data('params', JSON.stringify(_params).replace(/"/g, "'")).attr('data-params', JSON.stringify(_params).replace(/"/g, "'"));
			Mydao.initselect(null, null, function() {
				//刷新页面
				$("#SupervisionProcedures_table").bootstrapTable("refreshOptions", {
					pageNumber: 1
				}).bootstrapTable("refresh");
			});
		});
		$('#SupervisionProcedures [name="status"][checked]').trigger('change');

		//绑定项目切换事件
		$('#SupervisionProcedures select[name="projectid"]').on('change', function() {
			//刷新页面
			$("#SupervisionProcedures_table").bootstrapTable("refreshOptions", {
				pageNumber: 1
			}).bootstrapTable("refresh");
		});
		//对项目赋值
		$('#SupervisionProcedures select[name="projectid"]').change();

	})();
