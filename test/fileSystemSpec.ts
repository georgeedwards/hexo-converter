///<reference path='../typings/index.d.ts'/>

import {getFiles, writeFile, emptyOutput} from '../src/fsUtils';

describe('File System', function () {

    it('should read file path', function () {
        var _files: Array<string> = [];
        var files = getFiles('./test/test_content', _files);
        var fileShort: Array<string> = [];
        for (let file of files) {
            file.substr(file.length - 24);
            console.log(file);
        }
        expect(getFiles('./test/test_content', _files)).toContain('./test/test_content/no_tags.ts');
    });

    it('should write file to output dir', function () {
        emptyOutput();
        writeFile('test123', 'content/test.md');
        var _files: Array<string> = [];
        console.log('Files: ' + getFiles('./output', _files));
        expect(getFiles('./output', _files)).toContain('./output/content/test.md');
        emptyOutput();
    });

    it('should empty the output directory', function() {
        writeFile('test123', 'content/test.md');
        emptyOutput();
        var _files: Array<string> = [];
        expect(getFiles('./output', _files)).toEqual([]);
    });

});
