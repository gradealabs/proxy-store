"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createConnect_1 = require("./createConnect");
var sessionStorageStore_1 = require("./sessionStorageStore");
function withSessionStorage(mapStoreToValues, handlers) {
    return createConnect_1.default(mapStoreToValues, handlers, sessionStorageStore_1.default);
}
exports.default = withSessionStorage;
