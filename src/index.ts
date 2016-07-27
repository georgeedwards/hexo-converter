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


/** _______________________________________________________________________________________________
 *  Processed | open_tag | code_start | language_dec | code | code_end | close_tag | toBeProcessed |
 *  _______________________________________________________________________________________________
 *     ...    |{% nat. %}|     ```    |     lang?    | code |    ```   |{% nat. %} | rest of md    |
 */
function processBodyContent(fm: string, body: string): string {
    var processed = fm;
    var open_tag = '{% nativescript %}';

    if (containsIssue(body, open_tag)) {
        // Tag doesn't exist
        processed = processed + body;
    } else {
        //tag does exist
        processed = processTag(body, open_tag);
    }
    return processed;
}
