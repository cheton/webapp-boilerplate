/**
 * Multihost:
 * 
 * Setup multihost for the given `hostname`, `route` and `server`.
 *
 *  app.use(middleware.multihost({
 *      hostname: 'foo.com',
 *      server: fooApp
 *  }))
 *  app.use(middleware.multihost({
 *      hostname: 'bar.com',
 *      server: barApp
 *  }))
 *  app.use(middleware.multihost({
 *      hostname: '*.com',
 *      route: '/foo',
 *      server: fooApp
 *  }))
 *  app.use(middleware.multihost({
 *      hostname: '*.com',
 *      route: '/bar',
 *      server: barApp
 *  }))
 *  app.use(middleware.multihost({
 *      server: mainApp
 *  }))
 *
 * The `server` may be a Connect server or a regular Node `http.Server`.
 *
 * @param {String} hostname
 * @param {String} route
 * @param {Server} server
 * @return {Function}
 * @api public
 */

module.exports = function multihost(options) {
    var hostname = options.hostname;
    var route = options.route;
    var server = options.server;

    if (hostname && typeof(hostname) !== 'string') {
        throw new Error('multihost hostname is not a string');
    }
    if (route && typeof(route) !== 'string') {
        throw new Error('multihost route is not a string');
    }
    if ( ! server) {
        throw new Error('multihost server required');
    }
    // hostname
    if (hostname) {
        var regexp = new RegExp('^' + hostname.replace(/[*]/g, '(.*?)') + '$', 'i');
        if (server.onvhost) {
            server.onvhost(hostname);
        }
    }
    return function(req, res, next) {
        // hostname
        if (hostname) {
            if ( ! req.headers.host) {
                return next();
            }
            var host = req.headers.host.split(':')[0];
            if ( ! regexp.test(host)) {
                return next();
            }
        }
        // route
        if (route && req.url.indexOf(route) !== 0)  {
            return next();
        }
        if (typeof(server) === 'function') {
            return server(req, res, next);
        }
        server.emit('request', req, res);
    };
};
