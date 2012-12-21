define(function(require, exports, module) {
"use strict";

var $ = require("libs.jquery");

/**
 * This deferred object will trigger only when the deferred
 * objects that it "watches" have triggered.
 * @example
 *  var groups = that.getListSelected();
 *  var def = require("helpers/deferred").Deferred();
 *  groups.forEach(function(group) {
 *    var data = {
 *      action: "del",
 *      gid: group.get("gid")
 *    };
 *    def.watch(hmdm.mps.post("acctmgt/group", data))
 *  });
 *  def.done(function() {
 *    portal.model.getPath("group.all").invalidate();
 *  });
 * @class
 */

module.exports = {
    Deferred: function() {
        var ret = $.Deferred();
        ret.doneCount = ret.failCount = ret.totalCount = 0;
        ret.watch = function(d) {
            var that = this;
            ++that.totalCount;
            d.done(function() {
                ++that.doneCount;
                if (that.doneCount + that.failCount === that.totalCount) {
                    that.resolve();
                }
            });
            d.fail(function() {
                ++that.failCount;
                if(that.doneCount + that.failCount === that.totalCount) {
                    that.resolve();
                }
            });
            return d;
        };
        return ret;
    }
};

});
