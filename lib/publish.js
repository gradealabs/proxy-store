"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = publish;

function publish(subscribers, change) {
  const subIds = Object.keys(subscribers).map(parseFloat).sort();
  subIds.forEach(subId => {
    const fn = subscribers[subId];
    fn(change);
  });
}