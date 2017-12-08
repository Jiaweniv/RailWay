(function() {
	'use strict';
	setTimeout(function() {
		$('[data-toggle="uploader-image"]').each(function(a, b) {
			var size = $(this).data('size'),
				limit = $(this).data('limit'),
				title = $(this).data('title');
			if($(b).parent().parent().parent().attr('id') == $(b).attr('name')) {
				return true;
			}
			var rand = new Date().getTime(),
				value = $('<input type="hidden" name="' + $(b).attr('name') + '">'),
				prev = $('<div class="fl" id="showimage' + rand + '"></div>'),
				parent = $('<div class="fl" id="' + rand + '"></div>');
			$(b).removeAttr('name').attr('name', rand); //移除name属性
			$(b).parent().append(prev.append(value)).append(parent.append($(b)));

			//设置初始图
			setTimeout(function() {
				if($(value).val()) {
					var fidss = $(value).val().split(',');
					for(var k = 0; k < fidss.length; k++) {
						var am = $('<a class="m-module-a"></a>'),
							i = $('<i class="fa fa-times-circle"></i>');
						var img = $('<img width="100" value="' + fidss[k] + '" src="' + MydaoFileDownPath + '?fileId=' + fidss[k] + '"/>');
						prev.append(am.append(i).append(img));
						$(i).click(function() {
							var fids = value.val().split(',');
							for(var j = 0; j < fids.length; j++) {
								if(fids[j] == $(this).next('img').attr('value')) {
									fids = fids.remove(j);
									break;
								}
							}
							value.val(fids.toString());
							$(this).parent('a').remove();
						});
					}
				}
			}, 500);
			layui.use('upload', function() {
				layui.upload({
					elem: b, //默认查找class为layui-upload-file的元素
						
					url: MydaoFileUploadPath, //文件上传服务器地址
						
					method: 'POST',
					type: 'images', //设定上传的文件类型，也可以直接在input设置lay-type=""来取代 ,images,file,video,audio
						//						,ext: 'jpg|jpeg|gif|png' //自定义可支持的文件扩展名，也可以直接在input设置lay-ext=""来取代,zip|rar
						
					title: title ? title : '上传图片', //默认输出上传图片，或上传文件/视频/音频
						//			,unwrap:false//是否不改变原input样式风格，默认false
						
					before: function(input) {
						//文件上传之前触发，返回参数为当前dom
						var v1 = value.val() ? value.val().split(',') : [];
						if(limit && v1.length == limit) {
							layer.msg('文件上传数已达到最大值');
							return false;
						}
					},
					success: function(res, input) {
						//文件上传完成触发，返回响应信息和当前dom对象
						var am = $('<a class="m-module-a"></a>'),
							i = $('<i class="fa fa-times-circle"></i>');
						var img = $('<img width="100" value="' + res.fileIds + '" src="' + MydaoFileDownPath + '?fileId=' + res.fileIds + '"/>');
						prev.append(am.append(i).append(img));
						var v1 = value.val() ? value.val().split(',') : [];
						v1.push(res.fileIds);
						value.val(v1.toString());
						i.click(function() {
							var fids = value.val().split(',');
							for(var j = 0; j < fids.length; j++) {
								if(fids[j] == img.attr('value')) {
									fids = fids.remove(j);
									break;
								}
							}
							value.val(fids.toString());
							am.remove();
						});
					}
				});
			});
		});

		//上传文件
		$('[data-toggle="uploader-file"]').each(function(a, b) {
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

			//设置初始图
			setTimeout(function() {
				if($(value).val()) {
					var fidss = $(value).val().split(',');
					for(var k = 0; k < fidss.length; k++) {
						Mydao.ajax({
							"id": fidss[k]
						}, "file/getNameById", function(result) {
							if(result.code == 200) {
								var data = result.result;
								var am = $('<a class="m-module-a" target="_blank"></a>'),
									i = $('<i class="fa fa-times-circle pointer"></i>');
								showa.empty().append(am.append()).append(i);
								am.attr('href', MydaoFileDownPath + '?fileId=' + data.id).html(data.name);
								i.click(function() {
									value.val("");
									showa.empty();
								});
							}
						});
					}
				}
			}, 500);
			layui.use('upload', function() {
				layui.upload({
					elem: b, //默认查找class为layui-upload-file的元素
						
					url: MydaoFileUploadPath, //文件上传服务器地址
						
					method: 'POST',
					type: 'file',//设定上传的文件类型，也可以直接在input设置lay-type=""来取代 ,images,file,video,audio
						
					ext: 'doc|docx|xls|xlsx|txt|zip|rar|mp3|mp4|avi|pdf', //自定义可支持的文件扩展名，也可以直接在input设置lay-ext=""来取代,zip|rar
						//							,
						//						title: '上传文件 //默认输出上传图片，或上传文件/视频/音频
						//						,unwrap:false//是否不改变原input样式风格，默认false
						
					before: function(input) {
						//文件上传之前触发，返回参数为当前dom
						var imagSize = input.files[0].size,
							maxsize = 1024 * 1024 * 3;
						if(imagSize > maxsize) {
							layer.msg('文件不能大于3M');
							return false;
						}
					},
					success: function(res, input) {
						//文件上传完成触发，返回响应信息和当前dom对象
						var am = $('<a class="m-module-a"></a>'),
							i = $('<i class="fa fa-times-circle pointer"></i>');
						showa.empty().append(am.append()).append(i);
						value.val(res.fileIds).attr("filename", res.fileNames);
						am.attr('href', MydaoFileDownPath + '?fileId=' + res.fileIds).html(res.fileNames);
						i.click(function() {
							value.val("");
							showa.empty();
						});
					}
				});
			});
		});

		//日期框范围选择
		layui.use('laydate', function() {
			laydate = layui.laydate;
			var start = {
				max: '2099-06-16 23:59:59',
				istoday: false,
				festival: true, //是否显示节日
				choose: function(datas) {
					end.min = datas;
					end.start = datas;
				}
			};
			var end = {
				max: '2099-06-16 23:59:59',
				istoday: false,
				festival: true, //是否显示节日
				choose: function(datas) {
					start.max = datas;
				}
			};

			$('[data-toggle="range-start"]').click(function(e) {
				$(this).siblings(".myClass").remove();
				start.elem = this;
				laydate(start);
				return false;
			});
			$('[data-toggle="range-end"]').click(function(e) {
				$(this).siblings(".myClass").remove();
				end.elem = this;
				laydate(end);
				return false;
			});
		});

		//		绑定富文本                layui富文本  需要写一个销毁方法
		$('[data-layedit="layedit"]').each(function(index, ele) {
			var elements = $(ele).attr('id') ? $(ele).attr('id') : $(ele).attr('id', 'layedit' + index);
			layui.use('layedit', function() {
				var layedit = layui.layedit;
				layedit.set({
					uploadImage: {
						url: MydaoFileUploadPath, //接口url								
							
						type: 'POST' //默认post
					}
				});
				//注意：layedit.set 一定要放在 build 前面，否则配置全局接口将无效。
				layedit.build(elements.attr('id')); //建立编辑器
			});
		});

	}, 100);
})();