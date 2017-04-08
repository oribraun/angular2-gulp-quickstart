/**
 * Created by private on 01/04/2017.
 */
var main_folder = './src/';

var gulp = require('gulp');
var webserver = require('gulp-webserver');
var less = require('gulp-less');
var inject = require('gulp-inject');
var minify = require('gulp-minify');
var clean = require('gulp-clean');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const tscConfig = require('./src/tsconfig.json');

var jsFiles = 'includes/js/*.js';
var tsFiles = '/includes/ts/*.ts';
var lessFiles = 'includes/less/*.less';
var jsDest = 'public/js';
var tsDest = 'public/ts';
var cssDest = 'public/css';

gulp.task('hello-world',function(){
    console.log('our first hello world gulp task!');
});

gulp.task('index-inject', function () {
    var target = gulp.src(main_folder + 'index.html');
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    //var sources = gulp.src(['./src/**/*.js', './src/**/*.css'], {read: false});
    //var sources = gulp.src([main_folder + jsDest + '/*.js', main_folder + cssDest + '/*.css'], {read: false});
    var sources = gulp.src([__dirname + '/' + main_folder + jsDest + '/*.js', __dirname + '/' + main_folder + cssDest + '/*.css'], {read: false, cwd : __dirname + '/src/'});

    return target.pipe(inject(sources))
        .pipe(gulp.dest(main_folder));
});

gulp.task('js-compress', function() {
    gulp.src(main_folder + jsDest + '/*.js').pipe(clean());
    gulp.src(main_folder + jsFiles)
        .pipe(minify({
            ext:{
                //src:'-debug.js',
                min:'.min.js'
            },
            noSource : true,
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest(main_folder + jsDest))
});

gulp.task('webserver', function() {
    gulp.src([main_folder])
        .pipe(webserver({
            port: 9090,
            livereload: true,
            open: true,
            fallback : 'index.html'
        }));
});
gulp.task('less', function() {
    gulp.src(main_folder + cssDest + '/*.css').pipe(clean());
    gulp.src(main_folder + lessFiles)
        .pipe(less())
        .pipe(gulp.dest(main_folder + cssDest));
        //.pipe(webserver.reload());
});
gulp.task('clean', function () {
    gulp.src('public/ts').pipe(clean());
});

gulp.task('compile-typescript', ['clean'], function () {
    return gulp.src(main_folder + tsFiles)
        .pipe(sourcemaps.init())
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(main_folder + tsDest));
});
//
gulp.task('copy:libs', function() {
    gulp.src('src/public/libs').pipe(clean());
    return gulp.src([
        //'core-js/client/shim.min.js',
        //'zone.js/dist/zone.js',
        //'systemjs/dist/system.src.js',
        //'@angular/core/bundles/core.umd.js',
        //'@angular/common/bundles/common.umd.js',
        //'@angular/compiler/bundles/compiler.umd.js',
        //'@angular/platform-browser/bundles/platform-browser.umd.js',
        //'@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
        //'@angular/http/bundles/http.umd.js',
        //'@angular/router/bundles/router.umd.js',
        //'@angular/forms/bundles/forms.umd.js',
        //'@angular/reflect-metadata/',
        //'rxjs/**',
        //'angular-in-memory-web-api/bundles/in-memory-web-api.umd.js'
    ],{cwd: "node_modules/**/"})
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('src/public/lib'))
});
//gulp.task('copy:libs', function() {
//    gulp.src('src/public/libs').pipe(clean());
//    return gulp.src([
//        'core-js/client/shim.min.js',
//        'zone.js/dist/zone.js',
//        'systemjs/dist/system.src.js',
//        '@angular/**',
//        'rxjs/**',
//        'angular-in-memory-web-api/**',
//        //'node_modules/angular2/bundles/angular2-polyfills.js',
//        //'node_modules/systemjs/dist/system.js',
//        //'node_modules/systemjs/dist/system.src.js',
//        //'node_modules/systemjs/dist/system.src.js.map',
//        //'node_modules/rxjs/bundles/Rx.js',
//        //'node_modules/angular2/bundles/angular2.dev.js',
//        //'node_modules/es6-shim/es6-shim.js',
//        //'node_modules/angular2/bundles/http.dev.js',
//        //'node_modules/typescript/lib/typescript.js',
//        //'node_modules/angular2/bundles/http.dev.js',
//        //'node_modules/angular2/bundles/router.dev.js'
//    ],{cwd: "node_modules/**/**"})
//        .pipe(sourcemaps.init())
//        .pipe(sourcemaps.write('.'))
//        .pipe(gulp.dest('src/public/lib'))
//});
gulp.task('watch-less', function() {
    gulp.watch(lessFiles, ['less']);
})
gulp.task('watch-css-new-files', function() {
    gulp.watch(cssDest + '/*.css', ['index-inject']);
})
gulp.task('watch-new-js-files',function(){
    gulp.watch(jsFiles, ['js-compress']);
})
gulp.task('watch-new-min-js-files',function(){
    gulp.watch(jsDest + '/*.js', ['index-inject']);
})

gulp.task('default',
    [
        'webserver',
        'less',
        'watch-less',
        'watch-css-new-files',
        'index-inject',
        'js-compress',
        'watch-new-js-files',
        'watch-new-min-js-files',
        'copy:libs',
        'compile-typescript'
    ]);
