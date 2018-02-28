"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var default_1 = /** @class */ (function () {
    function default_1() {
        this.store = {};
    }
    default_1.prototype.setItem = function (key, value) {
        this.store[key] = value;
    };
    default_1.prototype.getItem = function (key) {
        return this.store[key];
    };
    default_1.prototype.removeItem = function (key) {
        delete this.store[key];
    };
    return default_1;
}());
exports.default = default_1;
