+ function($) {
	'use strict';
	(function() {
		$('#project-overview [data-toggle="tab"]').on('click', function() {
			var _obj = $(this),
				_projectid = $('#project-overview #projectid').val();
			if(_projectid) {
				if(_obj.attr('href') == '#tab-5cjdw') {
					$(_obj.attr('href')).load(_obj.data('url'), function() {});
				} else if(_obj.attr('href') == '#tab-5zpmt') {
					$(_obj.attr('href')).load(_obj.data('url'), function() {
						resizeInput($("#zpmtOut"));
						Mydao.ajax({
							id: _projectid
						}, $(_obj.attr('href')).data('loadurl'), function(result) {
							var currentTime = result.serverTime;
							if(result.code == 200) {
								var _result = result.result;
								if(_result.images) {
									var imgs = _result.images.split(',');
									for(var i = 0; i < imgs.length; i++) {
										$('#zpmt').append('<img width="35%" style="margin:10px 7%;" src="' + MydaoFileDownPath + '?fileId=' + imgs[i] + '"/>');
									}
								}
								_obj.tab('show');
							} else {
								layer.alert(result.msg);
							}

						});
					});
				} else if(_obj.attr('href') == '#tab-3zyjsbz') {
					$(_obj.attr('href')).load(_obj.data('url'), function() {
						resizeInput($("#zyjsbz_hlj"));
						Mydao.ajax({
							projectid: _projectid
						}, $(_obj.attr('href')).data('loadurl'), function(result) {
							var currentTime = result.serverTime;
							if(result.code == 200) {
								var _result = result.result.ts;
								Mydao.setform('#project-overview', _result);
								_obj.tab('show');
							} else {
								layer.alert(result.msg);
							}

						});
					});
				} else if(_obj.attr('href') == '#tab-2xlgk') {
					$(_obj.attr('href')).load(_obj.data('url'), function() {
						resizeInput($("#xlgk_hlj"));
						Mydao.ajax({
							projectid: _projectid
						}, $(_obj.attr('href')).data('loadurl'), function(result) {
							var currentTime = result.serverTime;
							if(result.code == 200) {
								var _result = result.result;
								var flag = false;
								Mydao.setform('#project-overview', _result);
								$(_obj.attr('href')).find('.buildsignificance_lizhahua').html(_result.buildsignificance)
								$(_obj.attr('href')).find('.designscope_lizhahua').html(_result.designscope)
								$(_obj.attr('href')).find('.heavydifficult_lizhahua').html(_result.heavydifficult)
								if(_result == null || _result.linedirection == null) {
									return false;
								}
								Mydao.ajax({
									projectid: _projectid
								}, 'contentQuantity/s1001', function(data) {
									var dataFrom = data.result;
									if(dataFrom != null && result != null) {
										dataFrom.dataFrom = result;
										var obj = dataFrom.dataFrom;
										obj.bridgenum = parseInt(dataFrom.extralargebridgeplace) + parseInt(dataFrom.largebridgeplace) + parseInt(dataFrom.mediumbridgeplace) + parseInt(dataFrom.tunnelplace);
										$('#bridgenum').val(obj.bridgenum);
										if(dataFrom.tunnel != 0) {
											obj.bridgeproportion = ((parseInt(dataFrom.extralargebridge) + parseInt(dataFrom.largebridge) + parseInt(dataFrom.mediumbridge)) / parseInt(dataFrom.tunnel)).toFixed(2);
											$('#bridgeproportion').val(obj.bridgeproportion);
										} else {
											obj.bridgeproportion = 0;
										}
										Mydao.setform('#project-overview', obj);
										$(_obj.attr('href')).find('.buildsignificance_lizhahua').html(_result.buildsignificance)
										$(_obj.attr('href')).find('.designscope_lizhahua').html(_result.designscope)
										$(_obj.attr('href')).find('.heavydifficult_lizhahua').html(_result.heavydifficult)
										_obj.tab('show');
									}
								});

							} else {
								layer.alert(result.msg);
							}

						});
					});
				} else {
					$(_obj.attr('href')).load(_obj.data('url'), function() {
						resizeInput($("#project-overview"));
						Mydao.ajax({
							projectid: _projectid
						}, $(_obj.attr('href')).data('loadurl'), function(result) {
							var currentTime = result.serverTime;
							if(result.code == 200) {
								var _result = result.result;
								Mydao.setform('#project-overview', _result);
								_obj.tab('show');
							} else {
								layer.alert(result.msg);
							}

						});
					});
				}
			}
		});
		$('#project-overview #projectid').on('change', function() {
			var _obj = $('#project-overview [aria-expanded="true"]');
			var _val = $(this).val();
			if(_val) {
				if(_obj.attr('href') == '#tab-5cjdw') {
					$(_obj.attr('href')).load(_obj.data('url'), function() {});
				} else if(_obj.attr('href') == '#tab-5zpmt') {
					$(_obj.attr('href')).load(_obj.data('url'), function() {
						resizeInput(layer);
						Mydao.ajax({
							id: _val
						}, $(_obj.attr('href')).data('loadurl'), function(result) {
							var currentTime = result.serverTime;
							if(result.code == 200) {
								var _result = result.result;
								if(_result.images) {
									var imgs = _result.images.split(',');
									for(var i = 0; i < imgs.length; i++) {
										$('#zpmt').append('<img width="35%" style="margin:10px 7%;" src="' + MydaoFileDownPath + '?fileId=' + imgs[i] + '"/>');
									}
								}
								_obj.tab('show');
							} else {
								layer.alert(result.msg);
							}

						});
					});
				} else if(_obj.attr('href') == '#tab-4zygcnrhsl') {
					$(_obj.attr('href')).load(_obj.data('url'), function() {
						resizeInput($("#zygcnrhsl_hlj"));
						Mydao.ajax({
							projectid: _val
						}, $(_obj.attr('href')).data('loadurl'), function(result) {
							var currentTime = result.serverTime;
							if(result.code == 200) {
								var _result = result.result;
								Mydao.setform('#project-overview', _result);
								_obj.tab('show');
							} else {
								layer.alert(result.msg);
							}

						});
					});
				} else if(_obj.attr('href') == '#tab-3zyjsbz') {
					$(_obj.attr('href')).load(_obj.data('url'), function() {
						resizeInput($("#zyjsbz_hlj"));
						Mydao.ajax({
							projectid: _val
						}, $(_obj.attr('href')).data('loadurl'), function(result) {
							var currentTime = result.serverTime;
							if(result.code == 200) {
								var _result = result.result.ts;
								Mydao.setform('#project-overview', _result);
								_obj.tab('show');
							} else {
								layer.alert(result.msg);
							}

						});
					});
				} else if(_obj.attr('href') == '#tab-2xlgk') {
					$(_obj.attr('href')).load(_obj.data('url'), function() {
						resizeInput($("#xlgk_hlj"));
						Mydao.ajax({
							projectid: _val
						}, $(_obj.attr('href')).data('loadurl'), function(result) {
							var currentTime = result.serverTime;
							if(result.code == 200) {
								var _result = result.result;
								console.log(_result)
								Mydao.setform('#project-overview #xlgk-form', _result);
								$(_obj.attr('href')).find('.buildsignificance_lizhahua').html(_result.buildsignificance)
								$(_obj.attr('href')).find('.designscope_lizhahua').html(_result.designscope)
								$(_obj.attr('href')).find('.heavydifficult_lizhahua').html(_result.heavydifficult)
								if(_result == null || _result.linedirection == null) {
									return false;
								}

								Mydao.ajax({
									projectid: _val
								}, 'contentQuantity/s1001', function(data) {
									var dataFrom = data.result;
									if(dataFrom != null && result != null) {
										dataFrom.dataFrom = result;
										var obj = dataFrom.dataFrom;
										obj.bridgenum = parseInt(dataFrom.extralargebridgeplace) + parseInt(dataFrom.largebridgeplace) + parseInt(dataFrom.mediumbridgeplace) + parseInt(dataFrom.tunnelplace);
										$('#bridgenum').val(obj.bridgenum);
										if(dataFrom.tunnel != 0) {
											obj.bridgeproportion = ((parseInt(dataFrom.extralargebridge) + parseInt(dataFrom.largebridge) + parseInt(dataFrom.mediumbridge)) / parseInt(dataFrom.tunnel)).toFixed(2);
											$('#bridgeproportion').val(obj.bridgeproportion);
										} else {
											obj.bridgeproportion = 0;
										}
										Mydao.setform('#project-overview #xlgk-form', obj);
										$(_obj.attr('href')).find('.buildsignificance_lizhahua').html(_result.buildsignificance)
										$(_obj.attr('href')).find('.designscope_lizhahua').html(_result.designscope)
										$(_obj.attr('href')).find('.heavydifficult_lizhahua').html(_result.heavydifficult)
										_obj.tab('show');
									}
								});

							} else {
								layer.alert(result.msg);
							}

						});
					});
				} else {
					$(_obj.attr('href')).load(_obj.data('url'), function() {
						resizeInput($("project-overview"));
						Mydao.ajax({
							projectid: _val
						}, $(_obj.attr('href')).data('loadurl'), function(result) {
							var currentTime = result.serverTime;
							if(result.code == 200) {
								var _result = result.result;
								Mydao.setform('#project-overview', _result);
								_obj.tab('show');
							} else {
								layer.alert(result.msg);
							}

						});
					});
				}
			} else {
				$(_obj.attr('href')).empty();
			}
		});
		$('#project-overview').delegate('#pfqk-form', 'valid.form', function() {
			$(this).ajaxSubmit({
				url: 'replySituation/s1002',
				data: {
					'projectid': $('#project-overview #projectid').val(),
					'clientid': Mydao.clientid
				}
			});
		});
		$('#project-overview').delegate('#xlgk-form', 'valid.form', function(e, f) {
			var cs = $(f).serializeJson();
			cs.buildsignificance_bq = $('#project-overview').delegate('#xlgk-form').find('.buildsignificance_lizhahua').html()
			cs.designscope_bq = $('#project-overview').delegate('#xlgk-form').find('.designscope_lizhahua').html()
			cs.heavydifficult_bq = $('#project-overview').delegate('#xlgk-form').find('.heavydifficult_lizhahua').html()
			Mydao.ajax({
				projectid: $('#project-overview #projectid').val()
			}, 'contentQuantity/s1001', function(data) {
				var dataFrom = data.result;
				if(dataFrom != null && cs != null) {
					dataFrom.dataFrom = cs;
					var obj = dataFrom.dataFrom;
					obj.bridgenum = parseInt(dataFrom.extralargebridgeplace) + parseInt(dataFrom.largebridgeplace) + parseInt(dataFrom.mediumbridgeplace) + parseInt(dataFrom.tunnelplace);
					$('#bridgenum').val(obj.bridgenum);
					if(dataFrom.tunnel != 0) {
						obj.bridgeproportion = ((parseInt(dataFrom.extralargebridge) + parseInt(dataFrom.largebridge) + parseInt(dataFrom.mediumbridge)) / parseInt(dataFrom.tunnel)).toFixed(2);
						$('#bridgeproportion').val(obj.bridgeproportion);
					} else {
						obj.bridgeproportion = 0;
					}
					Mydao.setform('#project-overview', obj);
				}
			});
			$(this).ajaxSubmit({
				url: 'lineOverview/s1002',
				data: {
					'projectid': $('#project-overview #projectid').val(),
					'clientid': Mydao.clientid
				}
			});
		});
		$('#project-overview').delegate('#zyjsbz-form', 'valid.form', function() {
			$(this).ajaxSubmit({
				url: 'technicalStandard/s1002',
				data: {
					'projectid': $('#project-overview #projectid').val(),
					'clientid': Mydao.clientid
				}
			});
		});
		$('#project-overview').delegate('#zygcnrhsl-form', 'valid.form', function() {
			$(this).ajaxSubmit({
				url: 'contentQuantity/s1002',
				data: {
					'projectid': $('#project-overview #projectid').val(),
					'clientid': Mydao.clientid
				}
			});
		});
		$('#project-overview').delegate('.btn-save', 'click', function(event) {
			switch($(this).attr('id')) {
				case 'pfqksave':
					$('#pfqk-form').trigger('validate');
					break;
				case 'xlgksave':
					$('#xlgk-form').trigger('validate');
					break;
				case 'zygcnrhslsave':
					$('#zygcnrhsl-form').trigger('validate');
					break;
				case 'zyjsbzsave':
					$('#zyjsbz-form').trigger('validate');
					break;
				default:
					break;
			}
		});
		$('#project-overview [name="status"]').on('change', function() {
			var _projectselect = $("#project-overview #projectid"),
				_params = _projectselect.data('params').toObj ? _projectselect.data('params').toObj() : {};
			_params.status = $(this).val();
			_projectselect.data('params', JSON.stringify(_params).replace(/"/g, "'")).attr('data-params', JSON.stringify(_params).replace(/"/g, "'"));
			Mydao.initselect();
		});
		$('#project-overview [name="status"][checked]').trigger('change');
		//调整input宽度
		var resizeInput = function(obj) {
			$(".group-input").each(function(index, element) {
				$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
			});
			//  select和标头的组合
			$(".group-select").each(function(index, element) {
				$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
			});
		};

		//对项目赋值
		$('a[href="#tab-1pfqk"]').click();

	})($);
}(jQuery);