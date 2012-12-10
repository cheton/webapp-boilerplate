define(function(require, exports, module) {
"use strict";

var log = require("lib/log");
var $ = require("libs.jquery");
var i18n = require("libs.i18next");

/**
 * Module Exports
 */
module.exports = {
    init: function(app) {
        log.debug("Hello World");

        $("#container").html('<h1 data-i18n="welcome"></h1>');
        $("#container").i18n();
    }
};

});
