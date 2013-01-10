// Module dependencies
var i18n = require('i18next'),
    settings = require('../config/settings'),
    log = require('../lib/logger')();

module.exports.all = [
    function requireAuthentication(req, res, next) {
        if (req.session && req.session.userName) {
            next();
        } else {
            res.redirect('/login?continue=' + req.url);
        }
    }
];

module.exports.changeUserLanguage = function(req, res) {
    var lng = req.params.__lng__;
    if (settings.supportedLngs.indexOf(lng) >= 0) {
        log.debug('Changed the language from %s to %s', i18n.lng(), lng);
        i18n.persistCookie(req, res, lng); // set cookie value for the language
        res.send(200);
    } else {
        log.warn('You cannot change the language to %s', lng);
        res.send(403);
    }
};

module.exports.status = function(req, res) {
    res.send({status: "ok"});
};
