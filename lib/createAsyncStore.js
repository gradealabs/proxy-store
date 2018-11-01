"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var publish_1 = require("./publish");
exports.retrievePersistedStore = function (asyncStorageEngine) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!asyncStorageEngine) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, asyncStorageEngine.getStore()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.persistStore = function (asyncStorageEngine, store) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!asyncStorageEngine) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, asyncStorageEngine.setStore(store)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
function createAsyncStore(asyncStorageEngine) {
    if (asyncStorageEngine === void 0) { asyncStorageEngine = null; }
    var subscribers = [];
    var storePending = true;
    var store = {};
    var onChange = function (change) {
        exports.persistStore(asyncStorageEngine, store);
        publish_1.default(subscribers, change);
    };
    exports.retrievePersistedStore(asyncStorageEngine).then(function (persistedStore) {
        Object.assign(store, persistedStore || {});
        storePending = false;
        publish_1.default(subscribers, { type: 'set', key: 'pending', value: storePending });
    });
    return {
        pending: function () {
            return storePending;
        },
        set: function (key, value) {
            var changed = value !== store[key];
            if (changed) {
                store[key] = value;
                onChange({ type: 'set', key: key, value: value });
            }
            return store;
        },
        get: function (key) {
            return store[key];
        },
        deleteProperty: function (key) {
            if (key in store) {
                delete store[key];
                onChange({ type: 'deleteProperty', key: key });
            }
            return store;
        },
        /**
         * Provide a subscribe method on the store that will notify the provided
         * callback with the target object that will be changed (set/del) along
         * with key and value.
         * Returns an object (handle) with a dispose method that should be called
         * to unsubscribe.
         */
        subscribe: function (fn) {
            if (typeof fn !== 'function') {
                throw new Error('subscribe expects a function as a parameter');
            }
            subscribers.push(fn);
            return {
                dispose: function () {
                    subscribers = subscribers.filter(function (cb) { return cb !== fn; });
                }
            };
        }
    };
}
exports.default = createAsyncStore;
