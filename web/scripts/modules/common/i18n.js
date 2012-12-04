define(function(require, exports, module) {
"use strict";

var $ = require("libs.jquery");
var i18n = require("libs.i18next");
var log = require("utils/log");
var settings = require("config/settings");

/**
 * Module Exports
 */
module.exports = {
    init: function(app) {
        var lng = $("html").attr("lang");
        if (settings.supportedLngs.indexOf(lng) < 0) {
            settings.i18next.lng = settings.i18next.fallbackLng || settings.supportedLanguages[0];
        }

        i18n.init(settings.i18next, function(t) {
            log.debug("i18n: lng=" + i18n.lng());
        });
    }
};

});
