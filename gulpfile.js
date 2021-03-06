const gulp = require('gulp');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnext = require('cssnext');
const precss = require('precss');
const cssmin = require('gulp-minify-css');
const gulpsass = require('gulp-sass');
const stylus = require('gulp-stylus');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const imageMin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const Browsersync = require('browser-sync').create();
const htmlmin = require('gulp-htmlmin');
const rev = require('gulp-rev-append');
const gulpRev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
const babel = require("gulp-babel");
const concat = require('gulp-concat');
const gulpLib = require('./gulp-lib/index.js');
const zip = require('gulp-zip');
const gulpCongfig = {
    point:3000,
    task:'dev',
    dev:'./dev/',  //开发目录
    build:'./build/'  //构建目录
}



function toNum(num){
    if(num>9){
        return num;
    };
    return '0'+num;
}

function timeFormat(){
    var time = new Date();
    return time.getFullYear()+'.'+
           toNum(time.getMonth()+1)+'.'+
           toNum(time.getDay())+'-'+
           time.getHours()+'.'+
           time.getMinutes()+'.'+
           time.getSeconds();
}

/*自定义库*/
gulp.task('gulpLibs',function(){
    gulp.src('dev/*/*.css')
        .pipe(gulpLib())
        .pipe(gulp.dest('./build/'));
});

/*less*/
gulp.task('LessTask', function() {
    var processors = [autoprefixer, cssnext, precss];
    gulp.src('src/*/*.less')
        .pipe(less())
        .pipe(postcss(processors))
        .pipe(cssmin())
        .pipe(gulp.dest(gulpCongfig[gulpCongfig.task]))
        .pipe(Browsersync.stream());
});


/*加入hash防止缓存*/
gulp.task("hashFiles",function(){
    return gulp.src("./dev/*/*")
           .pipe(gulpRev())
           .pipe(gulp.dest("./build/"))
           .pipe(gulpRev.manifest())
           .pipe(gulp.dest("./build/"));
});

/*html代码混淆*/
gulp.task('revHtml',["hashFiles"],function () {
    return gulp.src(['build/*.json', 'dev/*.html'])
        .pipe( revCollector({
            replaceReved: true,
        }))
        .pipe( gulp.dest('./build/'));
});


/*Sass*/
gulp.task('SassTask', function() {
  var processors = [autoprefixer, cssnext, precss];
  return gulp.src('src/*/*.scss')
      .pipe(gulpsass())
      .pipe(postcss(processors))
      .pipe(cssmin())
      .pipe(gulp.dest(gulpCongfig[gulpCongfig.task]))
      .pipe(Browsersync.stream());
});


/*stylus*/
gulp.task('stylusTask', function() {
  return gulp.src('src/*/*.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus({
        linenos: true,
        compress: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(gulpCongfig[gulpCongfig.task]));
});

gulp.task('postcssTask',['stylusTask'],function(){
var processors = [autoprefixer, cssnext, precss];
   return gulp.src('dev/*/*.css')
        .pipe(postcss(processors))
        .pipe(cssmin())
        .pipe(gulp.dest(gulpCongfig[gulpCongfig.task]))
        .pipe(Browsersync.stream());
});


/*图片压缩*/
gulp.task("dealImage",function(){
    return gulp.src("src/img/*.*")
           .pipe(imageMin())
           .pipe(gulp.dest("build/img"));
});


//处理html
gulp.task('minHtml', function () {
    return gulp.src('src/*.html')
        .pipe(rev())
        .pipe(htmlmin({
            removeComments: true,//清除HTML注释
            collapseWhitespace: true,//压缩HTML
            collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
            minifyJS: true,//压缩页面JS
            minifyCSS: true//压缩页面CSS
        }))
        .pipe(gulp.dest(gulpCongfig[gulpCongfig.task]))
        .pipe(Browsersync.stream());  //自动刷新页面
});


//开启自动刷新服务
gulp.task('serve', function() {
    Browsersync.init({
        open: 'localhost:8082', //用局域网ip打开
        server: {
            baseDir: gulpCongfig[gulpCongfig.task],
            directory: true
        }
    });
});

/*js,css压缩*/
gulp.task('concatJs', function(){
    //gulp.src('src/js/*.js')//这种方式合并文件的先后顺序不能控制
    gulp.src(['src/js/js1.js','src/js/js2.js']) //按顺序将文件写入数组，做为参数
    .pipe(concat('all.js')) //合并后生成的文件
    .pipe(gulp.dest('build/js'))
});


/*代码打包*/
gulp.task('packageProject',function(){
    var fileName = 'prject_'+timeFormat()+'.zip';
    return gulp.src(['./build/*','!./build/*.json'])      //找到目标文件夹并且进行去除json文件处理
        .pipe(zip(fileName))        //对文件进行压缩和重命名
        .pipe(gulp.dest('./projects/'));       //压缩到指定文件夹
});



/*压缩js*/
gulp.task('jsmin',function (cb) {
    return gulp.src("src/*/*.js")
        .pipe(babel())
        .pipe(uglify({
            mangle: true, //类型：Boolean 默认：true 是否修改变量名
            compress: true  //类型：Boolean 默认：true 是否完全压缩
        }))
        .pipe(gulp.dest(gulpCongfig[gulpCongfig.task]));
});


/*清除文件及文件夹*/
gulp.task('clearFiled',function () {
    return gulp.src('./build/*', {read: false})
        .pipe(clean());
});


/*默认执行任务*/
gulp.task("default",["clearFiled","serve"],function() {
    gulp.watch("src/*/*.less", ['LessTask']);
    gulp.watch("src/*/*.scss", ['SassTask']);
    gulp.watch("src/stylus/*.styl", ['postcssTask']);
    gulp.watch("src/img/*.*",["dealImage"]);
    gulp.watch("src/*/*.js",["jsmin"]);
    gulp.watch("src/*.html",["minHtml"]);
});