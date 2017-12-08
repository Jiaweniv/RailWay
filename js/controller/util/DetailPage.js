//详情页Js
//3-7

//详情页显示





//详情页证书
var person_aptitude_list = function(row) {
			var id = -1;
			if(row) id = row.id;
			$("#CheckExpert_See_Qualificationtable").bootstrapTable({
				method: 'post',
				url: Mydao.config.path + 'personAptitude/list',
				cache: true, //禁用缓存
				search: false, //禁用查询
				striped: true, //隔行变色
				uniqueId: "id", //唯一标识,
				responseHandler: function(res) { //设置返回数据

					if(res.code == 200) {

						return res.result.rows;
					}
				},
				ajaxOptions: {
					ContentType: 'application/json',
					dataType: 'json'
				},
				queryParams: function(p) {
					Mydao.config.ajaxParams.params = {};
					Mydao.config.ajaxParams.params.personid = id;
					return Mydao.config.ajaxParams;
				},
				columns: [{
						title: '序号',
						formatter: function(val, row, index) {
							return index + 1;
						}
					}, {
						title: '资质证书名称',
						field: 'name',
					}, {
						title: '资质证书编号',
						field: 'identity',
					}, {
						title: '注册单位',
						field: 'company',
					}, {
						title: '注册专业',
						field: 'specialty',
					}, {
						title: '证书状态',
						field: 'statusName',
					}, {
						title: '附件',
						field: 'file',
						align: 'center',
						formatter: function(value, row, index) {
							if(value)
								return '<img style="width:40px;height:40px;" src="' + MydaoFileDownPath + '?fileId=' + value + '">';
							else
								return '';
						}
					}
					//				{
					//					title: '操作<a id="add_qualification" herf="javascript:;" class="ml10" title="添加资质证书"><i class="fa fa-plus-square-o"></i></a>',
					//					field: 'flag',
					//					align: 'center',
					////					formatter: function(value, row, index) {
					////						return Mydao.operator(['edit', 'del']);
					////					},
					////					events: Mydao.operatorEvents({
					////						edit: person_aptitude_edit,
					////						del: person_aptitude_del
					////					})
				]
			});
		};
