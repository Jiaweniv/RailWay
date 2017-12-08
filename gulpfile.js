﻿
/*
   Author: By-Li .
    Email: luffy.vip@qq.com .
*/

// 载入外挂
var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'), //根据设置浏览器版本自动处理浏览器前缀
	minifycss = require('gulp-clean-css'), //压缩css文件,并给引用url添加版本号避免缓存
	jslint = require('gulp-jslint'), //js代码检查
	uglify = require('gulp-uglify'), // js文件压缩
	imagemin = require('gulp-imagemin'), //图片压缩
	clean = require('gulp-clean'), //删除文件夹
	notify = require('gulp-notify'), //输出错误信息
	livereload = require('gulp-livereload'), //监听文件变化
	rev = require('gulp-rev-append'), //文件添加版本号
	cache = require('gulp-cache'), //显示报错信息和报错后不终止当前gulp任务
	rename = require('gulp-rename'), //改变管道中的文件名
	htmlmin = require('gulp-htmlmin'), //压缩html
	gulpCopy = require('gulp-copy'), //复制文件夹
	jshint = require('gulp-jshint'), //检查js文件
	zip = require('gulp-zip'); //打包文件夹

//页面
gulp.task('htmls', function() {
	return gulp.src(['./*.html'])
		.pipe(rev())
//		.pipe(htmlmin({
//			removeComments: false, //清除HTML注释
//			collapseWhitespace: true, //压缩HTML
//			//		collapseBooleanAttributes: false, //省略布尔属性的值 <input checked="true"/> ==> <input />
//			//		removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
//			//		removeScriptTypeAttributes: false, //删除<script>的type="text/javascript"
//			//		removeStyleLinkTypeAttributes: false, //删除<style>和<link>的type="text/css"
//			minifyJS: true, //压缩页面JS
//			minifyCSS: true //压缩页面CSS
//		}))
		.pipe(gulp.dest('dist/'))
//		.pipe(notify({
//			message: '页面任务完成'
//		}));
});

//页面
gulp.task('htmls2', function() {
	return gulp.src(['view/**/*.html'])
		.pipe(rev())
//		.pipe(htmlmin({
//			removeComments: false, //清除HTML注释
//			collapseWhitespace: true, //压缩HTML
//			//		collapseBooleanAttributes: false, //省略布尔属性的值 <input checked="true"/> ==> <input />
//			//		removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
//			//		removeScriptTypeAttributes: false, //删除<script>的type="text/javascript"
//			//		removeStyleLinkTypeAttributes: false, //删除<style>和<link>的type="text/css"
//			minifyJS: true, //压缩页面JS
//			minifyCSS: true //压缩页面CSS
//		}))
		.pipe(gulp.dest('dist/view'))
//		.pipe(notify({
//			message: '页面任务完成'
//		}));
});
// 样式
gulp.task('styles', function() {
	return gulp.src('css/view/*.css')
		.pipe(autoprefixer({
			browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
		}))
		.pipe(minifycss({
			advanced: false, //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
			compatibility: '*', //保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
			keepSpecialComments: '*' //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
		}))
		.pipe(gulp.dest('dist/css/view'))
		//		.pipe(rename({ 
		//			suffix: '.min'
		//		}))
//		.pipe(notify({
//			message: '样式任务完成'
//		}));
});

//检查js脚本
gulp.task('jianchajs', function() {
	return gulp.src(['js/controller/*.js', 'js/controller/*/*.js', 'js/controller/*/*/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
});

// 脚本
gulp.task('scripts', function() {
	return gulp.src(['js/controller/**/*.js'])
		//		.pipe(jshint())
		//		.pipe(jshint.reporter('default'))
		//		.pipe(gulp.dest('dist/build/js'))

		.pipe(uglify())
		//		.pipe(rename({
		//			suffix: '.min'
		//		}))
		.pipe(gulp.dest('dist/js/controller'))
//		.pipe(notify({
//			message: '脚本任务完成'
//		}));
});

// 脚本
gulp.task('scripts2', function() {
	return gulp.src(['js/view/*.js'])
		//		.pipe(jshint())
		//		.pipe(jshint.reporter('default'))
		//		.pipe(gulp.dest('dist/build/js'))

		.pipe(uglify())
		//		.pipe(rename({
		//			suffix: '.min'
		//		}))
		.pipe(gulp.dest('dist/js/view'))
//		.pipe(notify({
//			message: '脚本任务完成'
//		}));
});

// 图片
gulp.task('images', function() {
	return gulp.src('img/*.{png,jpg,gif,ico}')
		.pipe(cache(imagemin({
			optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
			progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
			interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
			multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
		})))
		.pipe(gulp.dest('dist/img'))
//		.pipe(notify({
//			message: '图像的任务完成'
//		}));
});

gulp.task('copyico', function() {
	return gulp.src(["./*.ico"])
		.pipe(gulpCopy("dist/"))
//		.pipe(notify({
//			message: 'ico文件复制的任务完成'
//		}));
});


//移动第三方css插件
gulp.task('copycss', function() {
	return gulp.src(["css/plugins/**"])
		.pipe(gulpCopy("dist/"))
//		.pipe(notify({
//			message: 'CSS文件复制的任务完成'
//		}));
});

//移动第三方js插件
gulp.task('copyjs', function() {
	return gulp.src(["js/plugins/**"])
		.pipe(gulpCopy("dist/"))
//		.pipe(notify({
//			message: 'JS文件复制的任务完成'
//		}));
});

// 清理所有
gulp.task('cleanall', function() {
	return gulp.src(['dist','*.zip'], {
			read: false
		})
		.pipe(clean());
});

// 打包文件夹
gulp.task('zip', function() {
	return gulp.src('dist/**')
		.pipe(zip('zip.zip'))
		.pipe(gulp.dest('./'));
});

// 预设任务
gulp.task('zipall', ['zip'], function() {
	gulp.start('cleanall');
});

// 预设任务
gulp.task('all', ['cleanall'], function() {
	gulp.start('styles', 'scripts', 'scripts2', 'images', 'htmls', 'htmls2', 'copycss', 'copyjs','copyico');
});