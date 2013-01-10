define(function(require, exports, module) {
"use strict";

/**
 * Modules
 */
var log = require("lib/log");
var Backbone = require("libs.backbone");
var $ = require("libs.jquery");
var i18n = require("libs.i18next");
var app_config = require("modules/app/config");

/**
 * Libraries
 */
require("libs.jquery-plugins.jsrender");
require("libs.jquery-ui");

/**
 * Styles
 */
var style = require("text!modules/app/dashboard/dashboard.css");

/**
 * Templates
 */
var templateScripts = require("text!modules/app/dashboard/dashboard.tmpl.html");

/**
 * Backbone Views
 */
var Dashboard = Backbone.View.extend({
    initialize: function() {
    },
    render: function(app) {
        var _self = this;

        app.loadTemplateScripts(templateScripts);

        /**
         * JsRender Example
         */
        var $tmpl = $("script[id='tmpl-dashboard']");
        //log.debug("tmpl", $tmpl);

        var html = $tmpl.render();
        _self.$el.html(html); // $el is a jQuery object of the "el" property
        _self.$el.i18n();
    },
    show: function() {
        var _self = this;
        log.debug("dashboard: show");
    }
});

var _self;

/**
 * Module Exports
 */
module.exports = {
    init: function(app) {
        app.loadCSS(style);

        _self = new Dashboard({
            /**
             * The "el" property references the DOM object created in the browser.
             */
            el: ".content"
        });

        _self.render(app);
    },
    show: function() {
        _self.show();
    }
};

});
