"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MemoryStorage = /** @class */ (function () {
    function MemoryStorage() {
        this.store = null;
    }
    MemoryStorage.prototype.setStore = function (value) {
        this.store = value;
    };
    MemoryStorage.prototype.getStore = function () {
        return this.store;
    };
    return MemoryStorage;
}());
exports.default = MemoryStorage;
