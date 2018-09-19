"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function publish(subscribers, change) {
    if (change === void 0) { change = undefined; }
    for (var _i = 0, subscribers_1 = subscribers; _i < subscribers_1.length; _i++) {
        var fn = subscribers_1[_i];
        fn(change);
    }
}
exports.default = publish;
