/** _______________________________________________________________________________________________
 *  Processed | open_tag | code_start | language_dec | code | code_end | close_tag | toBeProcessed |
 *  _______________________________________________________________________________________________
 *     ...    |{% nat. %}|     ```    |     lang?    | code |    ```   |{% nat. %} | rest of md    |
 */
"use strict";
function processTag(body, open_tag) {
    var processed;
    var search_index = body.search(open_tag);
    var code_start_onwards = body.substr(search_index + 18); //substring of everything past the position of the search term (+18 - it's length)
    var language_dec_onwards = code_start_onwards.substr(code_start_onwards.substr(0, search_index).search("```") + 3); // skip past backticks
    var language_dec = getLanguage(language_dec_onwards);
    var code = language_dec_onwards.substr(language_dec.length, language_dec_onwards.search("```") - language_dec.length);
    var toBeProcessed = language_dec_onwards.substr(language_dec_onwards.search("{% endnativescript %}") + 21);
    processed = processed + open_tag + "{% codeblock lang:" + language_dec + " %}" + code + "{% endcodeblock %}" + "{% endnativescript %}" + toBeProcessed;
    return processed;
}
exports.processTag = processTag;
function containsIssue(body, open_tag) {
    while (body.search(open_tag) != -1) {
        var search_index = body.search(open_tag);
        //if there aren't any specialist tage, then return no errors
        var code_start_onwards = body.substr(search_index + open_tag.length); //substring of everything past the position of the search term (+18 - it's length)
        var tag_contains_code = code_start_onwards.search("{% endnativescript %}") < code_start_onwards.search("```");
        if (tag_contains_code) {
            return true;
        } //if the tag contains code, return the function to say there's an issue
        body = body.substring(search_index); // look at code past the tag we've just checked
    }
    return false; //if there aren't any specialist tage, then return no errors
}
exports.containsIssue = containsIssue;
function getLanguage(language_dec_onwards) {
    var language_dec_onwardsChars = language_dec_onwards.split(""); //convert string to array
    // Look for if there is content or newline after
    if (language_dec_onwardsChars[0] == "/n") {
        //no language declared
        console.log("No Langauge");
    }
    else {
        var language_dec;
        //for each string character
        for (var i = 0; i < 15; i++ || language_dec != undefined) {
            if (language_dec_onwardsChars[i] == "\n") {
                language_dec = language_dec_onwards.substr(0, i); //set the language as everything before the new line
            }
        }
    }
    return language_dec;
}
