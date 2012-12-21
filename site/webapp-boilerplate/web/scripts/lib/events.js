define(function(require, exports, module) {
"use strict";

var $ = require("libs.jquery");
var Event;

/**
 * Module Exports
 */
module.exports = Event = function() {
    this.event_callbacks = {};
};

Event.prototype.add = function(id, fn) {
    if ( ! id  || typeof fn !== "function") {
        return;
    }

    if ( ! this.event_callbacks[id]) {
        this.event_callbacks[id] = $.Callbacks();
    }

    this.event_callbacks[id].add(fn);
};

Event.prototype.remove = function(id, fn) {
    if ( ! id || typeof fn !== "function") {
        return;
    }

    if (this.event_callbacks[id]) {
        this.event_callbacks[id].remove(fn);
    }
};

Event.prototype.fire = function(id, value) {
    if ( ! id) {
        return;
    }

    if (this.event_callbacks[id]) {
        this.event_callbacks[id].fire(value);
    }
};

});
