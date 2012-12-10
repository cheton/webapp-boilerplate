define(function(require, exports, module) {
"use strict";

var has = require("lib/has");

var settings = {};

module.exports = settings = {
    supportedLngs: [
        "en", // default language
        "ar",
        "zh-TW"
    ],
    log: {
        level: has("production") ? "warn" : "debug", // trace, debug, info, warn, error
        logger: "console", // console
        prefix: "app:"
    },
    i18next: {
        // Resources will be resolved in this order:
        // 1) try languageCode plus countryCode, eg. 'en-US'
        // 2) alternative look it up in languageCode only, eg. 'en'
        // 3) finally look it up in definded fallback language, default: 'dev'
        // If language is not set explicitly i18next tries to detect the user language by:
        // 1) querystring parameter (?setLng=en-US)
        // 2) cookie (i18next)
        // 3) language set in navigator
        //lng: lng,

        // Preload additional languages on init:
        preload: [],

        // To lowercase countryCode in requests, eg. to 'en-us' set option lowerCaseLng = true
        //lowerCaseLng: true,

        // The current locale to set will be looked up in the new parameter: ?lang=en-US
        // default would be ?setLng=en-US
        //detectLngQS: "lang",

        // Enable cookie usage
        useCookie: true,

         // As the fallbackLng will default to 'dev' you can turn it off by setting the option value to false. This will prevent loading the fallbacks resource file and any futher look up of missing value inside a fallback file.
        fallbackLng: "en", //false,

        // Specify which locales to load:
        // If load option is set to current i18next will load the current set language (this could be a specific (en-US) or unspecific (en) resource file).
        // If set to unspecific i18next will always load the unspecific resource file (eg. en instead of en-US).
        load: "current", // all, current, unspecific

        // Caching is turned off by default. You might want to turn it on for production.
        //useLocalStorage: false,
        //localStorageExpirationTime: 86400000 // in ms, default 1 week

        // Debug output
        debug: has("production") ? false : true,

        // Path in resource store
        //resStore: resStore,

        // Set static route to load resources from
        // e.g. 'i18n/en-US/translation.json
        resGetPath: "i18n/__lng__/__ns__.json",

        // Load resource synchron
        getAsync: false,

        // Send missing resources to server
        resPostPath: "i18n/add/__lng__/__ns__",
        postAsync: true,

        // Multiple namespace
        ns: {
            namespaces: [
                "resource", // default
                "table"
            ],
            defaultNs: "resource"
        }
    }
};

});
