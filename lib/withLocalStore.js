"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createConnect_js_1 = require("./createConnect.js");
var localStorageStore_js_1 = require("./localStorageStore.js");
function withLocalStorage(mapStoreToValues) {
    return createConnect_js_1.default(mapStoreToValues, localStorageStore_js_1.default);
}
exports.default = withLocalStorage;
