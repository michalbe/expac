'use strict';

var dt = require('no-promise-dir-tree');
var base64File = require('base64-file-coder-node')();
var currentDir = process.cwd();
var path = require('path');
var fs = require('fs');
var filendir = require('filendir');
var cheerio = require('cheerio');
var each = require('async-each');
var htmlMinifier = require('html-minifier');

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
      } else if (path === 'expac/') {
        console.log('Previous expac build found. Ignoring...');
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
  },
  {
    type: 'html',
    ext: ['.html']
  }
];

var getFileType = function(name){
  var matchedType = fileTypes.filter(function(fileType){
    return fileType.ext.indexOf(path.extname(name)) > -1;
  });

  return matchedType[0].type;
};

var mimeTypes = {
  'image': 'image/png',
  'js': 'text/javascript',
  'css': 'text/css'
};

dt(currentDir, function(err, fileTree){
  var files = parseObject(fileTree);
  each(files, function(file, cb) {
    base64File.encode(file.path + file.name, function(err, data) {
      console.log('Proccessing ' + file.path + file.name + ' file...');
      cb(null, [file.path + file.name, data, getFileType(file.name)]);
    });
  }, function(err, content){
    for (var i in content) {
      folders[content[i][2]] = folders[content[i][2]] || {};
      folders[content[i][2]][content[i][0]] =
        'data:' + mimeTypes[folders[content[i][2]]] + ';base64,' +
        content[i][1];
    }
    // END OF FILES COLLECTING
    //console.log(JSON.stringify(folders));
    fs.readFile(rootname, {encoding: 'utf-8'}, function(err,data) {
      if (!err){
        var $ = cheerio.load(data);
        fs.readFile(__dirname + '/starter.js', {encoding: 'utf-8'},
          function(err, starter) {
            $('body').append(
              '<script>' +
                'var folders = ' + JSON.stringify(folders) + ';\n' +
                starter +
              '</script>'
            );

            filendir.wa(
              'expac/' + rootname,
              htmlMinifier.minify($.html(),{
                removeComments: true,
                removeCommentsFromCDATA: true,
                removeCDATASectionsFromCDATA: true,
                collapseWhitespace: true,
                conservativeCollapse: true,
                preserveLineBreaks: true,
                collapseBooleanAttributes: true,
                removeAttributeQuotes: true,
                removeRedundantAttributes: true,
                preventAttributesEscaping: true,
                useShortDoctype: true,
                // removeEmptyAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeOptionalTags: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
              }),
              function(err) {
                if(err) {
                  return console.log(err);
                }

                console.log('The file was saved as expac/' + rootname);
              }
            );

          }
        );
      }else{
        console.log(err);
      }
    });
  });
});
