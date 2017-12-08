$(function() {
	$('.sidebar-collapse').slimScroll({
		width: '100%', //可滚动区域宽度
		height: '100%', //可滚动区域高度
		railVisible: true, //是否 显示轨道
		alwaysVisible: true, //是否 始终显示组件
		borderRadius: '7px', //滚动条圆角
		railBorderRadius: '7px', //轨道圆角
		//			size: '10px', //组件宽度
		//			color: '#000', //滚动条颜色
		//			position: 'right', //组件位置：left/right
		//			distance: '0px', //组件与侧边之间的距离
		//			start: 'top', //默认滚动位置：top/bottom
		//			opacity: .4, //滚动条透明度
		//			disableFadeOut: false, //是否 鼠标经过可滚动区域时显示组件，离开时隐藏组件
		//			railColor: '#333', //轨道颜色
		//			railOpacity: .2, //轨道透明度
		//			railDraggable: true, //是否 滚动条可拖动
		//			railClass: 'slimScrollRail', //轨道div类名 
		//			barClass: 'slimScrollBar', //滚动条div类名
		//			wrapperClass: 'slimScrollDiv', //外包div类名
		allowPageScroll: true, //是否 使用滚轮到达顶端/底端时，滚动窗口
		wheelStep: 20, //滚轮滚动量s
		touchScrollStep: 200, //滚动量当用户使用手势
	});
	var wrapper = $('#wrapper').height();
	//	左侧菜单高度
	$('.main-sidebar').height(wrapper - 50);
	//	右侧内容区高度  （包含 面包屑导航 ）
	$('#page-wrapper').height(wrapper - 50);
	//	右侧内容高度
	$('.wrapper-content').height(wrapper - 50 - 40 - 20);


});