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

var retrievePersistedStore =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(asyncStorageEngine) {
    var payload;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (asyncStorageEngine) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return");

          case 2:
            _context.next = 4;
            return asyncStorageEngine.getItem('store');

          case 4:
            payload = _context.sent;
            _context.prev = 5;
            return _context.abrupt("return", _ejson.default.parse(payload));

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](5);
            return _context.abrupt("return", null);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[5, 9]]);
  }));

  return function retrievePersistedStore(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.retrievePersistedStore = retrievePersistedStore;

var persistStore =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(asyncStorageEngine, store) {
    var payload;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (asyncStorageEngine) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt("return");

          case 2:
            try {
              payload = _ejson.default.stringify(store);
            } catch (e) {
              payload = null;
            }

            _context2.next = 5;
            return asyncStorageEngine.setItem('store', payload);

          case 5:
            return _context2.abrupt("return", _context2.sent);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function persistStore(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports.persistStore = persistStore;

function createAsyncStore() {
  var asyncStorageEngine = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var subscribers = {};
  var subId = 0;
  var storePending = true;
  var store = {};

  var onChange = function onChange(change) {
    persistStore(asyncStorageEngine, store);
    (0, _publish.default)(subscribers, change);
  };

  retrievePersistedStore(asyncStorageEngine).then(function (persistedStore) {
    Object.assign(store, persistedStore || {});
    storePending = false;
    (0, _publish.default)(subscribers, {
      type: 'set',
      key: 'pending',
      value: storePending
    });
  });
  return {
    pending: function pending() {
      return storePending;
    },
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