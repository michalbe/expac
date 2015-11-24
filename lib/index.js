'use strict';

var dirTree = require('no-promise-dir-tree');
var currentDir = process.cwd();
dirTree(currentDir, function(err, success){
  console.log(success);
});
