
function closeAll(){
	layui.use(['layer'], function() {
		var layer = layui.layer;
		layer.closeAll();
	});
}
//机构人员
var JGXX = {}; //默认的部分页面，这将是最初加载
JGXX.partial = "view/InstitutionalPersonnel/AgencyInformation.html";
JGXX.init = function() { //引导方法
		//	do somethine...
		closeAll();
};
//字典管理
var ZDGL = {}; //默认的部分页面，这将是最初加载
ZDGL.partial = "view/SystemManagement/DictionaryManaged.html";
ZDGL.init = function() { //引导方法
	//	do somethine...
		closeAll();
};
var ZWSZ = {}; //默认的部分页面，这将是最初加载
ZWSZ.partial = "view/InstitutionalPersonnel/JobSettings.html";
ZWSZ.init = function() { //引导方法
	//	do somethine...
	closeAll();
};
var RYXX = {}; //默认的部分页面，这将是最初加载
RYXX.partial = "view/InstitutionalPersonnel/PersonnelInformation.html";
RYXX.init = function() { //引导方法
	//	do somethine..
	closeAll();
};

//系统管理
var JSQX = {}; //默认的部分页面，这将是最初加载
JSQX.partial = "view/SystemManagement/RolePermissions.html";
JSQX.init = function() { //引导方法
	//	do somethine..
	closeAll();
};
var YHGL = {}; //默认的部分页面，这将是最初加载
YHGL.partial = "view/SystemManagement/UserManagement.html";
YHGL.init = function() { //引导方法
	//	do somethine..
	closeAll();
};
var CDGL = {}; //默认的部分页面，这将是最初加载
CDGL.partial = "view/SystemManagement/MenuManagement.html";
CDGL.init = function() { //引导方法
	//	do somethine..
	closeAll();
};

//中心工作
var ZXJH = {}; //默认的部分页面，这将是最初加载
ZXJH.partial = "view/CenterWork/CenterProgram.html";
ZXJH.init = function() { //引导方法
	//	do somethine..
	closeAll();
};
var JDJH = {}; //默认的部分页面，这将是最初加载
JDJH.partial = "view/CenterWork/MonitoringPlan.html";
JDJH.init = function() { //引导方法
	//	do somethine..
	closeAll();
};

//项目信息
var GCXM = {}; //默认的部分页面，这将是最初加载
GCXM.partial = "view/ProjectInformation/Project.html";
GCXM.init = function() { //引导方法
	//	do somethine..
	closeAll();
};
var GCGK = {}; //默认的部分页面，这将是最初加载
GCGK.partial = "view/ProjectInformation/ProjectOverview.html";
GCGK.init = function() { //引导方法
	//	do somethine..
	closeAll();
};
var SJWJ = {}; //默认的部分页面，这将是最初加载
SJWJ.partial = "view/ProjectInformation/DesigningDocuments.html";
SJWJ.init = function() { //引导方法
	//	do somethine..
	closeAll();
};
var GDXX = {}; //默认的部分页面，这将是最初加载
GDXX.partial = "view/ProjectInformation/WorkPointInformation.html";
GDXX.init = function() { //引导方法
	//	do somethine..
	closeAll();
};
var SGJD = {}; //默认的部分页面，这将是最初加载
SGJD.partial = "view/ProjectInformation/ConstructionSchedule.html";
SGJD.init = function() { //引导方法
	//	do somethine..
	closeAll();
};
var FHGC = {}; //默认的部分页面，这将是最初加载
FHGC.partial = "view/ProjectInformation/ProtectionEngineering.html";
FHGC.init = function() { //引导方法
	//	do somethine..
	closeAll();
};

//监督抽取库
var JCRY = {}; //默认的部分页面，这将是最初加载
JCRY.partial = "view/SupervisedExtractionLibrary/Inspectors.html";
JCRY.init = function() { //引导方法
	//	do somethine..
	closeAll();
};
var JCZJ = {}; //默认的部分页面，这将是最初加载
JCZJ.partial = "view/SupervisedExtractionLibrary/CheckExperts.html";
JCZJ.init = function() { //引导方法
	//	do somethine..
	closeAll();
};
var JCJG = {}; //默认的部分页面，这将是最初加载
JCJG.partial = "view/SupervisedExtractionLibrary/TestingFacility.html";
JCJG.init = function() { //引导方法
	//	do somethine..
	closeAll();
};
var CCSX = {}; //默认的部分页面，这将是最初加载
CCSX.partial = "view/SupervisedExtractionLibrary/SpotChecks.html";
CCSX.init = function() { //引导方法
	//	do somethine..
	closeAll();
};

//项目监督
var JDSX = {}; //默认的部分页面，这将是最初加载
JDSX.partial = "view/ProjectSupervision/SupervisionProcedures.html";
JDSX.init = function() { //引导方法
	//	do somethine..
	closeAll();
};
var JDJC = {}; //默认的部分页面，这将是最初加载
JDJC.partial = "view/ProjectSupervision/SupervisedCheck.html";
JDJC.init = function() { //引导方法
	//	do somethine..
	closeAll();
};
var JDGZBG = {}; //默认的部分页面，这将是最初加载
JDGZBG.partial = "view/ProjectSupervision/SupervisoryWorkReport.html";
JDGZBG.init = function() { //引导方法
	//	do somethine..
	closeAll();
};

//执法业务
var TSJB = {}; //默认的部分页面，这将是最初加载
TSJB.partial = "view/LawOperations/ComplaintReport.html";
TSJB.init = function() { //引导方法
	//	do somethine..
	closeAll();
};
var XZCF = {}; //默认的部分页面，这将是最初加载
XZCF.partial = "view/LawOperations/Penalties.html";
XZCF.init = function() { //引导方法
	//	do somethine..
	closeAll();
};

//监督总览（新增）
var DWZL = {}; //默认的部分页面，这将是最初加载
DWZL.partial = "view/SupervisePandect/CompanyPandect.html";
DWZL.init = function() { //引导方法
	//	do somethine..
	closeAll();
};
var XMZL = {}; //默认的部分页面，这将是最初加载
XMZL.partial = "view/SupervisePandect/ProjectPandect.html";
XMZL.init = function() { //引导方法
	//	do somethine..
	closeAll();
};
var WTZL = {}; //默认的部分页面，这将是最初加载
WTZL.partial = "view/SupervisePandect/ProblemPandect.html";
WTZL.init = function() { //引导方法
	//	do somethine..
	closeAll();
};
//监督月报
var JDYB = {}; //默认的部分页面，这将是最初加载
JDYB.partial = "view/JianDuYueBao/JianDuYueBao.html";
JDYB.init = function() { //引导方法
	//	do somethine..
	closeAll();
};

//问题库
var WTK = {}; //默认的部分页面，这将是最初加载
WTK.partial = "view/Problem/Problem.html";
WTK.init = function() { //引导方法
	//	do somethine..
	closeAll();
};

//资料中心
var ZLZX = {}; //默认的部分页面，这将是最初加载
ZLZX.partial = "view/Information.html";
ZLZX.init = function() { //引导方法
	//	do somethine..
	closeAll();
};

//信息公开
var XXGK = {}; //默认的部分页面，这将是最初加载
XXGK.partial = "view/Disclosure.html";
XXGK.init = function() { //引导方法
	//	do somethine..
	closeAll();
};

//统计分析
var JDGZ = {}; //默认的部分页面，这将是最初加载
JDGZ.partial = "view/StatisticalAnalysis/Supervision.html";
JDGZ.init = function() { //引导方法
	//	do somethine..
	closeAll();
};
var JCWT = {}; //默认的部分页面，这将是最初加载
JCWT.partial = "view/StatisticalAnalysis/CheckProblem.html";
JCWT.init = function() { //引导方法
	//	do somethine..
	closeAll();
};


$(function() {
	//计算元素集合的总宽度
	function calSumWidth(elements) {
		var width = 0;
		$(elements).each(function() {
			width += $(this).outerWidth(true);
		});
		return width;
	}

	//滚动到指定选项卡
	function scrollToTab(element) {
		var marginLeftVal = calSumWidth($(element).prevAll()),
			marginRightVal = calSumWidth($(element).nextAll());
		// 可视区域非tab宽度
		var tabOuterWidth = calSumWidth($(".content_tabs").children().not(".J_menuTabs"));
		//可视区域tab宽度
		var visibleWidth = $(".content_tabs").outerWidth(true) - tabOuterWidth;
		//实际滚动宽度
		var scrollVal = 0;
		if($(".page-tabs-content").outerWidth() < visibleWidth) {
			scrollVal = 0;
		} else if(marginRightVal <= (visibleWidth - $(element).outerWidth(true) - $(element).next().outerWidth(true))) {
			if((visibleWidth - $(element).next().outerWidth(true)) > marginRightVal) {
				scrollVal = marginLeftVal;
				var tabElement = element;
				while((scrollVal - $(tabElement).outerWidth()) > ($(".page-tabs-content").outerWidth() - visibleWidth)) {
					scrollVal -= $(tabElement).prev().outerWidth();
					tabElement = $(tabElement).prev();
				}
			}
		} else if(marginLeftVal > (visibleWidth - $(element).outerWidth(true) - $(element).prev().outerWidth(true))) {
			scrollVal = marginLeftVal - $(element).prev().outerWidth(true);
		}
		$('.page-tabs-content').animate({
			marginLeft: 0 - scrollVal + 'px'
		}, "fast");
	}

	//关闭其他选项卡
	function closeOtherTabs() {
		$('.page-tabs-content').children("[data-id]").not(":first").not(".active").each(function() {
			$('.J_iframe[data-id="' + $(this).data('id') + '"]').remove();
			$(this).remove();
		});
		$('.page-tabs-content').css("margin-left", "0");
	}
	$('.J_tabCloseOther').on('click', closeOtherTabs);

	//滚动到已激活的选项卡
	function showActiveTab() {
		scrollToTab($('.J_menuTab.active'));
	}

	$('.J_tabShowActive').on('click', showActiveTab);

	// 点击选项卡菜单
	function activeTab() {
		if(!$(this).hasClass('active')) {
			var currentId = $(this).data('id');
			// 显示tab对应的内容区
			$('#wrapper-content .J_iframe').each(function() {
				if($(this).data('id') == currentId) {
					$(this).show().siblings('.J_iframe').hide();
					return false;
				}
			});
			$(this).addClass('active').siblings('.J_menuTab').removeClass('active');
			scrollToTab(this);
		}
	}

	$('.J_menuTabs').on('click', '.J_menuTab', activeTab);

	// 关闭选项卡菜单
	function closeTab() {
		var closeTabId = $(this).parents('.J_menuTab').data('id');
		var currentWidth = $(this).parents('.J_menuTab').width();

		// 当前元素处于活动状态
		if($(this).parents('.J_menuTab').hasClass('active')) {

			// 当前元素后面有同辈元素，使后面的一个元素处于活动状态
			if($(this).parents('.J_menuTab').next('.J_menuTab').size()) {

				var activeId = $(this).parents('.J_menuTab').next('.J_menuTab:eq(0)').data('id');
				$(this).parents('.J_menuTab').next('.J_menuTab:eq(0)').addClass('active');

				$('#wrapper-content .J_iframe').each(function() {
					if($(this).data('id') == activeId) {
						$(this).show().siblings('.J_iframe').hide();
						return false;
					}
				});

				var marginLeftVal = parseInt($('.page-tabs-content').css('margin-left'));
				if(marginLeftVal < 0) {
					$('.page-tabs-content').animate({
						marginLeft: (marginLeftVal + currentWidth) + 'px'
					}, "fast");
				}

				//  移除当前选项卡
				$(this).parents('.J_menuTab').remove();

				// 移除tab对应的内容区
				$('#wrapper-content .J_iframe').each(function() {
					if($(this).data('id') == closeTabId) {
						$(this).remove();
						return false;
					}
				});
			}

			// 当前元素后面没有同辈元素，使当前元素的上一个元素处于活动状态
			if($(this).parents('.J_menuTab').prev('.J_menuTab').size()) {
				var activeId2 = $(this).parents('.J_menuTab').prev('.J_menuTab:last').data('id');
				if(activeId2 == 'HOME') {
					var J_iframe = $("<div class='J_iframe'  data-id='" + activeId2 + "' ></div>");
					J_iframe.attr('data-id', activeId2);
					$.get('home.html', function(data) {
						$("#wrapper-content .sidebar_collapse").find('div.J_iframe').hide();
						$("#wrapper-content .sidebar_collapse").append(J_iframe);
						J_iframe.append(data);
					});
				}
				$(this).parents('.J_menuTab').prev('.J_menuTab:last').addClass('active');
				$('#wrapper-content .J_iframe').each(function() {
					if($(this).data('id') == activeId2) {
						$(this).show().siblings('.J_iframe').hide();
						return false;
					}
				});

				//  移除当前选项卡
				$(this).parents('.J_menuTab').remove();

				// 移除tab对应的内容区
				$('#wrapper-content .J_iframe').each(function() {
					if($(this).data('id') == closeTabId) {
						$(this).remove();
						return false;
					}
				});
			}
		}
		// 当前元素不处于活动状态
		else {
			//  移除当前选项卡
			$(this).parents('.J_menuTab').remove();

			// 移除相应tab对应的内容区
			$('#wrapper-content .J_iframe').each(function() {
				if($(this).data('id') == closeTabId) {
					$(this).remove();
					return false;
				}
			});
		}
		return false;
	}

	$('.J_menuTabs').on('click', '.J_menuTab i', closeTab);

	//查看左侧隐藏的选项卡
	function scrollTabLeft() {
		var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
		// 可视区域非tab宽度
		var tabOuterWidth = calSumWidth($(".content_tabs").children().not(".J_menuTabs"));
		//可视区域tab宽度
		var visibleWidth = $(".content_tabs").outerWidth(true) - tabOuterWidth;
		//实际滚动宽度
		var scrollVal = 0;
		if($(".page-tabs-content").width() < visibleWidth) {
			return false;
		} else {
			var tabElement = $(".J_menuTab:first");
			var offsetVal = 0;
			while((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) { //找到离当前tab最近的元素
				offsetVal += $(tabElement).outerWidth(true);
				tabElement = $(tabElement).next();
			}
			offsetVal = 0;
			if(calSumWidth($(tabElement).prevAll()) > visibleWidth) {
				while((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
					offsetVal += $(tabElement).outerWidth(true);
					tabElement = $(tabElement).prev();
				}
				scrollVal = calSumWidth($(tabElement).prevAll());
			}
		}
		$('.page-tabs-content').animate({
			marginLeft: 0 - scrollVal + 'px'
		}, "fast");
	}
	//查看右侧隐藏的选项卡
	function scrollTabRight() {
		var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
		// 可视区域非tab宽度
		var tabOuterWidth = calSumWidth($(".content_tabs").children().not(".J_menuTabs"));
		//可视区域tab宽度
		var visibleWidth = $(".content_tabs").outerWidth(true) - tabOuterWidth;
		//实际滚动宽度
		var scrollVal = 0;
		if($(".page-tabs-content").width() < visibleWidth) {
			return false;
		} else {
			var tabElement = $(".J_menuTab:first");
			var offsetVal = 0;
			while((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) { //找到离当前tab最近的元素
				offsetVal += $(tabElement).outerWidth(true);
				tabElement = $(tabElement).next();
			}
			offsetVal = 0;
			while((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
				offsetVal += $(tabElement).outerWidth(true);
				tabElement = $(tabElement).next();
			}
			scrollVal = calSumWidth($(tabElement).prevAll());
			if(scrollVal > 0) {
				$('.page-tabs-content').animate({
					marginLeft: 0 - scrollVal + 'px'
				}, "fast");
			}
		}
	}

	// 左移按扭
	$('.J_tabLeft').on('click', scrollTabLeft);

	// 右移按扭
	$('.J_tabRight').on('click', scrollTabRight);

	// 关闭全部
	$('.J_tabCloseAll').on('click', function() {
		$('.page-tabs-content').children("[data-id]").not(":first").each(function() {
			$('.J_iframe[data-id="' + $(this).data('id') + '"]').remove();
			$(this).remove();
		});
		$('.page-tabs-content').children("[data-id]:first").each(function() {
			var J_iframe = $("<div class='J_iframe'  data-id='" + $(this).data('id') + "' ></div>");
			J_iframe.attr('data-id', $(this).data('id'));
			$.get('home.html', function(data) {
				$("#wrapper-content .sidebar-collapse").find('div.J_iframe').hide();
				$("#wrapper-content .sidebar-collapse").append(J_iframe);
				J_iframe.append(data);
			});
			$(this).addClass("active");
		});
		$('.page-tabs-content').css("margin-left", "0");
	});
});

mydaoSPA.changeUrl(); //initialize