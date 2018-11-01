"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createStore_js_1 = require("./createStore.js");
var MemoryStorage_js_1 = require("./MemoryStorage.js");
var isClient = typeof window !== 'undefined';
var storageEngine = isClient ? window.sessionStorage : new MemoryStorage_js_1.default();
var store = createStore_js_1.default(storageEngine);
exports.default = store;
