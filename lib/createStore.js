"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createStore;
exports.persistStore = exports.retrievePersistedStore = void 0;

var _ejson = _interopRequireDefault(require("ejson"));

var _publish = _interopRequireDefault(require("./publish"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const retrievePersistedStore = storageEngine => {
  if (!storageEngine) {
    return;
  }

  let payload = storageEngine.getItem('store');

  try {
    return _ejson.default.parse(payload);
  } catch (e) {
    return null;
  }
};

exports.retrievePersistedStore = retrievePersistedStore;

const persistStore = (storageEngine, store) => {
  if (!storageEngine) {
    return;
  }

  let payload;

  try {
    payload = _ejson.default.stringify(store);
  } catch (e) {
    payload = null;
  }

  return storageEngine.setItem('store', payload);
};

exports.persistStore = persistStore;

function createStore(storageEngine = null) {
  let subscribers = {};
  let subId = 0;
  let store = retrievePersistedStore(storageEngine) || {};

  const onChange = change => {
    persistStore(storageEngine, store);
    (0, _publish.default)(subscribers, change);
  };

  return {
    set(key, value) {
      const changed = value !== store[key];

      if (changed) {
        store[key] = value;
        onChange({
          type: 'set',
          key,
          value
        });
      }

      return store;
    },

    get(key) {
      return store[key];
    },

    deleteProperty(key) {
      if (key in store) {
        delete store[key];
        onChange({
          type: 'deleteProperty',
          key
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
    subscribe(fn) {
      if (typeof fn !== 'function') {
        throw new Error('subscribe expects a function as a parameter');
      }

      subId = subId + 1;
      subscribers[subId] = fn;
      return {
        dispose() {
          delete subscribers[subId];
        }

      };
    }

  };
}