//人员信息
(function() {
	'use strict';
	var resizeInput = function() {
		$(".group-input").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
		});
		//  select和标头的组合
		$(".group-select").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
		});
		//定义右侧内容区宽度
		$('.module-right-box').each(function() {
			$(this).width(function(index, width) {
				return(width, $(this).parent().width() - $(this).parent().find('.module-left-box').outerWidth(true) - 32);
			});
		});
	};

	//		默认显示
	var _show = $('#Personnel_lzh #Personnel [aria-expanded="true"]');
	$(_show.attr('href')).load(_show.data('url'), function() {
		resizeInput();
	});

	//		切换
	$('#Personnel_lzh #Personnel [data-toggle="tab"]').on('click', function() {
		var _obj = $(this);
		$(_obj.attr('href')).load(_obj.data('url'), function() {
			resizeInput();
		});
	});

})();