"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _default =
/*#__PURE__*/
function () {
  function _default() {
    (0, _classCallCheck2.default)(this, _default);
    this.store = {};
  }

  (0, _createClass2.default)(_default, [{
    key: "setItem",
    value: function setItem(key, value) {
      this.store[key] = value;
    }
  }, {
    key: "getItem",
    value: function getItem(key) {
      return this.store[key];
    }
  }, {
    key: "removeItem",
    value: function removeItem(key) {
      delete this.store[key];
    }
  }]);
  return _default;
}();

exports.default = _default;