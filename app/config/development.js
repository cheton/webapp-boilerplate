// Module dependencies
var path = require('path'),
    connectAssets = require('connect-assets');

var settings = {
    webroot: {
        '/': {
            serveAssets: path.resolve(__dirname, '..', '..', 'web'),
            builtAssets: path.resolve(__dirname, '..', '..', 'web.built')
        }
    },
    uid: '', // UID
    gid: '', // GID

    sessionSecret: 'sessionSecret',
    port: process.env.PORT || 8000,
    host: '',

    // App settings
    HISTORY_LIMIT_MSG_NUMBER: 50,

    // Supported languages
    supportedLngs: [
        'en',
        'zh-TW',
        'ar'
    ],

    i18next: {
        // Set language from requested route: default false
        // Just set the value to the index where the language value is, eg.:
        // detectLngFromPath=0 --> /en-US/myPage
        // detectLngFromPath=1 --> /cms/en-US/myPage
        detectLngFromPath: false,

        // The current locale to set will be looked up in the new parameter: ?lang=en-US
        // default would be ?setLng=en-US
        //detectLngQS: 'lang',

        // Enable cookie usage
        useCookie: true,

        // Preload additional languages on init:
        preload: [],

         // As the fallbackLng will default to 'dev' you can turn it off by setting the option value to false. This will prevent loading the fallbacks resource file and any futher look up of missing value inside a fallback file.
        fallbackLng: 'en', // false

        // Specify which locales to load:
        // If load option is set to current i18next will load the current set language (this could be a specific (en-US) or unspecific (en) resource file).
        // If set to unspecific i18next will always load the unspecific resource file (eg. en instead of en-US).
        load: 'current', // all, current, unspecific

        debug: false,

        resGetPath: 'i18n/__lng__/__ns__.json',

        saveMissing: true,
        resSetPath: 'i18n/__lng__/__ns__.savedMissing.json',

        ns: {
            namespaces: [
                'resource', // default
                'config'
            ],
            defaultNs: 'resource'
        }
    },
    winston: {
        prefix: '',
        transports: {
            Console: {
                level: 'trace',
                silent: false,
                colorize: true,
                timestamp: true, // or function()
                json: false,
                handleExceptions: true
            },
            File: {
                level: 'trace',
                silent: false,
                colorize: false,
                timestamp: true, // or function()
                filename: 'log/app%s.log',
                maxsize: 104857600,
                maxFiles: 10,
                json: true,
                handleExceptions: true
            }
        },
        exceptionHandlers: {
            File: {
                timestamp: true, // or function()
                filename: 'log/error%s.log',
                maxsize: 104857600,
                maxFiles: 10,
                json: true
            }
        }
    }
};

module.exports = function() {
    return settings;
};

module.exports.init = function(app, express) {

    // Enable dependency based asset loading
    for (var route in settings.webroot) {
        if ( ! settings.webroot.hasOwnProperty(route)) {
            continue;
        }
        app.use(route, connectAssets({
            // The directory assets will be read from
            src: settings.webroot[route].serveAssets,
            // Writes built asset files to disk using this directory in production environment, set to false to disable
            buildDir: settings.webroot[route].builtAssets || false
        }));
    }

    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));

    // a custom "verbose errors" setting which can be used in the templates via settings['verbose errors']
    app.enable('verbose errors'); // enable verbose errors in development

    return module.exports;
};
