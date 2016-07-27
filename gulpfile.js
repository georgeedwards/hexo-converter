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
var cover = require('gulp-coverage');

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

gulp.task('test', 'Runs the Jasmine test specs', ['build'], function () {
  return gulp.src('lib/test/*.js')
    .pipe(jasmine())
});

gulp.task('jasmine', function () {
  return gulp.src('lib/test/*.js')
    .pipe(cover.instrument({
      pattern: ['lib/src/*.js'],
      debugDirectory: 'debug'
    }))
    .pipe(jasmine())
    .pipe(cover.gather())
    .pipe(cover.format())
    .pipe(gulp.dest('reports'));
});

gulp.task('watch', 'Watches ts source files and runs build on change', function () {
  gulp.watch('src/**/*.ts', ['build']);
});
