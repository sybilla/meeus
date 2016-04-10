var pkg = require('./package.json');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var Builder = require('systemjs-builder');
var licenseTool = require('./tools/add-license-to-file');
var addLicenseToFile = licenseTool.addLicenseToFile;
var addLicenseTextToFile = licenseTool.addLicenseTextToFile;

// License info for minified files
var licenseUrl = 'https://github.com/sybilla/meeus/blob/master/LICENSE.txt';
var license = 'Dual-licensed: ' + licenseUrl;

delete pkg.scripts;

var cjsPkg = Object.assign({}, pkg, {
  name: 'meeus',
  main: 'meeus.js',
  typings: 'meeus.d.ts'
});
var es6Pkg = Object.assign({}, cjsPkg, {
  name: 'meeus-es',
  main: 'meeus.js',
  typings: 'meeus.d.ts'
});

fs.writeFileSync('dist/cjs/package.json', JSON.stringify(cjsPkg, null, 2));
fs.writeFileSync('dist/cjs/LICENSE.txt', fs.readFileSync('./LICENSE.txt').toString());
fs.writeFileSync('dist/cjs/README.md', fs.readFileSync('./README.md').toString());

// Bundles for CJS only
mkdirp.sync('dist/cjs/bundles');
// UMD bundles
fs.writeFileSync('dist/cjs/bundles/meeus.umd.js', fs.readFileSync('dist/global/meeus.umd.js').toString());
fs.writeFileSync('dist/cjs/bundles/meeus.umd.min.js', fs.readFileSync('dist/global/meeus.umd.min.js').toString());
fs.writeFileSync('dist/cjs/bundles/meeus.umd.min.js.map', fs.readFileSync('dist/global/meeus.umd.min.js.map').toString());
// System bundles
fs.writeFileSync('dist/cjs/bundles/meeus.js', fs.readFileSync('dist/global/meeus.js').toString());
fs.writeFileSync('dist/cjs/bundles/meeus.min.js', fs.readFileSync('dist/global/meeus.min.js').toString());
fs.writeFileSync('dist/cjs/bundles/meeus.min.js.map', fs.readFileSync('dist/global/meeus.min.js.map').toString());

// ES6 Package
fs.writeFileSync('dist/es6/package.json', JSON.stringify(es6Pkg, null, 2));
fs.writeFileSync('dist/es6/LICENSE.txt', fs.readFileSync('./LICENSE.txt').toString());
fs.writeFileSync('dist/es6/README.md', fs.readFileSync('./README.md').toString());

// Add licenses to tops of bundles
addLicenseToFile('LICENSE.txt', 'dist/cjs/bundles/meeus.umd.js');
addLicenseTextToFile(license, 'dist/cjs/bundles/meeus.umd.min.js');
addLicenseToFile('LICENSE.txt', 'dist/cjs/bundles/meeus.js');
addLicenseTextToFile('license', 'dist/cjs/bundles/meeus.min.js');
addLicenseToFile('LICENSE.txt', 'dist/global/meeus.umd.js');
addLicenseTextToFile(license, 'dist/global/meeus.umd.min.js');
addLicenseToFile('LICENSE.txt', 'dist/global/meeus.js');
addLicenseTextToFile(license, 'dist/global/meeus.min.js');
