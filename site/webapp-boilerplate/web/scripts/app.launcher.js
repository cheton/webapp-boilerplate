define(function(require, exports, module) {
"use strict";

var defaults = {
    name: "",
    path: "",
    ref_count: 0,
    deps: [],
    init: function(applauncher) {},
    destroy: function(applauncher) {},
    registered: false,
    inited: false
};

var applauncher;
module.exports = applauncher = {
    modules: {},
    register: function(path, module) {
        if (module.registered) {
            return module;
        }

        // Register dependent modules
        var deps = module.deps;
        if (deps) {
            for (var _path in deps) {
                if ( ! deps.hasOwnProperty(_path)) {
                    continue;
                }
                var dep = deps[_path];
                if (typeof(dep) !== "object") {
                    continue;
                }
                applauncher.register(_path, dep);
                dep.ref_count++;
            }
        }

        // Fill in a given object with default properties.
        for (var prop in defaults) {
            if ( ! defaults.hasOwnProperty(prop)) {
                continue;
            }
            if (module[prop] == null) {
                module[prop] = defaults[prop];
            }
        }

        module.registered = true;
        module.path = path;

        applauncher.modules[module.path] = module;

        return module;
    },
    unregister: function(module, params) {
        // module dependencies
        var deps = module.deps;
        if (deps) {
            for (var _path in deps) {
                if ( ! deps.hasOwnProperty(_path)) {
                    continue;
                }
                var dep = deps[_path];
                if (dep.ref_count > 0) {
                    dep.ref_count--;
                }
                if (dep.ref_count <= 0 && dep.registered) {
                    applauncher.unregister(dep, params);
                }
            }
        }

        if (module.inited) {
            module.destroy(applauncher, params);
            module.inited = false;
        }

        delete applauncher.modules[module.path];
        module.registered = false;
        module.path = "";
    },
    init: function(module, params) {
        if (module.inited) {
            return;
        }

        // module dependencies
        var deps = module.deps;
        if (deps) {
            for (var _path in deps) {
                if ( ! deps.hasOwnProperty(_path)) {
                    continue;
                }
                var dep = deps[_path];
                if ( ! dep.inited) {
                    applauncher.init(dep, params);
                }
            }
        }

        if ( ! module.inited) {
            module.init(params);
            module.inited = true;
        }
    }
};

});
