/// <reference path='../typings/index.d.ts' />
var fm = require('front-matter');
import * as fs from 'fs';

export function getFiles(path: string): Array<string> {
    var files: Array<string> = [];
    fs.readdirSync(path).forEach(function (file) {
        var subpath = path + '/' + file;
        if (fs.lstatSync(subpath).isDirectory()) {
            getFiles(subpath);
        } else {
            files.push(path + '/' + file);
        }
    });
    return files;
}

function createDirectories(fileName: string): void {
    var directory = 'output/' + fileName.substring(0, fileName.indexOf('/'));
    //create directory
    try {
        fs.mkdirSync(fileName);
    } catch (e) {
        //file probably already exist 
    }
}

export function writeFile(content: string, fileName: string) {
    //extract the destination
    var directory = './output/' + fileName.substring(0, fileName.indexOf('/'));
    //add the file name to the path
    var _fileName = directory + fileName.substring(fileName.indexOf('/'));

    createDirectories(directory); //ensure the directory exists

    fs.writeFileSync(_fileName, content);
}
