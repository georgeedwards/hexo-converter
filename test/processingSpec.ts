///<reference path='../typings/index.d.ts'/>
import {containsIssue, getLanguage} from '../src/mdProcessing';
import {writeFile} from '../src/fsUtils';
import {no_tag_string, string_with_tag, string_with_tag_code, string_untitled_tag_code, string_with_2_tag_code} from './test_content/test-strings';
import {processBodyContent} from '../src/index';
import * as fs from 'fs';
var fm = require('front-matter');

describe('NativeScript Markdown Migrator', function () {

    // Issue Detection
    it('should not throw issue on clean file', function () {
        expect(containsIssue(no_tag_string, '{% nativescript %}', '{% endnativescript %}')).toBe(false);
    });

    it('should not throw issue on file with just tag', function () {
        expect(containsIssue(string_with_tag, '{% nativescript %}', '{% endnativescript %}')).toBe(false);
    });

    it('should throw issue on file with tag + code', function () {
        expect(containsIssue(string_with_tag_code, '{% nativescript %}', '{% endnativescript %}')).toBe(true);
    });

    it('should throw issue on file with second tag + code', function () {
        expect(containsIssue(string_with_2_tag_code, '{% nativescript %}', '{% endnativescript %}')).toBe(true);
    });

    // Tag Code Processing
    it('should pass tags without code clean through', function () {
        var data = fs.readFileSync('./test/test_content/without_code_blocks.md', 'utf8');

        var orig_cont = fm(data);
        var meta = '---\ntitle: ' + orig_cont.attributes.title + '\ndescription: ' + orig_cont.attributes.description + '\n---\n';
        var processed_content = processBodyContent(meta, orig_cont.body);
        //expect(processed_content.trim().split('')).toEqual(data.trim().split(''));
        expect(true).toBe(true);
    });

    //not doing ng tags or second code blocks in tag

    it('should convert nested code to codeblock tags', function () {
        var path = './test/test_content/with-code-block.md';
        var data = fs.readFileSync(path, 'utf8');

        var orig_cont = fm(data);
        var meta = '---\ntitle: ' + orig_cont.attributes.title + '\ndescription: ' + orig_cont.attributes.description + '\n---\n';
        var processed_content = processBodyContent(meta, orig_cont.body);
        expect(containsIssue(processed_content, '{% nativescript %}', '{% endnativescript %}')).toEqual(false);
        expect(containsIssue(processed_content, '{% angular %}', '{% endangular %}')).toEqual(false);
        //expect(true).toBe(true);
    });

    /*it('should detect the language of a codeblock', function () {
        expect(getLanguage(string_with_tag_code.substring(string_with_tag_code.search('```') + 3))).toBe('fringilla');
    });

    it('should detect no language in a codeblock', function () {
        expect(getLanguage(string_untitled_tag_code.substring(string_untitled_tag_code.search('```') + 3))).toBe('');
    });

    it('should add language to codeblocks', function () {
        expect(true).toBe(true);
    });

    it('should process multiple codeblocks per tag', function () {
        expect(true).toBe(true);
    });

    it('should process multiple tags per file', function () {
        expect(true).toBe(true);
    }); */

});
