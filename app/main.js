// Change the current working directory to ensure that files are relative to the current directory.
process.chdir(__dirname);

// Module dependencies
var cluster = require('cluster');
require('colors');
require('string-format');

if (cluster.isMaster) {

    console.log('Starting directory:', process.cwd());
    console.log('NodeJS-%s-%s-%s', process.version, process.platform, process.arch);

    // Fork workers
    var cpus = require('os').cpus().length;
    for (var i = 0; i < cpus; ++i) {
        cluster.fork();
    }

    // Event: message
    Object.keys(cluster.workers).forEach(function(id) {
        cluster.workers[id].on('message', function(msg) {
            if (msg.cmd === 'bonjour') {
                console.log('Received a bonjour command from worker #%d(pid=%d)', this.id, this.process.pid);
                this.send({reply: 'ok'});
            }
        });
    });

    // Event: online
    cluster.on('online', function(worker) {
        console.log('The worker #%d(pid=%d) is online', worker.id, worker.process.pid);
    });

    // Event: listening
    cluster.on('listening', function(worker, address) {
        console.log('The worker #%d(pid=%d) is listening on ' + '%s:%d'.bold.red, worker.id, worker.process.pid, address.address, address.port);
    });

    // Event: disconnect
    cluster.on('disconnect', function(worker) {
        console.log('The worker #%d(pid=%d) has disconnected', worker.id, worker.process.pid);
    });

    // Event: exit
    cluster.on('exit', function(worker, code, signal) {
        var exitCode = worker.process.exitCode;
        console.log('The worker #%d(pid=%d) died (%d). restarting...', worker.id, worker.process.pid, exitCode);
        cluster.fork();
    });

} else if (cluster.isWorker) {

    require('./app');

    process.send({cmd: 'bonjour'});
    process.on('message', function(msg) {
        console.log('Received a bonjour reply from master: %s', JSON.stringify(msg));
    });

}
