/// <reference path='../typings/index.d.ts' />
import * as fs from 'fs';
import {processTag, containsIssue} from './mdProcessing';
import {getFiles, writeFile} from './fsUtils';
var fm = require('front-matter');
var path = './content/';
var files: Array<string> = [];
files = getFiles(path, files);

for (let path of files) {

    fs.readFile(path, 'utf8', function (err, data) {
        if (err) { throw err; }

        var orig_cont = fm(data);

        console.log(path);
        //console.log(content.attributes.title);

        var substring = '/content';
        var fileName = path.substring(9); //extract the file name from root ./content
        var meta = '---\ntitle: ' + orig_cont.attributes.title + '\ndescription: ' + orig_cont.attributes.description + '\n---\n';
        var processed_content = processBodyContent(meta, orig_cont.body);
        writeFile(processed_content, fileName);
    });
}

var target_tags: Array<Array<string>> = [
    ['{% nativescript %}', '{% endnativescript %}'],
    ['{% angular %}', '{% endangular %}']
];

/** _______________________________________________________________________________________________
 *  Processed | open_tag | code_start | language_dec | code | code_end | close_tag | toBeProcessed |
 *  _______________________________________________________________________________________________
 *     ...    |{% nat. %}|     ```    |     lang?    | code |    ```   |{% nat. %} | rest of md    |
 */
export function processBodyContent(fm: string, body: string): string {
    var processed: string;
    //for (let tag of target_tags) {
    for (let tag of target_tags) {
        var open_tag = tag[0];
        var end_tag = tag[1];
        console.log(tag[0], tag[1]);
        var issue = containsIssue(body, open_tag, end_tag);
        if (issue) {
            // Tag does exist with code
            //processed = processTag(body, open_tag, end_tag);
            processed = processTag(body, open_tag, end_tag);
        } else {
            //tag and code combination doesn't exist
            processed = body;
        }
        body = processed;
    }
    return fm + processed;
}
