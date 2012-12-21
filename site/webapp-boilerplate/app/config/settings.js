var _ = require('underscore');
var pkg = require('../../package.json');
var path = require('path');

var settings = { // Default settings
    // version from package.json
    version: pkg.version,
    // Web
    route: '/', // the web route may be replaced in a multi-host environment
    asset: path.resolve(__dirname, '..', '..', 'web'),
    // Express view engine
    view: {
        /**
         * Set html (w/o dot) as the default extension
         */
        defaultExtension: 'html',
        
        /**
         * Format: <extension>: <template>
         */
        engines: [
            { // Hogan template with .html extension
                extension: 'html',
                template: 'hogan'
            },
            { // Hogan template with .hogan extension
                extension: 'hogan',
                template: 'hogan'
            },
            { // Jade template with .jade extension
                extension: 'jade',
                template: 'jade'
            }
        ]
    },
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
        fallbackLng: 'en', //false,

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
    }
};

var env = process.env.NODE_ENV || 'development';
var _settings = {};

if ('development' === env) {
    _settings = require('./development');
    settings = _.extend(settings, _settings);
}
if ('production' === env) {
    _settings = require('./production');
    settings = _.extend(settings, _settings);
}

module.exports = settings;
