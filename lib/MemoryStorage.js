"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.store = {};
    }
    setItem(key, value) {
        this.store[key] = value;
    }
    getItem(key) {
        return this.store[key];
    }
    removeItem(key) {
        delete this.store[key];
    }
}
exports.default = default_1;
