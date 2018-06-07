"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = publish;

var _keys = _interopRequireDefault(require("@babel/runtime/core-js/object/keys"));

function publish(subscribers, change) {
  var subIds = (0, _keys.default)(subscribers).map(parseFloat).sort();
  subIds.forEach(function (subId) {
    var fn = subscribers[subId];
    fn(change);
  });
}