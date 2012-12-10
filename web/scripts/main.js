(function() {

var _version = "";

// fake the "has" function for development mode
var has = has || function() { return false; };

requirejs.config({
    // baseUrl: The root path to use for all module lookups. 
    //baseUrl: "",

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
        "app": {
            version: _version
        }
    },

    /**
     * waitSeconds: The number of seconds to wait before giving up on loading a script. The
     * default is 7 seconds.
     */
    waitSeconds: 15,

    /**
     * context: A name to give to a loading context. This allows require.js to load multiple
     * versions of modules in a page, as long as each top-level require call specifies a unique
     * context string. To use it correctly, see the Multiversion Support section.
     */

    /**
     * deps: An array of dependencies to load. Useful when require is defined as a config object
     * before require.js is loaded, and you want to specify dependencies to load as soon as require()
     * is defined.
     */

    /**
     * callback: A function to pass to require that should be require after deps have been loaded.
     * Useful when require is defined as a config object before require.js is loaded, and you want to
     * specify a function to require after the configuration's deps array has been loaded.
     */

    /**
     * enforceDefine: If set to true, an error will be thrown if a script loads that does not call
     * define() or have a shim exports string value that can be checked. See Catching load failures
     * in IE for more information.
     */
    enforceDefine: false,

    /**
     * xhtml: If set to true, document.createElementNS() will be used to create script elements.
     */

    /**
     * urlArgs: Extra query string arguments appended to URLs that RequireJS uses to fetch
     * resources. Most useful to cache bust when the browser or server is not configured correctly.
     * Example cache bust setting for urlArgs:
     *
     *   urlArgs: "bust=" + (new Date()).getTime()
     *
     * During development it can be useful to use this, however be sure to remove it before deploying your code.
     */
    urlArgs: has("production") ? "v=" + _version : "v=" + (new Date()).getTime(),

    /** 
     * scriptType: Specify the value for the type="" attribute used for script tags inserted into the
     * document by RequireJS. Default is "text/javascript". To use Firefox's JavaScript 1.8
     * features, use "text/javascript;version=1.8". 
     */
    scriptType: "text/javascript"
});

/**
 * http://requirejs.org/docs/api.html#errors
 */
requirejs.onError = function(err) {
    console.log(err.requireType);
    if (err.requireType === "timeout") {
        console.log("modules: " + err.requireModules);
    }

    throw err;
};

requirejs.onResourceLoad = function(context, map, depArray) {
    if ( ! has("production")) {
        console.log("Loading: " + map.name + " at " + map.url);
    }
};

require(["common"], function() {
    require(["app"], function() {
        var app = require("app");
        app.init();
    });
});

})();
