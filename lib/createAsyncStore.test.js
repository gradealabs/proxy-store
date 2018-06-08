"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var createAsyncStore_1 = require("./createAsyncStore");
var makeAsyncStorageEngine = function () {
    var backingStore = {};
    return {
        setItem: function (key, value) { return Promise.resolve(backingStore[key] = value); },
        getItem: function (key) { return Promise.resolve(backingStore[key]); }
    };
};
describe('createAsyncStore', function () {
    describe('persistence', function () {
        it('should write as json stringified', function (done) {
            var asyncStorageEngine = makeAsyncStorageEngine();
            var store = { test: 1 };
            createAsyncStore_1.persistStore(asyncStorageEngine, store)
                .then(function () { return asyncStorageEngine.getItem('store'); })
                .then(function (result) { return assert.strictEqual(result, JSON.stringify(store)); })
                .then(done, done);
        });
        it('should read back store', function (done) {
            var asyncStorageEngine = makeAsyncStorageEngine();
            var store = { test: 1 };
            createAsyncStore_1.persistStore(asyncStorageEngine, store)
                .then(function () { return createAsyncStore_1.retrievePersistedStore(asyncStorageEngine); })
                .then(function (storeCopy) { return assert.deepStrictEqual(store, storeCopy); })
                .then(done, done);
        });
        it('retrieve should return undefined without a asyncStorageEngine', function (done) {
            createAsyncStore_1.retrievePersistedStore(null)
                .then(function (result) { return assert.strictEqual(result, undefined); })
                .then(done, done);
        });
    });
    describe('subscribe', function () {
        it('should throw if a non-function is passed to subscribe', function () {
            var asyncStorageEngine = makeAsyncStorageEngine();
            var store = createAsyncStore_1.default(asyncStorageEngine);
            assert.throws(function () {
                store.subscribe('this is not a function');
            });
        });
    });
    describe('integration', function () {
        it('should create a store without a asyncStorageEngine and .get without issue', function (done) {
            var store = createAsyncStore_1.default();
            var pendingHandle = store.subscribe(function () {
                if (!store.pending()) {
                    pendingHandle.dispose();
                    assert.strictEqual(store.get('test'), undefined);
                    done();
                }
            });
        });
        it('should create a store that can get', function (done) {
            var asyncStorageEngine = makeAsyncStorageEngine();
            asyncStorageEngine.setItem('store', JSON.stringify({ test: 1 }))
                .then(function () {
                var store = createAsyncStore_1.default(asyncStorageEngine);
                var pendingHandle = store.subscribe(function () {
                    if (!store.pending()) {
                        pendingHandle.dispose();
                        assert.strictEqual(store.get('test'), 1);
                        done();
                    }
                });
            });
        });
        it('should create a store that can set and publish', function (done) {
            var asyncStorageEngine = makeAsyncStorageEngine();
            var store = createAsyncStore_1.default(asyncStorageEngine);
            var pendingHandle = store.subscribe(function () {
                if (!store.pending()) {
                    pendingHandle.dispose();
                    store.subscribe(function () {
                        asyncStorageEngine.getItem('store')
                            .then(function (result) { return assert.strictEqual(result, JSON.stringify({ test: 1 })); })
                            .then(done, done);
                    });
                    store.set('test', 1);
                }
            });
        });
        it('should create a store that can set and publish only if changed', function (done) {
            var asyncStorageEngine = makeAsyncStorageEngine();
            var store = createAsyncStore_1.default(asyncStorageEngine);
            var subSpy = null;
            var pendingHandle = store.subscribe(function () {
                if (!store.pending()) {
                    pendingHandle.dispose();
                    subSpy = store.subscribe(function () {
                        asyncStorageEngine.getItem('store')
                            .then(function (result) { return assert.strictEqual(result, JSON.stringify({ test: 1 })); })
                            .then(function () { return subSpy.dispose(); })
                            .then(function () {
                            subSpy = store.subscribe(function () {
                                assert.fail('should not have published unchanged value');
                                subSpy.dispose();
                            });
                            store.set('test', 1);
                            done();
                        });
                    });
                    store.set('test', 1);
                }
            });
        });
        it('should create a store that can delete and publish', function (done) {
            var asyncStorageEngine = makeAsyncStorageEngine();
            asyncStorageEngine.setItem('store', JSON.stringify({ test: 1, other: 2 }))
                .then(function () {
                var store = createAsyncStore_1.default(asyncStorageEngine);
                var pendingHandle = store.subscribe(function () {
                    if (!store.pending()) {
                        pendingHandle.dispose();
                    }
                    store.subscribe(function () {
                        asyncStorageEngine.getItem('store')
                            .then(function (result) { return assert.strictEqual(result, JSON.stringify({ other: 2 })); })
                            .then(done, done);
                    });
                    store.deleteProperty('test');
                });
            });
        });
    });
});
