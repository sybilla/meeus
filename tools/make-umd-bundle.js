var browserify = require('browserify');
var fs = require('fs');

var b = browserify(['dist/cjs/meeus.js'], {
  baseDir: 'dist/cjs',
  standalone: 'meeus'
});

b.bundle().pipe(fs.createWriteStream('dist/global/meeus.umd.js'));

