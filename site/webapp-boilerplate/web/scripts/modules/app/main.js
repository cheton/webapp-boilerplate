define(function(require, exports, module) {
"use strict";

/**
 * Modules
 */
require("libs.bootstrap");

var log = require("lib/log");
var $ = require("libs.jquery");
var router = require("libs.director");
var app_config = require("modules/app/config");

var modules = {
    dashboard: require("modules/app/dashboard/main")
};

var routes = {
    '/dashboard': function() {
        modules['dashboard'].show();
    },
    '/reports': function() {},
    '/components': function() {},
    '/media': function() {},
    '/blog': function() {},
    '/help': function() {},
    '/faq': function() {},
    '/calendar': function() {},
    '/forms': function() {},
    '/tables': function() {}
};

/**
 * Backbone Model
 */
var AppModel = Backbone.Model.extend({
    defaults: {
        view: ""
    },
    // Validate data before you set or save it
    validate: function(attributes) {
        if ( ! attributes.view) {
            log.error("The view attribute is empty");
            return "The view attribute is empty";
        }
    },
    initialize: function() {
        this.on("change:view", function(model) {
            var previousView = this.previous("view");
            var activeView = model.get("view");

            $(".nav li a[data-view='" + previousView + "']").parent("li").removeClass("active");
            $(".nav li a[data-view='" + activeView + "']").parent("li").addClass("active");

            log.debug("Changed view from " + previousView + " to " + activeView);
        });
    }
});

/**
 * Backbone View
 */
var AppView = Backbone.View.extend({
    events: {
        "click .nav li:not(.dropdown)": "changeView"
    },
    initialize: function() {
        this.model = new AppModel();
    },
    render: function(app) {
        var _self = this;
        var activeView = location.hash;

        if ( ! activeView) {
            var defaultView = "#/dashboard";
            location.hash = activeView = defaultView;
        }

        $("body").i18n();

        // Client-side routing (aka hash-routing)
        router(routes).init();

        $(".nav li").each(function() {
            var $anchor = $(this).find('a');
            var view = $anchor.data("view");
            if ( ! view) {
                return;
            }
            log.info($anchor.attr("href"), activeView);
            if ($anchor.attr("href") === activeView) {
                _self.model.set({view: view});
            }
        });
    },

    changeView: function(e) {
        var $target = $(e.currentTarget);
        var view = $target.find("a").data("view");

        this.model.set({view: view});
    }

});

var _self;

/**
 * Module Exports
 */
module.exports = {

    deps: {
        "modules/app/dashboard": modules.dashboard
    },

    init: function(app) {

        app.api.get()
        .done(function(data) {
            log.info(data);
        })
        .fail(function(err) {
            log.error(err);
        });

        var appView = new AppView({
            /**
             * The "el" property references the DOM object created in the browser.
             */
            el: "body"
        });

        appView.render(app);
    }

};

});
