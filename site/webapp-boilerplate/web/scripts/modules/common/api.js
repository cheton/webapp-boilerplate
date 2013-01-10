define(function(require, exports, module) {
"use strict";

var WebService = require("lib/webservice");

/**
 * Module Exports
 */
module.exports = {
    init: function(app) {
        app.api = new WebService({
            path: "/api"
        });
    }
};

});
