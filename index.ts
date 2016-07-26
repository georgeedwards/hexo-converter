/// <reference path="typings/index.d.ts" />
import * as fs from 'fs';
import {processTag, containsIssue} from './mdProcessing';
var fm = require('front-matter');
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
function getFiles(path: string, files: Array<string>) {
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

function writeFile(_content: frontMatter, fileName: string) {
    var directory = "./output/" + fileName.substring(0, fileName.indexOf("/"));
    var _fileName = directory + fileName.substring(fileName.indexOf("/"));

    createDirectories(directory);
    var meta = "---\ntitle: " + _content.attributes.title + "\ndescription: " + _content.attributes.description + "\n---\n";
    var content = processBodyContent(meta, _content.body);
    fs.writeFileSync(_fileName, content)
}

/** _______________________________________________________________________________________________
 *  Processed | open_tag | code_start | language_dec | code | code_end | close_tag | toBeProcessed |
 *  _______________________________________________________________________________________________
 *     ...    |{% nat. %}|     ```    |     lang?    | code |    ```   |{% nat. %} | rest of md    |
 */
function processBodyContent(fm: string, body: string): string {
    var processed = fm;
    var open_tag = "{% nativescript %}";
    
    if (containsIssue(body, open_tag)) {
        // Tag doesn't exist
        processed = processed + body;
    } else {
        //tag does exist
        processed = processTag(body, open_tag);
    }
    return processed;
}
