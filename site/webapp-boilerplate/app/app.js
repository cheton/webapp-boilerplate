// Module dependencies
var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    engines = require('consolidate'),
    logger = require('./lib/logger'),
    i18n = require('i18next'),
    settings = require('./config/settings');

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

module.exports = function() {
    // Main app
    var app = express();

    /**
     * Setup logger (winston)
     */
    logger.init(settings.winston);
    logger.registerAppHelper(app); // Register app.locals (app.helper)

    var log = logger();

    /**
     * Setup i18n (i18next)
     */
    i18n.init(settings.i18next);
    i18n.registerAppHelper(app); // Register app.locals (app.helper)

    /**
     * Settings
     */
    (function(app) {
        var env = process.env.NODE_ENV || 'development';
        if ('production' === env) {
            app.use(express.errorHandler());
            // a custom "verbose errors" setting which can be used in the templates via settings['verbose errors']
            app.disable('verbose errors'); // disable verbose errors in production
            app.enable('view cache'); // Enables view template compilation caching in production
        }
        if ('development' === env) {
            app.use(express.errorHandler({
                dumpExceptions: true,
                showStack: true
            }));
            // a custom "verbose errors" setting which can be used in the templates via settings['verbose errors']
            app.enable('verbose errors'); // enable verbose errors in development
            app.disable('view cache'); // Disables view template compilation caching in development
        }

        app.enable('trust proxy'); // Enables reverse proxy support, disabled by default
        app.enable('case sensitive routing'); // Enable case sensitivity, disabled by default, treating "/Foo" and "/foo"as the same
        app.enable('strict routing'); // Enable strict routing, by default "/foo" and "/foo/" are treated the same by the router

        for (var i = 0; i < settings.view.engines.length; ++i) {
            var extension = settings.view.engines[i].extension;
            var template = settings.view.engines[i].template;
            app.engine(extension, engines[template]);
        }
        app.set('view engine', settings.view.defaultExtension); // The default engine extension to use when omitted
        app.set('views', path.join(__dirname, 'views')); // The view directory path

        log.debug('app.settings: %j', app.settings);
    }(app));

    /**
     * Cross-origin resource sharing
     */
    app.use(middleware.cors());

    /**
     * Express middleware
     */
    app.use(express.favicon());
    app.use(express.bodyParser()); // Parses x-www-form-urlencoded request bodies (and json)
    app.use(express.methodOverride());
    app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m \x1b[34m:status\x1b[0m :response-time ms' }));
    app.use(express.cookieParser());
    app.use(express.session({ // TODO: use external session store for production
        cookie: {
            maxAge: 365 * 24 * 60 * 60 * 1000 // one year
        }, // 1 minute
        secret: settings.sessionSecret
    }));
    app.use(express.compress());
    if (settings.route) {
        app.use(settings.route, express.static(settings.asset));
    } else {
        app.use(express.static(settings.asset));
    }

    /**
     * i18n routing
     */
    app.use(i18n.handle);

    /**
     * app.router positions our routes above the middleware defined below,
     * this means that Express will attempt to match & call routes _before_
     * continuing on, at which point we assume it's a 404 because no route
     * has handled the request.
     */
    app.use(app.router);

    /**
     * Error handling
     */
    app.use(middleware.err_log());
    app.use(middleware.err_client());
    app.use(middleware.err_notfound());
    app.use(middleware.err_server());

    /**
     * Route separation
     */
    require('./app.routes')(app);

    return app;
};
