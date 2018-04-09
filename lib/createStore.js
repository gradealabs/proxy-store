"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createStore(storageEngine) {
    if (storageEngine === void 0) { storageEngine = null; }
    var subscribers = [];
    var retrievePersistedStore = function () {
        if (!storageEngine) {
            return;
        }
        var payload = storageEngine.getItem('store');
        try {
            return JSON.parse(payload);
        }
        catch (e) {
            return null;
        }
    };
    var persistStore = function (store) {
        if (!storageEngine) {
            return;
        }
        var payload;
        try {
            payload = JSON.stringify(store);
        }
        catch (e) {
            payload = null;
        }
        return storageEngine.setItem('store', payload);
    };
    var publish = function (key, value) {
        subscribers.forEach(function (fn) {
            if (fn) {
                fn(key, value);
            }
        });
    };
    var store = retrievePersistedStore() || {};
    return {
        set: function (key, value) {
            var changed = JSON.stringify(value) !== JSON.stringify(store[key]);
            if (changed) {
                store[key] = value;
                persistStore(store);
                publish(key, value);
            }
            return store;
        },
        get: function (key) {
            return store[key];
        },
        deleteProperty: function (target, key) {
            if (key in target) {
                delete store[key];
                persistStore(store);
                publish(key, undefined);
                return store;
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
            var n = subscribers.push(fn);
            return {
                dispose: function () {
                    subscribers[n - 1] = null;
                }
            };
        }
    };
}
exports.default = createStore;
