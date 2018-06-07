"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createStore;
exports.persistStore = exports.retrievePersistedStore = void 0;

var _ejson = _interopRequireDefault(require("ejson"));

var _publish = _interopRequireDefault(require("./publish"));

var retrievePersistedStore = function retrievePersistedStore(storageEngine) {
  if (!storageEngine) {
    return;
  }

  var payload = storageEngine.getItem('store');

  try {
    return _ejson.default.parse(payload);
  } catch (e) {
    return null;
  }
};

exports.retrievePersistedStore = retrievePersistedStore;

var persistStore = function persistStore(storageEngine, store) {
  if (!storageEngine) {
    return;
  }

  var payload;

  try {
    payload = _ejson.default.stringify(store);
  } catch (e) {
    payload = null;
  }

  return storageEngine.setItem('store', payload);
};

exports.persistStore = persistStore;

function createStore() {
  var storageEngine = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var subscribers = {};
  var subId = 0;
  var store = retrievePersistedStore(storageEngine) || {};

  var onChange = function onChange(change) {
    persistStore(storageEngine, store);
    (0, _publish.default)(subscribers, change);
  };

  return {
    set: function set(key, value) {
      var changed = value !== store[key];

      if (changed) {
        store[key] = value;
        onChange({
          type: 'set',
          key: key,
          value: value
        });
      }

      return store;
    },
    get: function get(key) {
      return store[key];
    },
    deleteProperty: function deleteProperty(key) {
      if (key in store) {
        delete store[key];
        onChange({
          type: 'deleteProperty',
          key: key
        });
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
      if (typeof fn !== 'function') {
        throw new Error('subscribe expects a function as a parameter');
      }

      subId = subId + 1;
      subscribers[subId] = fn;
      return {
        dispose: function dispose() {
          delete subscribers[subId];
        }
      };
    }
  };
}