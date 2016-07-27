///<reference path='../typings/index.d.ts'/>
var fsUtils = require('../src/fsUtils');

/*
export function getFiles(path: string, files: Array<string>) {
    fs.readdirSync(path).forEach(function (file) {
        var subpath = path + '/' + file;
        if (fs.lstatSync(subpath).isDirectory()) {
            getFiles(subpath, files);
        } else {
            files.push(path + '/' + file);
        }
    });
}
*/
describe('File System', function () {

    it('should read file path', function () {
        var files = fsUtils.getFiles('./test/testcontent');
        var fileShort: Array<string> = [];
        for (let file of files) {
            file.substr(file.length - 24);
            console.log(file);
        }
        expect(fsUtils.getFiles('./test/testcontent')).toContain('./');
    });

});
