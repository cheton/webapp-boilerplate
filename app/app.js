// Change the current working directory to ensure that files are relative to the current directory.
process.chdir(__dirname);

// Module dependencies
var cluster = require('cluster'),
    express = require('express'),
    http = require('http');

var app = express(),
    env = app.settings.env;

var settings = require('./config/settings').init(app, express)(),
    logger = require('./lib/logger').init(settings.winston),
    i18n = require('i18next').init(settings.i18next);

var log = logger();

if (cluster.isMaster) {

    log.info('The app is running in ' + '%s'.bold.green + ' mode', env);
    log.info('Starting directory:', process.cwd());
    log.info('NodeJS-%s-%s-%s', process.version, process.platform, process.arch);
    log.info('Express-%s', express.version);

    // Fork workers
    var cpus = require('os').cpus().length;
    for (var i = 0; i < cpus; ++i) {
        cluster.fork();
    }

    // Event: message
    Object.keys(cluster.workers).forEach(function(id) {
        cluster.workers[id].on('message', function(msg) {
            if (msg.cmd === 'bonjour') {
                log.debug('Received a bonjour command from worker #%d(pid=%d)', this.id, this.process.pid);
                this.send({reply: 'ok'});
            }
        });
    });

    // Event: online
    cluster.on('online', function(worker) {
        log.info('The worker #%d(pid=%d) is online', worker.id, worker.process.pid);
    });

    // Event: listening
    cluster.on('listening', function(worker, address) {
        log.info('The worker #%d(pid=%d) is listening on ' + '%s:%d'.bold.red, worker.id, worker.process.pid, address.address, address.port);
    });

    // Event: disconnect
    cluster.on('disconnect', function(worker) {
        log.info('The worker #%d(pid=%d) has disconnected', worker.id, worker.process.pid);
    });

    // Event: exit
    cluster.on('exit', function(worker, code, signal) {
        var exitCode = worker.process.exitCode;
        log.info('The worker #%d(pid=%d) died (%d). restarting...', worker.id, worker.process.pid, exitCode);
        cluster.fork();
    });

} else if (cluster.isWorker) {

    require('./app.configure')(app);
    require('./app.main')(app);

    var server = http.createServer(app);
    server.listen(settings.port, function() {
        // Write your stuff
    });

    process.send({cmd: 'bonjour'});
    process.on('message', function(msg) {
        log.debug('Received a bonjour reply from master: %s', JSON.stringify(msg));
    });

}
