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

/*less*/
gulp.task('LessTask', function() {
    var processors = [autoprefixer, cssnext, precss];
    gulp.src('src/*/*.less')
        .pipe(less())
        .pipe(postcss(processors))
        .pipe(cssmin())
        .pipe(gulp.dest('build/'));
});

/*Sass*/
gulp.task('SassTask', function() {
  var processors = [autoprefixer, cssnext, precss];
  return gulp.src('src/*/*.scss')
      .pipe(gulpsass())
      .pipe(postcss(processors))
      .pipe(cssmin())
      .pipe(gulp.dest('build/'));
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
    .pipe(gulp.dest('dev/'));
});
  
gulp.task('postcssTask',['stylusTask'],function(){
var processors = [autoprefixer, cssnext, precss];
   return gulp.src('dev/*/*.css')
        .pipe(postcss(processors))
        .pipe(cssmin())
        .pipe(gulp.dest('build/'));
});


/*清除文件及文件夹*/
gulp.task('clearFiled', function () {
    return gulp.src('./build/*', {read: false})
        .pipe(clean());
});

/*图片压缩*/
gulp.task("dealImage",function(){
    return gulp.src("src/img/*.*")
           .pipe(imageMin())
           .pipe(gulp.dest("build/img"));
});




gulp.task("default", function() {
    gulp.watch("src/*/*.less", ['LessTask']);
    gulp.watch("src/*/*.scss", ['SassTask']);
    gulp.watch("src/stylus/*.styl", ['postcssTask']);
    gulp.watch("build/*",['clearFiled']);
});