define(function(require, exports, module) {
"use strict";

var $ = require("libs.jquery");
var rbac = require("libs.rbac");
var log = require("lib/log");
var settings = require("config/settings");

/**
 * Module Exports
 */
module.exports = {
    init: function(app) {
        var options = {
            role: "administrator",
            rules: {
                "administrator": {
                    permissions: [
                        "delete resources"
                    ],
                    inherits: ["moderator"]
                },
                "moderator": {
                    permissions: [
                        "edit resources",
                        "add resources"
                    ],
                    inherits: ['guest']
                },
                "guest": {
                    permissions: [
                        "view resources"
                    ],
                    inherits: []
                }
            }
        };

        rbac.init(options, function(rbac) {
            log.debug("rbac: role=" + rbac.role());
        });
    }
};

});
