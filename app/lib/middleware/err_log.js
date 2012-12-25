/**
 * Middleware: err_log
 */

module.exports = function err_log() {
    return function(err, req, res, next) {
        console.log(err.stack);
        next(err);
    };
};
