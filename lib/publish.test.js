"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var publish_1 = require("./publish");
describe('publish', function () {
    it('should execute each function', function () {
        var counter = 0;
        var subscribers = {
            0: function () { return counter++; },
            1: function () { return counter++; },
            2: function () { return counter++; }
        };
        publish_1.default(subscribers);
        assert.strictEqual(counter, 3);
    });
    it('should execute each function in subscribers in numerical order of keys', function () {
        var counter = 0;
        var subscribers = {
            '5': function () {
                counter = counter + 5;
                assert.strictEqual(counter, 7);
            },
            '2': function () {
                counter = counter + 2;
                assert.strictEqual(counter, 2);
            },
            '8': function () {
                counter = counter + 8;
                assert.strictEqual(counter, 15);
            }
        };
        publish_1.default(subscribers);
    });
    it('should send change parameter to subscribers', function () {
        var subscribers = {
            0: function (a) { return assert.strictEqual(a, 1); },
            1: function (a) { return assert.strictEqual(a, 1); },
            2: function (a) { return assert.strictEqual(a, 1); }
        };
        publish_1.default(subscribers, 1);
    });
});
