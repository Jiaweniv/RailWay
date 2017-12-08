$.sidebarMenu = function(menu) {
	var animationSpeed = 300;

	$(menu).on('click', 'li a', function(e) {
		var $this = $(this);
		var checkElement = $this.next();
		if(checkElement.length > 0) {
			if(checkElement.is('.treeview-menu') && checkElement.is(':visible')) {
				checkElement.slideUp(animationSpeed, function() {
					checkElement.removeClass('menu-open');
				});
				checkElement.parent("li").removeClass("active");
			}
			//如果菜单是不可见的
			else if((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
				//得到父菜单
				var parent = $this.parents('ul').first();
				//关闭所有打开的菜单内的父母
				var ul = parent.find('ul:visible').slideUp(animationSpeed);
				//删除menu-open父类
				ul.removeClass('menu-open');
				//获取当前父级的li
				var parent_li = $this.parent("li");

				//打开菜单,添加menu-open类目标
				checkElement.slideDown(animationSpeed, function() {
					//添加class到当前父级 li
					checkElement.addClass('menu-open');
					parent.find('li.active').removeClass('active');
					parent_li.addClass('active');
				});
			}
		} else {
			//添加class到当前父级 li 移除同级的class
			var parentLi = $this.parent("li"),
					siblingsNext = parentLi.siblings("li").find('a').next();
			parentLi.addClass("active").siblings("li").removeClass("active");
			//同级的li中的子菜单移除class
			if(siblingsNext.is('.treeview-menu') && siblingsNext.is(':visible')) {
				siblingsNext.slideUp(animationSpeed, function() {
					siblingsNext.removeClass('menu-open').find('li').removeClass('active');
				});
			}
		}

		//如果这不是一个链接,防止页面重定向
		if(checkElement.is('.treeview-menu')) {
			e.preventDefault();
		}
	});
};