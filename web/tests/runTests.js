define(function(require, exports, module) {
"use strict";

var modules = [
    "modules/app.launcher"
];

var log = require("../scripts/lib/log").log;

function param(obj) {
    var serial = [];
    for (var name in obj) {
        var value = obj[name];
        if (typeof(value) == "string") {
            value = '"' + value + '"';
        } else if (typeof(value) == 'undefined') {
            value = "";
        }
        serial.push(name + '=' + value);
    }
    return serial.join(", ");
}

module.exports = function() {
    require(modules, function() {

        // Register a callback to fire whenever the test suite begins.
        QUnit.begin(function() {
            log("QUnit.begin:");
        });

        // Register a callback to fire whenever the test suite ends.
        QUnit.done(function(details) {
            log("QUnit.done:", param({
                failed: details.failed,
                passed: details.passed,
                total: details.total,
                runtime: details.runtime + "ms"
            }));
        });

        // Register a callback to fire whenever an assertion completes.
        QUnit.log(function(details) {
            log("QUnit.log:", param({
                result: details.result,
                actual: details.actual,
                expected: details.expected,
                message: details.message,
                source: details.source
            }));
        });

        // Register a callback to fire whenever a module begins.
        QUnit.moduleStart(function(details) {
            log("QUnit.moduleStart:", param({
                name: details.name
            }));
        });

        // Register a callback to fire whenever a module ends.
        QUnit.moduleDone(function(details) {
            log("QUnit.moduleDone:", param({
                name: details.name,
                failed: details.failed,
                passed: details.passed,
                total: details.total
            }));
        });

        // Register a callback to fire whenever a test begins.
        QUnit.testStart(function(details) {
            log("QUnit.testStart:", param({
                name: details.name,
                module: details.module
            }));
        });

        // Register a callback to fire whenever a test ends.
        QUnit.testDone(function(details) {
            log("QUnit.testDone:", param({
                name: details.name,
                module: details.module,
                failed: details.failed,
                passed: details.passed,
                total: details.total
            }));
        });

        QUnit.start();
    });
};

});
