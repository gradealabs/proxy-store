"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createStore = _interopRequireDefault(require("./createStore"));

var _MemoryStorage = _interopRequireDefault(require("./MemoryStorage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isClient = typeof window !== 'undefined';
var storageEngine = isClient ? window.sessionStorage : new _MemoryStorage.default();
var store = (0, _createStore.default)(storageEngine);
var _default = store;
exports.default = _default;