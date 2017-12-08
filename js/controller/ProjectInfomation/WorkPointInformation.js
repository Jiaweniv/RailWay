//工点信息
+ function($) {
	'use strict';
	(function() {

		//初始化下拉框
		Mydao.initselect($("#workpointinfo-overview"));

		$('#workpointinfo-overview [data-toggle="tab"]').on('click', function() {
			var _obj = $(this);
			$(_obj.attr('href')).load(_obj.data('url'), function() {
				resizeInput($("#workpointinfo-overview"));
			});
		});

		//调整input宽度
		var resizeInput = function(obj) {
			$(obj).find(".group-input").each(function(index, element) {
				$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
			});
			//  select和标头的组合
			$(obj).find(".group-select").each(function(index, element) {
				$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
			});

			$(obj).find('.sidebar-collapse').slimScroll({
				height: '100%',
			});
		};

		//默认显示工点表
		$("#tab-1gdb").load("view/ProjectInformation/workpoint/gdb.html", function() {
			resizeInput($("#workpoint_gd"));
		});

		//项目和标段改变后刷新页面
		var refreshConetent = function() {
			var _obj = $("#workpointinfo-overview a[aria-expanded='true']"),
				_content = $(_obj.attr('href'));
			_content.load(_obj.data('url'), function() {
				resizeInput();
			});
		};

		//绑定项目事件
		$("#workpointinfo-overview select[name='projectid']").on("change", function() {
			refreshConetent();
		});

		//绑定标段事件
		$("#workpointinfo-overview select[name='sectionid']").on("change", function() {
			refreshConetent();
		});
		
		//对项目赋值
		$("#workpointinfo-overview select[name='projectid']").change();
		
		setTimeout(function(){
			$("#workpoint_select_section option").each(function(){
				if($(this).val()){
					$("#workpoint_select_section").val($(this).val());
					$("#workpoint_select_section").change();
					return false;					
				}
			});
		},500);

	})($);
}(jQuery);