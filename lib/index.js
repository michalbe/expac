'use strict';

var dt = require('no-promise-dir-tree');
var currentDir = process.cwd();

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

dt(currentDir, function(err, success){
  var tree = success;
  console.log(parseObject(tree), rootFile);
});
