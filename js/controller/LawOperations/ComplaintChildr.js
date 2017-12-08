	(function() {
		'use strict';
		Mydao.initselect('#ComplaintChildr');
		//绑定项目事件
		$("#ComplaintChildr #objecttype").on("change", function() {
			_show();
			var str = $(this).val();
			if(str == 1) {
				$('#ComplaintChildr #divGroup').css('display', '');
			} else if(str == 2) {
				$('#ComplaintChildr #divProject').css('display', '');
			} else if(str == 3) {
				$('#ComplaintChildr #divPerson').css('display', '');
			}
		});
		var _show = function() {
			$('#ComplaintChildr #divGroup').css('display', 'none');
			$('#ComplaintChildr #divProject').css('display', 'none');
			$('#ComplaintChildr #divPerson').css('display', 'none');
		};
	})();