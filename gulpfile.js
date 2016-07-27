var gulp = require('gulp');
var tslint = require('gulp-tslint');
var exec = require('child_process').exec;
var jasmine = require('gulp-jasmine');
var gulp = require('gulp-help')(gulp);
var tsconfig = require('gulp-tsconfig-files');
var path = require('path');
var inject = require('gulp-inject');
var gulpSequence = require('gulp-sequence');
var del = require('del');
var dtsGenerator = require('dts-generator');
require('dotbin');

var istanbul = require('gulp-istanbul');
var remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');

var tsFilesGlob = (function (c) {
  return c.filesGlob || c.files || '**/*.ts';
})(require('./tsconfig.json'));

var appName = (function (p) {
  return p.name;
})(require('./package.json'));

gulp.task('update-tsconfig', 'Update files section in tsconfig.json', function () {
  gulp.src(tsFilesGlob).pipe(tsconfig());
});

gulp.task('clean', 'Cleans the generated js files from lib directory', function () {
  return del([
    'lib/**/*'
  ]);
});

gulp.task('tslint', 'Lints all TypeScript source files', function () {
  return gulp.src(tsFilesGlob)
    .pipe(tslint({
      formatter: "verbose"
    }))
    .pipe(tslint.report())
});

gulp.task('gen-def', 'Generate a single .d.ts bundle containing external module declarations exported from TypeScript module files', function (cb) {
  return dtsGenerator.default({
    name: appName,
    project: '.',
    out: './lib/' + appName + '.d.ts',
    exclude: ['node_modules/**/*.d.ts', 'typings/**/*.d.ts']
  });
});

gulp.task('_build', 'INTERNAL TASK - Compiles all TypeScript source files', function (cb) {
  exec('tsc --version', function (err, stdout, stderr) {
    console.log('TypeScript ', stdout);
    if (stderr) {
      console.log(stderr);
    }
  });

  return exec('tsc', function (err, stdout, stderr) {
    console.log(stdout);
    if (stderr) {
      console.log(stderr);
    }
    cb(err);
  });
});

//run tslint task, then run update-tsconfig and gen-def in parallel, then run _build
gulp.task('build', 'Compiles all TypeScript source files and updates module references', function (callback) {
  gulpSequence('tslint', ['update-tsconfig', 'gen-def'], '_build')(callback);
});

gulp.task('test', ['test:instrument'], function() {
  return gulp.src('./lib/test/*.js') //take our transpiled test source
    .pipe(jasmine()) //runs tests
    .pipe(istanbul.writeReports({
      reporters: ['json', 'html'] //this yields a basic non-sourcemapped coverage.json file
    })).on('end', remapCoverageFiles); //perform a remap
});

gulp.task('watch', 'Watches ts source files and runs build on change', function () {
  gulp.watch('src/**/*.ts', ['build']);
});

gulp.task('test:instrument', ['build'], function() {
    return gulp.src('./lib/src/*.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire()); //this forces any call to 'require' to return our instrumented files
});

//using remap-istanbul we can point our coverage data back to the original ts files
function remapCoverageFiles() {
  return gulp.src('./coverage/coverage-final.json')
    .pipe(remapIstanbul({
      basePath: './lib/src',
      reports: {
        'html': './coverage',
        'text-summary': null,
        'lcovonly': './coverage/lcov.info'
      }
    }));
}