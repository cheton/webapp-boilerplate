define(function(require, exports, module) {
"use strict";

/**
 * Modules
 */
require("libs.bootstrap");

var log = require("lib/log");
var $ = require("libs.jquery");
var Backbone = require("libs.backbone");
var router = require("libs.director");

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
        var _self = this;

        if ( ! location.hash || location.hash.indexOf("#/") !== 0) {
            location.hash = "#/dashboard";
        }

        // Client-side routing (aka hash-routing)
        router(routes).init();

        this.$el.i18n();

        this.model = new AppModel();
        this.model.on("change:view", function(model) {
            var previousView = this.previous("view");
            var activeView = model.get("view");

            _self.$(".nav li a[data-view='" + previousView + "']").parent("li").removeClass("active");
            _self.$(".nav li a[data-view='" + activeView + "']").parent("li").addClass("active");

            log.debug("Changed view from " + previousView + " to " + activeView);
        });
    },
    render: function(app) {
        var view = location.hash.substring(2); // e.g. location.hash="#/dashboard", view="dashboard"
        this.navigate(view);
    },
    changeView: function(e) {
        var $target = $(e.currentTarget);
        var view = $target.find("a").data("view");

        this.navigate(view);
    },
    navigate: function(view) {
        if (typeof view === 'undefined') {
            return this.model.get("view");
        }
        this.model.set({view: view});
    }
});

var appView;

/**
 * Module Exports
 */
module.exports = {

    deps: {
        "modules/app/dashboard": modules.dashboard
    },
    init: function(app) {

        appView = new AppView({
            /**
             * The "el" property references the DOM object created in the browser.
             */
            el: "body"
        });
        appView.render(app);

        // Make API call
        app.api.get()
            .done(function(data) {
                log.info(data);
            })
            .fail(function(err) {
                log.error(err);
            });

    },
    view: function() {
        return appView;
    }

};

});
