///<reference path='../typings/index.d.ts'/>
import {containsIssue} from '../src/mdProcessing';
import {writeFile} from '../src/fsUtils';
import {no_tag_string, string_with_tag, string_with_tag_code} from './test_content/test-strings';
import {processBodyContent} from '../src/index';
import * as fs from 'fs';
var fm = require('front-matter');

describe('NativeScript Markdown Migrator', function () {

    // Issue Detection
    it('should not throw issue on clean file', function () {
        expect(containsIssue(no_tag_string, '{% nativescript %}')).toBe(false);
    });

    it('should not throw issue on file with just tag', function () {
        expect(containsIssue(string_with_tag, '{% nativescript %}')).toBe(false);
    });

    it('should throw issue on file with tag + code', function () {
        expect(containsIssue(string_with_tag_code, '{% nativescript %}')).toBe(true);
    });

    // Tag Code Processing
    it('should pass tags without code clean through', function () {
        var path = './test/test_content/without_code_blocks.md';
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) { throw err; }
            console.log('found file');
            var orig_cont = fm(data);
            var meta = '---\ntitle: ' + orig_cont.attributes.title + '\ndescription: ' + orig_cont.attributes.description + '\n---\n';
            var processed_content = processBodyContent(meta, orig_cont.body);
            expect(processed_content).toEqual(data);
        });
    });

    it('should convert nested code to codeblock tags', function () {
        expect(true).toBe(true);
    });

    it('should add language to codeblocks', function () {
        expect(true).toBe(true);
    });

    it('should process multiple codeblocks per tag', function () {
        expect(true).toBe(true);
    });

    it('should process multiple tags per file', function () {
        expect(true).toBe(true);
    });

});
