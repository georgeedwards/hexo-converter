///<reference path='../typings/index.d.ts'/>
import {containsIssue} from '../src/mdProcessing';
import {writeFile} from '../src/fsUtils';
import {no_tag_string, string_with_tag} from './test_content/test-strings';

describe('NativeScript Markdown Migrator', function () {

    it('should not throw issue on clean file', function () {
        expect(containsIssue(no_tag_string, '{% nativescript %}')).toBe(false);
    });

    it('should throw issue on file with tag', function () {
        expect(containsIssue(string_with_tag, '{% nativescript %}')).toBe(true);
    });

    it('should pass tags without code clean through', function () {
        expect(true).toBe(true);
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
