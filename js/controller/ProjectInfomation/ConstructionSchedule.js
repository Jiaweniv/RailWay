+ function($) {
	'use strict';
	(function() {
		var url = 'constructionSchedule/s1001',
			initInput = function(layero) {
				layero.find(".group-input").each(function(index, element) {
					$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
				});
				//  select和标头的组合
				layero.find(".group-select").each(function(index, element) {
					$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
				});
			},
			//编辑项目
			editSchedule = function(e, value, row, index) {
				layer.open({
					type: 1,
					content: "",
					title: "施工进度",
					area: ["70%", "90%"],
					moveOut: true,
					btn: ['保存', '取消'],
					success: function(layero, index) {
						layero.find('.layui-layer-content').load("view/ProjectInformation/schedule_edit.html", function() {
							Mydao.initselect(layero, null, function() {
								Mydao.setform($('#schedule_out #schedule-edit'), row);
							}); //加载select
							initInput(layero);
						});
					},
					cancel: function(layero, index) {},
					btn2: function(index, layero) {},
					yes: function(index, layero) {
						$('#schedule_out #schedule-edit').trigger('validate');
						if($('#schedule_out #schedule-edit').data('validator').isFormValid()) {

							var dataf = $('#schedule_out #schedule-edit').serializeJson();
							var up = $('#schedule_out #beforeinvestment').val();
							if(up && up > dataf.investment) {
								layer.msg("本月开累投资完成比不能小于上月开累投资完成比");
								return false;
							}

							dataf.id = row.id;
							$(this).doajax({
								url: 'constructionSchedule/updateConstructionSchedule',
								data: dataf
							}, function() {
								layer.close(index);
								$('#schedule #schedule-table').bootstrapTable("refreshOptions", {
									pageNumber: 1
								}).bootstrapTable("refresh");
							});
						}
					}
				});
			},
			//删除项目
			delSchedule = function(e, value, row, index) {
				layer.confirm('确定删除？', {
					icon: 3,
					title: '提示'
				}, function(index) {
					Mydao.ajax({
						id: row.id
					}, 'constructionSchedule/deleteConstructionSchedule', function(result) {
						var currentTime = result.serverTime;

						if(result.code == 200) {
							$('#schedule #schedule-table').bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						} else {
							layer.alert(result.msg);
						}
					});
					layer.close(index);
				});
			},
			//显示项目信息
			showSchedule = function(e, value, row, index) {
				layer.open({
					type: 1,
					content: "",
					title: "施工进度",
					area: ["70%", "90%"],
					moveOut: true,
					success: function(layero, index) {
						layero.find('.layui-layer-content').load("view/ProjectInformation/ConstructionScheduleSee.html", function() {						
							$('#schedule-edit #projectname').html(row.projectname);
							$('#schedule-edit #sectionname').html(row.sectionname);
							$('#schedule-edit #year').html(row.year);
							$('#schedule-edit #quarter').html(row.quarter);
							$('#schedule-edit #investment').html(row.investment);
							$('#schedule-edit #imageprogress').html(row.imageprogress);
						});
					},
					cancel: function(layero, index) {
						//清空project对象
					}
				});
			},

			//显示项目进度信息
			show_Progress = function(e, value, row, index) {
				layer.open({
					type: 1,
					content: "",
					title: "施工进度",
					area: ["70%", "90%"],
					moveOut: true,
					success: function(layero, index) {
						Mydao.ajax({
							'projectid': row.projectid, //项目ID
							'sectionid': row.sectionid //标段ID
						}, url, function(result) {
							var currentTime = result.serverTime;
							if(result.code == 200) {
								var _data = result.result.rows;
								layero.find('.layui-layer-content').load("view/ProjectInformation/ProjectScheduleSee.html", function() {
									layero.find('#Project_message #xumumingzi').text(row.projectname);
									layero.find('#Project_message #biaoduanmingzi').text(row.sectionname);
									for(var i = 0; i < _data.length; i++) {
										var _str = '<div class="cd-timeline-img"><span>' + _data[i].year + '</span></div>';
										_str += '<div class="cd-timeline-content">';
										_str += '<div class="project_time"><span class="investment" ><em>' + _data[i].investment + '%</em></span>' + _data[i].year + '年' + _data[i].quarter + '月</div>';
										_str += '<div class="imageprogress" style="word-break: break-all;word-wrap: break-word;text-align: left;"><span>形象进度：</span>' + _data[i].imageprogress + '</div>';
										_str += '</div>';
										var _strPR = $('<div class="cd-timeline-block"></div>');
										$('#cd-timeline').append(_strPR.append(_str));
										if((i % 2) == 1) {
											_strPR.addClass('tr').attr('data-text', 'left');
											_strPR.find('.progress-bar').css({
												'float': 'right'
											});
											_strPR.find('.cd-timeline-content').css({
												'padding-left': '0',
												'padding-right': '70px'
											});
											_strPR.find('.investment').css({
												'right': '0px',
											});
										} else {
											_strPR.find('.investment').css({
												'left': '0px',
											});
										}
									}
								});
							} else {

								layer.alert(result.msg);
							}
						});
					},
					cancel: function(layero, index) {
						//清空project对象
					}
				});
			};
		
		$('#schedule #schedule-table').bootstrapTable({
			pagination: true,
			sidePagination: 'server',
			queryParamsType: "undefined", //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  //设置为limit可以获取limit, offset, search, sort, order  
			method: 'post',
			pageNumber: 1,
			url: Mydao.config.path + url,
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
				Mydao.config.ajaxParams.params.projectid = $('#schedule #projectid').val();
				Mydao.config.ajaxParams.params.sectionid = $('#schedule #sectionid').val();
				//Mydao.config.ajaxParams.params.year = $('#schedule #year').val();   // 施工进度 列表页 不需要按年份 查询
				//Mydao.config.ajaxParams.params.quarter = $('#schedule #quarter').val();
				return Mydao.config.ajaxParams;
			},
			columns: [{
				title: '标段',
				align: 'center',
				field: 'sectionname'
			}, {
				title: '年度',
				field: 'year',
				align: 'center',
				width: '60px'
			}, {
				title: '月份',
				field: 'quarter',
				align: 'center',
				formatter: function(value, row, index) {
					return Data.YueFen(value);
				}
			}, {
				title: '开累投资完成比',
				field: 'investment',
				align: 'center',
				formatter: function(value, row, index) {
					return value + "%";
				}
			}, {
				title: '标段形象进度',
				align: 'center',
				field: 'imageprogress',
				formatter: Mydao.nameFormatter,
				events: {
					'click a': showSchedule
				}
			}, {
				title: '操作',
				align: 'center',
				width: '130px',
				formatter: function(value, row, index) {
					var ctrls = [];
					if(Mydao.permissions['constructionschedule_edit']) {
						ctrls.push('edit');
					}
					if(Mydao.permissions['constructionschedule_del']) {
						ctrls.push('del');
					}
					if(Mydao.permissions['constructionschedule_look']) {
						ctrls.push('view');
					}
					return Mydao.operator(ctrls);
				},
				events: Mydao.operatorEvents({
					edit: editSchedule,
					del: delSchedule,
					view: show_Progress
				})
			}]
		});
		$('#schedule #search').on('click', function(event) {
			$('#schedule #schedule-table').bootstrapTable("refreshOptions", {
				pageNumber: 1
			}).bootstrapTable("refresh");
		});
		$('#schedule #save').on('click', function(event) {
			layer.open({
				type: 1,
				content: "",
				title: "施工进度",
				area: ["70%", "90%"],
				moveOut: true,
				btn: ['保存', '取消'],
				success: function(layero, index) {
					layero.find('.layui-layer-content').load("view/ProjectInformation/schedule_edit.html", function() {
						Mydao.initselect(layero); //加载select
						initInput(layero);
						var date = new Date(),
							dates=date.getMonth();
							if(dates==0){
								dates=12;
							}
						$("#schedule-edit #quarter option").each(function(){							
							if($(this).attr("value")==dates){					
								$(this).attr("selected","selected");
							}else{
								$('option[value=""]').attr("selected","selected");
							}
						});
					});
				},
				cancel: function(layero, index) {
					//清空project对象
				},
				btn2: function(index, layero) {},
				yes: function(index, layero) {
					$('#schedule_out #schedule-edit').trigger('validate');
					if($('#schedule_out #schedule-edit').data('validator').isFormValid()) {
						var dataf = $('#schedule_out #schedule-edit').serializeJson();
						var up = $('#schedule_out #beforeinvestment').val();
						if(up && up > dataf.investment) {
							layer.msg("本月开累投资完成比不能小于上月开累投资完成比");
							return false;
						}
						$(this).doajax({
							url: 'constructionSchedule/insertConstructionSchedule',
							data: dataf
						}, function() {
							layer.close(index);
							$('#schedule #schedule-table').bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						});
					}
				}
			});
		});

		Mydao.initselect('#schedule');
		$(document.body).delegate('#schedule_out #schedule-edit select', 'change', function() {
			var projectid = $('#schedule_out #schedule-edit #projectid').val(),
				sectionid = $('#schedule_out #schedule-edit #sectionid').val(),
				year = $('#schedule_out #schedule-edit #year').val(),
				quarter = $('#schedule_out #schedule-edit #quarter').val();
			if(projectid && sectionid && year && quarter) {
				if(quarter == 1) {
					year = year - 1;
					quarter = 12;
				} else {
					quarter = quarter - 1;
				}
				Mydao.ajax({
					projectid: projectid,
					sectionid: sectionid,
					year: year,
					quarter: quarter
				}, 'constructionSchedule/s1002', function(result) {
					var currentTime = result.serverTime;

					if(result.code == 200) {
						var _result = result.result;
						$('#schedule_out #beforeinvestment').val(_result);
					} else {
						$('#schedule_out #beforeinvestment').val('');
					}

				});
			}
		});

		/*
		 * 取消项目赋值，分页会出现问题。
		 */
		//对项目赋值     
		$("#schedule select[name='projectid']").change();
		//		$('#search').click();
	})();
}(jQuery);