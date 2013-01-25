/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        jshint: {
            options: {
                es5: true, // Tolerate ES5 syntax
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    __dirname: true,
                    process: true,
                    exports: true,
                    module: true,
                    console: true,
                    define: true,
                    require: true,
                    requirejs: true
                }
            },
            all: [
                'Gruntfile.js',
                'app/**/*.js',
                'web/scripts/**/*.js'
            ]
        },
        nodeunit: {
            all: [
                'app/test/**/*.js'
            ]
        },
        qunit: {
            files: [
                'web/tests/**/*.html'
            ]
        },
        compass: {
            prod: {
                options: {
                    environment: 'production',
                    cssDir: 'build/<%= pkg.name %>/web/styles',
                    imagesDir: 'build/<%= pkg.name %>/web/images',
                    javascriptsDir: 'build/<%= pkg.name %>/web/scripts',
                    sassDir: 'build/<%= pkg.name %>/web/sass',
                    outputStyle: 'compressed',
                    relativeAssets: true,
                    noLineComments: true,
                    trace: true
                }
            },
            dev: {
                options: {
                    environment: 'development',
                    cssDir: 'web/styles',
                    imagesDir: 'web/images',
                    javascriptsDir: 'web/scripts',
                    sassDir: 'web/sass',
                    outputStyle: 'expanded',
                    relativeAssets: true,
                    noLineComments: true,
                    trace: true
                }
            }
        },
        clean: {
            prod: [
                'build'
            ]
        },
        copy: {
            prod: {
                options: {
                    processContent: false,
                    processContentExclude: [
                    ]
                },
                files: [
                    {
                        src: 'package.json',
                        dest: 'build/<%= pkg.name %>/'
                    },
                    {
                        expand: true,
                        cwd: 'app',
                        src: '**',
                        dest: 'build/<%= pkg.name %>/app/'
                    },
                    {
                        expand: true,
                        cwd: 'web',
                        src: '**',
                        dest: 'build/<%= pkg.name %>/web/'
                    }
                ]
            }
        },
        compress: {
            prod: {
                options: {
                    archive: 'build/<%= pkg.name %>-<%= pkg.version %>.zip',
                    mode: 'zip'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'build/<%= pkg.name %>/',
                        src: '**',
                        dest: '<%= pkg.name %>-<%= pkg.version %>'
                    }
                ]
            }
        },
        requirejs: {
            prod: {
                options: {
                    /**
                     * Important Notice
                     * If you have any changes or updates to the following configuration items in the main.js, don't forget to synchronize it to app.build.js.
                     * - paths
                     * - shims
                     * - packages
                     *
                     * Please follow the link below to view an example build file that demostrates how to use the build system for require.js
                     * https://github.com/jrburke/r.js/blob/master/build/example.build.js
                     */
                    //List the modules that will be optimized. All their immediate and deep
                    //dependencies will be included in the module's file when the build is
                    //done. If that module or any of its dependencies includes i18n bundles,
                    //only the root bundles will be included unless the locale: section is set above.
                    modules: [
                        {
                            name: 'main',
                            include: [ // refer to main.js
                                'app',
                                "modules/common/api",
                                "modules/common/rbac",
                                "modules/common/i18n",
                                "modules/common/socket.io",
                                'modules/app/main'
                            ]
                        }
                    ],

                    //##########################################################################

                    //The top level directory that contains your app. If this option is used
                    //then it assumed your scripts are in a subdirectory under this path.
                    //This option is not required. If it is not specified, then baseUrl
                    //below is the anchor point for finding things. If this option is specified,
                    //then all the files from the app directory will be copied to the dir:
                    //output area, and baseUrl will assume to be a relative path under
                    //this directory.
                    appDir: 'build/<%= pkg.name %>/web/',

                    //By default, all modules are located relative to this path. If baseUrl
                    //is not explicitly set, then all modules are loaded relative to
                    //the directory that holds the build file. If appDir is set, then
                    //baseUrl should be specified as relative to the appDir.
                    baseUrl: 'scripts',

                    //By default all the configuration for optimization happens from the command
                    //line or by properties in the a config file, and configuration that was
                    //passed to requirejs as part of the app's runtime "main" JS file is *not*
                    //considered. However, if you prefer for the that "main" JS file configuration
                    //to be read for the build so that you do not have to duplicate the values
                    //in a separate configuration, set this property to the location of that
                    //main JS file. The first requirejs({}), require({}), requirejs.config({}),
                    //or require.config({}) call found in that file will be used.
                    mainConfigFile: 'build/<%= pkg.name %>/web/scripts/common.js',

                    //The directory path to save the output. If not specified, then
                    //the path will default to be a directory called "build" as a sibling
                    //to the build file. All relative paths are relative to the build file.
                    dir: 'build/<%= pkg.name %>/web/',

                    //As of RequireJS 2.0.2, the dir above will be deleted before the
                    //build starts again. If you have a big build and are not doing
                    //source transforms with onBuildRead/onBuildWrite, then you can
                    //set keepBuildDir to true to keep the previous dir. This allows for
                    //faster rebuilds, but it could lead to unexpected errors if the
                    //built code is transformed in some way.
                    keepBuildDir: true,

                    //Used to inline i18n resources into the built file. If no locale
                    //is specified, i18n resources will not be inlined. Only one locale
                    //can be inlined for a build. Root bundles referenced by a build layer
                    //will be included in a build layer regardless of locale being set.
                    locale: 'en-us',

                    //How to optimize all the JS files in the build output directory.
                    //Right now only the following values
                    //are supported:
                    //- "uglify": (default) uses UglifyJS to minify the code.
                    //- "closure": uses Google's Closure Compiler in simple optimization
                    //mode to minify the code. Only available if running the optimizer using
                    //Java.
                    //- "closure.keepLines": Same as closure option, but keeps line returns
                    //in the minified files.
                    //- "none": no minification will be done.
                    optimize: 'uglify',

                    //Introduced in 2.1.2: If using "dir" for an output directory, normally the
                    //optimize setting is used to optimize the build layers (the "modules"
                    //section of the config) and any other JS file in the directory. However, if
                    //the non-build layer JS files will not be loaded after a build, you can
                    //skip the optimization of those files, to speed up builds. Set this value
                    //to true if you want to skip optimizing those other non-build layer JS
                    //files.
                    skipDirOptimize: false,

                    //Introduced in 2.1.2 and considered experimental.
                    //If the minifier specified in the "optimize" option supports generating
                    //source maps for the minfied code, then generate them. The source maps
                    //generated only translate minified JS to non-minified JS, it does not do
                    //anything magical for translating minfied JS to transpiled source code.
                    //Currently only optimize: "uglify2" is supported when running in node or
                    //rhino, and if running in rhino, "closure" with a closure compiler jar
                    //build after r1592 (20111114 release).
                    //The source files will show up in a browser developer tool that supports
                    //source maps as ".js.src" files.
                    generateSourceMaps: false,

                    //Introduced in 2.1.1: If a full directory optimization ("dir" is used), and
                    //optimize is not "none", and skipDirOptimize is false, then normally all JS
                    //files in the directory will be minified, and this value is automatically
                    //set to "all". For JS files to properly work after a minification, the
                    //optimizer will parse for define() calls and insert any dependency arrays
                    //that are missing. However, this can be a bit slow if there are many/larger
                    //JS files. So this transport normalization is not done (automatically set
                    //to "skip") if optimize is set to "none". Cases where you may want to
                    //manually set this value:
                    //1) Optimizing later: if you plan on minifying the non-build layer JS files
                    //after the optimizer runs (so not as part of running the optimizer), then
                    //you should explicitly this value to "all".
                    //2) Optimizing, but not dynamically loading later: you want to do a full
                    //project optimization, but do not plan on dynamically loading non-build
                    //layer JS files later. In this case, the normalization just slows down
                    //builds, so you can explicitly set this value to "skip".
                    //Finally, all build layers (specified in the "modules" or "out" setting)
                    //automatically get normalization, so this setting does not apply to those
                    //files.
                    normalizeDirDefines: "skip",

                    //If using UglifyJS for script optimization, these config options can be
                    //used to pass configuration values to UglifyJS.
                    //See https://github.com/mishoo/UglifyJS for the possible values.
                    uglify: {
                        toplevel: true,
                        //ascii_only: true,
                        //beautify: true, // pass true if you want indented output
                        //max_line_length: 1000,

                        //How to pass uglifyjs defined symbols for AST symbol replacement,
                        //see "defines" options for ast_mangle in the uglifys docs.
                        defines: {
                            DEBUG: ['name', 'false']
                        },

                        //Custom value supported by r.js but done differently
                        //in uglifyjs directly:
                        //Skip the processor.ast_mangle() part of the uglify call (r.js 2.0.5+)
                        no_mangle: true
                    },

                    //If using UglifyJS for script optimization, these config options can be
                    //used to pass configuration values to UglifyJS.
                    //See https://github.com/mishoo/UglifyJS2 for possible values.
                    uglify2: {},

                    //If using Closure Compiler for script optimization, these config options
                    //can be used to configure Closure Compiler. See the documentation for
                    //Closure compiler for more information.
                    closure: {
                        CompilerOptions: {},
                        CompilationLevel: 'SIMPLE_OPTIMIZATIONS',
                        loggingLevel: 'WARNING'
                    },

                    //Allow CSS optimizations. Allowed values:
                    //- "standard": @import inlining, comment removal and line returns.
                    //Removing line returns may have problems in IE, depending on the type
                    //of CSS.
                    //- "standard.keepLines": like "standard" but keeps line returns.
                    //- "none": skip CSS optimizations.
                    //- "standard.keepComments": keeps the file comments, but removes line
                    //returns.  (r.js 1.0.8+)
                    //- "standard.keepComments.keepLines": keeps the file comments and line
                    //returns. (r.js 1.0.8+)
                    optimizeCss: "standard",

                    //If optimizeCss is in use, a list of of files to ignore for the @import
                    //inlining. The value of this option should be a string of comma separated
                    //CSS file names to ignore (like 'a.css,b.css'. The file names should match
                    //whatever strings are used in the @import calls.
                    cssImportIgnore: null,

                    //Inlines the text for any text! dependencies, to avoid the separate
                    //async XMLHttpRequest calls to load those dependencies.
                    inlineText: true,

                    //Allow "use strict"; be included in the RequireJS files.
                    //Default is false because there are not many browsers that can properly
                    //process and give errors on code for ES5 strict mode,
                    //and there is a lot of legacy code that will not work in strict mode.
                    useStrict: false,

                    //Allows trimming of code branches that use has.js-based feature detection:
                    //https://github.com/phiggins42/has.js
                    //The code branch trimming only happens if minification with UglifyJS or
                    //Closure Compiler is done. For more information, see:
                    //http://requirejs.org/docs/optimization.html#hasjs
                    has: {
                        production: true
                    },

                    //Similar to pragmasOnSave, but for has tests -- only applied during the
                    //file save phase of optimization, where "has" is applied to both
                    //dependency mapping and file save phases.
                    /*
                    hasOnSave: {
                        'function-bind': true,
                        'string-trim': false
                    },
                    */

                    //Allows namespacing requirejs, require and define calls to a new name.
                    //This allows stronger assurances of getting a module space that will
                    //not interfere with others using a define/require AMD-based module
                    //system. The example below will rename define() calls to foo.define().
                    //See http://requirejs.org/docs/faq-advanced.html#rename for a more
                    //complete example.
                    /*
                    namespace: 'foo',
                    */

                    //If skipModuleInsertion is false, then files that do not use define()
                    //to define modules will get a define() placeholder inserted for them.
                    //Also, require.pause/resume calls will be inserted.
                    //Set it to true to avoid this. This is useful if you are building code that
                    //does not use require() in the built project or in the JS files, but you
                    //still want to use the optimization tool from RequireJS to concatenate modules
                    //together.
                    skipModuleInsertion: false,

                    //Specify modules to stub out in the optimized file. The optimizer will
                    //use the source version of these modules for dependency tracing and for
                    //plugin use, but when writing the text into an optimized layer, these
                    //modules will get the following text instead:
                    //If the module is used as a plugin:
                    //    define({load: function(id){throw new Error("Dynamic load not allowed: " + id);}});
                    //If just a plain module:
                    //    define({});
                    //This is useful particularly for plugins that inline all their resources
                    //and use the default module resolution behavior (do *not* implement the
                    //normalize() method). In those cases, an AMD loader just needs to know
                    //that the module has a definition. These small stubs can be used instead of
                    //including the full source for a plugin.
                    /*
                    stubModules: ['text', 'bar'],
                    */

                    //If it is not a one file optimization, scan through all .js files in the
                    //output directory for any plugin resource dependencies, and if the plugin
                    //supports optimizing them as separate files, optimize them. Can be a
                    //slower optimization. Only use if there are some plugins that use things
                    //like XMLHttpRequest that do not work across domains, but the built code
                    //will be placed on another domain.
                    /*
                    optimizeAllPluginResources: false,
                    */

                    //Finds require() dependencies inside a require() or define call. By default
                    //this value is false, because those resources should be considered dynamic/runtime
                    //calls. However, for some optimization scenarios,
                    //Introduced in 1.0.3. Previous versions incorrectly found the nested calls
                    //by default.
                    findNestedDependencies: false,

                    //If set to true, any files that were combined into a build layer will be
                    //removed from the output folder.
                    removeCombined: false,

                    //Wrap any build layer in a start and end text specified by wrap.
                    //Use this to encapsulate the module code so that define/require are
                    //not globals. The end text can expose some globals from your file,
                    //making it easy to create stand-alone libraries that do not mandate
                    //the end user use requirejs.
                    /*
                    wrap: {
                        start: "(function() {",
                        end: "}());"
                    },
                    */

                    //Another way to use wrap, but uses default wrapping of:
                    //(function() { + content + }());
                    /*
                    wrap: true,
                    */

                    //Another way to use wrap, but uses file paths. This makes it easier
                    //to have the start text contain license information and the end text
                    //to contain the global variable exports, like
                    //window.myGlobal = requirejs('myModule');
                    //File paths are relative to the build file, or if running a commmand
                    //line build, the current directory.
                    /*
                    wrap: {
                        startFile: "parts/start.frag",
                        endFile: "parts/end.frag"
                    },
                    */

                    //As of r.js 2.1.0, startFile and endFile can be arrays of files, and
                    //they will all be loaded and inserted at the start or end, respectively,
                    //of the build layer.
                    /*
                    wrap: {
                        startFile: ["parts/startOne.frag", "parts/startTwo.frag"],
                        endFile: ["parts/endOne.frag", "parts/endTwo.frag"]
                    },
                    */

                    //When the optimizer copies files from the source location to the
                    //destination directory, it will skip directories and files that start
                    //with a ".". If you want to copy .directories or certain .files, for
                    //instance if you keep some packages in a .packages directory, or copy
                    //over .htaccess files, you can set this to null. If you want to change
                    //the exclusion rules, change it to a different regexp. If the regexp
                    //matches, it means the directory will be excluded. This used to be
                    //called dirExclusionRegExp before the 1.0.2 release.
                    //As of 1.0.3, this value can also be a string that is converted to a
                    //RegExp via new RegExp().
                    fileExclusionRegExp: /^\./,

                    //By default, comments that have a license in them are preserved in the
                    //output. However, for a larger built files there could be a lot of
                    //comment files that may be better served by having a smaller comment
                    //at the top of the file that points to the list of all the licenses.
                    //This option will turn off the auto-preservation, but you will need
                    //work out how best to surface the license information.
                    preserveLicenseComments: true,

                    //Sets the logging level. It is a number. If you want "silent" running,
                    //set logLevel to 4. From the logger.js file:
                    //TRACE: 0,
                    //INFO: 1,
                    //WARN: 2,
                    //ERROR: 3,
                    //SILENT: 4
                    //Default is 0.
                    logLevel: 0,

                    //A function that if defined will be called for every file read in the
                    //build that is done to trace JS dependencies. This allows transforms of
                    //the content.
                    onBuildRead: function(moduleName, path, contents) {
                        //Always return a value.
                        return contents;
                    },

                    //A function that will be called for every write to an optimized bundle
                    //of modules. This allows transforms of the content before serialization.
                    onBuildWrite: function(moduleName, path, contents) {
                        //Always return a value.
                        return contents;
                    },

                    //Introduced in 2.1.3: Seed raw text contents for the listed module IDs.
                    //These text contents will be used instead of doing a file IO call for
                    //those modules. Useful is some module ID contents are dynamically
                    //based on user input, which is common in web build tools.
                    /*
                    rawText: {
                        'some/id': 'define(["another/id"], function () {});'
                    },
                    */

                    //Introduced in 2.0.2: if set to true, then the optimizer will add a
                    //define(require, exports, module) {}); wrapper around any file that seems
                    //to use commonjs/node module syntax (require, exports) without already
                    //calling define(). This is useful to reuse modules that came from
                    //or are loadable in an AMD loader that can load commonjs style modules
                    //in development as well as AMD modules, but need to have a built form
                    //that is only AMD. Note that this does *not* enable different module
                    //ID-to-file path logic, all the modules still have to be found using the
                    //requirejs-style configuration, it does not use node's node_modules nested
                    //path lookups.
                    cjsTranslate: false, //true

                    //Introduced in 2.0.2: a bit experimental.
                    //Each script in the build layer will be turned into
                    //a JavaScript string with a //@ sourceURL comment, and then wrapped in an
                    //eval call. This allows some browsers to see each evaled script as a
                    //separate script in the script debugger even though they are all combined
                    //in the same file. Some important limitations:
                    //1) Do not use in IE if conditional comments are turned on, it will cause
                    //errors:
                    //http://en.wikipedia.org/wiki/Conditional_comment#Conditional_comments_in_JScript
                    //2) It is only useful in optimize: 'none' scenarios. The goal is to allow
                    //easier built layer debugging, which goes against minification desires.
                    useSourceUrl: false // true
                }
            }
        }
    });

    // Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // Load task-related files from the tasks directory, relative to the grunt.js gruntfile.
    grunt.loadTasks('tasks');

    // Test tasks
    grunt.registerTask('test', ['jshint', 'nodeunit', 'qunit']);

    // Development tasks
    grunt.registerTask('build:dev', 'Make development build', function() {
        grunt.task.run(['jshint', 'nodeunit', 'qunit', 'compass:dev']);
    });

    // Production tasks
    grunt.registerTask('build:prod', 'Make production build', function() {
        grunt.task.run(['jshint', 'nodeunit', 'qunit', 'clean:prod', 'copy:prod', 'compass:prod', 'requirejs:prod', 'compress:prod']);
    });

    // Default tasks
    grunt.registerTask('default', 'build:dev');
    grunt.registerTask('dev', 'build:dev');
    grunt.registerTask('prod', 'build:prod');

};
