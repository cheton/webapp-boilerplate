// Module dependencies
var path = require('path'),
    express = require('express'),
    i18n = require('i18next'),
    engines = require('consolidate'),
    settings = require('./config/settings')(),
    logger = require('./lib/logger');

/**
 * Express base configuration
 */
module.exports = function(app) {
    /**
     * Global configuration
     */
    app.configure(function() {
        // Register app.locals (app.helper):
        logger.registerAppHelper(app);

        // Register app.locals (app.helper):
        i18n.registerAppHelper(app);

        // Define view engine with its options
        app.engine('html', engines.hogan);
        app.set('views', path.resolve(__dirname, 'views'));
        app.set('view engine', 'html');

        // Enables reverse proxy support
        app.enable('trust proxy');
        app.enable('jsonp callback');

        // Set uncompressed html output and disable layout templating
        app.locals({
            pretty: true,
            layout: false
        });

        app.use(express.favicon());

        // Parses x-www-form-urlencoded request bodies (and json)
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        //app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m \x1b[34m:status\x1b[0m :response-time ms' }));
        app.use(express.cookieParser());
        app.use(express.session({
            cookie: {
                maxAge: 365 * 24 * 60 * 60 * 1000 // one year
            }, // 1 minute
            secret: settings.sessionSecret
        }));

        // ## CORS middleware
        // see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
        app.use(function(req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.header('Cache-Control', 'private, max-age=0');
            res.header('Expires', new Date().toUTCString());
                                                                                          
            if ('OPTIONS' === req.method) {
                res.send(200);
            } else {
                next();
            }
        });
        // i18next routing
        app.use(i18n.handle);

        // Static resources
        app.use(express.static(settings.webroot));

        // Routing with Express
        app.use(app.router);

        // Log errors
        app.use(function(err, req, res, next) {
            console.log(err.stack);
            next(err);
        });

        // Client errors
        app.use(function(err, req, res, next) {
            if (req.xhr) {
                res.send(500, {
                    error: 'Something blew up!'
                });
            } else {
                next(err);
            }
        });

        // 500 status
        app.use(function(err, req, res, next) {
            res.status(500).send(err);
        });

        // 404 status
        app.use(function(req, res, next) {
            res.status(404).end();
        });

    });

};
