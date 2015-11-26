'use strict';

var dt = require('no-promise-dir-tree');
var base64Img = require('base64-img');
var currentDir = process.cwd();
var path = require('path');
var each = require('async-each');

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

var imagesFolder = null;

dt(currentDir, function(err, fileTree){
  var files = parseObject(fileTree);
  each(files.filter(function(file){
    return path.extname(file.filename) === '.png';
  }), function(file, cb) {
    base64Img.base64(file.path + file.filename, function(err, data) {
      cb(null, [file.path + file.filename, data]);
    });
  }, function(err, content){
    var resp = {};
    for (var i in content) {
      resp[content[i][0]] = content[i][1];
    }
    imagesFolder = resp;
    // END OF IMAGES COLLECTING
    
  });
});
