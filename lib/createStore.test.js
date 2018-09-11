"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var createStore_1 = require("./createStore");
var makeStorageEngine = function () {
    var backingStore = {};
    return {
        setItem: function (key, value) { return backingStore[key] = value; },
        getItem: function (key) { return backingStore[key]; }
    };
};
describe('createStore', function () {
    describe('persistence', function () {
        it('should write as json stringified', function () {
            var storageEngine = makeStorageEngine();
            var store = { test: 1 };
            createStore_1.persistStore(storageEngine, store);
            assert.strictEqual(storageEngine.getItem('store'), JSON.stringify(store));
        });
        it('should read back store', function () {
            var storageEngine = makeStorageEngine();
            var store = { test: 1 };
            createStore_1.persistStore(storageEngine, store);
            var storeCopy = createStore_1.retrievePersistedStore(storageEngine);
            assert.deepStrictEqual(store, storeCopy);
        });
        it('retrieve should return undefined without a storageEngine', function () {
            assert.strictEqual(createStore_1.retrievePersistedStore(null), undefined);
        });
    });
    describe('subscribe', function () {
        it('should throw if a non-function is passed to subscribe', function () {
            var storageEngine = makeStorageEngine();
            var store = createStore_1.default(storageEngine);
            assert.throws(function () {
                store.subscribe('this is not a function');
            });
        });
    });
    describe('dispose', function () {
        it('should dispose the correct subscriber', function (done) {
            var storageEngine = makeStorageEngine();
            var store = createStore_1.default(storageEngine);
            var firstFn = function () {
                assert.fail('should not have called firstFn');
            };
            var secondFn = function () {
                done();
            };
            var firstHandle = store.subscribe(firstFn);
            var secondHandle = store.subscribe(secondFn);
            firstHandle.dispose();
            store.set('test', 1);
        });
    });
    describe('integration', function () {
        it('should create a store without a storageEngine and .get without issue', function () {
            var store = createStore_1.default();
            assert.strictEqual(store.get('test'), undefined);
        });
        it('should create a store that can get', function () {
            var storageEngine = makeStorageEngine();
            storageEngine.setItem('store', JSON.stringify({ test: 1 }));
            var store = createStore_1.default(storageEngine);
            assert.strictEqual(store.get('test'), 1);
        });
        it('should create a store that can set and publish', function (done) {
            var storageEngine = makeStorageEngine();
            var store = createStore_1.default(storageEngine);
            store.subscribe(function () {
                assert.strictEqual(storageEngine.getItem('store'), JSON.stringify({ test: 1 }));
                done();
            });
            store.set('test', 1);
        });
        it('should create a store that can set and publish only if changed', function (done) {
            var storageEngine = makeStorageEngine();
            var store = createStore_1.default(storageEngine);
            var subSpy = null;
            subSpy = store.subscribe(function () {
                assert.strictEqual(storageEngine.getItem('store'), JSON.stringify({ test: 1 }));
                subSpy.dispose();
                subSpy = store.subscribe(function () {
                    assert.fail('should not have published unchanged value');
                    subSpy.dispose();
                });
                store.set('test', 1);
                setTimeout(done, 0); // give the subscription a chance to fire first
            });
            store.set('test', 1);
        });
        it('should create a store that can delete and publish', function (done) {
            var storageEngine = makeStorageEngine();
            storageEngine.setItem('store', JSON.stringify({ test: 1, other: 2 }));
            var store = createStore_1.default(storageEngine);
            var subSpy = null;
            subSpy = store.subscribe(function () {
                assert.strictEqual(storageEngine.getItem('store'), JSON.stringify({ other: 2 }));
                subSpy.dispose();
                done();
            });
            store.deleteProperty('test');
        });
    });
});
