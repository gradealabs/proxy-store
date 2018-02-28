"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createStore_1 = require("./createStore");
const MemoryStorage_1 = require("./MemoryStorage");
const isClient = typeof window !== 'undefined';
const storageEngine = new MemoryStorage_1.default();
const store = createStore_1.default(storageEngine);
exports.default = store;
