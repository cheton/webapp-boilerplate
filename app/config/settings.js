var _ = require('underscore');
var pkg = require('../../package.json');

var settings = { // Default settings
    // version from package.json
    version: pkg.version,
    uid: '', // UID
    gid: '', // GID
    port: process.env.PORT || 8000,
    multihost: {
        path: '../site',
        index: require('./multihost.json')
    },
    // Express view engine
    view: {
        /**
         * Set html (w/o dot) as the default extension
         */
        defaultExtension: 'html',
        
        /**
         * Format: <extension>: <template>
         */
        engines: [
            { // Hogan template with .html extension
                extension: 'html',
                template: 'hogan'
            },
            { // Hogan template with .hogan extension
                extension: 'hogan',
                template: 'hogan'
            },
            { // Jade template with .jade extension
                extension: 'jade',
                template: 'jade'
            }
        ]
    }
};

var env = process.env.NODE_ENV || 'development';
var _settings = {};

if ('development' === env) {
    _settings = require('./development');
    settings = _.extend(settings, _settings);
}
if ('production' === env) {
    _settings = require('./production');
    settings = _.extend(settings, _settings);
}

module.exports = settings;
