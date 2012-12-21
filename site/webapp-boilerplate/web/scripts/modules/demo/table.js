define(function(require, exports, module) {
"use strict";

/**
 * Modules
 */
var log = require("lib/log");
var Backbone = require("libs.backbone");
var $ = require("libs.jquery");
var i18n = require("libs.i18next");
var _ = require("libs.underscore");
var data = require("json!modules/demo/table.json");

/**
 * Templates
 */
var templateScripts = require("text!modules/demo/tmpl.demo.html");
//var $templates = $("<div>" + templates + "</div>");

/**
 * Libraries
 */
require("libs.jquery-ui");
require("libs.jquery-plugins.dataTables");
require("libs.jquery-plugins.dataTables.themes.bootstrap");
require("libs.jquery-plugins.jsrender");

var TableView = Backbone.View.extend({
    initialize: function() {
    },
    render: function(app) {
        var _self = this;

        app.loadTemplateScripts(templateScripts);

        var $tmpl = $("script[id='tmpl-table']");
        var html = $tmpl.render({});
        _self.$el.html(html);

        /* Table initialisation */
        var oTable = _self.$('table#datatable').dataTable( {
            "sDom": "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
            "sPaginationType": "bootstrap",
            "oLanguage": {
                "sLengthMenu": "_MENU_ records per page"
            },
            "oTableTools": {
                "sRowSelect": "multi",
                "aButtons": ["select_all", "select_none"]
            },
            "aaData": data,
            "aoColumns": [
                { "sTitle": i18n.t("table:engine-name") },
                { "sTitle": i18n.t("table:browser") },
                { "sTitle": i18n.t("table:platform") },
                { "sTitle": i18n.t("table:engine-version") },
                { "sTitle": i18n.t("table:css-grade") }
            ]
        });
    }
});

/**
 * Module Exports
 */
module.exports = {
    init: function(app) {
        var tableView = new TableView({
            /**
             * The "el" property references the DOM object created in the browser.
             */
            el: "#container"
        });

        log.debug("tableView.render()");
        tableView.render(app);

    }
};

});
