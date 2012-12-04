// Module dependencies
var express = require('express'),
    http = require('http'),
    util = require('util'),
    director = require('director');

// String utils
require('colors');
require('string-format');

var app = express(),
    env = app.settings.env,
    server = http.createServer(app);

var settings = require('./config/settings').init(app, express)();
require('./app.common')(app);

var log = app.locals.log;

server.listen(settings.port, function() {
    log.info(util.format('Express server listening on port ' + '%d'.bold.red + ' in ' + '%s'.bold.green + ' mode', settings.port, env));
    log.info(util.format('Using Express %s...', express.version.red.bold));
});

require('./app.main')(app);
