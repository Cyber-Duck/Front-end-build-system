# Front end build system
To install, just select your project type and copy the `package.json` file and `Gulpfile.js` to the public root of your application, and update the `config` object where required.

**Important**: If updating an existing site to the new build system, please ensure the website templates point to the correct locations and file names for CSS and JavaScript files, and run build test before pushing anything to live or testing sites.

Note that for CSS authoring, autoprefixer is installed by default configured for 2 latest browser versions, so no prefixes or prefix mixins are required. Check [autoprefixer documentation](https://github.com/postcss/autoprefixer) to modify the support for older browsers.

## Silverstripe configuration
Replace the `<theme>` with the real name of your theme in the `config` object.

    var config = {
        scssDir: './themes/<theme>/scss',
        jsDir: './themes/<theme>/js',
        cssDir: './themes/<theme>/css',
        ssDir: './themes/<theme>/templates',
        imgSrc: './assets/Uploads'
    };

## Laravel configuration
You shouldn't need to change anything here, unless your project hs a different structure.

    var config = {
        scssDir: './resources/assets/scss',
        jsSrc: './resources/assets/js',
        jsDest: './public/assets/js',
        cssDir: './public/assets/css',
        tplDir: './resources/views',
        imgSrc: './public/assets/img'
    };


### BrowserSync task
Replace the value of the proxy with the real domain used. This task will create a server wrapping your vhost. This server  will be available at `http://localhost:3000`, and it will show the site hosted at the local domain specified. I

    proxy: "domain.dev"

If no local domain has been set up, it isstill possible to use **BrowserSync**. The task can create a development server for static files replacing the `proxy` with a `server` property, and using `baseDir` to point the server to the where the static files are:

    server: {
		baseDir: "./"
	}

Please note that if you are working with static files, you may need to update the watcher as well, to point to the static files instead of the templates. Also, if you can specify your preferred development browser in the `browser` property with `browser: "google chrome"`, or even add more than one using an array `browser: ["google chrome", "firefox"]`.

### Watch task
Can be uncommented if the BrowserSync option is not going to be used, as they both watch over the same files.

## Extending the build system
This build system uses basic Gulp and NPM packages. To add more tasks and packages just install them using NPM and add them to the Gulpfile using require. If you need anything to be permanently added to the build system, create a pull request or let us know.