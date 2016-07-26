/// <reference path="typings/index.d.ts" />
import * as fs from 'fs';
var fm = require ('front-matter');
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
    var search_index: number = body.search(open_tag);
    if (search_index == -1) { // Tag doesn't exist
        processed = processed + body;
    } else { //tag does exist
        //console.log(search_index);
        var code_start_onwards = body.substr(search_index + 18); //substring of everything past the position of the search term (+18 - it's length)
        if (code_start_onwards.search("{% endnativescript %}") < code_start_onwards.search("```")) { //if there is a ``` before the end of the nativescript block
            //not code block in tag
            //console.log("No Block");
            processed = processed + body;
        } else {
            var language_dec_onwards = code_start_onwards.substr(code_start_onwards.substr(0, search_index).search("```") + 3); // skip past backticks
            var language_dec_onwardsChars = language_dec_onwards.split(""); //convert string to array
            // Look for if there is content or newline after
            if (language_dec_onwardsChars[0] == "/n") {
                //no language declared
                console.log("No Langauge");
            } else {
                var language_dec: string;
                //for each string character
                for (var i = 0; i < 15; i++ || language_dec != undefined) {
                    if (language_dec_onwardsChars[i] == "\n"){ //if it's a new line character
                        language_dec = language_dec_onwards.substr(0,i); //set the language as everything before the new line
                    }
                }
            }
            var code = language_dec_onwards.substr(language_dec.length, language_dec_onwards.search("```") - language_dec.length);
            var toBeProcessed = language_dec_onwards.substr(language_dec_onwards.search("{% endnativescript %}") + 21 );
            processed = processed + open_tag + "{% codeblock lang:" + language_dec +" %}" + code + "{% endcodeblock %}" + "{% endnativescript %}" + toBeProcessed;
        }
    }
    return processed;
}
