/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

module.exports.rbac = {
    setUp: function(done) {
        this.rbac = require('../../../lib/middleware/rbac')({verbose: true});
        done();
    },
    tearDown: function(done) {
        this.rbac = undefined;
        done();
    },
    'for the authenticated user without locals': function(test) {
        var req = {user: { id: 'foo' }};
        var res = {};

        this.rbac(req, res, function (err) {
            if (err) {
                return test.done(err);
            }
            test.equal(req.user.isAuthenticated, true);
            test.equal(typeof(req.user.can), 'function');
            test.equal(typeof(req.user.is), 'function');
            test.done();
        });
    },
    'for the authenticated user with locals': function(test) {
        var req = {user: { id: 'foo' }};
        var res = {locals: {}};

        this.rbac(req, res, function (err) {
            if (err) {
                return test.done(err);
            }
            test.equal(req.user.isAuthenticated, true);
            test.equal(typeof(req.user.can), 'function');
            test.equal(typeof(req.user.is), 'function');
            test.equal(res.locals.user.isAuthenticated, true);
            test.equal(typeof(res.locals.user.can), 'function');
            test.equal(typeof(res.locals.user.is), 'function');
            test.done();
        });
    },
    'for the anonymous user without locals': function(test) {
        var req = {};
        var res = {};

        this.rbac(req, res, function (err) {
            if (err) {
                return test.done(err);
            }
            test.equal(req.user.isAuthenticated, false);
            test.equal(typeof(req.user.can), 'function');
            test.equal(typeof(req.user.is), 'function');
            test.done();
        });
    },
    'for the anonymous user with locals': function(test) {
        var req = {};
        var res = {locals: {}};

        this.rbac(req, res, function (err) {
            if (err) {
                return test.done(err);
            }
            test.equal(req.user.isAuthenticated, false);
            test.equal(typeof(req.user.can), 'function');
            test.equal(typeof(req.user.is), 'function');
            test.equal(res.locals.user.isAuthenticated, false);
            test.equal(typeof(res.locals.user.can), 'function');
            test.equal(typeof(res.locals.user.is), 'function');
            test.done();
        });
    },
};
