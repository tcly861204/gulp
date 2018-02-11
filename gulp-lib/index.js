'use strict';
const gutil          = require('gulp-util');
const through2       = require('through2');
module.exports = function(){
  return through2.obj(function(file, enc, cb) {
    if(file.isNull()){
      this.push(file);
      return cb();
    }

    if(file.isStream()){
      this.emit("error",new gutil.PluginError('Streaming not supported'));
      return cb();
    }

    console.log(cb(null,file));
    return cb(null,file)
  });
}