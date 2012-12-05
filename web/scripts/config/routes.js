define(function(require, exports, module) {
"use strict";

var routes = {};

module.exports = routes = {
    /**
     * The routes settings are assumed to be relative to the baseUrl specified in main.js.
     * It allows array values. You must specify at least one module for a page.
     *
     * {
     *     "foo-1": "bar",
     *     "foo-2": [
     *         "baz-1",
     *         "baz-2"
     *     ]
     * }
     *
     * If a module exports an init function, the init function will be called by app.js to start up.
     * Actually each page can have multiple init functions in modules, and each init function will be 
     * executed in order of definition.
     *
     *  module.exports = {
     *      init: function() { }
     *  };
     *
     */
    "*": [
        "modules/common/i18n"
    ],
    // Index
    "index": "modules/main/index",
    // Demo
    "demo": "modules/demo/main",
    "basic": "modules/demo/basic",
    "advanced": "modules/demo/advanced",
    "table": "modules/demo/table"
};

});