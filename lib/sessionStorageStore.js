"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createStore_1 = require("./createStore");
var MemoryStorage_1 = require("./MemoryStorage");
var SessionStorage_1 = require("./SessionStorage");
var storageEngine;
try {
    storageEngine = new SessionStorage_1.default();
}
catch (_) {
    storageEngine = new MemoryStorage_1.default();
}
var store = createStore_1.default(storageEngine);
exports.default = store;
