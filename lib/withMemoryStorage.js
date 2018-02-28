"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createConnect_1 = require("./createConnect");
const memoryStorageStore_1 = require("./memoryStorageStore");
function withMemoryStorage(mapStoreToValues, mapStoreToMethods) {
    return createConnect_1.default(mapStoreToValues, mapStoreToMethods, memoryStorageStore_1.default);
}
exports.default = withMemoryStorage;
