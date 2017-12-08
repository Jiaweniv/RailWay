var Data = {};

//企业类型
Data.QYLX = function(obj) {
	var name;
	Mydao.ajax({
		type: "ORG"
	}, 'dictionary/s1002', function(result) {
		var currentTime = result.serverTime;
		if(result.code == 200) {
			var resultQYLX = result.result;
			for(var i = 0; i < resultQYLX.length; i++) {
				var item = resultQYLX[i];
				if(item.id == obj) {
					name = item.name;
				}
			}
		} else {
			layer.msg('接口' + result.msg);
		}
	}, false);
	return name;
};

//资格证书  》 类型
Data.LX = function(obj) {
	var name;
	Mydao.ajax({
		type: "CERTIFICATETYPE"
	}, 'dictionary/s1002', function(result) {
		var currentTime = result.serverTime;
		if(result.code == 200) {
			var resultLX = result.result;
			for(var i = 0; i < resultLX.length; i++) {
				var item = resultLX[i];
				if(item.id == obj) {
					name = item.name;
				}
			}
		} else {
			layer.msg('接口' + result.msg);
		}
	}, false);
	return name;
};

//学历:
Data.XueLi = function(obj) {
	var name;
	Mydao.ajax({
		type: "PTYPE"
	}, 'dictionary/s1002', function(result) {
		var currentTime = result.serverTime;
		if(result.code == 200) {
			var resultXueLi = result.result;
			for(var i = 0; i < resultXueLi.length; i++) {
				var item = resultXueLi[i];
				if(item.id == obj) {
					name = item.name;
				}
			}
		} else {
			layer.msg('接口' + result.msg);
		}
	}, false);
	return name;

};
//职务：
Data.Zhiwu = function(obj) {
	var name;
	Mydao.ajax({
		type: "PJOB"
	}, 'dictionary/s1002', function(result) {
		var currentTime = result.serverTime;
		if(result.code == 200) {
			var resultZhiwu = result.result;
			for(var i = 0; i < resultZhiwu.length; i++) {
				var item = resultZhiwu[i];
				if(item.id == obj) {
					name = item.name;
				}
			}
		} else {
			layer.msg('接口' + result.msg);
		}
	}, false);
	return name;

};
//职称：
Data.Zhicheng = function(obj) {
	var name;
	Mydao.ajax({
		type: "PJOBTITLE"
	}, 'dictionary/s1002', function(result) {
		var currentTime = result.serverTime;
		if(result.code == 200) {
			var resultZhicheng = result.result;
			for(var i = 0; i < resultZhicheng.length; i++) {
				var item = resultZhicheng[i];
				if(item.id == obj) {
					name = item.name;
				}
			}
		} else {
			layer.msg('接口' + result.msg);
		}
	}, false);
	return name;

};
//专业:
Data.Zhuanye = function(obj) {
	var name;
	Mydao.ajax({
		type: "DISCIPLINE"
	}, 'dictionary/s1002', function(result) {
		var currentTime = result.serverTime;
		if(result.code == 200) {
			var resultZhuanye = result.result;
			for(var i = 0; i < resultZhuanye.length; i++) {
				var item = resultZhuanye[i];
				if(item.id == obj) {
					name = item.name;
				}
			}
		} else {
			layer.msg('接口' + result.msg);
		}
	}, false);
	return name;

};

//项目信息-基本信息-施工标段查看
Data.SGBD = function(obj) {
	var name;
	Mydao.ajax({
		dictType: 'ORG'
	}, 'organization/selectList', function(result) {
		var currentTime = result.serverTime;
		if(result.code == 200) {
			var resultSGBD = result.result;
			for(var i = 0; i < resultSGBD.length; i++) {
				var item = resultSGBD[i];
				if(item.id == obj) {
					name = item.name;
				}
			}
		} else {
			layer.msg('接口' + result.msg);
		}
	}, false);
	return name;
};

//进展状态
Data.JZZTList = function(val) {
	switch(val) {
		case "1":
			val = "未开工";
			break;
		case "2":
			val = "施工中";
			break;
		case "3":
			val = "已完成";
			break;
		case "4":
			val = "已初验";
			break;
		case "5":
			val = "已竣工";
			break;
		default:
			val = "无";
			break;
	}
	return val;
};

//执照类型
Data.zhizhaoleixing = function(obj) {
	var name;
	Mydao.ajax({
		type: "TRAFFIC"
	}, 'dictionary/s1002', function(result) {
		var currentTime = result.serverTime;
		if(result.code == 200) {
			var result0 = result.result;
			for(var i = 0; i < result0.length; i++) {
				var item = result0[i];
				if(item.id == obj) {
					name = item.name;
				}
			}
		} else {
			layer.msg('接口' + result.msg);
		}
	}, false);
	return name;

};

//省份直辖市
Data.ShengZhiXiaShi = function(obj) {
	var name = '';
	Mydao.ajax({
		'level': 1
	}, 'dictionary/region', function(result) {
		var currentTime = result.serverTime;
		if(result.code == 200) {
			var result2 = result.result;
			for(var i = 0; i < result2.length; i++) {
				var item = result2[i];
				if(item.id == obj) {
					name = item.name;
				}
			}
		} else {
			layer.msg('接口' + result.msg);
		}
	}, false);
	return name;
};
//市
Data.Shi = function(obj) {
	var name = '';
	Mydao.ajax({
		'level': 2
	}, 'dictionary/region', function(result) {
		var currentTime = result.serverTime;
		if(result.code == 200) {
			var _result = result.result;
			for(var i = 0; i < _result.length; i++) {
				var item = _result[i];
				if(item.id == obj) {
					name = item.name;
				}
			}
		} else {
			layer.msg('接口' + result.msg);
		}
	}, false);
	return name;
};

//月份：
Data.YueFen = function(val) {
	switch(val) {
		case "1":
			val = "1";
			break;
		case "2":
			val = "2";
			break;
		case "3":
			val = "3";
			break;
		case "4":
			val = "4";
			break;
		case "5":
			val = "5";
			break;
		case "6":
			val = "6";
			break;
		case "7":
			val = "7";
			break;
		case "8":
			val = "8";
			break;
		case "9":
			val = "9";
			break;
		case "10":
			val = "10";
			break;
		case "11":
			val = "11";
			break;
		case "12":
			val = "12";
			break;
		default:
			val = "无";
			break;
	}
	return val;
};

//类型
Data.DOCUMENT = function(obj) {
	var name;
	Mydao.ajax({
		'type': 'DOCUMENT'
	}, 'dictionary/s1002', function(result) {
		var currentTime = result.serverTime;
		if(result.code == 200) {
			var resultForm = result.result;
			for(var i = 0; i < resultForm.length; i++) {
				var item = resultForm[i];
				if(item.id == obj) {
					name = item.name;
				}
			}
		} else {
			layer.msg('接口' + result.msg);
		}
	}, false);
	return name;
};