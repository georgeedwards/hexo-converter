"use strict";
/// <reference path="typings/index.d.ts" />
var fs = require('fs');
var fm = require('front-matter');
var mkpath = require('mkpath');
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
var _loop_1 = function(path_1) {
    fs.readFile(path_1, 'utf8', function (err, data) {
        if (err)
            throw err;
        var content = fm(data);
        console.log(path_1);
        //console.log(content.attributes.title);
        var substring = "/content";
        var fileName = path_1.substring(9); //extract the file name from root ./content
        //console.log("FileName: " + fileName);
        writeFile(content, fileName);
    });
};
for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
    var path_1 = files_1[_i];
    _loop_1(path_1);
}
function writeFile(_frontMatter, fileName) {
    var directory = "./output/" + fileName.substring(0, fileName.indexOf("/"));
    var _fileName = directory + fileName.substring(fileName.indexOf("/"));
    console.log("Dir:" + directory);
    console.log("File: " + _fileName);
    createDirectories(directory);
    var content = "---\ntitle: " + _frontMatter.attributes.title + "\ndescription: " + _frontMatter.attributes.description + "\n---";
    //console.log("Content: " + content);
    fs.writeFileSync(_fileName, content);
}
function createDirectories(fileName) {
    var directory = "output/" + fileName.substring(0, fileName.indexOf("/"));
    //create directory
    mkpath(directory, function (err) {
        if (err)
            throw err;
        console.log(directory + ' directory created');
    });
}
