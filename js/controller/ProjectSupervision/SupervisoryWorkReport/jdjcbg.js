//监督检查报告
//李朝华
	
	(function() {
		'use strict';
		//方案查看
		var central_show = function(e, value, row, index) {
			layer.open({
				type: 1,
				content: "",
				title: '查看',
				area: ['80%', '90%'],
				moveOut: true,
				success: function(layero, index) {
					layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisoryWorkReport_childs/JDJCBG_show_And_eidt.html', function() {
						$('.JDJCBG_edit').hide(); //控制编辑隐藏
						$('.JDJCBG_show').show(); //控制查看显示
						Mydao.ShowHuiTian(layero, row); // 查看回填方法
						//回填上报人
						var _MyDao_User = JSON.parse(sessionStorage.getItem('MYDAO_USER'));
						layero.find('#people').html(_MyDao_User.username);
					});
				},
				cancel: function(layero, index) {

				}
			});
		};
		//项目查看
		var projectname_show = function(e, value, row, index) {
			Mydao.ajax({
				"id": row.id
			}, 'inspectionReport/s1005', function(result) {
				var currentTime = result.serverTime;
				if(result.code == 200) {
					var d = result.result;
					layer.open({
						type: 1,
						content: "",
						title: '查看',
						area: ['80%', '90%'],
						moveOut: true,
						success: function(layero, index) {
							//有些统计值后台统计麻烦,前台处理
							d.checkitemLenght = Object.keys(d.checkitem).length; //统计检查事项的类别个数
							var sum = 0;
							$.each(d.checkitem, function(index, ele) {
								return sum += parseInt(ele.childrens.length); //循环累加
							});
							d.checkitemChildrensLenght = sum; //统计检查事项的事项个数
							d.checkdetailLenght = d.checkdetail.length; //统计检查结果的 不合格个数
							layui.use(['laytpl'], function() {
								var laytpl = layui.laytpl;
								layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisoryWorkReport_childs/jdjcbgSee.html', function() {
									var _getTpl = $('#JDJCBG_container').html(),
										project_show = $('#JDJCBG_SHOW_LAYUI');
									laytpl(_getTpl).render(d, function(html) {
										project_show.html(html);
									});
									//	检查结果 列表
									project_show.find('#check_result').bootstrapTable({
										cache: true,
										striped: true, //隔行变色
										data: d.checkdetail,
										columns: [{
											title: '标段',
											field: 'sectionname',
											align: 'center'
										}, {
											title: '工点',
											field: 'workpointname',
											align: 'center'
										}, {
											title: '事项分类',
											field: 'itemname',
											align: 'center'
										}, {
											title: '问题描述',
											field: 'description',
											align: 'center',
										}]
									});
								});
							});
						},
						cancel: function(layero, index) {

						}
					});
				} else {
					layer.msg(result.msg);
				}
			});
		};
		//编辑
		var central_edit = function(e, value, row, index) {
			layer.open({
				type: 1,
				content: "",
				btn: ['保存', '取消'], //底部按钮
				btnAlign: 'c', //按钮居中
				title: '编辑监督检查报告',
				area: ['80%', '90%'],
				moveOut: true,
				success: function(layero, index) {
					layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisoryWorkReport_childs/JDJCBG_show_And_eidt.html', function() {
						Mydao.initselect(layero, null, function() { //填充 select 的值
							Mydao.setform(layero, row); //填充表单的值
						});
						//回填上报人    不可被修改  默认当前用户
						var _MyDao_User = JSON.parse(sessionStorage.getItem('MYDAO_USER'));
						layero.find('#JDJCBG_edit #ShangBaoRen').find('input').val(_MyDao_User.username);
					});
				},
				yes: function(index, layero) {
					Mydao.ajax({
						"id": row.id,
						"projectid": $("#JDJCBG_edit #projectid").val(),
						"checkprogramid": $("#JDJCBG_edit [name='checkprogramid']").val(),
						"reporttime": $("#JDJCBG_edit #reporttime").val(),
						"appendix": $("#JDJCBG_edit input[name='appendix']").val()
					}, 'inspectionReport/s1002', function(result) {
						var currentTime = result.serverTime;
						if(result.code == 200) {
							layer.alert("操作成功！");
							$("#xmztbg #jdjcbg_table5").bootstrapTable("refresh"); //刷新当前表格
						} else {
							layer.msg(result.msg);
						}
						layer.close(index); //如果设定了yes回调，需进行手工关闭
					});
				},
				cancel: function(layero, index) {

				},
				btn2: function(index, layero) {

				}
			});
		};
		//删除
		var central_del = function(e, value, row, index) {
			layer.open({
				title: '消息提示', //标题
				content: '确定要删除该监督检查报告吗？', //内容
				btn: ['确认', '取消'], //按钮
				btnAlign: 'c', //按钮居中
				success: function(layero, index) {},
				yes: function(index, layero) { //回调
					Mydao.ajax({
						"id": row.id
					}, 'inspectionReport/s1006', function(result) {
						var currentTime = result.serverTime;
						if(result.code == 200) {
							layer.msg("操作成功！");
							//刷新页面
							$("#xmztbg #jdjcbg_table5").bootstrapTable("refresh");
						} else {
							layer.msg(result.msg);
						}
						layer.close(index);
					});
				}
			});
		};
		//导出 
		var central_export = function(e, value, row, index) {
			window.location.href = MydaoFileDownPath + "?fileId=" + row.reportfileid;
		};
		var url = 'inspectionReport/s1004';
		$('#xmztbg #jdjcbg_table5').bootstrapTable({
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
				Mydao.config.ajaxParams.page.orderField = '';
				Mydao.config.ajaxParams.page.pageSize = p.pageSize;
				Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
				Mydao.config.ajaxParams.page.orderDirection = 'desc';
				Mydao.config.ajaxParams.params.clientid = Mydao.clientid;
				return Mydao.config.ajaxParams;
			},
			columns: [{
				title: '方案名称',
				field: 'checkprogramname',
				align: 'center',
				formatter: Mydao.nameFormatter,
				events: {
					'click a': central_show
				}
			}, {
				title: '项目名称',
				field: 'projectname',
				align: 'center',
				formatter: Mydao.nameFormatter,
				events: {
					'click a': projectname_show
				}
			}, {
				title: '报告时间',
				field: 'reporttime',
				align: 'center',
				formatter: function(val, row, index) {
					var d = new Date();
					d.setTime(val);
					return d.format("YYYY-MM-DD");
				}
			}, {
				title: '监督检查报告',
				align: 'center',
				field: 'appendix',
				formatter: function(val, row, index) {
					if(val) {
						return Mydao.fileName(val);
					}
				}
			}, {
				title: '操作',
				align: 'center',
				formatter: function(value, row, index) {
					var ctrls = [];
					if(Mydao.permissions['central_edit']) {
						ctrls.push('edit');
					}
					if(Mydao.permissions['central_del']) {
						ctrls.push('del');
					}
					if(Mydao.permissions['central_download']) {
						ctrls.push('export');
					}
					return Mydao.operator(ctrls);
				},
				events: Mydao.operatorEvents({
					edit: central_edit, // 编辑
					del: central_del, //删除
					export: central_export, //导出
				})
			}]
		});

	})();
