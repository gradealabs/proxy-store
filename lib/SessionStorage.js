"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SessionStorage = /** @class */ (function () {
    function SessionStorage() {
        if (!window) {
            throw new Error('SessionStorage requires window object in scope');
        }
        if (!window.sessionStorage) {
            throw new Error('SessionStorage requires window.sessionStorage object in scope');
        }
    }
    SessionStorage.prototype.setStore = function (store) {
        var payload;
        try {
            payload = JSON.stringify(store);
        }
        catch (e) {
            payload = null;
        }
        return window.sessionStorage.setItem('store', payload);
    };
    SessionStorage.prototype.getStore = function () {
        var payload = window.sessionStorage.getItem('store');
        try {
            return JSON.parse(payload);
        }
        catch (e) {
            return null;
        }
    };
    return SessionStorage;
}());
exports.default = SessionStorage;
