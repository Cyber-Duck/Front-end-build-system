# CD Front end build system
**Important**: If updating an existing site to the new build system, please ensure the website templates point to the correct locations and file names for CSS and JavaScript files, since they may have changed from previous locations/build systems. Also, run the `gulp build` task and test before pushing anything to live or testing sites.

**Requirements**: You must have at least Node.js 5.0 installed, as many of the packages use JS Promises not available on older versions of Node, and Gulp 3.9.1 installed globally on your system, any other version will throw a mismatch error with local Gulp.

To install, just select your project type and copy/rename the `package.json` file and `Gulpfile.js` to the public root of your application, and update the `config` object where required. Once all variables are updated, navigate to the public folder of the project and run `npm install` to download all the packages. It may take a few minutes. Remember to update the `package.json` file with your project details, as these are being used in the banner for the JS file.

Note that for CSS authoring, autoprefixer is installed by default and configured for 2 latest browser versions, so no prefixes or prefix mixins are required. Check [autoprefixer documentation](https://github.com/postcss/autoprefixer) to modify the support for older browsers.

## Available tasks
**Gulp default task:** runs the build task used for production, described below.
	
	$ gulp

-

**Sass compiling for development:** compiles Sass files in expanded mode, generates CSS sourcemaps (in /css/maps/).

	$ gulp style-dev

-

**Sass compiling for production:** compiles sass with no sourcemaps, and runs `css-nano` to minify/compress the output with no sourcemaps.

	$ gulp style

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

**ES Lint:** runs ES Lint in all the files within the `src` folder defined in the config, the rules are saved in the `.eslintrc.json` file and can be adapted to the needs of the project.

	$ gulp lint

-

**Clean task:** removes the unused uncompressed scripts.js file, and the CSS sourcemaps created in the /css/maps/ folder. This task will trigger the production `style` task and `compress` task before running, to ensure the production ready assets are in place before removing the extra files.

	$ gulp clean

-

**Image optimisation:** optimises .png, .jpg, .jpeg, and .gif files using lossless image compression algorythms, from the plugin `gulp-imageoptim`. This task does not run automatically, as it is designed to optimise assets uploaded by the client using a cron job. If you need to optimise theme assets, you can add the respective paths to the task.

	$ gulp imgoptim

-

**Build task for production:** this task runs `style`, `compress` and `clean` tasks at once, to generate all production ready assets and clean unused files from the project. Remember all tasks have their respective dependencies to ensure it all runs smoothly.

	$ gulp build

-

**BrowserSync:** creates a local server wrapping your specified local domain, and opens up the specified browser(s) and watches for changes to templates, Sass and JS files, to reload the synced browsers or inject the CSS changes directly.

	$ gulp browsersync



**Watch task:** watches for changes on Sass files to run the `style-dev` task, or changes in JS files to run `js` task. Should not used if the BrowserSync task is active, as both ot them watch the same files and run the same tasks.

	$ gulp watch

-
## Project configuration
Update all the paths to point to the location of the current project.

    var config = {
        scssDir: '/scss',
        jsDir: '/js',
        cssDir: '/css',
        tplDir: '/templates',
        imgSrc: './assets/'
    };


### BrowserSync task
Replace the value of the proxy with the real domain used. This task will create a server wrapping your vhost. This server  will be available at `http://localhost:3000`, and it will show the site hosted at the local domain specified. I

    proxy: "domain.dev"

If no local domain has been set up, it's still possible to use **BrowserSync**. The task can create a development server for static files replacing the `proxy` with a `server` property, and using `baseDir` to point the server to the where the static files are:

    server: {
		baseDir: "./"
	}

Please note that if you are working with static files, you may need to update the watcher as well, to point to the static files instead of the templates. Also, if you can specify your preferred development browser in the `browser` property with `browser: "google chrome"`, or even add more than one using an array `browser: ["google chrome", "firefox"]`.

### Watch task
Can be uncommented if the BrowserSync option is not going to be used, as they both watch over the same files.

## Extending the build system
This build system uses basic Gulp and NPM packages. To add more tasks and packages just install them using NPM and add them to the Gulpfile using require. If you need anything to be permanently added to the build system, create a pull request or let us know.