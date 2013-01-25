define(function(require, exports, module) {
"use strict";

var log = require("lib/log");
var has = require("lib/has");
var appRouter = require("app.router");
var appLauncher = require("app.launcher");
var settings = require("config/settings");
var routes = require("config/routes");
var $ = require("libs.jquery");

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

    loadCSS: function(styles) {
        if (typeof styles === 'string') {
            styles = [styles];
        }
        if ($.isArray(styles)) {
            for (var i = 0; i < styles.length; ++i) {
                var style = styles[i];
                $("<style />").html(style).appendTo("head");
            }
        }
    },

    loadTemplateScripts: function(templates) {
        if (typeof templates === 'string') {
            templates = [templates];
        }
        if ($.isArray(templates)) {
            for (var i = 0; i < templates.length; ++i) {
                var template = templates[i];
                $("<div />").html(template).appendTo($("body"));
            }
        }
    }

};

});
