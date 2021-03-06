// Change the current working directory to ensure that files are relative to the current directory.
process.chdir(__dirname);

// Module dependencies
var cluster = require('cluster');
require('colors');
require('string-format');

var settings = require('./config/settings'); // the configuration settings have been initialized

if (cluster.isMaster) {

    console.log('Starting directory:', process.cwd());
    console.log('NodeJS-%s-%s-%s', process.version, process.platform, process.arch);

    // Fork workers
    for (var i = 0; i < settings.cluster.maxWorkers; ++i) {
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

    var app = require('./app')(),
        server = require('http').createServer(app),
        io = require('./socket.io')(server);

    server.listen(settings.port, function() {
        // Lower the process privileges by setting the GID and UID after the process has mount to the port.
        if (settings.gid) {
            process.setgid(settings.gid);
        }
        if (settings.uid) {
            process.setuid(settings.uid);
        }
        var address = server.address();
        console.log('Server is listening on %s:%d', address.address, address.port);
    });

    process.send({cmd: 'bonjour'});
    process.on('message', function(msg) {
        console.log('Received a bonjour reply from master: %s', JSON.stringify(msg));
    });

    io.sockets.on('connection', function(socket) {
        socket.on('message', function(msg) {
            console.log('Received a message: %s', msg);
            socket.emit('message', { 'status': 'ok' });
        });
        socket.on('disconnect', function() {
            console.log('Disconnected');
        });
    });

}
