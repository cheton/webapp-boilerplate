var _ = require('underscore');

var settings = { // Default settings
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

module.exports = function() {
    return settings;
};

module.exports.init = function(app, express) {
    var _settings = {};
    // PRODUCTION
    if ('production' === app.settings.env) {
        _settings = require('./production').init(app, express)();
        settings = _.extend(settings, _settings);
    }
    // DEVELOPMENT
    if ('development' === app.settings.env) {
        _settings = require('./development').init(app, express)();
        settings = _.extend(settings, _settings);
    }

    return module.exports;
};
