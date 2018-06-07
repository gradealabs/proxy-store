"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = withMemoryStorage;

var _createConnect = _interopRequireDefault(require("./createConnect"));

var _memoryStorageStore = _interopRequireDefault(require("./memoryStorageStore"));

function withMemoryStorage(mapStoreToValues) {
  return (0, _createConnect.default)(mapStoreToValues, _memoryStorageStore.default);
}