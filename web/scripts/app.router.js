define(function(require, exports, module) {
"use strict";

var log = require("utils/log");

var appRouter = module.exports = {
    
    init: function(settings) {
        var body = document.getElementsByTagName("body")[0];
        var dataRoute = body && body.getAttribute("data-route");
        if ( ! dataRoute) {
            log.error("Please check if the data-route attribute exists in the BODY element");
            return false;
        }

        var modules = [];
        var routes = ["*", dataRoute];
        for (var i in routes) {
            if ( ! routes.hasOwnProperty(i)) {
                continue;
            }
            var route = routes[i];
            var routeModules = settings.routes[route];
            if (routeModules) {
                modules = modules.concat(typeof(routeModules) === "string" ? [routeModules] : routeModules);
            }
        }

        if (modules.length > 0) {
            require(modules, function() {
                for (var i = 0; i < modules.length; ++i) {
                    var module = modules[i];
                    var object = require(module);

                    log.debug("Loading: route=" + route + ", module=" + module);

                    if (typeof settings.callback === 'function') {
                        settings.callback(module, object);
                    }
                }
            });
        } else {
            log.error("No module definition specified in the routes", routes);
        }
    }

};

});
