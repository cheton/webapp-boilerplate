// Module dependencies
var settings = require('./config/settings')();

module.exports = function(app) {

    { // General
        var site = require('./routes/site');

        app.get(settings.webroot.route + '*', site.view);
    }

    { // API
        var api = require('./routes/api');

        app.get('/api/locale/:__lng__', api.changeUserLanguage);
        app.all('/api/*', api.all);
    }

    { // Test
        if ('development' === app.settings.env) { // Test
            var err = require('./test/err');

            app.get('/test/404', err['404']);
            app.get('/test/403', err['403']);
            app.get('/test/500', err['500']);
        }
    }

    return module.exports;

};
