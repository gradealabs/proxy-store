"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createConnect_1 = require("./createConnect");
var memoryStorageStore_1 = require("./memoryStorageStore");
function withMemoryStorage(mapStoreToValues, handlers) {
    return createConnect_1.default(mapStoreToValues, handlers, memoryStorageStore_1.default);
}
exports.default = withMemoryStorage;
