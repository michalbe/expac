'use strict';

var dt = require('no-promise-dir-tree');
var base64File = require('base64-file-coder-node')();
var currentDir = process.cwd();
var path = require('path');
var each = require('async-each');

var rootname = 'index.html';
var rootFile;
var parseObject = function(obj, path){
  path = path || '';
  var response = [];
  for (var i in obj) {
    if (typeof obj[i] === 'object') {
      response = response.concat(parseObject(obj[i], path + i + '/'));
    } else if (obj[i] === true) {
      if (path+i === rootname) {
        rootFile = {
          path: path,
          name: i
        };
      } else {
        response.push({
          path: path,
          name: i
        });
      }
    }
  }

  return response;
};

var folders = {};
var fileTypes = [
  {
    type: 'image',
    ext: ['.png', '.jpg', '.gif'],
  },
  {
    type: 'css',
    ext: ['.css'],
  },
  {
    type: 'js',
    ext: ['.js'],
  }
];

var getFileType = function(name){
  var matchedType = fileTypes.filter(function(fileType){
    return fileType.ext.indexOf(path.extname(name)) > -1;
  });

  return matchedType[0].type;
};

dt(currentDir, function(err, fileTree){
  var files = parseObject(fileTree);
  each(files, function(file, cb) {
    base64File.encode(file.path + file.name, function(err, data) {
      cb(null, [file.path + file.name, data, getFileType(file.name)]);
    });
  }, function(err, content){
    for (var i in content) {
      folders[content[i][2]] = folders[content[i][2]] || {};
      folders[content[i][2]][content[i][0]] = content[i][1];
    }
    // END OF IMAGES COLLECTING
    console.log(JSON.stringify(folders));
  });
});
