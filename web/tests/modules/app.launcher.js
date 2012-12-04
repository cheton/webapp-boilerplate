define(function(require, exports, module) {
"use strict";

var _ = require("libs.underscore");
var appLauncher = require("../../scripts/app.launcher");

var foo = require("modules/app/foo"); // Foo module depends on Bar module
var bar = require("modules/app/bar"); // Bar module has no dependencies

test("appLauncher test", function() {
    equal(_.size(appLauncher.modules), 0, "No modules registered");

    // Test appLauncher.register function
    appLauncher.register("modules/app/foo", foo);
    equal(_.size(appLauncher.modules), 2, "Two modules loaded");
    equal(foo.registered, true, "Foo module is registered");
    equal(bar.registered, true, "Bar module is registered");
    equal(foo.ref_count, 0, "Foo module's reference count is equal to zero");
    equal(bar.ref_count, 1, "Bar module's reference count is increased by one");
    equal(foo.inited, false, "Foo module is not initialized");
    equal(bar.inited, false, "Bar module is not initialized");

    // Test appLauncher.init function
    appLauncher.init(foo);
    equal(foo.inited, true, "Foo module has initialized");
    equal(bar.inited, true, "Bar module has initialized");

    // Test appLauncher.unregister function
    appLauncher.unregister(foo);
    equal(_.size(appLauncher.modules), 0, "Two modules unloaded");
    equal(foo.registered, false, "Foo module is unregistered");
    equal(bar.registered, false, "Bar module is unregistered");
    equal(foo.ref_count, 0, "Foo module's reference count is equal to zero");
    equal(bar.ref_count, 0, "Bar module's reference count is equal to zero");

    // Test appLauncher.register function
    appLauncher.register("modules/app/bar", bar);
    equal(_.size(appLauncher.modules), 1, "One module loaded");
    equal(foo.registered, false, "Foo module is unregistered");
    equal(bar.registered, true, "Bar module is registered");
    equal(foo.ref_count, 0, "Foo module's reference count is equal to zero");
    equal(bar.ref_count, 0, "Bar module's reference count is equal to zero");
});

});
