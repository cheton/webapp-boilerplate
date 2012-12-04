// Module dependencies
var path = require('path'),
    util = require('util'),
    i18n = require('i18next'),
    settings = require('./config/settings')();

module.exports = function(app) {

    var log = app.locals.log;

    function changeUserLanguage(req, res) {
        var lng = req.params.__lng__;
        if (settings.supportedLngs.indexOf(lng) >= 0) {
            log.debug(util.format('Changed the language from %s to %s', i18n.lng(), lng));
            i18n.persistCookie(req, res, lng); // set cookie value for the language
            res.send(200);
        } else {
            log.warn(util.format('You cannot change the language to %s', lng));
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
    app.get('/*.html', function(req, res) {
        var view = req.params[0];
        renderView(req, res, view);
    });

    // default route
    app.get('/', function(req, res) {
        renderView(req, res, 'index');
    });

    return module.exports;

};
