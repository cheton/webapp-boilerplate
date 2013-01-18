(function() {
    requirejs.config({
        /**
         * path mappings for module names not found directly under baseUrl.
         * The path settings are assumed to be relative to baseUrl, unless
         * the paths setting starts with a "/" or has a URL protocol in it
         * ("like http:"). In those cases, the path is determined relative
         * to baseUrl. Using the above sample config, "some/module"'s script
         * tag will be src="/another/path/some/v1.0/module.js".
         * The path that is used for a module name should not include the
         * .js extension, since the path mapping could be for a directory.
         * The path mapping code will automatically add the .js extension
         * when mapping the module name to a path.
         */
        paths: {
            // Modernizr
            "libs.modernizr": "../libraries/modernizr/2.6.2/modernizr-2.6.2",

            // Socket.IO
            "libs.socket.io": "../libraries/socket.io/0.9.11/socket.io",

            // Director
            "libs.director": "../libraries/director/1.1.6/director-1.1.6",

            // RBAC
            "libs.rbac": "../libraries/rbac/0.1.2/rbac",

            // i18next
            "libs.i18next": "../libraries/i18next/1.5.8/i18next-1.5.8",

            // Underscore
            "libs.underscore": "../libraries/underscore/1.4.3/underscore",

            // Backbone
            "libs.backbone": "../libraries/backbone/0.9.2/backbone",

            // Bootstrap
            "libs.bootstrap": "../libraries/bootstrap/2.2.2/js/bootstrap",

            // jQuery
            "libs.jquery": "../libraries/jquery/1.8.3/jquery-1.8.3",

            // jQuery UI
            "libs.jquery-ui": "../libraries/jquery-ui/1.9.2/jquery-ui",

            // jQuery Plugins
            "libs.jquery-plugins.dataTables": "../libraries/jquery-plugins/jquery-dataTables/1.9.0/jquery.dataTables",
            "libs.jquery-plugins.dataTables.themes.bootstrap": "../libraries/jquery-plugins/jquery-dataTables/1.9.0/themes/DT_bootstrap",
            "libs.jquery-plugins.jsrender": "../libraries/jquery-plugins/jsrender/1.0pre/jsrender",

            // RequireJS Plugins
            "text": "../libraries/requirejs-plugins/text/2.0.3/text",
            "domReady": "../libraries/requirejs-plugins/domReady/2.0.1/domReady",
            "cs": "../libraries/requirejs-plugins/cs/0.4.3/cs",
            "i18n": "../libraries/requirejs-plugins/i18n/2.0.1/i18n",
            "json": "../libraries/requirejs-plugins/json/0.2.1/json"
        },

        /**
         * Configure the dependencies and exports for older, traditional "browser globals"
         * scripts that do not use define() to declare the dependencies and set a module value. 
         */
        shim: {
            // Director
            "libs.director": {
                exports: "Router"
            },

            // Modernizr
            "libs.modernizr": {
                exports: "Modernizr"
            },

            "libs.rbac": {
                deps: ["libs.jquery"],
                exports: "rbac"
            },

            // i18next
            "libs.i18next": {
                deps: ["libs.jquery"],
                exports: "i18n"
            },

            // Underscore
            "libs.underscore": {
                exports: "_"
            },

            // Backbone
            "libs.backbone": {
                // These script dependencies should be loaded before loading backbone.js
                deps: ["libs.underscore", "libs.jquery"],
                // Once loaded, use the global 'Backbone' as the module value.
                exports: "Backbone"
            },

            // jQuery
            "libs.jquery": {
                exports: "$"
            },

            // jQuery UI
            "libs.jquery-ui": {
                deps: ["libs.jquery"]
            },

            // jQuery Plugins
            "libs.jquery-plugins.dataTables": {
                deps: ["libs.jquery"]
            },
            "libs.jquery-plugins.dataTables.themes.bootstrap": {
                deps: ["libs.jquery-plugins.dataTables"]
            },
            "libs.jquery-plugins.jsrender": {
                deps: ["libs.jquery"]
            }
        },

        /**
         * map: For the given module prefix, instead of loading the module with the given ID,
         * substitute a different module ID.
         *
         * This sort of capability is really important for larger projects which may have two sets of
         * modules that need to use two different versions of 'foo', but they still need to cooperate with
         * each other.
         *
         * This is not possible with the context-backed multiversion support. In addition, the paths
         * config is only for setting up root paths for module IDs, not for mapping one module ID to
         * another one.
         */
        map: {
        },

        /**
         * There is a common need to pass configuration info to a module. That configuration
         * info is usually known as part of the application, and there needs to be a way to pass that down
         * to a module. In RequireJS, that is done with the config option for requirejs.config().
         * Modules can then read that info by asking for the special dependency "module" and calling
         * module.config().
         */
        config: {
        },

        /**
         * packages: configures loading modules from CommonJS packages.
         * See the packages topic for more information.
         * This will instruct require.js to load "<your-script-path>/main.js".
         */
        packages: [
        ]

    });
})();
