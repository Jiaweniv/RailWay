	(function() {
		'use strict';
		var editer = {};
		$('#ComplaintReport_lzh').find('#ComplaintReport [data-toggle="tab"]').on('click', function() {
			var _obj = $(this);
			$(_obj.attr('href')).load(_obj.data('url'), function() {
			});
		});
		$('#ComplaintReport_lzh').find("#tab-toushujubao").load("view/LawOperations/ComplaintReport_tsjb.html", function() {
		});
		//调整input宽度
		var resizeInput = function(parent) {
			$(parent).find(".group-input").each(function(index, element) {
				$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
			});
			//  select和标头的组合
			$(parent).find(".group-select").each(function(index, element) {
				$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
			});

			$(parent).find('.sidebar-collapse').slimScroll({
				height: '100%',
			});
		};
		$('#ComplaintReport_lzh').find('#ComplaintReport #JobNewBtn').on('click', function(e) {
			layer.open({
				type: 1,
				content: '',
				btn: ['保存', '返回'], //按钮
				shadeClose: 'true', //遮罩
				btnAlign: 'c', //按钮居中
				area: ["70%", "90%"],
				moveOut: true,
				success: function(layero, index) {
					layero.find('.layui-layer-content').load('view/LawOperations/ComplaintChildr.html', function() {
						resizeInput(layero);
						editer = UE.getEditor('myEditor');
					});
				},
				yes: function(index, layero) { //回调					
					layero.find("form").trigger("validate");
					if(!layero.find("form").data("validator").isFormValid()) return false;
					Mydao.ajax({
						"title": $("#ComplaintChildr #title").val(),
						"reporttype": $("#ComplaintChildr #reporttype").val(),
						"reportuser": $("#ComplaintChildr #reportuser").val(),
						"reporttime": $("#ComplaintChildr #reporttime").val(),
						"reportorg": $("#ComplaintChildr #reportorg").val(),
						"source": $("#ComplaintChildr #source").val(),
						"objecttype": $("#ComplaintChildr #objecttype").val(),
						"reportobject": $("#ComplaintChildr #reportobject").val(),
						"section": $("#ComplaintChildr #section").val(),
						"type": $("#ComplaintChildr #type").val(),
						//							"content": $("#ComplaintChildr #content").val(),
						"content": editer.getContent(),
						"file": $("#ComplaintChildr #file").val(),
						"divGroupSel": $("#ComplaintChildr #divGroupSel option:selected").val(),
						"divProjectSel": $("#ComplaintChildr #divProjectSel option:selected").val(),
						"divPersonSel": $("#ComplaintChildr #divPersonSel option:selected").val(),
						"ispublish": $("#ComplaintChildr #ispublish").val(),
						"results": $("#ComplaintChildr #results").val(),
						"toaccept": $("#ComplaintChildr #toaccept").val()
					}, 'complaintReport/insertComplaintReport', function(result) {
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						var currentTime = result.serverTime;
						if(result.code == 200) {

							layer.alert("操作成功！");
							UE.getEditor('myEditor').destroy();
							//刷新页面
							$('#ComplaintReport_tsjb #tsjb_table').bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
							$('#ComplaintReport_wtfk #wtfk_table').bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						} else {
							layer.alert(result.msg);
						}
					});
				},
				cancel: function(layero, index) {
					UE.getEditor('myEditor').destroy();
				}

			});

		});

	})();