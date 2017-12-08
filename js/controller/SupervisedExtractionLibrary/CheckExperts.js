//检查专家
+ function($) {
	'use strict';
	(function() {

		//删除
		var checkuser_del = function(e, value, row, index) {
			//询问框
			layer.open({
				title: '消息提示', //标题
				content: '确定要删除该检查人员吗？', //内容
				btn: ['确认', '取消'], //按钮
				btnAlign: 'c', //按钮居中
				yes: function(index, layero) { //回调
					Mydao.ajax({
						"id": row.id
					}, 'person/delCheckUser', function(result) {
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						var currentTime = result.serverTime;
						if(result.code == 200) {
							layer.alert("操作成功！");
							//刷新页面
							$("#CheckExperts_lzh #CheckExperts_lzh_table").bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						} else {
							layer.alert("操作失败！");
						}

					});
				}
			});
		};

		var checkexperts_show = function(e, value, row, index) {
			Mydao.ajax({
				'id': row.id,
			}, 'person/show', function(result) {
				var currentTime = result.serverTime;
				if(result.code == 200) {
					var d = row;
					layer.open({
						type: 1,
						title: '检查人员',
						btnAlign: 'c',
						content: "",
						area: ["70%", "90%"],
						moveOut: true,
						cancel: function(layero, index) {},
						success: function(layero, index) {
							layero.find('.sidebar-collapse').slimScroll({
								height: '100%',
							});
							layui.use(['laytpl'], function() {
								var laytpl = layui.laytpl;
								layero.find('.layui-layer-content').load('view/SupervisedExtractionLibrary/InspectorsSee.html', function() {
									var _getTpl = $('#InspectorsSee_lyui').html(),
										project_show = $('#InspectorsSee_show_lyui');
									laytpl(_getTpl).render(d, function(html) {
										project_show.html(html);
										person_aptitude_list(result.result.aptitude);
										var identityback = d.idcardfile;
										var jobentityback = d.jobtitlefile;
										var offientityback = d.officefile;
										if(identityback) {
											var identityback_array = identityback.split(",");
											for(var i = 0; i < identityback_array.length; i++) {
												$('#idcardfile').append("<img src='" + MydaoFileDownPath + "?fileId=" + identityback_array[i] + "' width='100px'/>");
											}
										}
										if(jobentityback) {
											var jobentityback_array = jobentityback.split(",");
											for(var s = 0; s < jobentityback_array.length; s++) {
												$('#jobtitlefile').append("<img src='" + MydaoFileDownPath + "?fileId=" + jobentityback_array[s] + "' width='100px'/>");
											}
										}
										if(offientityback) {
											var offientityback_array = offientityback.split(",");
											for(var a = 0; a < offientityback_array.length; a++) {
												$('#officefile').append("<img src='" + MydaoFileDownPath + "?fileId=" + offientityback_array[a] + "' width='100px'/>");
											}
										}
									});

								});

							});
						},
						yes: function(index, layero) {
							layer.close(index);
						}
					});

				} else {
					layer.msg(result.msg);
				}
			});
		};
		//详情页表格
		var person_aptitude_list = function(row) {
			
//			var id = -1;
//			if(row) id = row.id;

			$("#InspectorsSee_Qualificationtable").bootstrapTable({
//				method: 'post',
//				url: Mydao.config.path + 'personAptitude/list',
				data:row,
				cache: true, //禁用缓存
				search: false, //禁用查询
				striped: true, //隔行变色
				uniqueId: "id", //唯一标识,
//				responseHandler: function(res) { //设置返回数据
//					if(res.code == 200) {
//						return res.result.rows;
//					}
//				},
//				ajaxOptions: {
//					ContentType: 'application/json',
//					dataType: 'json'
//				},
//				queryParams: function(p) {
//					Mydao.config.ajaxParams.params = {};
//					Mydao.config.ajaxParams.params.personid = id;
//					return Mydao.config.ajaxParams;
//				},
				columns: [{
					title: '序号',
					align: 'center',
					formatter: function(val, row, index) {
						return index + 1;
					}
				}, {
					title: '资质证书名称',
					align: 'center',
					field: 'name',
				}, {
					title: '资质证书编号',
					align: 'center',
					field: 'identity',
				}, {
					title: '注册单位',
					align: 'center',
					field: 'company',
				}, {
					title: '注册专业',
					align: 'center',
					field: 'specialty',
				}, {
					title: '证书状态',
					align: 'center',
					formatter: function(value, row, index) {
						if(row.status)
						
						return row.status == 1610? '有效':'无效';
						else
							return '';
					}
				}, {
					title: '附件',
					field: 'file',
					align: 'center',
					formatter: function(value, row, index) {
						if(value)
						return Mydao.imgName(value);
						else
							return '';
					}
				}]
			});
		};

		//加载专业
		Mydao.ajax({
			"type": "DISCIPLINE"
		}, 'dictionary/s1002', function(result) {
			if(result.code == 200) {
				//刷新页面
				$("#CheckExperts_lzh #inspectors_profession").append('<option value="">--所有专业--</option>');
				$.each(result.result, function(index, val) {
					$("#CheckExperts_lzh #inspectors_profession").append('<option value="' + val.id + '">' + val.name + '</option>');
				});
			} else {
				layer.alert("加载专业信息失败!");
			}
		});

		//表格
		var url = "person/findExpertUser";
		$('#CheckExperts_lzh #CheckExperts_lzh_table').bootstrapTable({
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
				Mydao.config.ajaxParams.params.profession = $('#CheckExperts_lzh [name="profession"]').val();
				Mydao.config.ajaxParams.params.name = $('#CheckExperts_lzh [name="name"]').val();
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
				title: '姓名',
				field: 'name',
				align: 'center',
				formatter: Mydao.nameFormatter,
				events: {
					'click a': checkexperts_show
				}
			}, {
				title: '所属组织',  /* 查所属机构   实现不了。*/
				field: 'organizationname',
				align: 'center',
				valign: 'middle'
			}, {
				title: '职务',
				field: 'postname',
				align: 'center',
			}, {
				title: '执法证件编号',
				field: 'lawlicense',
				align: 'center',
			}]
		});
		//查询
		$('#CheckExperts_lzh #CheckExperts_lzh_search').on('click', function(event) {
			$("#CheckExperts_lzh #CheckExperts_lzh_table").bootstrapTable("refreshOptions", {
				pageNumber: 1
			}).bootstrapTable("refresh");
		});
	})();
}(jQuery);