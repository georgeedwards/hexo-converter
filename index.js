"use strict";
/// <reference path="typings/index.d.ts" />
var fs = require('fs');
var fm = require('front-matter');
var path = 'content/';
var files = [];
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
function getFiles(path, files) {
    fs.readdirSync(path).forEach(function (file) {
        var subpath = path + '/' + file;
        if (fs.lstatSync(subpath).isDirectory()) {
            getFiles(subpath, files);
        }
        else {
            files.push(path + '/' + file);
        }
    });
}
function createDirectories(fileName) {
    var directory = "output/" + fileName.substring(0, fileName.indexOf("/"));
    //create directory
    try {
        fs.mkdirSync(fileName);
    }
    catch (e) {
    }
}
function writeFile(_content, fileName) {
    var directory = "./output/" + fileName.substring(0, fileName.indexOf("/"));
    var _fileName = directory + fileName.substring(fileName.indexOf("/"));
    createDirectories(directory);
    var meta = "---\ntitle: " + _content.attributes.title + "\ndescription: " + _content.attributes.description + "\n---\n";
    var content = processBodyContent(meta, _content.body);
    fs.writeFileSync(_fileName, content);
}
function processBodyContent(fm, body) {
    var final_content = fm;
    var search_index = body.search("{% nativescript %}");
    if (search_index == -1) {
        final_content = final_content + body;
    }
    else {
        console.log(search_index);
        final_content = final_content + body.substr(0, search_index);
    }
    return final_content;
}
