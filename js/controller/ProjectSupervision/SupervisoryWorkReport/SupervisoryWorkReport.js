
	(function() {
		'use strict';
		$('#SupervisoryWorkReport [data-toggle="tab"]').on('click', function() {
			var _obj = $(this);
			$(_obj.attr('href')).load(_obj.data('url'), function() {
				resizeInput();
			});
		});
		//初始化下来框
		Mydao.initselect($("#SupervisoryWorkReport"));
		var _show = function() {
			$('#SupervisedCheck_layer #divyear').css('display', 'none');
			$('#SupervisedCheck_layer #divyue').css('display', 'none');
			$('#SupervisedCheck_layer #divquarter').css('display', 'none');
		};
		$('#SupervisedCheck_layer [name="type"]').on('change', function() {
			_show();
			var str = $(this).val();
			if(str == 2) {
				$('#SupervisedCheck_layer #divyear').css('display', '');
			} else if(str == 3) {
				$('#SupervisedCheck_layer #divyear').css('display', '');
				$('#SupervisedCheck_layer #divquarter').css('display', '');
			} else if(str == 4) {
				$('#SupervisedCheck_layer #divyear').css('display', '');
				$('#SupervisedCheck_layer #divyue').css('display', '');
			}
		});
		//调整input宽度
		var resizeInput = function(ele) {
			$(ele).find(".group-input").each(function(index, element) {
				$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
			});
			//  select和标头的组合
			$(ele).find(".group-select").each(function(index, element) {
				$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
			});

			$(ele).find('.sidebar-collapse').slimScroll({
				height: '100%',
			});
		};

		//默认显示工点表
		$("#SupervisoryWorkReport #tab-SupervisoryWorkReport1").load("view/ProjectSupervision/SupervisoryWorkReport_childs/xmztbg.html", function() {
			resizeInput();
		});

		//项目和标段改变后刷新页面
		var refreshConetent = function() {
			var _obj = $("#SupervisoryWorkReport a[aria-expanded='true']"),
				_content = $(_obj.attr('href'));
			_content.load(_obj.data('url'), function() {
				resizeInput();
			});
		};
			//新建
		$('#SuperNewBtn').on('click', function(event) {
			layer.open({
				type: 1,
				content: '',
				btn: ['确认', '取消'], //按钮
				shadeClose: 'true', //遮罩
				btnAlign: 'c', //按钮居中				
				area: ["70%", "90%"],
				moveOut: true,
				success: function(layero, index) {
					layero.find('.layui-layer-content').load('view/ProjectSupervision/SupervisoryWorkReport_edit.html', function() {
						//监督工作报告 和前面三个tab 页 的新建页不一样 
						if($('#tab-SupervisoryWorkReport1').is(':visible')) {
							layero.find('#radio_two').hide();
							layero.find('#BaoGaoLeiXing').hide();
							layero.find('#ShangBaoRen').show();
							layero.find('#JianChaFangAn').show();
							layero.find('#JianChaFangAn').show();
							var _MyDao_User = JSON.parse(sessionStorage.getItem('MYDAO_USER'));
							layero.find('#ShangBaoRen').find('input').val(_MyDao_User.username);
						}
						Mydao.initselect(layero);
						resizeInput(layero);
					});

				},
				yes: function(index, layero) { //回调
					if($('#tab-1').is(':visible')) {
						//监督工作报告  提交
						Mydao.ajax({
							"projectid": $("#SupervisedCheck_layer #projectid").val(),
							"checkprogramid": $("#SupervisedCheck_layer [name='checkprogramid']").val(),
							"reporttime": $("#SupervisedCheck_layer #reporttime").val(),
							"appendix": $("#SupervisedCheck_layer input[name='files']").val()
						}, 'inspectionReport/s1001', function(result) {
							layer.close(index); //如果设定了yes回调，需进行手工关闭
							var currentTime = result.serverTime;
							if(result.code == 200) {
								layer.alert("操作成功！");
								refreshConetent();
							} else {
								layer.msg(result.msg);
							}
						});
					} else {
						Mydao.ajax({
							"projectid": $("#SupervisedCheck_layer #projectid").val(),
							"files": $("#SupervisedCheck_layer input[name='files']").val(),
							"type": $("#SupervisedCheck_layer #type").val(),
							"year": $("#SupervisedCheck_layer #year").val(),
							"month": $("#SupervisedCheck_layer #month").val(),
							"quarter": $("#SupervisedCheck_layer #quarter").val(),
							"reporttime": $("#SupervisedCheck_layer #reporttime").val()
						}, 'supervisionReport/add', function(result) {
							layero.find("input").val("");
							layer.close(index); //如果设定了yes回调，需进行手工关闭
							var currentTime = result.serverTime;
							if(result.code == 200) {
								layer.alert("操作成功！");
								refreshConetent();
							} else {
								layer.alert("操作失败！");
							}
						});
					}

				},
				cancel: function(layero, index) {},
			});
		});
		//绑定项目事件
		$("#SupervisoryWorkReport #projectid").on("change", function() {
			refreshConetent();
		});

		$('#SupervisoryWorkReport [name="status"]').on('change', function() {
			var _projectselect = $("#SupervisoryWorkReport #projectid"),
				_params = _projectselect.data('params').toObj ? _projectselect.data('params').toObj() : {};
			_params.status = $(this).val();
			_projectselect.data('params', JSON.stringify(_params).replace(/"/g, "'")).attr('data-params', JSON.stringify(_params).replace(/"/g, "'"));
			Mydao.initselect();
		});

		//对项目赋值
		$('#SupervisoryWorkReport a[href="#tab-SupervisoryWorkReport1"]').click();//这里需不需要改，待定

	})($);