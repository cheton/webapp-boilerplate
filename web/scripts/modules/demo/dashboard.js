define(function(require, exports, module) {
"use strict";

/**
 * Modules
 */
var log = require("utils/log");
var Backbone = require("libs.backbone");
var $ = require("libs.jquery");
var i18n = require("libs.i18next");

/**
 * Libraries
 */
require("libs.jquery-plugins.jsrender");

/**
 * Templates
 */
var templateScripts = require("text!modules/demo/tmpl.demo.html");
//var $templates = $("<div>" + templates + "</div>");

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
        log.debug("tmpl", $tmpl);

        var html = $tmpl.render();
        _self.$el.html(html); // $el is a jQuery object of the "el" property
        _self.$el.i18n();
    }
});

/**
 * Module Exports
 */
module.exports = {
    init: function(app) {
        var dashboard = new Dashboard({
            /**
             * The "el" property references the DOM object created in the browser.
             */
            el: "#container"
        });

        dashboard.render(app);

    }
};

});
