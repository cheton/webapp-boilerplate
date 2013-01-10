define(function(require, exports, module) {
"use strict";

var $ = require("libs.jquery");

/**
 * Represents a WebService
 * @class
 */
function WebService(options) {
    var _self = {};

    _self.path = options.path;

    // Called when the service object encounters an error.
    _self.onError = options.onError || function(error, e) {
    };

    /**
     * General-purpose AJAX command. Please use the other commands in preference to _self one.
     * Notes:
     * <ul>
     *   <li>The URL is relative to the path specfied in the WebService's constructor.</li>
     *   <li>Data is always sent as JSON.</li>
     *   <li>Data is expected to be an object instead of a string.</li>
     * </ul>
     * For asynchronous requests:
     * <ul>
     *   <li>On success, the done callback will be triggered with the data as the first argument.</li>
     *   <li>On fail, the fail callback will be triggered with the error object as the first argument.
     *       The ajax object will be provided as the second argument.</li>
     * </ul>
     * @example
     *   // Asynchronous requests
     *   $.ajax(...).done(function(data) {
     *     // Actual data. The result layer will be removed automatically
     *   }).fail(function(error, ajax) {
     *     // error has the error field of the resulting json if any
     *     // ajax is the ajax request
     *   });
     *
     *   // Synchronous requests
     *   ret = $.ajax(...);
     *   // ret is undefined if there was an error. The error object is in lastError().
     * @param {Object} options [Optional] Uses jQuery.ajax options.
     */
    _self.ajax = function(options) { 
        var get_error = function(o) {
            var ret = options.converters["text json"](o.responseText);
            var error = ret.error !== undefined ? ret.error : ret;
            return error;
        };
      
        options.url = _self.expandURL(options.url || "");
        options.type = options.type || "GET";
        if (options.type !== "GET") {
            var data = options.data || {};
            options.data = JSON.stringify(data);
            options.contentType = "application/json";
        }
        options.error = function(e) {
            _self.onError(get_error(e), e);
        };
        options.converters = {
            "text json" : function(data) {
                try {
                    var parsed = JSON.parse(data);
                    if (parsed.result !== undefined) {
                        return parsed.result;
                    } else {
                        return parsed;
                    }
                } catch(x) {
                    // Not a JSON object
                    return data;
                }
            }
        };
        options.cache = false;

        if (options.async) {
            // Asynchronous
            var def = $.Deferred();
            $.ajax(options).done(function(data) {
                def.resolveWith(null, [data]);
            }).fail(function(ajax) {
                def.rejectWith(ajax, [get_error(ajax)]);
            });
            return def;
        } else {
            // Synchronous, return answer directly
            var o = $.ajax(options);
            var ret = options.converters["text json"](o.responseText);
            if (o.status === 200) {
                _self._lastError = undefined;
                return ret;
            } else {
                _self._lastError = ret.error !== undefined ? ret.error : ret;
                return undefined;
            }
        }
    };

    /**
     * Issues an asynchronous GET request to the webservice
     * @param {String} url 
     * @param {Object} query [Optional] Only JSON stringifiable objects are allowed here.
     *                 For GET requests, _self becomes part of the query string.
     * @example
     *   var webservice = new WebService("http://foo/bar");
     *   webservice.get("baz");
     *   webservice.get("baz").done(function(data) {
     *     console.info(data);
     *   });
     */
    _self.get = function(url, query) {
        return _self.ajax({
            "url" : url,
            "data" : query,
            "async" : true
        });
    };

    /**
     * Issues a synchronous GET request to the webservice.
     * <br/><font color="red">WARNING! Synchronous requests will block browser execution. They should be avoided
     * in release code.</font>
     * @param {String} url 
     * @param {Object} query [Optional] Only JSON stringifiable objects are allowed here.
     *                 For GET requests, _self becomes part of the query string.
     * @example
     *   var webservice = new WebService("http://foo/bar");
     *   var ans = webservice.getSync("baz");
     */
    _self.getSync = function(url, query) {
        var options = {
            "url" : url,
            "data" : query,
            "async" : false
        };
      
        return _self.ajax(options);
    };

    /**
     * Issues an asynchronous PUT request to the webservice. The PUT command is used for "setting"
     * data.
     * @param {String} url 
     * @param {Object} data [Optional] Only JSON stringifiable objects are allowed here.
     * @example
     *   var webservice = new WebService("http://foo/bar");
     *   webservice.put("baz");
     *   webservice.put("baz").done(function(data) {
     *     console.info(data);
     *   });
     */
    _self.put = function(url, data) { 
        return _self.ajax({
            "url" : url,
            "data" : data,
            "async" : true,
            "type" : "PUT"
        });
    };

    /**
     * Issues a synchronous PUT request to the webservice. The PUT command is used for "setting"
     * data.
     * <br/><font color="red">WARNING! Synchronous requests will block browser execution. They should be avoided
     * in release code.</font>
     * @param {String} url 
     * @param {Object} data [Optional] Only JSON stringifiable objects are allowed here.
     * @example
     *   var webservice = new WebService("http://foo/bar");
     *   var ans = webservice.putSync("baz");
     */
    _self.putSync = function(url, data) {
        return _self.ajax({
            "url" : url,
            "data" : data,
            "async" : false,
            "type" : "PUT"
        });
    };

    /**
     * Issues an asynchronous POST request to the webservice. The POST command is used for "executing"
     * operations.
     * @param {String} url 
     * @param {Object} data [Optional] Only JSON stringifiable objects are allowed here.
     * @example
     *   var webservice = new WebService("http://foo/bar");
     *   webservice.put("baz");
     *   webservice.put("baz").done(function(data) {
     *     console.info(data);
     *   });
     */
    _self.post = function(url, data) {
        return _self.ajax({
            "url" : url,
            "data" : data,
            "async" : true,
            "type" : "POST"
        });
    };

    /**
     * Issues a synchronous POST request to the webservice. The POST command is used for "executing"
     * operations.
     * <br/><font color="red">WARNING! Synchronous requests will block browser execution. They should be avoided
     * in release code.</font>
     * @param {String} url 
     * @param {Object} data [Optional] Only JSON stringifiable objects are allowed here.
     * @example
     *   var webservice = new WebService("http://foo/bar");
     *   var ans = webservice.postSync("baz");
     */
    _self.postSync = function(url, data) {
        return _self.ajax({
            "url" : url,
            "data" : data,
            "async" : false,
            "type" : "POST"
        });
    };

    /**
     * Issues an asynchronous DELETE request to the webservice. The DELETE command is used for "deleting"
     * data.
     * @param {String} url 
     * @param {Object} data [Optional] Only JSON stringifiable objects are allowed here.
     * @example
     *   var webservice = new WebService("http://foo/bar");
     *   webservice.remove("baz");
     *   webservice.remove("baz").done(function(data) {
     *     console.info(data);
     *   });
     */
    _self.delete = function(url, data) {
        return _self.ajax({
            "url" : url,
            "data" : data,
            "async" : true,
            "type" : "DELETE"
        });
    };

    /**
     * Issues a synchronous DELETE request to the webservice. The DELETE command is used for "deleting"
     * data.
     * <br/><font color="red">WARNING! Synchronous requests will block browser execution. They should be avoided
     * in release code.</font>
     * @param {String} url 
     * @param {Object} data [Optional] Only JSON stringifiable objects are allowed here.
     * @example
     *   var webservice = new WebService("http://foo/bar");
     *   var ans = webservice.removeSync("baz");
     */
    _self.deleteSync = function(url, data) {
      return _self.ajax({
        "url" : url,
        "data" : data,
        "async" : false,
        "type" : "DELETE"
      });
    };

    /**
     * Used to expand URL to the actual URL _self will be used. Child classes
     * can override _self.
     * @param {String} url URL should not be undefined.
     * @return Full URL.
     */
    _self.expandURL = function(url) {
        return _self.path + "/" + url;
    };

    _self.lastError = function() {
        return _self._lastError;
    };

    return _self;
}

module.exports = WebService;

});
