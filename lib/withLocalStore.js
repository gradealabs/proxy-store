"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createConnect_1 = require("./createConnect");
var localStorageStore_1 = require("./localStorageStore");
function withLocalStorage(mapStoreToValues, mapStoreToMethods) {
    return createConnect_1.default(mapStoreToValues, mapStoreToMethods, localStorageStore_1.default);
}
exports.default = withLocalStorage;
