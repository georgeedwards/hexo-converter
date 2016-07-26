/// <reference path="typings/index.d.ts" />
import * as fs from 'fs';
import * as fm from 'front-matter';
import * as mkpath from 'mkpath';
var path = 'content/'
var files = []


var getFiles = function (path, files) {
    fs.readdirSync(path).forEach(function (file) {
        var subpath = path + '/' + file;
        if (fs.lstatSync(subpath).isDirectory()) {
            getFiles(subpath, files);
        } else {
            files.push(path + '/' + file);
        }
    });
}

getFiles(path, files);

for (let path of files) {

    fs.readFile(path, 'utf8', function (err, data) {
        if (err) throw err

        var content = fm(data)

        console.log(path)
        //console.log(content.attributes.title);

        var substring = "/content";
        var fileName = path.substring(9) //extract the file name from root ./content
        //console.log("FileName: " + fileName);
        writeFile(content, fileName);
    })
}


function writeFile(_frontMatter: frontMatter, fileName: string) {
    var directory = "./output/" + fileName.substring(0, fileName.indexOf("/"));
    var _fileName = directory + fileName.substring(fileName.indexOf("/"));
    console.log("Dir:" +  directory);
    console.log("File: " + _fileName);
    createDirectories(directory);
    var content = "---\ntitle: " + _frontMatter.attributes.title + "\ndescription: " + _frontMatter.attributes.description + "\n---";
    //console.log("Content: " + content);
    fs.writeFileSync(_fileName, content)
}

interface frontMatter {
    attributes: fmAttributes;
    body: string;
    frontmatter: string;
}

interface fmAttributes {
    title: string;
    description: string;
}

function createDirectories(fileName: string) {
    var directory = "output/" + fileName.substring(0, fileName.indexOf("/"));
    //create directory
    mkpath(directory, function (err) {
        if (err) throw err;
        console.log(directory + ' directory created');
    });
}