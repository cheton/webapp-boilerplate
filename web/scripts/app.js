define(function(require, exports, module) {
"use strict";

var log = require("utils/log");
var has = require("utils/has");
var appRouter = require("app.router");
var appLauncher = require("app.launcher");
var settings = require("config/settings");
var routes = require("config/routes");

var app = module.exports = {

    init: function() {
        log.setLevel(settings.log.level);
        log.setLogger(settings.log.logger);
        log.setPrefix(settings.log.prefix);

        var msg = [
            "version=" + module.config().version,
            "production=" + has("production")
        ];
        log.debug(msg.join(", "));

        appRouter.init({
            routes: routes,
            callback: function(module, object) {
                // Initialize the module if necessary
                if (object && typeof(object.init) === "function") {
                    appLauncher.register(module, object);
                    appLauncher.init(object, app);
                }
            }
        });

        return app;
    },

    loadCSS: function(style) {
        var $ = require("libs.jquery");
        $("<style />").html(style).appendTo("head");
    },

    loadTemplateScripts: function(template) {
        var $ = require("libs.jquery");
        $("<div />").html(template).appendTo($("body"));
    }

};

});
