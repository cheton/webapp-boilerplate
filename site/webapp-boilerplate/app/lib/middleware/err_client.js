/**
 * Middleware: err_client
 */

module.exports = function err_client() {
    return function(err, req, res, next) {
        if (req.xhr) {
            res.send(500, {
                error: 'Something blew up!'
            });
        } else {
            next(err);
        }
    };
};
