/**
 * Multihost:
 * 
 * Setup multihost for the given `hosts`, `route` and `server`.
 *
 *  app.use(middleware.multihost({
 *      hosts: 'foo.com',
 *      server: fooApp
 *  }))
 *  app.use(middleware.multihost({
 *      hosts: 'bar.com',
 *      server: barApp
 *  }))
 *  app.use(middleware.multihost({
 *      hosts: '*.com',
 *      route: '/foo',
 *      server: fooApp
 *  }))
 *  app.use(middleware.multihost({
 *      hosts: '*.com',
 *      route: '/bar',
 *      server: barApp
 *  }))
 *  app.use(middleware.multihost({
 *      server: mainApp
 *  }))
 *
 * The `server` may be a Connect server or a regular Node `http.Server`.
 *
 * @param {String} hosts
 * @param {String} route
 * @param {Server} server
 * @return {Function}
 * @api public
 */

module.exports = function multihost(options) {
    var hosts = options.hosts;
    var route = options.route;
    var server = options.server;

    if (route && typeof(route) !== 'string') {
        throw new Error('multihost: route is not a string');
    }
    if ( ! server) {
        throw new Error('multihost: server required');
    }
    // hosts
    if (hosts) {
        var regexps = [];
        if (typeof hosts === 'string') {
            hosts = [hosts];
        }
        for (var i = 0; i < hosts.length; ++i) {
            regexps.push(new RegExp('^' + hosts[i].replace(/[*]/g, '(.*?)') + '$', 'i'));
        }
    }
    return function(req, res, next) {
        // hosts
        if (regexps) {
            if ( ! req.headers.host) {
                return next();
            }
            var hostname = req.headers.host.split(':')[0]; // e.g. localhost:8000

            for (var i = 0; i < regexps.length; ++i) {
                var regexp = regexps[i];
                if (regexp.test(hostname)) {
                    break;
                }
            }
            if (i === regexps.length) {
                return next();
            }
        }
        // route
        if (route && req.url.indexOf(route) !== 0)  {
            return next();
        }
        // server
        if (typeof(server) === 'function') {
            return server(req, res, next);
        }
        server.emit('request', req, res);
    };
};
