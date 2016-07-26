/// <reference path="typings/index.d.ts" />
import * as fs from 'fs';
import * as fm from 'front-matter';
var path = 'content/'
var files: Array<string> = []

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
function getFiles (path: string, files: Array<string>) {
    fs.readdirSync(path).forEach(function (file) {
        var subpath = path + '/' + file;
        if (fs.lstatSync(subpath).isDirectory()) {
            getFiles(subpath, files);
        } else {
            files.push(path + '/' + file);
        }
    });
}

function createDirectories(fileName: string): void {
    var directory = "output/" + fileName.substring(0, fileName.indexOf("/"));
    //create directory
    try {
        fs.mkdirSync(fileName);
    } catch (e) {
        //file probably already exist 
    }
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

function writeFile(_frontMatter: frontMatter, fileName: string) {
    var directory = "./output/" + fileName.substring(0, fileName.indexOf("/"));
    var _fileName = directory + fileName.substring(fileName.indexOf("/"));
    
    createDirectories(directory);
    var content = "---\ntitle: " + _frontMatter.attributes.title + "\ndescription: " + _frontMatter.attributes.description + "\n---";

    fs.writeFileSync(_fileName, content)
}