define(function(require, exports, module) {
"use strict";

var io = require("libs.socket.io");

/**
 * Module Exports
 */
module.exports = {
    init: function(app) {
        var url = window.location.origin;
        var socket = io.connect(url);
        socket.on('connect', function() {
            socket.send('hi');
            socket.on('message', function(msg) {
                //console.log(msg);
            });
        });
    }
};

});
