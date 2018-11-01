"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createConnect_js_1 = require("./createConnect.js");
var sessionStorageStore_js_1 = require("./sessionStorageStore.js");
function withSessionStorage(mapStoreToValues) {
    return createConnect_js_1.default(mapStoreToValues, sessionStorageStore_js_1.default);
}
exports.default = withSessionStorage;
