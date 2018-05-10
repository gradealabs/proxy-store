"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = publish;

function publish(subscribers) {
  var subIds = Object.keys(subscribers).map(parseFloat).sort();
  subIds.forEach(function (subId) {
    var fn = subscribers[subId];
    fn();
  });
}