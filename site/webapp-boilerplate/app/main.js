var app = require('./app')();
var server = require('http').createServer(app);
var port = process.env.PORT || 8000;

server.listen(port, function() {
    var address = server.address();
    console.log('Server is listening on %s:%d', address.address, address.port);

    // Write your stuff
});
