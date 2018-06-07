"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createStore = _interopRequireDefault(require("./createStore"));

var _MemoryStorage = _interopRequireDefault(require("./MemoryStorage"));

var isClient = typeof window !== 'undefined';
var storageEngine = new _MemoryStorage.default();
var store = (0, _createStore.default)(storageEngine);
var _default = store;
exports.default = _default;