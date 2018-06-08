"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function publish(subscribers, change) {
    if (change === void 0) { change = undefined; }
    var subIds = Object.keys(subscribers).map(parseFloat).sort();
    subIds.forEach(function (subId) {
        var fn = subscribers[subId];
        fn(change);
    });
}
exports.default = publish;
