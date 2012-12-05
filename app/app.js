// Module dependencies
var cluster = require('cluster'),
    express = require('express'),
    http = require('http'),
    util = require('util');

var app = express(),
    env = app.settings.env;

var settings = require('./config/settings').init(app, express)();
require('./app.common')(app);

var log = app.locals.log;

if (cluster.isMaster) {

    log.info(util.format('master #0(pid=%d) is running in ' + '%s'.bold.green + ' mode', process.pid, env));
    log.info(util.format('NodeJS-%s-%s', process.version, process.platform));
    log.info('Express-' + express.version);

    // Fork workers
    var cpus = require('os').cpus().length;
    for (var i = 0; i < cpus; ++i) {
        cluster.fork();
    }

    // Event: message
    Object.keys(cluster.workers).forEach(function(id) {
        cluster.workers[id].on('message', function(msg) {
            if (msg.cmd === 'bonjour') {
                log.debug(util.format('The master received a bonjour command from worker #%d(pid=%d)', this.id, this.process.pid));
                this.send({reply: 'ok'});
            }
        });
    });

    // Event: online
    cluster.on('online', function(worker) {
        log.info(util.format('The worker #%d(pid=%d) is online', worker.id, worker.process.pid));
    });

    // Event: listening
    cluster.on('listening', function(worker, address) {
        log.info(util.format('The worker #%d(pid=%d) is listening on ' + '%s:%d'.bold.red, worker.id, worker.process.pid, address.address, address.port));
    });

    // Event: disconnect
    cluster.on('disconnect', function(worker) {
        log.info(util.format('The worker #%d(pid=%d) has disconnected', worker.id, worker.process.pid));
    });

    // Event: exit
    cluster.on('exit', function(worker, code, signal) {
        var exitCode = worker.process.exitCode;
        log.info(util.format('The worker #%d(pid=%d) died (%d). restarting...', worker.id, worker.process.pid, exitCode));
        cluster.fork();
    });

} else if (cluster.isWorker) {

    require('./app.main')(app);

    var server = http.createServer(app);
    server.listen(settings.port, function() {
        // Write your stuff
    });

    process.send({cmd: 'bonjour'});
    process.on('message', function(msg) {
        log.debug(util.format('The worker #%d(pid=%d) received a bonjour reply from its master', cluster.worker.id, cluster.worker.process.pid));
    });

}
