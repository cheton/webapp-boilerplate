// Module dependencies
var winston = require('winston');

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

module.exports = {
    init: function(settings) {
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

        module.exports.log = logger;

        return module.exports;
    },
    registerAppHelper: function(app) {
        if (app.helpers) {
            app.helpers({
                log: {
                    trace: logger.trace,
                    debug: logger.debug,
                    info: logger.info,
                    warn: logger.warn,
                    error: logger.error
                }
            });
        } else {
            app.locals.log = {
                trace: logger.trace,
                debug: logger.debug,
                info: logger.info,
                warn: logger.warn,
                error: logger.error
            };
        }

        return logger;
    }
};
