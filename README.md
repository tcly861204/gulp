```
npm install -g gulp-concat 文件打包
npm install -g gulp-rename 文件重命名
npm install -g gulp-imagemin 图片压缩
npm install -g gulp-jslint js代码校验 慎用
npm install -g gulp-minify-css css压缩
npm install -g gulp-minify-html html压缩
npm install -g gulp-uglify js压缩

```
# 使用babel编译es6需要安装以下插件包 配置.babelrc
```
"gulp-babel": "^7.0.0",
"babel-core": "^6.26.0",
"babel-polyfill": "^6.26.0",
"babel-preset-stage-0": "^6.24.1",
"babel-preset-es2015": "^6.24.1",
```


# 入门指南
1. 全局安装 gulp：
```javascript
$ npm install --global gulp
```

2. 作为项目的开发依赖（devDependencies）安装：
```javascript
$ npm install --save-dev gulp
```

3. 在项目根目录下创建一个名为 gulpfile.js 的文件：
```javascript
var gulp = require('gulp');

gulp.task('default', function() {
  // 将你的默认的任务代码放在这
});
```

4. 运行 gulp：
```javascript
$ gulp
```

# gulp API 文档
gulp.src(globs[, options])

输出（Emits）符合所提供的匹配模式（glob）或者匹配模式的数组（array of globs）的文件。 将返回一个 Vinyl files 的 stream 它可以被 piped 到别的插件中。


```javascript
gulp.src('client/templates/*.jade')
  .pipe(jade())
  .pipe(minify())
  .pipe(gulp.dest('build/minified_templates'));
```
