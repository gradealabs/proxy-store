"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EJSON = require("ejson");
var publish_js_1 = require("./publish.js");
exports.retrievePersistedStore = function (storageEngine) {
    if (!storageEngine) {
        return;
    }
    var payload = storageEngine.getItem('store');
    try {
        return EJSON.parse(payload);
    }
    catch (e) {
        return null;
    }
};
exports.persistStore = function (storageEngine, store) {
    if (!storageEngine) {
        return;
    }
    var payload;
    try {
        payload = EJSON.stringify(store);
    }
    catch (e) {
        payload = null;
    }
    return storageEngine.setItem('store', payload);
};
function createStore(storageEngine) {
    if (storageEngine === void 0) { storageEngine = null; }
    var subscribers = [];
    var store = exports.retrievePersistedStore(storageEngine) || {};
    var onChange = function (change) {
        exports.persistStore(storageEngine, store);
        publish_js_1.default(subscribers, change);
    };
    return {
        set: function (key, value) {
            var changed = value !== store[key];
            if (changed) {
                store[key] = value;
                onChange({ type: 'set', key: key, value: value });
            }
            return store;
        },
        get: function (key) {
            return store[key];
        },
        deleteProperty: function (key) {
            if (key in store) {
                delete store[key];
                onChange({ type: 'deleteProperty', key: key });
            }
            return store;
        },
        /**
         * Provide a subscribe method on the store that will notify the provided
         * callback with the target object that will be changed (set/del) along
         * with key and value.
         * Returns an object (handle) with a dispose method that should be called
         * to unsubscribe.
         */
        subscribe: function (fn) {
            if (typeof fn !== 'function') {
                throw new Error('subscribe expects a function as a parameter');
            }
            subscribers.push(fn);
            return {
                dispose: function () {
                    subscribers = subscribers.filter(function (cb) { return cb !== fn; });
                }
            };
        }
    };
}
exports.default = createStore;
