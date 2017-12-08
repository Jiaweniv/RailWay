(function() {
	'use strict';
	var editer = {};
	Mydao.initselect();
	//显示详情
	var showProblem = function(e, value, row, index) {
		Mydao.ajax({
			id: row.id
		}, 'checkDetail/s1002', function(data) {
			var currentTime = data.serverTime;
			if(data.code == 200) {
				var result = data.result;
				$.ajax({
					type: 'get',
					dataType: 'html',
					url: 'view/Problem/detail.html',
					success: function(resp) {
						var dialog = layer.open({
							type: 1,
							content: resp,
							area: ["70%", "90%"],
							moveOut: true,
							success: function(layero, index) {

							},
							cancel: function(layero, index) {

							}
						});
					},
					dataFilter: function(data) {
						data = Mydao.setcontent(data, result);
						return data;
					}
				});
			} else {
				layer.alert(data.msg);
			}

		});
	};

	//渲染表格
	$('#problem_lzh_boxs #problem-table').bootstrapTable({
		pagination: true,
		sidePagination: 'server',
		queryParamsType: "undefined", //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  //设置为limit可以获取limit, offset, search, sort, order  
		method: 'post',
		pageNumber: 1,
		url: Mydao.config.path + 'checkDetail/s1001',
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
			Mydao.config.ajaxParams.page.orderField = 'cr.checktime';
			Mydao.config.ajaxParams.page.pageSize = p.pageSize;
			Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
			Mydao.config.ajaxParams.page.orderDirection = 'desc';
			return Mydao.config.ajaxParams;
		},
		columns: [{
			title: '序号',
			align: 'center',
			formatter: function(value, row, index) {
				return index + 1;
			},
		}, {
			title: '年度',
			align: 'center',
			field: 'year'
		}, {
			title: '项目名称',
			align: 'center',
			field: 'projectname'
		}, {
			title: '施工标段',
			align: 'center',
			field: 'sectionname'
		}, {
			title: '检查事项',
			align: 'center',
			field: 'name',
			formatter: function(val, row, index) {
				return val.split('-')[0];
			}
		}, {
			title: '检查时间',
			align: 'center',
			field: 'checktime'
		}, {
			title: '问题描述',
			align: 'center',
			field: 'description',
			formatter: function(val, row, index) {
				return Mydao.valueFormatter(val, 20);
			}
		}, {
			title: '详情',
			align: 'center',
			formatter: function(value, row, index) {
				return Mydao.operator(['view']);
			},
			events: Mydao.operatorEvents({
				view: showProblem
			})
		}]
	});

	//查询
	$('#problem_lzh_boxs').find('#search').on('click', function(event) {
		$('#problem_lzh_boxs').find('#problem-table').bootstrapTable("refreshOptions", {
			pageNumber: 1,
			queryParams: function(p) {
				Mydao.config.ajaxParams.params = {};
				Mydao.config.ajaxParams.page.orderField = 'cr.checktime';
				Mydao.config.ajaxParams.page.pageSize = p.pageSize;
				Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
				Mydao.config.ajaxParams.page.orderDirection = 'desc';
				Mydao.config.ajaxParams.params.projectid = $('#problem_lzh_projectid').val();
				Mydao.config.ajaxParams.params.sectionid = $('#problem_lzh_section').val();
				Mydao.config.ajaxParams.params.orgname = $('#problem_lzh_super_org_name').val();
				Mydao.config.ajaxParams.params.datetype = $('#datetype').val();
				Mydao.config.ajaxParams.params.year = $('#year').val();
				Mydao.config.ajaxParams.params.datevalue = $('#datevalue').val() < 10 ? '0' + $('#datevalue').val() : $('#datevalue').val();
				Mydao.config.ajaxParams.params.type = $('#problem_lzh_checkitemsid').val();
				return Mydao.config.ajaxParams;
			}
		});
	});

	//日期管理
	$('#problem_lzh_boxs').find("#datetype").on("change", function() {
		if($(this).val() == '1') {
			$('#problem_lzh_boxs').find('#year').show().val('');
			$('#problem_lzh_boxs').find('#datevalue').val('').hide();
		} else if($(this).val() == '2') {
			$('#problem_lzh_boxs').find('#year').show().val('');
			$('#problem_lzh_boxs').find('#datevalue').show().empty();
			for(var i = 1; i <= 12; i++) {
				$('#problem_lzh_boxs').find('#datevalue').append('<option value="' + i + '">' + i + '</option>');
			}
		} else if($(this).val() == '3') {
			$('#problem_lzh_boxs').find('#year').show().val('');
			$('#problem_lzh_boxs').find('#datevalue').show().empty();
			for(var j = 1; j <= 4; j++) {
				$('#problem_lzh_boxs').find('#datevalue').append('<option value="' + j + '">' + j + '</option>');
			}
		} else {
			$('#problem_lzh_boxs').find('#year').val('').hide();
			$('#problem_lzh_boxs').find('#datevalue').val('').hide();
		}
	});
	//默认选中年度
	setTimeout(function(){
		$('#problem_lzh_boxs').find("#datetype").val(1);
		$('#problem_lzh_boxs').find("#datetype").change();
	},100);
})();