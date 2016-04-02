/*
 * Main Gulpfile for Laravel projects
 * Cyber-Duck Ltd - www.cyber-duck.co.uk
 */

var gulp = require('gulp'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    minify = require('gulp-cssnano'),
    imageop = require('gulp-image-optimization'),
    rename = require("gulp-rename"),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    sync = require('browser-sync').create();
    //watch = require('gulp-watch'),



/*
 * Main configuration object
 */
var config = {
    scssDir: './resources/assets/scss',
    jsSrc: './resources/assets/js',
    jsDest: './public/assets/js',
    cssDir: './public/assets/css',
    tplDir: './resources/views',
    imgSrc: './public/assets/img'
};



/*
 * Compile Sass for development
 * with sourcemaps and not minified
 */
gulp.task('style-dev', function () {
    'use strict';
    return gulp.src(config.scssDir + '/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(config.cssDir))
        .pipe(sync.stream());
});



/*
 * Compile Sass for production
 * with no sourcemaps and minified
 */
gulp.task('style', function () {
    'use strict';
    return gulp.src(config.scssDir + '/*.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
        .pipe(minify())
        .pipe(gulp.dest(config.cssDir));
});



/*
 * Concatenate JS files
 */
gulp.task('js', function () {
    'use strict';
    return gulp.src([
        config.jsSrc + '/src/start.js',
        config.jsSrc + '/src/main.js',
        config.jsSrc + '/src/end.js'
    ])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(config.jsDest));
});



/*
 * Compress and rename JS files
 */
gulp.task('compress', ['js'], function () {
    'use strict';
    return gulp.src(config.jsDest + '/scripts.js')
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.jsDest));
});


/*
 * Clean non used JS files, and sourcemaps for production
 */
gulp.task('clean', ['style', 'compress'], function () {
    'use strict';
    del(config.cssDir + '/maps/*');
    del(config.cssDir + '/maps/');
    del(config.jsDest + '/scripts.js');
});



/*
 * Optimise images uploaded in the CMS
 */
gulp.task('imgoptim', function (cb) {
    'use strict';
    return gulp.src([
        config.imgSrc + '/**/*.png',
        config.imgSrc + '/**/*.jpg',
        config.imgSrc + '/**/*.gif',
        config.imgSrc + '/**/*.jpeg'
    ])
        .pipe(imageop({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(config.imgSrc)).on('end', cb).on('error', cb);
});



/*
 * Production task
 * Compiles Sass with no sourcemaps, minifies CSS
 * Compress JS
 * Clean sourcemaps and uncompressed JS
*/
gulp.task('build', function () {
    'use strict';
    gulp.start('style');
    gulp.start('compress');
    gulp.start('clean');
});



/*
 * Reload task for JS files used by BrowserSync
 */
gulp.task('js-sync', ['js'], function () {
    'use strict';
    sync.reload();
});



/*
 * BrowserSync task, contains watchers for Sass, JS and Templates
 */
gulp.task('browsersync', ['style-dev', 'js'], function () {
    'use strict';
    sync.init({
        proxy: "domain.dev",
        browser: "google chrome"
    });
    gulp.watch(config.tplDir + '/**/*.{php|twig}').on('change', sync.reload);
    gulp.watch(config.scssDir + '/**/*.scss', ['style-dev']);
    gulp.watch(config.jsDir + '/src/*.js', ['js-sync']);
});



/*
 * Development mode, watching for changes
 * This mode creates non compressed CSS, non compressed JS
 * and creates sourcemaps.
*/
// gulp.task('watch', function () {
//     'use strict';
//     // Development task for compiling Sass
//     watch(config.scssDir + '/**/*.scss', function () {
//         gulp.start('style-dev');
//     });

//     // Concatenating JS files, but not compressing
//     watch(config.jsDir + '/src/*.js', function () {
//         gulp.start('js');
//     });
// });



/*
 * Default task, runs the build task
 */
gulp.task('default', ['build']);
