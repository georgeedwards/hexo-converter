/// <reference path="typings/index.d.ts" />
import * as fs from 'fs';
import * as fm from 'front-matter';

var files = fs.readdirSync('./content');

for (let file of files) {
  /*fs.readFile(file, 'utf8', function (err, data) {
    if (err) throw err

    var content = fm(data)

    console.log(content)
  })*/
  console.log(file);
}

