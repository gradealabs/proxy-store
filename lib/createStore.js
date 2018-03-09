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
    var persistStore = function () {
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
    var publish = function (target, key, value) {
        subscribers.forEach(function (fn) {
            if (fn) {
                fn(target, key, value);
            }
        });
    };
    // Provide a subscribe method on the store that will notify the provided callback
    // with the target object that will be changed (set/del) along with key and value.
    // Returns an object (handle) with a dispose method that should be called to
    // unsubscribe.
    var subscribe = function (fn) {
        var n = subscribers.push(fn);
        return {
            dispose: function () {
                subscribers[n - 1] = null;
            }
        };
    };
    var store = retrievePersistedStore() || {};
    // Expose specific methods on the store
    Object.defineProperty(store, 'subscribe', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (fn) {
            return subscribe(fn);
        }
    });
    return new Proxy(store, {
        set: function (target, key, value) {
            var changed = JSON.stringify(value) !== JSON.stringify(target[key]);
            target[key] = value;
            if (changed) {
                persistStore();
                publish(target, key, value);
            }
            return true;
        },
        get: function (target, key) {
            return target[key];
        },
        deleteProperty: function (target, key) {
            if (key in target) {
                delete target[key];
                persistStore();
                publish(target, key, undefined);
                return true;
            }
            return false;
        }
    });
}
exports.default = createStore;
