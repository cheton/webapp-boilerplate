var fnList = [];
var failureHandler = function failureHandler(req, res, action) {
    res.send(403);
};
var defaultUser = {};
var verbose = false;

function tester(req, verb) {
    return function(action) {
        var result = null;
        var vote = false;
        var stop = false;
        function stopNow(vote) {
            stop = true;
            if (vote === false){ 
                result = false;
            } else if (vote === true) {
                result = true;
            }
        }
        for (var i = 0; i < fnList.length && ! stop; i++) {
            var fn = fnList[i];
            vote = fn.call(req, req.user, action, stopNow);
            if (vote === false) {
                stop = true; 
                result = false;
            } else if (vote === true) {
                result = true;
            }
        }
        if (module.exports.verbose) {
            console.log('Check Permission: ' + (req.user.id || req.user.name || 'user') + '.' + (verb || 'can') + '(\'' + action + '\') -> ' + (result === true));
        }
        return (result === true);
    };
}

function attachHelpers(req, obj) {
    var oldUser = req.user;
    obj.user = req.user || Object.create(defaultUser);
    if (oldUser) {
        obj.user.isAuthenticated = true;
    } else {
        obj.user.isAuthenticated = false;
    }
    if (obj.user) {
        obj.user.is = tester(req, 'is');
        obj.user.can = tester(req, 'can');
    }
}

function routeTester(verb) {
    return function (action) {    
        return function(req,res,next) {
            if (tester(req,verb)(action)) {
                next();
            } else {
                // Failed authentication.
                failureHandler(req, res, action);    
            }
        };
    };
}

module.exports = function rbac(options) {
    options = options || {};

    failureHandler = options.failureHandler || failureHandler;
    defaultUser = options.defaultUser || defaultUser;
    verbose = options.verbose || verbose;

    return function(req, res, next) {
        if (res.locals) {
            attachHelpers(req, res.locals);
        }
        attachHelpers(req, req);
        next();
    };
};

module.exports.can = routeTester('can');

module.exports.is = routeTester('is');

module.exports.isAuthenticated = function isAuthenticated(req, res, next) {
    if (arguments.length === 0) {
        return isAuthenticated;
    }
    if (req.user && req.user.isAuthenticated === true) {
        next();
    } else if (req.user) {
        failureHandler(req, res, 'isAuthenticated');
    } else {
        throw new Error('Request.user was null or undefined, include middleware');
    }
};

module.exports.useAuthorizationStrategy = function useAuthorizationStrategy(path, fn) {
    if (typeof path === 'function'){
        fn = path;
    }
    fnList.push(function(user, action, stop) {
        if (typeof path === 'string' && path !== action){
            return null;
        }
        return fn.call(this, user, action, stop);
    });
    return this;
};
