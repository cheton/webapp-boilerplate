// Module dependencies
var path = require('path'),
    express = require('express'),
    engines = require('consolidate'),
    logger = require('./lib/logger'),
    i18n = require('i18next'),
    settings = require('./config/settings');

module.exports = function() {
    // Main app
    var app = express();

    var env = process.env.NODE_ENV || 'development';
    if ('production' === env) {
        app.use(express.errorHandler());
        // a custom "verbose errors" setting which can be used in the templates via settings['verbose errors']
        app.disable('verbose errors'); // disable verbose errors in production
    }
    if ('development' === env) {
        app.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));

        // a custom "verbose errors" setting which can be used in the templates via settings['verbose errors']
        app.enable('verbose errors'); // enable verbose errors in development
    }

    logger.init(settings.winston);
    i18n.init(settings.i18next);

    var log = logger();

    // Register app.locals (app.helper):
    logger.registerAppHelper(app);

    // Register app.locals (app.helper):
    i18n.registerAppHelper(app);

    // Define view engine with its options
    for (var i = 0; i < settings.view.engines.length; ++i) {
        var extension = settings.view.engines[i].extension;
        var template = settings.view.engines[i].template;
        app.engine(extension, engines[template]);
    }
    app.set('view engine', settings.view.defaultExtension);
    app.set('views', path.resolve(__dirname, 'views'));

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
    app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m \x1b[34m:status\x1b[0m :response-time ms' }));
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
    if (settings.route) {
        app.use(settings.route, express.static(settings.asset));
    } else {
        app.use(express.static(settings.asset));
    }

    // "app.router" positions our routes 
    // above the middleware defined below,
    // this means that Express will attempt
    // to match & call routes _before_ continuing
    // on, at which point we assume it's a 404 because
    // no route has handled the request.
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

    // 404 status
    app.use(function(req, res, next) {
        res.status(404);

        // respond with html page
        if (req.accepts('html')) {
            res.render(path.join('common', '404.hogan'), { url: req.url });
            return;
        }

        // respond with json
        if (req.accepts('json')) {
            res.send({ error: 'Not found' });
            return;
        }

        // default to plain-text. send()
        res.type('txt').send('Not found');
    });

    // error-handling middleware, take the same form
    // as regular middleware, however they require an
    // arity of 4, aka the signature (err, req, res, next).
    // when connect has an error, it will invoke ONLY error-handling
    // middleware.

    // If we were to next() here any remaining non-error-handling
    // middleware would then be executed, or if we next(err) to
    // continue passing the error, only error-handling middleware
    // would remain being executed, however here
    // we simply respond with an error page.
    app.use(function(err, req, res, next) {
        // we may use properties of the error object
        // here and next(err) appropriately, or if
        // we possibly recovered from the error, simply next().
        res.status(err.status || 500);
        res.render(path.join('common', '500.jade'), { error: err });
    });

    // Route separation
    require('./app.routes')(app);

    return app;
};
