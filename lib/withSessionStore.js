"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = withSessionStorage;

var _createConnect = _interopRequireDefault(require("./createConnect"));

var _sessionStorageStore = _interopRequireDefault(require("./sessionStorageStore"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function withSessionStorage(mapStoreToValues) {
  return (0, _createConnect.default)(mapStoreToValues, _sessionStorageStore.default);
}