/*
 * Main Gulpfile for Silverstripe projects
 * Cyber-Duck Ltd - www.cyber-duck.co.uk
 */

const gulp = require('gulp'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    minify = require('gulp-cssnano'),
    imageop = require('gulp-image-optimization'),
    rename = require("gulp-rename"),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    lint = require('gulp-eslint'),
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    babel = require("gulp-babel");
    // sync = require('browser-sync').create()

const pkg = require('./package.json');

/*
 * Main configuration object
 */
const config = {
    scssDir: './public/scss',
    jsSrc: './public/js/src',
    jsDest: './public/js/min',
    cssDir: './public/css',
    tplDir: '',
    imgSrc: ''
};



/*
 * Compile Sass for development
 * with sourcemaps and not minified
 */
gulp.task('style-dev', function () {
    'use strict';
    gulp.src(config.scssDir + '/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(config.cssDir));
        // .pipe(sync.stream());
});



/*
 * Compile Sass for production
 * with no sourcemaps and minified
 */
gulp.task('style', () => {
    'use strict';
    gulp.src(config.scssDir + '/*.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
        .pipe(minify({
            zindex: false, 
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(gulp.dest(config.cssDir));
});



/*
 * Banner for JS file
 */
var topBanner = [
  '/*',
  ' * <%= pkg.name %>',
  ' * <%= pkg.description %>',
  ' * @author <%= pkg.author %>',
  ' * @version v<%= pkg.version %>',
  ' */',
  ' \n',
  '$(document).ready(function () {',
  ' \n'
].join('\n');



/*
 * End of JS file
 */
let date = new Date();
var now = date.getDay() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " @ " + date.getHours() + ":" + date.getMinutes();

var bottomBanner = [
  ' \n',
  '/*',
  ' * Last updated: ' + now,
  ' */',
  ' \n',
  '});'
].join('\n');



/*
 * Concatenate and transpile JS files
 */
gulp.task('js', () => {
    'use strict';
    return gulp.src(config.jsSrc + '/main.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .on('error', function(e) {
            console.log('>>> ERROR', e);
            this.emit('end');
        })
        .pipe(concat('scripts.js'))
        .pipe(header(topBanner, {pkg: pkg}))
        .pipe(footer(bottomBanner))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.jsDest));
});



/*
 * Compress and rename JS files
 */
gulp.task('compress', ['js'], () => {
    'use strict';
    return gulp.src(config.jsDest + '/scripts.js')
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.jsDest));
});


/*
 * Lint JS using ES Lint
 * NOT READY FOR USE
 */
// gulp.task('lint', () => {
//     return gulp.src(config.jsDest + '/scripts.js')
//         .pipe(lint.format())
//         .pipe(lint.failAfterError());
// });


/*
 * Clean non used JS files, and sourcemaps for production
 */
gulp.task('clean', ['style', 'compress'], () => {
    'use strict';
    del(config.cssDir + '/maps/*');
    del(config.cssDir + '/maps/');
    del(config.jsDest + '/scripts.js');
    del(config.jsDest + '/scripts.js.map');
});



/*
 * Optimise images uploaded in the CMS
 */
gulp.task('imgoptim', (cb) => {
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
gulp.task('build', () => {
    'use strict';
    gulp.start('style');
    gulp.start('compress');
    gulp.start('clean');
});



/*
 * Reload task for JS files used by BrowserSync
 */
// gulp.task('js-sync', ['js'], () => {
//     'use strict';
//     sync.reload();
// });



/*
 * BrowserSync task, contains watchers for Sass, JS and Templates
 */
// gulp.task('browsersync', ['style-dev', 'js'], () => {
//     'use strict';
//     sync.init({
//         proxy: "domain.dev",
//         browser: "google chrome"
//     });
//     gulp.watch(config.tplDir + '/**/*.ss').on('change', sync.reload);
//     gulp.watch(config.scssDir + '/**/*.scss', ['style-dev']);
//     gulp.watch(config.jsDir + '/src/*.js', ['js-sync']);
// });



/*
 * Development mode, watching for changes
 * This mode creates non compressed CSS, non compressed JS
 * and creates sourcemaps.
*/
gulp.task('watch', () => {
    'use strict';
    // Development task for compiling Sass
    watch(config.scssDir + '/**/*.scss', () => {
        gulp.start('style-dev');
    });

    // Concatenating JS files, but not compressing
    watch(config.jsSrc + '/*.js', () => {
        gulp.start('js');
    });
});



/*
 * Default task, runs the build task
 */
gulp.task('default', ['build']);
