//监督检查	
	(function() {
		'use strict';
		$("#example-embed").steps({
			transitionEffect: "fade"
		});

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

		$('#SupervisedCheck [data-toggle="tab"]').on('click', function() {
			var _obj = $(this);
			$("body").undelegate("click");
			$(_obj.attr('href')).load(_obj.data('url'), function() {
				resizeInput();
			});
		});

		$('#SupervisedCheck [name="status"]').on('change', function() {
			var _projectselect = $("#SupervisedCheck #projectid"),
				_params = _projectselect.data('params').toObj ? _projectselect.data('params').toObj() : {};
			_params.status = $(this).val();
			_projectselect.data('params', JSON.stringify(_params).replace(/"/g, "'")).attr('data-params', JSON.stringify(_params).replace(/"/g, "'"));
			Mydao.initselect();
		});
		$('#SupervisedCheck [name="status"][checked]').trigger('change');

		//默认显示方案
		$("#tab-SupervisedCheck1").load("view/ProjectSupervision/SupervisedCheck_childs/CheckProgram.html", function() {
			resizeInput($("#checkprogram_fa"));
		});

		//对项目赋值
		$('#SupervisedCheck a[href="#tab-SupervisedCheck1"]').click();
	
		$('#SupervisedCheck #projectid').change(function() {
			var _obj = $("#SupervisedCheck a[aria-expanded='true']");
			$(_obj.attr('href')).load(_obj.data('url'), function() {
				resizeInput();
			});
		});
	})();