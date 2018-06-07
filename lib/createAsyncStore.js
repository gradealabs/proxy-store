"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAsyncStore;
exports.persistStore = exports.retrievePersistedStore = void 0;

var _ejson = _interopRequireDefault(require("ejson"));

var _publish = _interopRequireDefault(require("./publish"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

const retrievePersistedStore =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (asyncStorageEngine) {
    if (!asyncStorageEngine) {
      return;
    }

    let payload = yield asyncStorageEngine.getItem('store');

    try {
      return _ejson.default.parse(payload);
    } catch (e) {
      return null;
    }
  });

  return function retrievePersistedStore(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.retrievePersistedStore = retrievePersistedStore;

const persistStore =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (asyncStorageEngine, store) {
    if (!asyncStorageEngine) {
      return;
    }

    let payload;

    try {
      payload = _ejson.default.stringify(store);
    } catch (e) {
      payload = null;
    }

    return yield asyncStorageEngine.setItem('store', payload);
  });

  return function persistStore(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports.persistStore = persistStore;

function createAsyncStore(asyncStorageEngine = null) {
  let subscribers = {};
  let subId = 0;
  let storePending = true;
  let store = {};

  const onChange = change => {
    persistStore(asyncStorageEngine, store);
    (0, _publish.default)(subscribers, change);
  };

  retrievePersistedStore(asyncStorageEngine).then(persistedStore => {
    Object.assign(store, persistedStore || {});
    storePending = false;
    (0, _publish.default)(subscribers, {
      type: 'set',
      key: 'pending',
      value: storePending
    });
  });
  return {
    pending() {
      return storePending;
    },

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