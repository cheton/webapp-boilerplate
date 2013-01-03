// Module dependencies
var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    engines = require('consolidate'),
    logger = require('./lib/logger'),
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
     * Multi-host
     */
    (function(app) {
        for (var i in settings.multihost) {
            if ( ! settings.multihost.hasOwnProperty(i)) {
                continue;
            }
            var options = settings.multihost[i];

            /**
             * Modules are cached after the first time they are loaded.
             * The cached module must be invalidated to ensure data-independence
             * in a multi-host environment.
             */
            var server_path = options.server;
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
    }(app));

    /**
     * Error handling
     */
    app.use(middleware.err_log());
    app.use(middleware.err_client({
        error: 'XHR error'
    }));
    app.use(middleware.err_notfound({
        view: '404.hogan',
        error: 'Not found'
    }));
    app.use(middleware.err_server({
        view: '500.jade',
        error: 'Internal server error'
    }));

    return app;
};
