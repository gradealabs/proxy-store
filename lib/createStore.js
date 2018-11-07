"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var publish_1 = require("./publish");
exports.readStore = function (storageEngine) {
    if (!storageEngine) {
        return;
    }
    return storageEngine.getStore();
};
exports.writeStore = function (storageEngine, store) {
    if (!storageEngine) {
        return;
    }
    return storageEngine.setStore(store);
};
function createStore(storageEngine) {
    if (storageEngine === void 0) { storageEngine = null; }
    var subscribers = [];
    var storePending = true;
    var defaultCachedStore = {};
    var readCachedStore = function () {
        return (storageEngine && storageEngine.getCachedStore)
            ? storageEngine.getCachedStore()
            : defaultCachedStore;
    };
    var writeCachedStore = function (store) {
        if (storageEngine && storageEngine.setCachedStore) {
            storageEngine.setCachedStore(store);
        }
        else {
            defaultCachedStore = store;
        }
    };
    var lazyLoadPersistedStore = function () {
        var persistedStore = exports.readStore(storageEngine) || {};
        var store = Object.assign({}, persistedStore || {});
        writeCachedStore(store);
        storePending = false;
    };
    var onChange = function (change, store) {
        exports.writeStore(storageEngine, store);
        publish_1.default(subscribers, change);
    };
    var set = function (key, value, store) {
        var changed = value !== store[key];
        if (changed) {
            store[key] = value;
            onChange({ type: 'set', key: key, value: value }, store);
        }
    };
    var deleteProperty = function (key, store) {
        if (key in store) {
            delete store[key];
            onChange({ type: 'deleteProperty', key: key }, store);
        }
    };
    return {
        set: function (key, value) {
            if (storePending) {
                lazyLoadPersistedStore();
            }
            var store = readCachedStore();
            set(key, value, store);
            writeCachedStore(store);
        },
        get: function (key) {
            if (storePending) {
                lazyLoadPersistedStore();
            }
            var store = readCachedStore();
            return store[key];
        },
        deleteProperty: function (key) {
            if (storePending) {
                lazyLoadPersistedStore();
            }
            var store = readCachedStore();
            deleteProperty(key, store);
            writeCachedStore(store);
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
            if (storePending) {
                lazyLoadPersistedStore();
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
