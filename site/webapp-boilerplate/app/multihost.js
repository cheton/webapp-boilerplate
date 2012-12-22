/**
 * Setup multi-host environment
 */
var settings = require('./config/settings');

module.exports = function(host, route) {
    // Change the default route
    settings.route = route;

    return require('./app')();
};
