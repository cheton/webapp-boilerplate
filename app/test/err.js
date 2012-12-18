
module.exports['404'] = function(req, res, next) {
    // trigger a 404 since no other middleware
    // will match /404 after this one, and we're not
    // responding here
    next();
};

module.exports['403'] = function(req, res, next) {
    // trigger a 403 error
    var err = new Error('Access Forbidden');
    err.status = 403;
    next(err);
};

module.exports['500'] = function(req, res, next) {
    // trigger a generic (500) error
    var err = new Error('Internal Server Error');
    next(err);
};
