'use strict';

var dt = require('no-promise-dir-tree');
var base64Img = require('base64-img');
var currentDir = process.cwd();
var path = require('path');

var rootFileName = 'index.html';
var rootFile;
var parseObject = function(obj, path){
  path = path || '';
  var response = [];
  for (var i in obj) {
    if (typeof obj[i] === 'object') {
      response = response.concat(parseObject(obj[i], path + i + '/'));
    } else if (obj[i] === true) {
      if (path+i === rootFileName) {
        rootFile = {
          path: path,
          filename: i
        };
      } else {
        response.push({
          path: path,
          filename: i
        });
      }
    }
  }

  return response;
};

dt(currentDir, function(err, fileTree){
  var files = parseObject(fileTree);
  files.forEach(function(file) {
    if (path.extname(file.filename) === '.png') {
      base64Img.base64(file.path + file.filename, function(err, data) {
        console.log(data);
      });
    }
  });
});
