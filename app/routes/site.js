// Module dependencies
var path = require('path'),
    fs = require('fs'),
    i18n = require('i18next'),
    settings = require('../config/settings')();

module.exports.view = function(req, res, next) {

    var view = req.params[0] || 'index';
    var file = view + '.hogan';
    if (fs.existsSync(path.resolve(__dirname, '..', 'views', file))) {
        var lng = res.locals.i18n.lng();
        if (settings.supportedLngs.indexOf(lng) < 0) {
            lng = settings.i18next.fallbackLng || settings.supportedLngs[0];
            i18n.persistCookie(req, res, lng); // set cookie value for the languge
        }

        res.render(file, {
            'version': settings.version,
            'lang': lng,
            'title': res.locals.t('title'),
            'dir': res.locals.t('config:dir')
        });

        return;
    }

    next();
};
