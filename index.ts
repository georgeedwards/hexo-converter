/// <reference path="typings/index.d.ts" />
import * as fs from 'fs';
import * as fm from 'front-matter';
var path = 'content/'
var files = []


var getFiles = function(path, files){
    fs.readdirSync(path).forEach(function(file){
        var subpath = path + '/' + file;
        if(fs.lstatSync(subpath).isDirectory()){
            getFiles(subpath, files);
        } else {
            files.push(path + '/' + file);
        }
    });     
}

getFiles(path, files);

for (let file of files) {

  fs.readFile(file, 'utf8', function (err, data) {
    if (err) throw err

    var content = fm(data)

    console.log(file)
    console.log(content.attributes.title);
  })
}

