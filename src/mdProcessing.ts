/** _______________________________________________________________________________________________
 *  Processed | open_tag | code_start | language_dec | code | code_end | close_tag | toBeProcessed |
 *  _______________________________________________________________________________________________
 *     ...    |{% nat. %}|     ```    |     lang?    | code |    ```   |{% nat. %} | rest of md    |
 */

export function processTag(body: string, open_tag: string, end_tag: string) {
    var processed: string = '';
    var toBeProcessed = body;
    do { //for every code block in tag
        do { // do for every code block in the file
            var solution: FileBreakdown = seperateBody(toBeProcessed, processed, open_tag, end_tag);

            //reconstruct document, first open code block, then fill in code and rest of content
            processed = solution.processed + open_tag + solution.pre_code + '{% codeblock ' + solution.language_dec + ' lang:' + solution.language_dec + ' %}' + solution.code + '{% endcodeblock %}' + solution.after_code + end_tag + solution.toBeProcessed;
            toBeProcessed = solution.toBeProcessed;
        } while (containsIssue(toBeProcessed, open_tag, end_tag));
        var toBeProcessed = processed;
    } while (containsIssue(toBeProcessed, open_tag, end_tag));
    return processed + toBeProcessed;
}

function seperateBody(toBeProcessed: string, processed: string, open_tag: string, end_tag: string): FileBreakdown {
    var search_index: number = toBeProcessed.search(open_tag);
    processed = processed + toBeProcessed.substr(0, search_index);

    //substring of everything past the position of the open_tag, until the end_tag
    var inside_tag = toBeProcessed.substr(search_index + open_tag.length, toBeProcessed.substr(search_index + open_tag.length).search(end_tag));
    var pre_code = inside_tag.substring(inside_tag.search('```'), inside_tag.substring(inside_tag.search('```')).search('```'));

    if (inside_tag.substr(0, search_index).search('```') !== -1) {
        var language_dec_onwards = inside_tag.substr(inside_tag.substr(0, search_index).search('```') + 3);
        var language_dec = getLanguage(language_dec_onwards);
        var code = language_dec_onwards.substr(language_dec.length, language_dec_onwards.search('```') - language_dec.length);

        // see if there are more code blocks between end of code and end of tag
        var after_code = language_dec_onwards.substr(language_dec_onwards.search('```') + 3);
    }

    // Must be relative to something not based on language_dec_onwards <- as it's only in the current tag
    toBeProcessed = toBeProcessed.substr(toBeProcessed.search(end_tag) + end_tag.length);

    //var solution = new fileBreakdown;
    var solution = {
        processed: processed,
        toBeProcessed: toBeProcessed,
        language_dec: language_dec,
        code: code,
        pre_code: pre_code,
        after_code: after_code
    };
    return solution;
}

export function containsIssue(body: string, open_tag: string, end_tag: string): boolean {
    while (body.search(open_tag) !== -1) {
        var search_index: number = body.search(open_tag);
        //if there aren't any specialist tage, then return no errors
        //substring of everything past the position of the search term (+18 - it's length)
        var code_start_onwards = body.substr(search_index + open_tag.length);
        var end_tag_pos = code_start_onwards.search(end_tag);
        var code_block_pos = code_start_onwards.search('```');
        var tag_contains_code = (end_tag_pos > code_block_pos && end_tag_pos !== -1 && code_block_pos !== -1);
        if (tag_contains_code) { return true; } //if the tag contains code, return the function to say there's an issue
        body = body.substring(search_index + open_tag.length); // look at code past the tag we've just checked
    }
    return false; //if there aren't any specialist tage, then return no errors
}

export function getLanguage(language_dec_onwards: string) {
    var language_dec_onwardsChars = language_dec_onwards.split(''); //convert string to array
    // Look for if there is content or newline after
    if (language_dec_onwardsChars[0] === '\n') {
        //no language declared
        console.log('No Langauge');
        return '';
    } else {
        var language_dec: string;
        //for each string character
        for (var i = 0; i < 15; i++ && language_dec === undefined) {
            if (language_dec_onwardsChars[i] === '\n' || language_dec_onwardsChars[i] === '\r') { //if it's a new line character
                language_dec = language_dec_onwards.substr(0, i); //set the language as everything before the new line
                return language_dec;
            }
        }
    }
    return language_dec;
}

class FileBreakdown {
    processed: string;
    toBeProcessed: string;
    language_dec: string;
    code: string;
    pre_code: string;
    after_code: string;
}
