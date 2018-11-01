"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createStore_1 = require("./createStore");
var MemoryStorage_1 = require("./MemoryStorage");
var LocalStorage_1 = require("./LocalStorage");
var isClient = typeof window !== 'undefined';
var storageEngine = isClient ? new LocalStorage_1.default() : new MemoryStorage_1.default();
var store = createStore_1.default(storageEngine);
exports.default = store;
