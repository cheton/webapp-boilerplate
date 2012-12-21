// Module dependencies
var settings = require('./config/settings');

module.exports = function(app) {

    { // API
        var api = require('./routes/api');

        app.get(settings.route + 'api/locale/:__lng__', api.changeUserLanguage);
        app.all(settings.route + 'api/*', api.all);
    }

    { // General
        var site = require('./routes/site');
        app.get(settings.route + '*', site.view);
    }

    return module.exports;

};
