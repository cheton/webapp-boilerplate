var settings = {
};

module.exports = function() {
    return settings;
};

module.exports.init = function(app, express) {
    // PRODUCTION
    if ('production' === app.settings.env) {
        settings = require('./production').init(app, express)();
    }
    // DEVELOPMENT
    if ('development' === app.settings.env) {
        settings = require('./development').init(app, express)();
    }

    return module.exports;
};
