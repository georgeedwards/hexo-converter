/** _______________________________________________________________________________________________
 *  Processed | open_tag | code_start | language_dec | code | code_end | close_tag | toBeProcessed |
 *  _______________________________________________________________________________________________
 *     ...    |{% nat. %}|     ```    |     lang?    | code |    ```   |{% nat. %} | rest of md    |
 */

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
    lang_dec: string;
    code: string;
    pre_code: string;
    post_code: string;
}

export function processTag(toBeProcessed: string, open_tag: string, close_tag: string): string {
    var processed: string = '';

    do {

        var pre_tag = toBeProcessed.substr(0, toBeProcessed.search(open_tag));

        //var afterOpenTag = toBeProcessed.substr(toBeProcessed.search(open_tag) + open_tag.length);
        var inside_tag = toBeProcessed.substr(toBeProcessed.search(open_tag) + open_tag.length, toBeProcessed.substr(toBeProcessed.search(open_tag) + open_tag.length).search(close_tag));
        var containsCode = (inside_tag.search('```') !== -1);
        if (toBeProcessed.search(open_tag) === -1) {
            processed = processed + toBeProcessed;
            return processed;
        }
        if (containsCode) {
            //do {
            var tag_contents = insideTag(inside_tag);
            processed = processed + pre_tag + open_tag + tag_contents + close_tag;
            //} while (tag_contents.post_code.search('```') !== -1);
        } else {
            processed = processed + pre_tag + open_tag + inside_tag + close_tag;
        }
        if (toBeProcessed.search(close_tag) === -1) { // no more tags
            processed = processed + toBeProcessed;
            toBeProcessed = '';
        } else { //to be processed should be trimmed to start just beyond the just processed tag
            toBeProcessed = toBeProcessed.substr(toBeProcessed.search(close_tag) + close_tag.length);
        }
    } while (toBeProcessed.length !== 0);
    return processed;
}

function insideTag(inside_tag: string) {
    var results = interpretTag(inside_tag);
    var result = results.pre_code + '\r\n{% codeblock ' + results.lang_dec + ' lang:' + results.lang_dec + ' %}' + results.code + '{% endcodeblock %}\r\n';
    if (results.post_code.search('```') !== -1) {
        do {
            var next_result = interpretTag(results.post_code);
            result = result + next_result.pre_code + '{% codeblock ' + next_result.lang_dec + ' lang:' + next_result.lang_dec + ' %}' + next_result.code + '{% endcodeblock %}';
        } while (results.post_code.search('```') !== -1 && next_result.post_code.search('```') !== -1);
        results.post_code = next_result.post_code;
    }
    result = result + results.post_code;
    return result;
}

function interpretTag(inside_tag: string) {
    var results: FileBreakdown = new FileBreakdown;
    results.pre_code = inside_tag.substring(inside_tag.search('```'), inside_tag.substring(inside_tag.search('```')).search('```'));
    var language_dec_onwards = inside_tag.substr(inside_tag.search('```') + 3);
    results.lang_dec = getLanguage(language_dec_onwards);
    results.code = language_dec_onwards.substr(results.lang_dec.length, language_dec_onwards.search('```') - results.lang_dec.length);
    results.post_code = language_dec_onwards.substr(language_dec_onwards.search('```') + 3);
    return results;
}
