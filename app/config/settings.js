var _ = require('underscore');

var settings = {
// Default settings
};

module.exports = function() {
    return settings;
};

module.exports.init = function(app, express) {
    // PRODUCTION
    if ('production' === app.settings.env) {
        var _settings = require('./production').init(app, express)();
        settings = _.extend(settings, _settings);
    }
    // DEVELOPMENT
    if ('development' === app.settings.env) {
        var _settings = require('./development').init(app, express)();
        settings = _.extend(settings, _settings);
    }

    return module.exports;
};
