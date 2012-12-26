var settings = require('./config/settings');

module.exports = function(server) {
    var io = require('socket.io').listen(server);

    /**
     * https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
     */
    io.configure('production', function() {
        // The following options are advised to be set in production
        io.enable('browser client minification');  // send minified client
        io.enable('browser client etag');          // apply etag caching logic based on version number
        io.enable('browser client gzip');          // gzip the file
        io.set('log level', 1);                    // reduce logging

        // enable all transports (optional if you want flashsocket support, please note that some hosting
        // providers do not allow you to create servers that listen on a port different than 80 or their
        // default port)
        io.set('transports', [
            'websocket',
            'flashsocket',
            'htmlfile',
            'xhr-polling',
            'jsonp-polling'
        ]);

        /**
         * Heroku has provided their own recommended set of options because they do not support WebSockets unlike other hosting services.
         * https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
         *
         * io.set("transports", ["xhr-polling"]); 
         * io.set("polling duration", 10); 
         */
    });

    io.configure('development', function() {
    });

    if (settings['socket.io'].redis) {
        var redis = require('socket.io/node_modules/redis'),
            pub = redis.createClient(),
            sub = redis.createClient(),
            client = redis.createClient();

        /**
         * If your Redis server uses a password, you must auth the client objects ahead of time, and 
         * you must pass in the redis module you used to create those clients as an option to the
         * RedisStore constructor:
         */
        /*
        pub.auth('password', function(err) {
            if (err) {
                throw err;
            }
        });
        sub.auth('password', function(err) {
            if (err) {
                throw err;
            }
        });
        client.auth('password', function(err) {
            if (err) {
                throw err;
            }
        });
        */

        var RedisStore = require('socket.io/lib/stores/redis');
        io.set('store', new RedisStore({
            redisPub: pub,
            redisSub: sub,
            redisClient: client
        }));
    }

    return io;
};
