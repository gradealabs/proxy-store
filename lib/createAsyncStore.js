"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAsyncStore;
exports.publish = exports.persistStore = exports.retrievePersistedStore = void 0;

var retrievePersistedStore = async function retrievePersistedStore(asyncStorageEngine) {
  if (!asyncStorageEngine) {
    return;
  }

  var payload = await asyncStorageEngine.getItem('store');

  try {
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
};

exports.retrievePersistedStore = retrievePersistedStore;

var persistStore = async function persistStore(asyncStorageEngine, store) {
  if (!asyncStorageEngine) {
    return;
  }

  var payload;

  try {
    payload = JSON.stringify(store);
  } catch (e) {
    payload = null;
  }

  return await asyncStorageEngine.setItem('store', payload);
};

exports.persistStore = persistStore;

var publish = function publish(subscribers, key, value) {
  subscribers.forEach(function (fn) {
    if (fn && typeof fn === 'function') {
      fn(key, value);
    }
  });
};

exports.publish = publish;

function createAsyncStore() {
  var asyncStorageEngine = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var subscribers = [];
  var storePending = true;
  var store = {};
  retrievePersistedStore(asyncStorageEngine).then(function (persistedStore) {
    Object.assign(store, persistedStore || {});
    storePending = false;
    publish(subscribers, '$pending', storePending);
  });
  return {
    pending: function pending() {
      return storePending;
    },
    set: function set(key, value) {
      var changed = JSON.stringify(value) !== JSON.stringify(store[key]);

      if (changed) {
        store[key] = value;
        persistStore(asyncStorageEngine, store);
        publish(subscribers, key, value);
      }

      return store;
    },
    get: function get(key) {
      return store[key];
    },
    deleteProperty: function deleteProperty(key) {
      if (key in store) {
        delete store[key];
        persistStore(asyncStorageEngine, store);
        publish(subscribers, key, undefined);
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
    subscribe: function subscribe(fn) {
      var n = subscribers.push(fn);
      return {
        dispose: function dispose() {
          subscribers[n - 1] = null;
        }
      };
    }
  };
}