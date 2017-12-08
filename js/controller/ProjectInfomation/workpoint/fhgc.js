
	(function() {
		var fhgc_edit = function(e, value, row, index) {
				var id = $('#fhgc [data-toggle="tab"][aria-expanded="true"]').attr('id');
				Mydao.ajax({
					id: row.id
				}, id + '/s1002', function(result) {
					var currentTime = result.serverTime;
					if(result.code == 200) {
						var _result = result.result;
						var dialog = layer.open({
							type: 1,
							content: "",
							area: ["70%", "90%"],
							moveOut: true,
							btn: ['确定', '取消'],
							success: function(layero, index) {
								layero.find('.layui-layer-content').load("view/ProjectInformation/workpoint/fhgc_edit.html", function() {
									$('#' + id + '_edit').removeClass('hide');
									layero.find(".group-input").each(function(index, element) {
										$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
									});
									//  select和标头的组合
									layero.find(".group-select").each(function(index, element) {
										$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
									});
									Mydao.setform($('#' + id + '_edit'), _result);
								});
							},
							cancel: function() {

							},
							yes: function(indexr, layero) {
								$('#' + id + '_edit').trigger("validate");
								if($('#' + id + '_edit').data("validator").isFormValid()) {
									Mydao.config.ajaxParams.params = $('#' + id + '_edit').serializeJson();
									Mydao.config.ajaxParams.params.id = row.id;
									$(this).doajax({
										url: id + '/s1004',
										data: Mydao.config.ajaxParams.params
									}, function(msg) {
										layer.close(indexr);
										$('#fhgc-table').bootstrapTable('refresh');
									});
								}
							}
						});
					} else {
						layer.alert(result.msg);
					}

				});
			},
			fhgc_del = function(e, value, row, index) {
				var id = $('#fhgc [data-toggle="tab"][aria-expanded="true"]').attr('id');
				layer.confirm('是否删除?', function(indexl) {
					$(this).doajax({
						url: id + '/s1005',
						data: {
							id: row.id
						}
					}, function() {
						layer.close(indexl);
						$('#fhgc-table').bootstrapTable('refresh');
					});
				});
			},
			fhgc_show = function(e, value, row, index) {
				var id = $('#fhgc [data-toggle="tab"][aria-expanded="true"]').attr('id');
				Mydao.ajax({id:row.id},id+'/s1002',function(result){
					var currentTime = result.serverTime;
					if(result.code == 200){
					    var resultForm = result.result;
						$.ajax({
							type: 'get',
							dataType:'html',
							url: 'view/ProjectInformation/workpoint/fhgc_show.html',
							success: function(resp) {
								var dialog = layer.open({
									type: 1,
									content: resp,
									area: ["70%", "90%"],
									moveOut: true,
									success: function(layero, index) {
										$('#' + id + '_show').removeClass('hide');
									}
								});
							},
							dataFilter: function(data) {
								data = Mydao.setcontent(data,resultForm);
								return data;
							}
						});
					}else{
					    layer.alert(result.msg);
					}
				
				});
			};

		var tablec = {
			crossironBridge: {
				columns: [{
					title: '序号',
					align:'center',
					formatter: function(value, row, index) {
						return index + 1;
					},
				}, {
					title: '线名',
					align:'center',
					field: 'linename',
					formatter: Mydao.nameFormatter,
					events: {
						'click a': fhgc_show
					}
				}, {
					title: '行别',
					align:'center',
					field: 'streamtype',
				}, {
					title: '中心里程',
					align:'center',
					field: 'centermileage',
				}, {
					title: '桥梁限重（T）',
					align:'center',
					field: 'weightlimit',
				}, {
					title: '桥梁限速（km/h）',
					align:'center',
					field: 'speedlimit',
				}, {
					title: '管理单位',
					align:'center',
					field: 'managementunit',
				}, {
					title: '操作　<i id="fhgc_save" class="fa fa-plus-square-o" title="新增"></i>',
					align: 'center',
					formatter: function(value, row, index) {
						var ctrls = [];
						ctrls.push('edit');
						ctrls.push('del');
						return Mydao.operator(ctrls);
					},
					events: Mydao.operatorEvents({
						edit: fhgc_edit,
						del: fhgc_del
					})
				}]
			},
			lronCrossbar: {
				columns: [{
					title: '序号',
					align:'center',
					formatter: function(value, row, index) {
						return index + 1;
					},
				}, {
					title: '线名',
					align:'center',
					field: 'linename',
					formatter: Mydao.nameFormatter,
					events: {
						'click a': fhgc_show
					}
				}, {
					title: '行别',
					align:'center',
					field: 'streamtype',
				}, {
					title: '中心里程',
					align:'center',
					field: 'centermileage',
				}, {
					title: '限高（m）',
					align:'center',
					field: 'highlimit',
				}, {
					title: '归属站段',
					align: 'center',
					field: 'ascriptionstation',
				}, {
					title: '归属铁路局',
					align:'center',
					field: 'ascriptionrailway',
				}, {
					title: '操作　<i id="fhgc_save" class="fa fa-plus-square-o" title="新增"></i>',
					align: 'center',
					formatter: function(value, row, index) {
						var ctrls = [];
						ctrls.push('edit');
						ctrls.push('del');
						return Mydao.operator(ctrls);
					},
					events: Mydao.operatorEvents({
						edit: fhgc_edit,
						del: fhgc_del
					})
				}]
			},
			protectiveFence: {
				columns: [{
					title: '序号',
					align: 'center',
					formatter: function(value, row, index) {
						return index + 1;
					},
				}, {
					title: '线名',
					align: 'center',
					field: 'linename',
					formatter: Mydao.nameFormatter,
					events: {
						'click a': fhgc_show
					}
				}, {
					title: '行别',
					align: 'center',
					field: 'streamtype',
				}, {
					title: '材质',
					align: 'center',
					field: 'material',
				}, {
					title: '栅栏高度（m）',
					align: 'center',
					field: 'high',
				}, {
					title: '起点里程',
					align: 'center',
					field: 'startmileage',
				}, {
					title: '终点里程',
					align: 'center',
					field: 'endmileage',
				}, {
					title: '操作　<i id="fhgc_save" class="fa fa-plus-square-o" title="新增"></i>',
					align: 'center',
					formatter: function(value, row, index) {
						var ctrls = [];
						ctrls.push('edit');
						ctrls.push('del');
						return Mydao.operator(ctrls);
					},
					events: Mydao.operatorEvents({
						edit: fhgc_edit,
						del: fhgc_del
					})
				}]
			},
			ironParallel: {
				columns: [{
					title: '序号',
					align: 'center',
					formatter: function(value, row, index) {
						return index + 1;
					},
				}, {
					title: '线名',
					align: 'center',
					field: 'linename',
					formatter: Mydao.nameFormatter,
					events: {
						'click a': fhgc_show
					}
				}, {
					title: '行别',
					align: 'center',
					field: 'streamtype',
				}, {
					title: '结构形式',
					align: 'center',
					field: 'structuretype',
				}, {
					title: '长度（公里）',
					align: 'center',
					field: 'length',
				}, {
					title: '起点里程',
					align: 'center',
					field: 'startmileage',
				}, {
					title: '终点里程',
					align: 'center',
					field: 'endmileage',
				}, {
					title: '操作　<i id="fhgc_save" class="fa fa-plus-square-o" title="新增"></i>',
					align: 'center',
					formatter: function(value, row, index) {
						var ctrls = [];
						ctrls.push('edit');
						ctrls.push('del');
						return Mydao.operator(ctrls);
					},
					events: Mydao.operatorEvents({
						edit: fhgc_edit,
						del: fhgc_del
					})
				}]
			},
			lineVideo: {
				columns: [{
					title: '序号',
					align: 'center',
					formatter: function(value, row, index) {
						return index + 1;
					},
				}, {
					title: '线名',
					align: 'center',
					field: 'linename',
					formatter: Mydao.nameFormatter,
					events: {
						'click a': fhgc_show
					}
				}, {
					title: '行别',
					align: 'center',
					field: 'streamtype',
				}, {
					title: '摄像头位置',
					align: 'center',
					field: 'location',
				}, {
					title: '设备管理单位',
					align: 'center',
					field: 'managementunit',
				}, {
					title: '盯控单位',
					align: 'center',
					field: 'stareunit',
				}, {
					title: '备注',
					align: 'center',
					field: 'remark',
				}, {
					title: '操作　<i id="fhgc_save" class="fa fa-plus-square-o" title="新增"></i>',
					align: 'center',
					formatter: function(value, row, index) {
						var ctrls = [];
						ctrls.push('edit');
						ctrls.push('del');
						return Mydao.operator(ctrls);
					},
					events: Mydao.operatorEvents({
						edit: fhgc_edit,
						del: fhgc_del
					})
				}]
			}
		};
		$('#fhgc #fhgc-table').bootstrapTable({
			pagination: true,
			sidePagination: 'server',
			queryParamsType: "undefined", //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  //设置为limit可以获取limit, offset, search, sort, order  
			method: 'post',
			pageNumber: 1,
			url: Mydao.config.path + $('#fhgc [data-toggle="tab"][aria-expanded="true"]').attr('id') + '/s1001',
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
				Mydao.config.ajaxParams.params.sectionid = $('#workpointinfo-overview #workpoint_select_section').val();
				Mydao.config.ajaxParams.params.projectid = $('#workpointinfo-overview #workpoint_select_projectid').val();
				return Mydao.config.ajaxParams;
			},
			columns: tablec['crossironBridge'].columns
		});

		$('#fhgc').delegate('#fhgc_save', 'click', function() {
			if(!$('#workpointinfo-overview #workpoint_select_section').val()) {
				layer.msg('请选择标段！');
				return true;
			}
			var id = $('#fhgc [data-toggle="tab"][aria-expanded="true"]').attr('id');
			var dialog = layer.open({
				type: 1,
				content: "",
				area: ["70%", "90%"],
				moveOut: true,
				btn: ['确定', '取消'],
				success: function(layero, index) {
					layero.find('.layui-layer-content').load("view/ProjectInformation/workpoint/fhgc_edit.html", function(result) {
						$('#' + id + '_edit').removeClass('hide');
						layero.find(".group-input").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
						});
						//  select和标头的组合
						layero.find(".group-select").each(function(index, element) {
							$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
						});
					});
				},
				cancel: function() {

				},
				yes: function(indexr, layero) {
					$('#' + id + '_edit').trigger("validate");
					if($('#' + id + '_edit').data("validator").isFormValid()) {
						Mydao.config.ajaxParams.params = $('#' + id + '_edit').serializeJson();
						Mydao.config.ajaxParams.params.sectionid = $('#workpointinfo-overview #workpoint_select_section').val();
						Mydao.config.ajaxParams.params.projectid = $('#workpointinfo-overview #workpoint_select_projectid').val();
						$(this).doajax({
							url: id + '/s1003',
							data: Mydao.config.ajaxParams.params
						}, function(msg) {
							layer.close(indexr);
							$('#fhgc #fhgc-table').bootstrapTable('refresh');
						});
					}
				}
			});
		});
		$('#fhgc [data-toggle="tab"]').on('click', function() {
			var id = this.id;
			$('#fhgc-table').bootstrapTable('removeAll').bootstrapTable('refreshOptions', {
				columns: tablec[id].columns,
				pageNumber: 1,
				url: Mydao.config.path + id + '/s1001'
			});
		});
	})($);