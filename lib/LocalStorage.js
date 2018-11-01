"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LocalStorage = /** @class */ (function () {
    function LocalStorage() {
    }
    LocalStorage.prototype.setStore = function (store) {
        var payload;
        try {
            payload = JSON.stringify(store);
        }
        catch (e) {
            payload = null;
        }
        return window.localStorage.setItem('store', payload);
    };
    LocalStorage.prototype.getStore = function () {
        var payload = window.localStorage.getItem('store');
        try {
            return JSON.parse(payload);
        }
        catch (e) {
            return null;
        }
    };
    return LocalStorage;
}());
exports.default = LocalStorage;
