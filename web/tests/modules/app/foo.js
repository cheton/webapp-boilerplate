define(function(require, exports, module) {
"use strict";

var bar = require("modules/app/bar");

module.exports = {
    deps: {
        "modules/app/bar": bar
    },
    init: function() {
        console.log("i'm foo");
    }
};

});
