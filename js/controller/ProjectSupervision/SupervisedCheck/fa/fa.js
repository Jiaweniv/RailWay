/**
 * 监督检查方案
 */
$(function() {
	'use strict';
	//编辑
	var _edit = function(e, value, row, index) {
		Mydao.currentPage.params.checkprogram = row;
		layer.open({
			type: 1,
			title: '编辑检查方案',
			btnAlign: 'c',
			content: "",
			area: ["450px", "260px"],
			btn: ['保存', '取消'], //按钮
			success: function(layero, index) {
				layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisedCheck_childs/CheckProgram_simple_edit.html', function() {
					layero.find('.sidebar-collapse').slimScroll({
						height: '100%',
					});

					layero.find(".group-input").each(function(index, element) {
						$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
					});

					Mydao.setform(layero, row);
				});
			},
			yes: function(index, layero) {
				console.log(layero);
				layero.find("#checkprogramEdit #checkprogram_simple_edit").trigger("validate");
				if(!layero.find("#checkprogramEdit #checkprogram_simple_edit").data("validator").isFormValid()) {
					return false;
				}
				var params = layero.find("#checkprogramEdit #checkprogram_simple_edit").serializeJson();
				params.id = row.id;
				Mydao.ajax(params, 'checkProgram/simpleEdit', function(result) {
					layer.close(index); //如果设定了yes回调，需进行手工关闭
					if(result.code == 200) {
						layer.alert("操作成功！");
						//刷新页面
						$("#checkprogram_fa #checkprogram_fa_table").bootstrapTable("refreshOptions", {
							pageNumber: 1
						}).bootstrapTable("refresh");
					} else {
						layer.alert("操作失败！");
					}
				});
				layer.close(layero);
			},
			cancel: function(layero, index) {}
		});
	};

	//显示
	var _show = function(e, value, row, index) {
		layer.open({
			type: 1,
			title: '',
			btnAlign: 'c',
			content: "",
			area: ["70%", "90%"],
			moveOut: true,
			cancel: function(layero, index) {},
			btn: ['导出', '返回'],
			success: function(layero, index) {
				layero.find('.layui-layer-content').load("view/ProjectSupervision/SupervisedCheck_childs/CheckProgram_show.html", function(result) {
					//基础信息
					Mydao.ajax({
						"id": row.id
					}, 'checkProgram/look', function(result) {
						result = result.result;
						layero.find("#checkProgram_show span[name='programname']").text(result.checkprogram.name);
						layero.find("#checkProgram_show span[name='projectname']").text(result.checkprogram.projectname);
						layero.find("#checkProgram_show span[name='checktime']").text(Mydao.formatDate(result.checkprogram.checkstart) + "到" + Mydao.formatDate(result.checkprogram.checkend));
						if(result.checkprogram.affix) {
							layero.find("#checkProgram_show a[name='affixname']").attr('href', MydaoFileDownPath + '?fileId=' + result.checkprogram.affix).html(result.checkprogram.affixname);
						}
						var checkusers = "";
						for(var i = 0; i < result.checkprogram.checkusers.length; i++) {
							if(i == 0) {
								checkusers += result.checkprogram.checkusers[i].name;
							} else {
								checkusers += "、" + result.checkprogram.checkusers[i].name;
							}
						}
						layero.find("#checkProgram_show span[name='checkusers']").text(checkusers);

						layero.find("#checkProgram_show span[name='superviseplan']").text(result.checkprogram.planname);

						$("#checkProgram_show #checkprogram_show_sections").bootstrapTable({
							data: result.sections,
							checkboxHeader: true,
							uniqueId: "id",
							columns: [{
								title: '序号',
								align: 'center',
								valign: 'middle',
								formatter: function(val, row, index) {
									return index + 1;
								}
							}, {
								title: '标段',
								field: 'sectionname',
								align: 'center',
								valign: 'middle',
							}, {
								title: '工点',
								field: 'workpointname',
								align: 'center',
								valign: 'middle',
							}]
						});

						$("#checkProgram_show #checkprogram_show_items").bootstrapTable({
							data: result.items,
							checkboxHeader: true,
							uniqueId: "id",
							columns: [{
									title: '序号',
									align: 'center',
									valign: 'middle',
									formatter: function(val, row, index) {
										return index + 1;
									}
								}, {
									title: '检查类型',
									field: 'itemname',
									align: 'center',
									valign: 'middle',
								}, {
									title: '检查事项',
									field: 'allname',
									align: 'center',
									valign: 'middle',
								}, {
									title: '抽查依据',
									field: 'foundation',
									align: 'center',
									valign: 'middle',
								}, {
									title: '抽查内容',
									field: 'content',
									align: 'center',
									valign: 'middle',
								}, {
									title: '抽查对象',
									field: 'checkobject',
									align: 'center',
									valign: 'middle',
								}
								//									{
								//										title: '抽查类型',
								//										field: 'selecttype',
								//										align: 'center',
								//										valign: 'middle'
								//									}
							]
						});

					});
					//标段、工点信息表格
					//						Mydao.ajax({
					//							"checkprogramid": row.id
					//						}, 'checkProgram/sectionPointTable', function(result) {
					//							for(var i = 0; i < result.result.length; i++) {
					//								var val = result.result[i];
					//								var td_length = val.tr_length - 2;
					//								var obj = '<fieldset>' +
					//									'<legend>标段：' + val.sectionname + '　　工点：' + val.workpointname + '</legend>' +
					//									'	<table>' +
					//									'		<tr>' +
					//									'			<td colspan="' + td_length + '" align="center">检查事项</td>' +
					//									'			<td align="center">抽查依据</td>' +
					//									'			<td align="center">抽查内容</td>' +
					//									'			<td align="center">抽查对象</td>' +
					//									'			<td align="center">抽查类型</td>' +
					//									'		</tr>';
					//								for(var j = 0; j < val.infos.length; j++) {
					//									var info = val.infos[j];
					//									obj += '<tr>';
					//									for(var k = 0; k < td_length; k++) {
					//										var item = info.items[k];
					//										if(item)
					//											obj += '<td id="' + info.items[k].itemid + '">' + info.items[k].name + '</td>';
					//										else
					//											obj += '<td class="blank"></td>';
					//									}
					//									obj += '<td>' + info.foundation + '</td>' +
					//										'<td>' + info.content + '</td>' +
					//										'<td>' + info.checkobject + '</td>' +
					//										'<td>' + info.mode + '</td>';
					//									if(info.selecttype == 0)
					//										obj += '<td>选择</td>';
					//									else
					//										obj += '<td>抽取</td>';
					//									obj += '</tr>';
					//								}
					//
					//								obj += '	</table>' +
					//									'</legend>' +
					//									'</fieldset>';
					//
					//								$("#checkProgram_show").append($(obj));
					//							}
					//						})
				});
			},
			yes: function(index, layero) {
				window.location.href = MydaoFileDownPath + "?fileId=" + row.reportid;
			}
		});
	};

	//删除
	var _del = function(e, value, row, index) {
		//询问框
		layer.open({
			title: '消息提示', //标题
			content: '确定要删除该检查方案吗？', //内容
			btn: ['确认', '取消'], //按钮
			btnAlign: 'c', //按钮居中
			yes: function(index, layero) { //回调
				Mydao.ajax({
					"id": row.id
				}, 'checkProgram/delete', function(result) {
					layer.close(index); //如果设定了yes回调，需进行手工关闭
					var currentTime = result.serverTime;
					if(result.code == 200) {
						layer.alert("操作成功！");
						//刷新页面
						$("#checkprogram_fa #checkprogram_fa_table").bootstrapTable("refreshOptions", {
							pageNumber: 1
						}).bootstrapTable("refresh");
					} else {
						layer.alert(result.msg);
					}
				});
			}
		});
	};

	var resizeInput = function(obj) {
		$(obj).find(".group-input").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
		});
		//  select和标头的组合
		$(obj).find(".group-select").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
		});
		//  textarea和标头的组合
		$(obj).find(".group-textarea").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
		});

	};
	//查询
	$("#checkprogram_fa button[name='search']").on("click", function() {
		//刷新页面
		$("#checkprogram_fa #checkprogram_fa_table").bootstrapTable("refreshOptions", {
			pageNumber: 1
		}).bootstrapTable("refresh");
	});

	//新建
	$("#checkprogram_fa button[name='create']").on("click", function() {
		init_checkprogram_fa_page();
	});

	//初始化编辑页面
	var init_checkprogram_fa_page = function(e, value, row, index) {
		row == undefined ? Mydao.currentPage.params.checkprogram = null : Mydao.currentPage.params.checkprogram = row;
		layer.open({
			id: 'checkprogram_add',
			type: 1,
			title: row == null ? '添加检查方案' : '编辑检查方案',
			btnAlign: 'c',
			content: "",
			area: ["70%", "90%"],
			moveOut: true,
			cancel: function(layero, index) {

			},
			success: function(layero, index) {
				Mydao.currentPage.params.window = index;
				Mydao.currentPage.params.layero = layero;
				layero.find('.sidebar-collapse').slimScroll({
					height: '100%',
				});
				layero.find('.layui-layer-content').load(row == null ? 'view/ProjectSupervision/SupervisedCheck_childs/CheckProgram_add.html' : 'view/ProjectSupervision/SupervisedCheck_childs/CheckProgram_edit.html', function() {
					row == null ? layero.find('#checkprogram_one_step').find('#checkprogram_one_step_projectid').val($('#SupervisedCheck .projetc_li_val_xuanzhong> select').val()).change() : '';
					//调整input宽度
					resizeInput(layero);
					$(".wizard > .steps > ul > li").css({
						"width": "20%",
						"height": "5px",
						"background": "#c1c1c1"
					});
					$(".wizard > .steps > ul > li > a").css({
						"text-align": "center",
						"line-height": "55px",
						"color": "#5eb7f1",
						"height": "0px"
					});
					$(".wizard > .steps .current a").css({
						"color": "#5eb7f1"
					});
				});
			}
		});
	};

	//方案表格
	$('#checkprogram_fa #checkprogram_fa_table').bootstrapTable({
		pagination: true,
		sidePagination: 'server',
		queryParamsType: "undefined", //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  //设置为limit可以获取limit, offset, search, sort, order  
		method: 'post',
		pageNumber: 1,
		url: Mydao.config.path + "checkProgram/list",
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
			Mydao.config.ajaxParams.page.orderField = "cp.checkstart";
			Mydao.config.ajaxParams.page.pageSize = p.pageSize;
			Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
			Mydao.config.ajaxParams.page.orderDirection = "desc";
			Mydao.config.ajaxParams.params.projectid = $("#SupervisedCheck #projectid").val();
			Mydao.config.ajaxParams.params.name = $("#checkprogram_fa input[name='name']").val();
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
			title: '方案名称',
			field: 'name',
			align: 'center',
			formatter: Mydao.nameFormatter,
			events: {
				'click a': _show
			}

		}, {
			title: '检查时间',
			align: 'center',
			formatter: function(val, row, index) {
				return Mydao.formatDate(row.checkstart) + "到" + Mydao.formatDate(row.checkend);
			}
		}, {
			title: '检查人员',
			align: 'center',
			field: 'personname'
		}, {
			title: '方案附件',
			field: 'affix',
			align: 'center',
			formatter: function(value, row, index) {
				if(value) {
					//						if(row.affixname) {
					//							return '<a class="m-module-a" href="' + MydaoFileDownPath + '?fileId=' + value + '">' + row.affixname + '</a>';
					//						} else {
					return '<a class="m-module-a" href="' + MydaoFileDownPath + '?fileId=' + value + '">点击下载</a>';
					//						}
				}
			}
		}, {
			title: '操作',
			align: 'center',
			formatter: function(value, row, index) {
				var ctrls = [];
				//编辑
				if(Mydao.permissions['checkprogram_edit']) {
					ctrls.push('edit');
				}
				//删除
				if(Mydao.permissions['checkprogram_del']) {
					ctrls.push('del');
				}

				//查看
				//					if(Mydao.permissions['checkprogram_look']) {
				//						ctrls.push('view');
				//					}

				return Mydao.operator(ctrls);
			},
			events: Mydao.operatorEvents({
				//					edit: _edit,  
				edit: init_checkprogram_fa_page,
				del: _del,
				//					view: _show
			})
		}]
	});
});