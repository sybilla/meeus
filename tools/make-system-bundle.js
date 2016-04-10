var path = require('path');
var Builder = require('systemjs-builder');
var addLicenseToFile = require('./add-license-to-file');

var config = {
  baseURL: 'dist',
  paths: {
      'sybilla/*': 'cjs/*.js'
  }
};


build('sybilla/meeus', '../dist/global/meeus.js', '../dist/global/meeus.min.js');

function build(name, inputFile, outputFile) {
  var devBuilder = new Builder();

  devBuilder.config(config);

  devBuilder.build(name, path.resolve(__dirname, inputFile)).then(function() {
    var prodBuilder = new Builder();
    prodBuilder.config(config);
    prodBuilder.build(name, path.resolve(__dirname, outputFile), {sourceMaps: true, minify: true}).then(function() {
      process.exit(0);
    }, function(err) {
      console.error('prod died', err);
      process.exit(1);
    });

  }, function(err) {
    console.error('dev died', err);
    process.exit(1);
  });
}

process.stdin.resume();
