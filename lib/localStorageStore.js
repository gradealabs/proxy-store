"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createStore_1 = require("./createStore");
var MemoryStorage_1 = require("./MemoryStorage");
var LocalStorage_1 = require("./LocalStorage");
var storageEngine;
try {
    storageEngine = new LocalStorage_1.default();
}
catch (_) {
    storageEngine = new MemoryStorage_1.default();
}
var store = createStore_1.default(storageEngine);
exports.default = store;
