"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function publish(subscribers, change) {
    if (change === void 0) { change = undefined; }
    var filtered = subscribers.filter(function (s) { return s; });
    for (var _i = 0, filtered_1 = filtered; _i < filtered_1.length; _i++) {
        var fn = filtered_1[_i];
        fn(change);
    }
}
exports.default = publish;
