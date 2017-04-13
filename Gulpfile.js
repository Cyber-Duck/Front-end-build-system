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
    babel = require("gulp-babel");
    // sync = require('browser-sync').create()



/*
 * Main configuration object
 */
const config = {
    scssDir: './themes/<theme>/scss',
    jsSrc: './themes/<theme>/js/src',
    jsDest: './themes/<theme>/js/min',
    cssDir: './themes/<theme>/css',
    ssDir: './themes/<theme>/templates',
    imgSrc: './assets/Uploads'
};

/*
 * Main configuration object (Laravel project)
const config = {
    scssDir: './resources/assets/scss',
    jsSrc: './resources/assets/js',
    jsDest: './public/assets/js',
    cssDir: './public/assets/css',
    tplDir: './resources/views',
    imgSrc: './public/assets/img'
};
 */



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
var banner = [
  '/*',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @author <%= pkg.author %>',
  ' * @version v<%= pkg.version %>',
  ' */',
  ' \n'
].join('\n');



/*
 * Concatenate and transpile JS files
 */
gulp.task('js', () => {
    'use strict';
    return gulp.src([
        config.jsSrc + '/start.js',
        config.jsSrc + '/main.js',
        config.jsSrc + '/end.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(babel())
        .on('error', function(e) {
            console.log('>>> ERROR', e);
            this.emit('end');
        })
        .pipe(concat('scripts.js'))
        .pipe(header(banner, {pkg: pkg}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.jsDest));
});



/*
 * Compress and rename JS files
 */
gulp.task('compress', ['js'], () => {
    'use strict';
    return gulp.src(config.jsSrc + '/scripts.js')
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.jsDest + '/min'));
});


/*
 * Lint JS using ES Lint
 */
gulp.task('lint', ['js'], () => {
    return gulp.src(config.jsSrc + '/scripts.js')
        .pipe(eslint({
            configFilePath: './eslintrc'
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});


/*
 * Clean non used JS files, and sourcemaps for production
 */
gulp.task('clean', ['style', 'compress'], () => {
    'use strict';
    del(config.cssDir + '/maps/*');
    del(config.cssDir + '/maps/');
    // del(config.jsDest + '/scripts.js');
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
//     gulp.watch(config.ssDir + '/**/*.ss').on('change', sync.reload);
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
