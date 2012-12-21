define(function(require, exports, module) {
"use strict";

var $ = require("libs.jquery");
var style = require("text!modules/main/index.css");

module.exports = {
    init: function(app) {
        app.loadCSS(style);

        $(".masthead").hide().removeClass("hidden").fadeIn('fast');
    }
};

});
