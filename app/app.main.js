// Module dependencies
var path = require('path'),
    fs = require('fs'),
    i18n = require('i18next'),
    settings = require('./config/settings')();

module.exports = function(app) {

    var log = app.locals.logger;

    function changeUserLanguage(req, res) {
        var lng = req.params.__lng__;
        if (settings.supportedLngs.indexOf(lng) >= 0) {
            log.debug('Changed the language from %s to %s', i18n.lng(), lng);
            i18n.persistCookie(req, res, lng); // set cookie value for the language
            res.send(200);
        } else {
            log.warn('You cannot change the language to %s', lng);
            res.send(403);
        }
    }

    function requireAuthentication(req, res, next) {
        if (req.session && req.session.userName) {
            next();
        } else {
            res.redirect('/login?continue=' + req.url);
        }
    }

    function renderView(req, res, view) {
        var lng = res.locals.i18n.lng();
        if (settings.supportedLngs.indexOf(lng) < 0) {
            lng = settings.i18next.fallbackLng || settings.supportedLngs[0];
            i18n.persistCookie(req, res, lng); // set cookie value for the languge
        }
        res.render(view, {
            'version': settings.version,
            'lang': lng,
            'title': res.locals.t('title'),
            'dir': res.locals.t('config:dir')
        });
    }


    // api: change user language
    app.get('/api/locale/:__lng__', [
        changeUserLanguage
    ]);

    // api: all
    app.all('/api/*', [
        requireAuthentication
    ]);

    // default view
    app.get('/*', function(req, res, next) {
        var view = req.params[0] || 'index';
        var file = view + '.hogan';
        if (fs.existsSync(path.resolve(__dirname, 'views', file))) {
            renderView(req, res, file);
            return;
        }

        next();
    });

    /* 
    app.get('/404', function(req, res, next){
        // trigger a 404 since no other middleware
        // will match /404 after this one, and we're not
        // responding here
        next();
    });

    app.get('/403', function(req, res, next){
        // trigger a 403 error
        var err = new Error('not allowed!');
        err.status = 403;
        next(err);
    });

    app.get('/500', function(req, res, next){
        // trigger a generic (500) error
        next(new Error('keyboard cat!'));
    });
    */

    return module.exports;

};
