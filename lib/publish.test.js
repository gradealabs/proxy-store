"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var publish_1 = require("./publish");
describe('publish', function () {
    it('should execute each function', function () {
        var counter = 0;
        var subscribers = [
            function () { return counter++; },
            function () { return counter++; },
            function () { return counter++; }
        ];
        publish_1.default(subscribers);
        assert.strictEqual(counter, 3);
    });
    it('should send change parameter to subscribers', function () {
        var subscribers = [
            function (a) { return assert.strictEqual(a, 1); },
            function (a) { return assert.strictEqual(a, 1); },
            function (a) { return assert.strictEqual(a, 1); }
        ];
        publish_1.default(subscribers, 1);
    });
});
