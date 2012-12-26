/**
 * CORS middleware
 * see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
 */

module.exports = function cors() {
    return function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.header('Cache-Control', 'private, max-age=0');
        res.header('Expires', new Date().toUTCString());
                                                                                      
        if ('OPTIONS' === req.method) {
            res.send(200);
        } else {
            next();
        }
    };
};
