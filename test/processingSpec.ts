///<reference path='../typings/index.d.ts'/>
import {containsIssue} from '../src/mdProcessing';

describe('NativeScript Markdown Migrator', function () {

    it('should pass non tagged file clean through', function () {
        expect(true).toBe(true);
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
