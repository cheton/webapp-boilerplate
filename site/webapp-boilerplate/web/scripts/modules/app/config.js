define(function(require, exports, module) {
"use strict";

var _ = require("libs.underscore");

var defaults = {
    base: "", // with trailing slash (e.g. http://example.com/foo/bar/)
    baseurl: "", // without trailing slash (e.g. /foo/bar)
    signout: "about: blank",
    modules: [],
    username: ""
};

var config = (window.root.app && window.root.app.config) || {};

module.exports = _.defaults(config, defaults);

});
