//车站	
	(function() {
		'use strict';
		var station_show = function(e, value, row, index) {
			layer.open({
				type: 1,
				title: '车站信息',
				btnAlign: 'c',
				content: "",
				btn: ['确定'], //按钮
				area: ["400px", "400px"],
				cancel: function(layero, index) {},
				success: function(layero, index) {
					layero.find('.sidebar-collapse').slimScroll({
						height: '100%',
					});

					layero.find('.layui-layer-content').load('view/ProjectInformation/workpoint/cz_edit.html', function() {
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
		var init_station_edit_page = function(e, value, row, index) {
			layer.open({
				type: 1,
				title: '车站信息',
				btnAlign: 'c',
				content: "",
				btn: ['保存', '取消'], //按钮
				area: ["400px", "400px"],
				cancel: function(layero, index) {},
				success: function(layero, index) {
					layero.find('.sidebar-collapse').slimScroll({
						height: '100%',
					});

					layero.find('.layui-layer-content').load('view/ProjectInformation/workpoint/cz_edit.html', function() {
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
					var cs = $("#workpoint_cz_edit").serializeJson();
					var url = 'station/add';
					if(row) { //编辑
						url = 'station/edit';
						cs.id = row.id;
					} else { //新增
						cs.projectid = $("#workpointinfo-overview select[name='projectid']").val();
						cs.sectionid = $("#workpointinfo-overview select[name='sectionid']").val();
					}
					Mydao.ajax(cs, url, function(result) {
						layer.alert("操作成功");
						if(result.code == 200) {
							$("#workpoint_cz #workpoint_cz_table").bootstrapTable("refreshOptions", {
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
		var station_edit = function(e, value, row, index) {
			init_station_edit_page(e, value, row, index);
		};

		//大临工程删除
		var station_del = function(e, value, row, index) {
			layer.confirm('确定删除？', {
				icon: 3,
				title: '提示'
			}, function(index) {
				Mydao.ajax({
					id: row.id
				}, 'station/delete', function(result) {
					var currentTime = result.serverTime;
					if(result.code == 200) {
						$("#workpoint_cz_table").bootstrapTable("refreshOptions", {
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
		var url = "station/list";
		$('#workpoint_cz #workpoint_cz_table').bootstrapTable({
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
				Mydao.config.ajaxParams.params.name = $("#workpoint_cz input[name='name']").val();
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
				title: '站名',
				field: 'name',
				align: 'center'
			}, {
				title: '中心里程',
				field: 'centermileage',
				align: 'center'
			}, {
				title: '车站类型',
				field: 'stationtype',
				align: 'center'
			}, {
				title: '主要工程数量',
				field: 'mainnumber',
				align: 'center'
			}, {
				title: '站房面积',
				field: 'stationarea',
				align: 'center'
			},{
				title: '操作',
				align: 'center',
//				formatter: function(value, row, index) {
//					var ctrls = new Array();
//					//编辑
//					if(Mydao.permissions['station_edit']) {
//						ctrls.push('edit');
//					}
//					//删除
//					if(Mydao.permissions['station_del']) {
//						ctrls.push('del');
//					}
//					return Mydao.operator(ctrls);
//				},
				formatter: function(value, row, index) {
					return Mydao.operator(['edit', 'del','view']);
				},
				events: Mydao.operatorEvents({
					edit: station_edit,
					del: station_del,
					view:station_show
				})
			}]
		});

		//查询
		$("#workpoint_cz button[name='search']").on("click", function() {
			//刷新页面
			$("#workpoint_cz #workpoint_cz_table").bootstrapTable("refreshOptions", {
				pageNumber: 1
			}).bootstrapTable("refresh");
		});

		//新建
		$("#workpoint_cz button[name='create']").on("click", function() {
			if(!$("#workpointinfo-overview select[name='projectid']").val()) {
				layer.msg('请选择项目后新建车站');
				return false;
			}

			if(!$("#workpointinfo-overview select[name='sectionid']").val()) {
				layer.msg('请选择标段后后新建车站');
				return false;
			}

			init_station_edit_page();
		});
	})();