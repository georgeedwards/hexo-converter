"use strict";
/// <reference path="typings/index.d.ts" />
var fs = require('fs');
var fm = require('front-matter');
var path = 'content/';
var files = [];
var getFiles = function (path, files) {
    fs.readdirSync(path).forEach(function (file) {
        var subpath = path + '/' + file;
        if (fs.lstatSync(subpath).isDirectory()) {
            getFiles(subpath, files);
        }
        else {
            files.push(path + '/' + file);
        }
    });
};
getFiles(path, files);
var _loop_1 = function(file) {
    fs.readFile(file, 'utf8', function (err, data) {
        if (err)
            throw err;
        var content = fm(data);
        console.log(file);
        console.log(content.attributes.title);
    });
};
for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
    var file = files_1[_i];
    _loop_1(file);
}
