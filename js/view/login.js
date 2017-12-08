$(function() {

	//验证码key
	var verifyKey;

	//获取验证码
	var getVerifyCode = function() {
		$.ajax({
			type: "post",
			url: MyDaoRequestPath + "/RailWayInvoker/user/verify.do",
			async: false,
			contentType: "application/json",
			processData: false,
			dataType: "json",
			success: function(data) {
				if(data.code == 200) {
					var result = data.result;
					verifyKey = result.verifyKey;
					$("#verify").attr("src", "data:image/jpg;base64," + result.verifyImage);
				} else {
					layer.msg(data.msg);
				}
			}
		});
	};

	//调用验证码获取
	getVerifyCode();

	//切换验证码
	$("#verify").click(function() {
		getVerifyCode();
	});

	//忘记密码
	$('.forgot-password').click(function() {
		layer.alert('请先联系本部管理员！');
	});
	//明暗切换
	$('.togglePass').on('click', function() {
		var $btn = $(this),
			state = $btn.toggleClass('active').hasClass('active'),
			passwordInput = $btn.closest('.form-group').find('input')[0];
		passwordInput.type = state ? 'text' : 'password';
	});

	var btnLogin = $('#login-but'),
		form = $('#loginForm');

	$('body').keydown(function(e) {
		if(e.keyCode == 13) {
			dologin();
		}
	});
	btnLogin.on('click', function() {
		dologin();
	});

	var dologin = function() {
		var userNameElement = $("#logiName"),
			passwordElement = $("#loginPass"),
			code = $("#code");
		if(userNameElement.val().length == 0) {
			layer.tips('请输入登录账号', '#logiName', {
				tips: [3, '#26a6de']
			});
			userNameElement.focus();
			return false;
		}

		if(passwordElement.val().length == 0) {
			layer.tips('请输入登录密码', '#loginPass', {
				tips: [3, '#26a6de']
			});
			passwordElement.focus();
			return false;
		}

		if(code.val().length == 0) {
			layer.tips('请输入验证码', '#code', {
				tips: [3, '#26a6de']
			});
			code.focus();
			return false;
		}
		btnLogin.attr('disabled', 'disabled').addClass('.login-but-gray').html('正在登录...');
		var obj = {
			"base": {
				"token": "",
				"userid": ""
			},
			"params": {
				"username": userNameElement.val(),
				"password": passwordElement.val(),
				"verifyKey": verifyKey,
				"verify": $("#code").val()
			}
		};
		$.ajax({
			type: "post",
			url: MyDaoRequestPath + "/RailWayInvoker/user/login.do",
			async: false,
			contentType: "application/json",
			data: JSON.stringify(obj),
			processData: false,
			dataType: 'json',
			dataFilter: function(data, type) {
				data = data.replace(/:(\d+),/g, ':\"$1\",');
				return data;
			},
			success: function(data) {
				if(data.code == 200) {
					sessionStorage.setItem('MYDAO_USER', JSON.stringify(data.result));
					/*这里使用的异步请求，当请求登录成功的时候，重新定位到index界面*/
					window.location.href = MyDaoRequestPath + '/RailWay/index.html';
				} else {
					btnLogin.removeAttr('disabled').removeClass('.login-but-gray').html('立即登录');
					$("#code").val("");
					layer.msg(data.msg);
					getVerifyCode();
				}
			}
		});
	};
});