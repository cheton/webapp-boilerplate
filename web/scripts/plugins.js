var root = this.parent || this;

// RequireJS Config Object
// define the config object as the global variable 'require' before require.js is loaded, and have the value applied automatically.
var require;

(function(global) {

// Avoid `console` errors in browsers that lack a console.
(function(global) {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}(global));

// RequireJS Config Object
require = (function(global) {
    var dataVersion = (new Date()).getTime();

    function scripts() {
        return document.getElementsByTagName('script');
    }

    /**
     * Helper function for iterating over an array backwards. If the func
     * returns a true value, it will break out of the loop.
     */
    function eachReverse(ary, func) {
        if (ary) {
            var i;
            for (i = ary.length - 1; i > -1; i -= 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    eachReverse(scripts(), function(script) {
        dataVersion = script.getAttribute('data-version');
        if (dataVersion) {
            return true;
        }
    });

    return {
        config: {
            "app": {
                version: dataVersion
            }
        },
        urlArgs: 'v=' + dataVersion,
        waitSeconds: 15
    };

}(global));

// Place any jQuery/helper plugins in here.

}(this));
