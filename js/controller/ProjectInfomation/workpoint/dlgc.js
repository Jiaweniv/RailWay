//大临工程	
	(function() {
		'use strict';
		//初始化编辑页面
		var largeproject_show = function(e, value, row, index) {
			layer.open({
				type: 1,
				title: '大临工程信息',
				btnAlign: 'c',
				content: "",
				btn: ['确定'], //按钮
				area: ["70%", "90%"],
				moveOut: true,
				cancel: function(layero, index) {},
				success: function(layero, index) {
					layero.find('.sidebar-collapse').slimScroll({
						height: '100%',
					});

					layero.find('.layui-layer-content').load('view/ProjectInformation/workpoint/dlgc_edit.html', function() {
						layero.find('.sidebar-collapse').slimScroll({
							height: '100%',
						});

						layero.find(".group-input").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
						});

						//select和标头的组合
						layero.find(".group-select").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
						});
					layero.find("select,input,textarea").attr("disabled", "disabled");
					});
					Mydao.setform(layero, row);

				},
				yes: function(index, layero) {
					layer.close(index);
				}
			});
		};
		//初始化编辑页面
		var init_largeproject_edit_page = function(e, value, row, index) {
			layer.open({
				type: 1,
				title: '大临工程信息',
				btnAlign: 'c',
				content: "",
				btn: ['保存', '取消'], //按钮
				area: ["70%", "90%"],
				moveOut: true,
				cancel: function(layero, index) {},
				success: function(layero, index) {
					layero.find('.sidebar-collapse').slimScroll({
						height: '100%',
					});

					layero.find('.layui-layer-content').load('view/ProjectInformation/workpoint/dlgc_edit.html', function() {
						layero.find('.sidebar-collapse').slimScroll({
							height: '100%',
						});

						layero.find(".group-input").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
						});

						//select和标头的组合
						layero.find(".group-select").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
						});

					});
					Mydao.setform(layero, row);

				},
				yes: function(index, layero) {
					layero.find("form").trigger("validate");
					if(!layero.find("form").data( "validator" ).isFormValid()) return false;
					var cs = $("#workpoint_gdgc_edit").serializeJson();
					if(row) { //编辑
						cs.id = row.id;
					} else { //新增
						cs.projectid = $("#workpointinfo-overview select[name='projectid']").val();
						cs.sectionid = $("#workpointinfo-overview select[name='sectionid']").val();
					}
					Mydao.ajax(cs, 'largeProject/edit', function(result) {
						layer.alert("操作成功");
						if(result.code == 200) {
							$("#workpoint_dlgc #workpoint_dlgc_table").bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						} else {
							layer.msg(result.msg);
						}
					});
					layer.close(index);
				}
			});
		};

		//大临工程编辑
		var largeproject_edit = function(e, value, row, index) {
			init_largeproject_edit_page(e, value, row, index);
		};

		//大临工程删除
		var largeproject_del = function(e, value, row, index) {
			layer.confirm('确定删除？', {
				icon: 3,
				title: '提示'
			}, function(index) {
				Mydao.ajax({
					id: row.id
				}, 'largeProject/del', function(result) {
					var currentTime = result.serverTime;
					if(result.code == 200) {
						$("#workpoint_dlgc #workpoint_dlgc_table").bootstrapTable("refreshOptions", {
							pageNumber: 1
						}).bootstrapTable("refresh");
					} else {
						layer.msg(result.msg);
					}
				});
				layer.close(index);
			});
		};

		//表格
		var url = "largeProject/list";
		$('#workpoint_dlgc #workpoint_dlgc_table').bootstrapTable({
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
				Mydao.config.ajaxParams.params.projectid = $("#workpointinfo-overview select[name='projectid']").val();
				Mydao.config.ajaxParams.params.sectionid = $("#workpointinfo-overview select[name='sectionid']").val();
				Mydao.config.ajaxParams.params.name = $("#workpoint_dlgc input[name='name']").val();
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
				title: '设施名称',
				field: 'name',
				align: 'center'
			}, {
				title: '地点及位置',
				field: 'location',
				align: 'center'
			}, {
				title: '标准、规划及用地面积',
				field: 'area',
				align: 'center'
			}, {
				title: '供应范围',
				field: 'range',
				align: 'center'
			}, {
				title: '主要工程数量',
				field: 'worknumber',
				align: 'center'
			}, {
				title: '主要设备配置',
				field: 'deviceconf',
				align: 'center'
			}, {
				title: '操作',
				align: 'center',
				formatter: function(value, row, index) {
					var ctrls = [];
					//编辑
					if(Mydao.permissions['largeproject_edit']) {
						ctrls.push('edit');
					}
					//删除
					if(Mydao.permissions['largeproject_del']) {
						ctrls.push('del');
					}
					//删除
					//if(Mydao.permissions['largeproject_look']) {
						ctrls.push('view');
					//}
					return Mydao.operator(ctrls);
				},
				events: Mydao.operatorEvents({
					edit: largeproject_edit,
					del: largeproject_del,
					view:largeproject_show
				})
			}]
		});

		//查询
		$("#workpoint_dlgc button[name='search']").on("click", function() {
			//刷新页面
			$("#workpoint_dlgc #workpoint_dlgc_table").bootstrapTable("refreshOptions", {
				pageNumber: 1
			}).bootstrapTable("refresh");
		});

		//新建
		$("#workpoint_dlgc button[name='create']").on("click", function() {
			if(!$("#workpointinfo-overview select[name='projectid']").val()) {
				layer.msg('请选择项目后新建大临工程');
				return false;
			}

			if(!$("#workpointinfo-overview select[name='sectionid']").val()) {
				layer.msg('请选择标段后后新建大临工程');
				return false;
			}

			init_largeproject_edit_page();
		});
	})();