define(function(require, exports, module) {
"use strict";

/**
 * Modules
 */
var log = require("lib/log");
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
var HelloWorld = Backbone.View.extend({
    initialize: function() {
        log.debug("HelloWorld: initialize");
    },
    events: { // Backbone View events
        "click button#btn-confirm": "doConfirm"
    },
    render: function(app) {
        var _self = this;

        log.debug("HelloWorld: render");

        app.loadTemplateScripts(templateScripts);

        /**
         * JsRender Example
         */
        var $tmpl = $("script[id='tmpl-advanced']");
        log.debug("tmpl", $tmpl);

        var html = $tmpl.render();
        _self.$el.html(html); // $el is a jQuery object of the "el" property
        _self.$el.i18n();

        /**
         * Attach a click event handler function for the confirm button
         */
        _self.$("button#btn-confirm").on("click", function() {
            log.debug("Clicked on the Confirm button");
        });
    },
    doConfirm: function() {
        log.debug("The doConfirm() function is called");
    }
});

/**
 * Module Exports
 */
module.exports = {
    init: function(app) {
        var helloWorld = new HelloWorld({
            /**
             * The "el" property references the DOM object created in the browser.
             */
            el: "#container"
        });

        helloWorld.render(app);

    }
};

});
