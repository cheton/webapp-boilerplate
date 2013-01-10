define(function(require, exports, module) {
"use strict";

var _ = require("libs.underscore");

var defaults = {
    signout: "about: blank",
    modules: []
};

var app_config = (parent.app && parent.app.config) || {};

module.exports = _.defaults(app_config, defaults);

});
