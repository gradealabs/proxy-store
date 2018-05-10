"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = withLocalStorage;

var _createConnect = _interopRequireDefault(require("./createConnect"));

var _localStorageStore = _interopRequireDefault(require("./localStorageStore"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function withLocalStorage(mapStoreToValues) {
  return (0, _createConnect.default)(mapStoreToValues, _localStorageStore.default);
}