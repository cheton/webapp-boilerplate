/*
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

module.exports.test = {
    setUp: function(done) {
        done();
    },
    'no args': function(test) {
        //test.equal(1, 0);
        test.done();
    }
};

/*
module.exports.test_404 = function(req, res, next) {
    // trigger a 404 since no other middleware
    // will match /404 after this one, and we're not
    // responding here
    next();
};

module.exports.test_403 = function(req, res, next) {
    // trigger a 403 error
    var err = new Error('Access Forbidden');
    err.status = 403;
    next(err);
};

module.exports.test_500 = function(req, res, next) {
    // trigger a generic (500) error
    var err = new Error('Internal Server Error');
    next(err);
};
*/
