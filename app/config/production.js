var os = require('os');

var settings = {
    cluster: {
        maxWorkers: os.cpus().length || 1
    },
    winston: {
        prefix: '',
        transports: {
            Console: {
                level: 'info',
                silent: true,
                colorize: true,
                timestamp: true, // or function()
                json: false,
                handleExceptions: true
            },
            File: {
                level: 'info',
                silent: false,
                colorize: false,
                timestamp: true, // or function()
                filename: 'log/app%s.log',
                maxsize: 104857600,
                maxFiles: 10,
                json: true,
                handleExceptions: true
            }
        },
        exceptionHandlers: {
            File: {
                timestamp: true, // or function()
                filename: 'log/error%s.log',
                maxsize: 104857600,
                maxFiles: 10,
                json: true
            }
        }
    }
};

module.exports = settings;
