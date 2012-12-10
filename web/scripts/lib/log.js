define(function(require, exports, module) {
"use strict";

function getISODateTime(d) {
    if (typeof d === 'undefined') {
        d = new Date();
    }

    function pad(number, length) {
        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }

    function getTimeZoneDesignator(d) {
        var tz_offset = d.getTimezoneOffset();
        var hour = pad(Math.abs(tz_offset / 60), 2);
        var minute = pad(Math.abs(tz_offset % 60), 2);
        tz_offset = ((tz_offset < 0) ? '+' : '-') + hour + ':' + minute;
        return tz_offset;
    }

    return (d.getFullYear() + "-" + pad(d.getMonth() + 1, 2) + "-" + pad(d.getDate(), 2) + "T" +
            pad(d.getHours(), 2) + ":" + pad(d.getMinutes(), 2) + ":" + pad(d.getSeconds(), 2) +
            getTimeZoneDesignator(d));
}

// Constants
var TRACE = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    NONE = 5,
    SEPARATOR = "\t";

function nullLogger(logger) {
}

function consoleLogger(logger) {
    if (window.console && window.console.log && window.console.log.apply) {
        var args = [];
        if (logger.datetime) {
            args.push(logger.datetime);
        }
        if (logger.level) {
            args.push(logger.level);
        }
        if (logger.prefix) {
            args.push(logger.prefix);
        }
        window.console.log.apply(window.console, args.concat(logger.args));
    }
}

var Log = function() {
    var _self = {};
    var _prefix = false;
    var _level = DEBUG;
    var _logger = consoleLogger;

    var _log = function(level, args) { 
        var d = new Date();
        _self.getLogger()({
            datetime: getISODateTime(d),
            level: level,
            prefix: _self.getPrefix(),
            args: Array.prototype.slice.call(args)
        });
    };

    _self.setPrefix = function(prefix) {
        if (typeof prefix !== 'undefined') {
            _prefix = prefix;
        } else {
            _prefix = false;
        }
    };

    _self.getPrefix = function() {
        return (_prefix !== false) ? _prefix : "";
    };

    _self.setLogger = function(logger) {
        if (typeof logger !== 'undefined' && typeof logger === 'function') {
            _logger = logger;
        } else if (typeof logger !== 'undefined' && typeof logger === 'string') {
            var log_loggers = {
                'console': consoleLogger
            };
            _logger = log_loggers[logger];
            if (typeof _logger === 'undefined') {
                _logger = nullLogger; // default
            }
        }
    };

    _self.getLogger = function() {
        return _logger;
    };

    _self.setLevel = function(level) {
        if (typeof level !== 'undefined' && typeof level === 'number') {
            _level = level;
        } else if (typeof level !== 'undefined' && typeof level === 'string') {
            var log_levels = {
                'trace': TRACE,
                'debug': DEBUG,
                'info': INFO,
                'warn': WARN,
                'error': ERROR
            };
            _level = log_levels[level];
            if (typeof _level === 'undefined') {
                _level = NONE; // default
            }
       }
    };

    _self.getLevel = function() {
        return _level;
    };

    _self.log = function() {
        _log("", arguments);
    };

    _self.trace = function() {
        var level = _level;
        if (level <= TRACE) {
            _log("T", arguments);
        }
    };

    _self.debug = function() {
        var level = _level;
        if (level <= DEBUG) {
            _log("D", arguments);
        }
    };

    _self.info = function() {
        var level = _level;
        if (level <= INFO) {
            _log("I", arguments);
        }
    };

    _self.warn = function() {
        var level = _level;
        if (level <= WARN) {
            _log("W", arguments);
        }
    };

    _self.error = function() {
        var level = _level;
        if (level <= ERROR) {
            _log("E", arguments);
        }
    };

    return _self;
};

var log = new Log();
module.exports = log;

});
