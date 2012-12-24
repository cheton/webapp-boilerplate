// Module dependencies
var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    engines = require('consolidate'),
    logger = require('./lib/logger'),
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

    var log = logger();

    // Register app.locals (app.helper):
    logger.registerAppHelper(app);

    // Define view engine with its options
    for (var i = 0; i < settings.view.engines.length; ++i) {
        var extension = settings.view.engines[i].extension;
        var template = settings.view.engines[i].template;
        app.engine(extension, engines[template]);
    }
    app.set('view engine', settings.view.defaultExtension);
    app.set('views', path.join(__dirname, 'views'));

    // Enables reverse proxy support
    app.enable('trust proxy');
    app.enable('jsonp callback');

    /**
     * Auto-load bundled middleware
     */
    var middleware = {};

    fs.readdirSync(__dirname + '/lib/middleware').forEach(function(filename) {
        if ( ! /\.js$/.test(filename)) {
            return;
        }
        var name = path.basename(filename, '.js');
        middleware[name] = require('./lib/middleware/' + name);
    });

    /**
     * Multihost
     */
    for (var i = 0; i < settings.multihost.index.length; ++i) {
        var options = settings.multihost.index[i];

        /**
         * Modules are cached after the first time they are loaded.
         * The cached module must be invalidated to ensure data-independence
         * in a multi-host environment.
         */
        var server_path = path.join(settings.multihost.path, options.server);
        if (require.cache[server_path]) {
            delete require.cache[server_path];
        }
        var server = require(server_path);
        if ( ! server) {
            log.error('The multi-host server does not exist: %s', server_path);
            return;
        }

        app.use(middleware.multihost({
            hosts: options.hosts,
            route: options.route,
            server: server(options.hosts, options.route)
        }));

        log.info('Attached a multi-host server: %j', options);
    }

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
            res.render('404.hogan', { url: req.url });
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
        res.render('500.jade', { error: err });
    });

    return app;
};
