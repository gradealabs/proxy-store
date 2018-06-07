"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = withLocalStorage;

var _createConnect = _interopRequireDefault(require("./createConnect"));

var _localStorageStore = _interopRequireDefault(require("./localStorageStore"));

function withLocalStorage(mapStoreToValues) {
  return (0, _createConnect.default)(mapStoreToValues, _localStorageStore.default);
}