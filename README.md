# CD Front end build system
**Important**: If updating an existing site to the new build system, please ensure the website templates point to the correct locations and file names for CSS and JavaScript files, since they may have changed from previous locations/build systems. Also, run the `gulp build` task and test before pushing anything to live or testing sites.

**Requirements**: You must have at least Node.js 8.0 installed, as many of the packages use JS Promises not available on older versions of Node, and Gulp 4 installed globally on your system, any other version will throw a mismatch error with local Gulp.

To install, just copy the `package.json` file and `Gulpfile.js` to the public root of your application, and update the `config` object where required. Once all variables are updated, navigate to the public folder of the project and run `npm install` to download all the packages. It may take a few minutes. Remember to update the top of the `package.json` file with your project details, as these are being used in the banner for the JS files.

Note that for CSS authoring, autoprefixer is installed by default and configured for 2 latest browser versions, so no prefixes or prefix mixins are required. Check [autoprefixer documentation](https://github.com/postcss/autoprefixer) to modify the support for older browsers.

## Available tasks
**Gulp default task:** runs the watch task used for development, described below.
	
	$ gulp

-

**Sass compiling for development:** compiles Sass files in expanded mode, generates CSS sourcemaps (in /css/maps/).

	$ gulp cssDev

-

**Sass compiling for production:** compiles sass with no sourcemaps, and runs `css-nano` to minify/compress the output with no sourcemaps.

	$ gulp css

-

**Concatenate JS files:** concatenates the specified JavaScript files in the given order. The idea is to keep JS files small and simple, and let this task join them into one. remember to add all the files you want to concatenate to the task.

The contents of the `topBanner` and `bottomBanner` variables are included at the top and bottom of the concatenated javascript file. This can be used to add opening and closing statements to the end scripts file.

The task to concatenate js files is: 

	$ gulp js

Babel is running on the concatenated file, to transpile ES6 into browser ready code.

-

**Compress JS:** runs the UglifyJS parser/mangler/compressor library on the concatenated JavaScript file, and creates a copy renamed to `scripts.min.js` inside the /js/min/ folder. Note that this task has the previous task as a dependency, so it will trigger it first and for it to finish before running.

	$ gulp compress

-

**Clean task:** removes the unused uncompressed scripts.js file, and the CSS sourcemaps created in the /css/maps/ folder. This task will trigger the production `style` task and `compress` task before running, to ensure the production ready assets are in place before removing the extra files.

	$ gulp clean

-

**TinyPNG:** optimises .png, .jpg and .jpeg files using lossless image compression TinyPNG API. This task does not run automatically, so you have to run it manually when required. The task runs over the directory defined in the config. **Important:** this task requires an API key to run, you can get one for free at tinypng.com.

	$ gulp tinypng

-

**Build task for production:** this task runs `style`, `compress` and `clean` tasks at once, to generate all production ready assets and clean unused files from the project. Remember all tasks have their respective dependencies to ensure it all runs smoothly.

	$ gulp build

**Watch task:** watches for changes on Sass files to run the `style-dev` task, or changes in JS files to run `js` task. Should not used if the BrowserSync task is active, as both ot them watch the same files and run the same tasks.

	$ gulp watch

-
## Project configuration
Update all the paths to point to the location of the current project and some other project specific details.

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

JavaScript configuration object, define the files to be concatenated.

	const jsFiles = [
	    config.jsSrc + '/main.js', 
	    config.jsSrc + '/another.js', 
	    config.jsSrc + '/test.js'
	];

## Extending the build system
This build system uses basic Gulp and NPM packages. To add more tasks and packages just install them using NPM and add them to the Gulpfile using require. If you need anything to be permanently added to the build system, create a pull request or let us know.

## Experimental
We've added a cache busting feature to the build system which injects the current time as part of the filename, to make use of this please make sure you adapt the inject tasks to match your filesas the task expects to find a filename as shown below:

	style.20170503121812.css

So it can replace it contantly every time the file gets compiled.

To make the browser pull the correct files, you also need to add this to the `.htaccess` file:

    RewriteRule ^assets\/css\/style.([0-9]+).css$ /assets/css/style.css [L]
    RewriteRule ^assets\/(js|js\/min)\/scripts.([0-9]+).(js|min.js)$ /assets/$1/scripts.$3 [L]
