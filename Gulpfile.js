/*
 * Main Gulpfile for any type of projects
 * Cyber-Duck Ltd - www.cyber-duck.co.uk
 */

const gulp = require('gulp');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const minify = require('gulp-cssnano');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const inject = require('gulp-inject-string');
const header = require('gulp-header');
const footer = require('gulp-footer');
const babel = require('gulp-babel');
const pkg = require('./package.json');

/*
 * Main configuration object
 */
const config = {
    scssDir: './public/scss',
    jsSrc: './public/js/src',
    jsDest: './public/js/min',
    cssDir: './public/css',
    tplDir: './public/',
    tplName: 'index.html',
    imgSrc: './public/img',
    tinyPngApiKey: '',
    injectAssets: true
};

const jsFiles = [
    config.jsSrc + '/main.js', 
    config.jsSrc + '/another.js', 
    config.jsSrc + '/test.js'
];

/*
 * Current date
 */
let date = new Date();
let day = String('00' + date.getDate()).slice(-2);
let month = String('00' + (date.getMonth() + 1)).slice(-2);
let year = date.getFullYear();
let hour = String('00' + date.getHours()).slice(-2);
let minute = String('00' + date.getMinutes()).slice(-2);
let second = String('00' + date.getSeconds()).slice(-2);

let now = `${day}/${month}/${year} @ ${hour}:${minute}`;
let nowHash = `${year}${month}${day}${hour}${minute}${second}`;

/*
 * Compile Sass for development
 * with sourcemaps and not minified
 */
function cssDev () {
    'use strict';
    return gulp
        .src(config.scssDir + '/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(autoprefixer({cascade: false}))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(config.cssDir));
};

/*
 * Compile Sass for production
 * with no sourcemaps and minified
 */
function css () {
    'use strict';
    return gulp.src(config.scssDir + '/*.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(minify({
            zindex: false, 
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(config.cssDir));
};

/*
 * Inject stylesheet to file
 */
function injectCss () {
    'use strict';
    let stylesheet = RegExp('style.([0-9]+).css');
    return gulp.src(config.tplDir + config.tplName)
        .pipe(inject.replace(stylesheet, 'style.' + nowHash + '.css'))
        .pipe(gulp.dest(config.tplDir));
};

/*
 * Banner for JS file
 */
let topBanner = `/*
 * <%= pkg.name %>
 * <%= pkg.description %>
 * @version v<%= pkg.version %>
 */

$(document).ready(function () {
`;

/*
 * End of JS file
 */
let bottomBanner = `
/*
 * Last updated: ${now}
 */
});`;

/*
 * Concatenate and transpile JS files
 */
function js () {
    'use strict';
    return gulp.src(jsFiles)
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.js'))
        .pipe(babel())
        .on('error', (e) => {
            console.log('>>> ERROR', e);
            this.emit('end');
        })
        .pipe(header(topBanner, {pkg: pkg}))
        .pipe(footer(bottomBanner))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.jsDest));
};

/*
 * Compress and rename JS files
 * @todo: add requirements (js)
 */
function compress () {
    'use strict';
    return gulp.src(config.jsDest + '/scripts.js')
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.jsDest));
};

/*
 * Inject scripts to file
 */
function injectJs () {
    'use strict';
    let scriptMin = RegExp('scripts.([0-9]+).min.js');
    let script = RegExp('scripts.([0-9]+).js');
    return gulp.src(config.tplDir + config.tplName)
        .pipe(inject.replace(scriptMin, 'scripts.' + nowHash + '.min.js'))
        .pipe(inject.replace(script, 'scripts.' + nowHash + '.js'))
        .pipe(gulp.dest(config.tplDir));
};

/*
 * Clean non used JS files, and sourcemaps for production
 * @todo: needs to have the required tasks (js, compress)
 */
async function cleanCss () {
    'use strict';
    await del([
        config.cssDir + '/maps/*',
        config.cssDir + '/maps/'
    ]);
};

async function cleanJs () {
    'use strict';
    await del([
        // config.jsDest + '/scripts.js', // File might be needed
        config.jsDest + '/scripts.js.map'
    ]);
};

/*
 * Optimise images using TinyPNG API
 */
function tinypng () {
    'use strict';
    return gulp.src([
        config.imgSrc + '/**/*.png',
        config.imgSrc + '/**/*.jpg',
        config.imgSrc + '/**/*.jpeg'
    ])
        .pipe(tinypng(config.tinyPngApiKey))
        .pipe(gulp.dest(config.imgSrc));
};

/*
 * Development mode, watching for changes
 * This mode creates non compressed CSS, non compressed JS
 * and creates sourcemaps.
*/
function devWatch () {
    'use strict';
    if (config.injectAssets) {
        gulp.watch(config.scssDir + '/**/*.scss', gulp.series(cssDev, injectCss));
        gulp.watch(config.jsSrc + '/*.js', gulp.series(js, injectJs));
    } else {
        gulp.watch(config.scssDir + '/**/*.scss', cssDev);
        gulp.watch(config.jsSrc + '/*.js', js);
    }
};

/*
 * Compiles Sass with no sourcemaps, minifies CSS
 * Compress JS
*/
function build (done) {
    'use strict';
    if (config.injectAssets) {
        return gulp.series(
            gulp.parallel(gulp.series(css, injectCss, cleanCss)),
            gulp.parallel(gulp.series(js, compress, injectJs, cleanJs))
        )(done);
    } else {
        return gulp.series(
            gulp.parallel(gulp.series(css, cleanCss)),
            gulp.parallel(gulp.series(js, compress, cleanJs))
        )(done);
    }
};

exports.cssDev = cssDev;
exports.css = css;
exports.injectCss = injectCss;
exports.js = js;
exports.compress = compress;
exports.injectJs = injectJs;
exports.cleanCss = cleanCss;
exports.cleanJs = cleanJs;
exports.tinypng = tinypng;
exports.devWatch = devWatch;
exports.build = build;

/*
 * Default task, runs the watch task
 */
gulp.task('default', gulp.parallel(devWatch));
