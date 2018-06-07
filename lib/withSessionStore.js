"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = withSessionStorage;

var _createConnect = _interopRequireDefault(require("./createConnect"));

var _sessionStorageStore = _interopRequireDefault(require("./sessionStorageStore"));

function withSessionStorage(mapStoreToValues) {
  return (0, _createConnect.default)(mapStoreToValues, _sessionStorageStore.default);
}