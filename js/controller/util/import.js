(function() {
	'use strict';
	//上传文件
	$('[data-toggle="import-data"]').each(function(a, b) {
		if($(b).parent().parent().parent().attr('id') == $(b).attr('name')) {
			return true;
		}
		var rand = new Date().getTime(),
			value = $('<input id="' + ($(b).attr('id') ? $(b).attr('id') : '') + '"type="hidden" name="' + $(b).attr('name') + '">'),
			prev = $('<div class="fl" id="showimage' + rand + '"></div>'),
			showa = $('<div></div>'),
			parent = $('<div class="fl" id="' + rand + '"></div>');
		$(b).removeAttr('name').attr('name', rand); //移除name属性
		$(b).parent().append(prev.append(value).append(showa)).append(parent.append($(b)));

		layui.use('upload', function() {
			layui.upload({
				elem: b, //默认查找class为layui-upload-file的元素
				url: MydaoFileUploadPath, //文件上传服务器地址
				method: 'POST',
				type: 'file', //设定上传的文件类型，也可以直接在input设置lay-type=""来取代 ,images,file,video,audio
				ext: 'xls|xlsx', //自定义可支持的文件扩展名，也可以直接在input设置lay-ext=""来取代,zip|rar
				before: function(input) {
					//文件上传之前触发，返回参数为当前dom
				},
				success: function(res, input) {
					//文件上传完成触发，返回响应信息和当前dom对象
					Mydao.currentPage.params.fileId = res.fileIds;
					Mydao.currentPage.params.type = $(".import_btn").data("type");

					Mydao.ajax(Mydao.currentPage.params, 'import/importData', function(result) {
						if(!result.msg) {
							layer.alert("导入成功，请等待片刻进行查看。");
						} else {
							layer.alert(result.msg);
						}

					}, false);

				}
			});
		});
	});
})();