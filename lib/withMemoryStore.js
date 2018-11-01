"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createConnect_js_1 = require("./createConnect.js");
var memoryStorageStore_js_1 = require("./memoryStorageStore.js");
function withMemoryStorage(mapStoreToValues) {
    return createConnect_js_1.default(mapStoreToValues, memoryStorageStore_js_1.default);
}
exports.default = withMemoryStorage;
