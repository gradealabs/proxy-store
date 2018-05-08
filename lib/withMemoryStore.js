"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = withMemoryStorage;

var _createConnect = _interopRequireDefault(require("./createConnect"));

var _memoryStorageStore = _interopRequireDefault(require("./memoryStorageStore"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function withMemoryStorage(mapStoreToValues) {
  return (0, _createConnect.default)(mapStoreToValues, _memoryStorageStore.default);
}