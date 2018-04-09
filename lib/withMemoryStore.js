"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createConnect_1 = require("./createConnect");
var memoryStorageStore_1 = require("./memoryStorageStore");
function withMemoryStorage(mapStoreToValues) {
    return createConnect_1.default(mapStoreToValues, memoryStorageStore_1.default);
}
exports.default = withMemoryStorage;
