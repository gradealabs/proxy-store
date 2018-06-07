"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class _default {
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

exports.default = _default;