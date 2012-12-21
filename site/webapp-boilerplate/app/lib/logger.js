// Module dependencies
var cluster = require('cluster'),
    winston = require('winston'),
    util = require('util');

// String utils
require('colors');
require('string-format');

// Default settings
var defaultSettings = {
    levels: {
        trace: 0,
        debug: 1,
        info: 2,
        warn: 3,
        error: 4
    },
    colors: {
        trace: 'magenta',
        debug: 'blue',
        info: 'green',
        warn: 'yellow',
        error: 'red'
    },
    exitOnError: function(err) {
        console.log('Error:', err);
        return false;
    }
};

// Store the logger instance
var logger;

function meta() {
    var _meta = {};
    if (cluster.isMaster) {
        _meta.id = 0;
        _meta.pid = process.pid;
    } else if (cluster.isWorker) {
        _meta.id = cluster.worker.id;
        _meta.pid = cluster.worker.process.pid;
    }
    return { meta: _meta };
}

module.exports = function() {
    var arr = [];
    if (logger.settings.prefix) { // prefix
        arr.push(logger.settings.prefix);
    }
    return {
        log: function() {
            var args = Array.prototype.slice.call(arguments);
            var level = args.shift();
            logger.log(level, util.format.apply(util.format, arr.concat(args)), meta());
        },
        trace: function() {
            var args = Array.prototype.slice.call(arguments);
            logger.trace(util.format.apply(util.format, arr.concat(args)), meta());
        },
        debug: function() {
            var args = Array.prototype.slice.call(arguments);
            logger.debug(util.format.apply(util.format, arr.concat(args)), meta());
        },
        info: function() {
            var args = Array.prototype.slice.call(arguments);
            logger.info(util.format.apply(util.format, arr.concat(args)), meta());
        },
        warn: function() {
            var args = Array.prototype.slice.call(arguments);
            logger.warn(util.format.apply(util.format, arr.concat(args)), meta());
        },
        error: function() {
            var args = Array.prototype.slice.call(arguments);
            logger.error(util.format.apply(util.format, arr.concat(args)), meta());
        }
    };
};

module.exports.init = function(settings) {
    if (cluster.isMaster) {
        settings.transports.File.filename = util.format(settings.transports.File.filename, '');
        settings.exceptionHandlers.File.filename = util.format(settings.exceptionHandlers.File.filename, '');
    } else if (cluster.isWorker) {
        settings.transports.File.filename = util.format(settings.transports.File.filename, ':' + cluster.worker.id);
        settings.exceptionHandlers.File.filename = util.format(settings.exceptionHandlers.File.filename, ':' + cluster.worker.id);
    }

    logger = new (winston.Logger)(defaultSettings);

    if ( ! settings.transports) {
        return;
    }

    if (settings.transports.Console) {
        logger.add(winston.transports.Console, settings.transports.Console);
    }

    if (settings.transports.File) {
        logger.add(winston.transports.File, settings.transports.File);
    }

    if (settings.exceptionHandlers && settings.exceptionHandlers.File) {
        logger.handleExceptions(
            new winston.transports.File(settings.exceptionHandlers.File)
        );
    }

    logger.settings = settings;

    return module.exports;
};

module.exports.registerAppHelper = function(app) {
    if (app.helpers) {
        app.helpers({logger: module.exports()});
    } else {
        app.locals.logger = module.exports();
    }

    return module.exports;
};
