# CD Front end build system
Cyber-Duck configuration for building front end assets for any project.

To install, just copy the `package.json` file and `Gulpfile.js` to the public root of your application, and update the `config` object where required. Once all variables are updated, navigate to the public folder of the project and run `npm install` to download all the packages. It may take a few minutes. Remember to update the top of the `package.json` file with your project details, as these are being used in the banner for the JS files.

**Important**: If updating a site from previous versions of the build system into this new version, please ensure the website templates point to the correct locations and the file names for CSS and JavaScript files are correct (Not Applicable if using a different Cache Busting method), since they may have changed from previous locations/build systems. Also, run the `gulp build` task and test before pushing anything to live or testing sites.

**Requirements**: You must have at least Node.js 8.0 installed, as many of the packages use JS Promises not available on older versions of Node. Also Gulp 4 must be installed globally on your system, any other version will throw a mismatch error with local Gulp, or the new function based syntax will not work properly.

Note that for CSS authoring, autoprefixer is installed by default and configured for 2 latest browser versions, so no prefixes or prefix mixins are required when writing CSS. Check [autoprefixer documentation](https://github.com/postcss/autoprefixer) to modify the support for older browsers.

## Available tasks
**Gulp default task:** runs the watch task used for development. It watches for changes on Sass files to run the `cssDev` task, or changes in JS files to run `js` task. It also runs the cache busting tasks (injectCss & injectJs) if selected in the config object.
	
	$ gulp

-

**Sass compiling for development:** compiles Sass files in expanded mode, generates CSS sourcemaps (in /css/maps/). This task runs automatically with the `watch` task (default). Note that PostCSS / Autoprefixer is added by default, so no need to manually add vendor prefixes. This is configurable in the task itself.

	$ gulp cssDev

-

**Sass compiling for production:** compiles sass with no sourcemaps, and runs `gulp-clean-css` to minify/compress the output with no sourcemaps. Runs with the `build` task.

	$ gulp css

-

**Concatenate JS files:** concatenates the specified JavaScript files in the given order. The idea is to keep JS files small and simple (plugins can be added here as well), and let this task join all the files into one. Remember to add all the files you want to concatenate, into the JS configuration object at the top of the Gulpfile.

The contents of the `topBanner` and `bottomBanner` variables are included at the top and bottom of the concatenated javascript file. This can be used to add opening and closing statements to the end scripts file.

The task to concatenate js files is: 

	$ gulp js

Babel is running on the concatenated file, to automatically transpile ES6 into browser ready code.

-

**Compress JS:** runs the UglifyJS parser/mangler/compressor library on the concatenated JavaScript file, and creates a copy renamed to `scripts.min.js` inside the JS destination folder set in the config object. 

	$ gulp compress

-

**Clean tasks:** removes and the sourcemaps created in the CSS or JS folders. Used to remove the unused uncompressed scripts.js file but this has been commented because the file is sometimes used, feel free to add if needed.

	$ gulp cleanCss 
	$ gulp cleanJs

-

**Optimising images:** optimises .png and .jpg files using lossless image compression. This task does not run automatically, so you have to run it manually when required. The task runs over the directory defined in the config.

	$ gulp imgoptim

-

**Build task for production:** this task runs `style`, `compress` and `clean` tasks as a series, to generate all production ready assets and clean unused files from the project. Remember all tasks have their respective dependencies to ensure it all runs smoothly.

	$ gulp build

-
## Project configuration
Update all the paths to point to the location of the current project and some other project specific details. The `injectAssets` variable is used to activate the cache busting feature, and it requires the header and footer Tpl names so it can write the file paths.

	const config = {
	    scssDir: './public/scss',
	    jsSrc: './public/js/src',
	    jsDest: './public/js/min',
	    cssDir: './public/css',
	    tplDir: './public/',
        headerTpl: 'header.html',
        footerTpl: 'footer.html',
	    imgSrc: './public/img',
	    injectAssets: true
	};

JavaScript configuration object, defines the files to be concatenated.

	const jsFiles = [
	    config.jsSrc + '/main.js', 
	    config.jsSrc + '/another.js'
	];

CleanCSS configuration object, defines the options for CleanCSS. [All available options can be viewed here](https://github.com/jakubpawlowicz/clean-css#constructor-options).

	const CleanCssOptions = [
	    compatibility: '*'
	];

## Extending the build system
This build system uses basic Gulp and NPM packages. To add more tasks and packages just install them using NPM and add them to the Gulpfile using require. If you need anything to be permanently added to the build system, create a pull request or let us know.

## Cache busting
We've added a cache busting feature to the build system which injects the current time as part of the filename, to make use of this please make sure you adapt the inject tasks to match your filesas the task expects to find a filename as shown below:

	style.20190422121812.css

So it can replace it contantly every time the file gets compiled.

To make the browser get the correct files, you also need to add the following rules to the `.htaccess` file of your project, making sure it matches the actual location of the compiled/minified files:

    RewriteRule ^assets\/css\/style.([0-9]+).css$ /assets/css/style.css [L]
    RewriteRule ^assets\/(js|js\/min)\/scripts.([0-9]+).(js|min.js)$ /assets/$1/scripts.$3 [L]
