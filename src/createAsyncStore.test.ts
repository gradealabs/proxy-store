import * as assert from 'assert'
import * as isEqual from 'lodash.isequal'
import createAsyncStore, { writeStore, readStore } from './createAsyncStore'

const makeAsyncStorageEngine = () => {
  let backingStore = null
  return {
    setStore: (store) => Promise.resolve(backingStore = store),
    getStore: () => Promise.resolve(backingStore)
  }
}

describe('createAsyncStore', function () {
  describe('persistence', function () {
    it('should read back store', function (done) {
      const asyncStorageEngine = makeAsyncStorageEngine()
      const store = { test: 1 }

      writeStore(asyncStorageEngine, store)
        .then(() => readStore(asyncStorageEngine))
        .then(storeCopy => assert.deepStrictEqual(store, storeCopy))
        .then(done, done)
    })

    it('readStore should return undefined without a asyncStorageEngine', function (done) {
      readStore(null)
        .then(result => assert.strictEqual(result, undefined))
        .then(done, done)
    })
  })

  describe('subscribe', function () {
    it('should throw if a non-function is passed to subscribe', function () {
      const asyncStorageEngine = makeAsyncStorageEngine()
      const store = createAsyncStore(asyncStorageEngine)

      assert.throws(function () {
        store.subscribe('this is not a function')
      })
    })
  })

  describe('integration', function () {
    it('should create a store without a asyncStorageEngine and .get without issue', function (done) {
      const store = createAsyncStore()

      const pendingHandle = store.subscribe(() => {
        if (!store.pending()) {
          pendingHandle.dispose()

          assert.strictEqual(store.get('test'), undefined)
          done()
        }
      })
    })

    it('should create a store that can get', function (done) {
      const asyncStorageEngine = makeAsyncStorageEngine()
      asyncStorageEngine.setStore({ test: 1 })
        .then(() => {
          const store = createAsyncStore(asyncStorageEngine)

          const pendingHandle = store.subscribe(() => {
            if (!store.pending()) {
              pendingHandle.dispose()

              assert.strictEqual(store.get('test'), 1)
              done()
            }
          })
        })
    })

    it('should create a store that can set and publish', function (done) {
      const asyncStorageEngine = makeAsyncStorageEngine()
      const store = createAsyncStore(asyncStorageEngine)

      const pendingHandle = store.subscribe(() => {
        if (!store.pending()) {
          pendingHandle.dispose()

          store.subscribe(() => {
            asyncStorageEngine.getStore()
              .then(result => assert.ok(isEqual(result, { test: 1 })))
              .then(done, done)
          })

          store.set('test', 1)
        }
      })
    })

    it('should create a store that can set and publish only if changed', function (done) {
      const asyncStorageEngine = makeAsyncStorageEngine()
      const store = createAsyncStore(asyncStorageEngine)
      let subSpy = null

      const pendingHandle = store.subscribe(() => {
        if (!store.pending()) {
          pendingHandle.dispose()

          subSpy = store.subscribe(() => {
            asyncStorageEngine.getStore()
              .then(result => assert.ok(isEqual(result, { test: 1 })))
              .then(() => subSpy.dispose())
              .then(() => {
                subSpy = store.subscribe(() => {
                  assert.fail('should not have published unchanged value')
                  subSpy.dispose()
                })
                store.set('test', 1)
                done()
              })
          })
          store.set('test', 1)
        }
      })
    })

    it('should create a store that can delete and publish', function (done) {
      const asyncStorageEngine = makeAsyncStorageEngine()
      asyncStorageEngine.setStore({ test: 1, other: 2 })
        .then(() => {
          const store = createAsyncStore(asyncStorageEngine)

          const pendingHandle = store.subscribe(() => {
            if (!store.pending()) {
              pendingHandle.dispose()
            }

            store.subscribe(() => {
              asyncStorageEngine.getStore()
                .then(result => assert.ok(isEqual(result, { other: 2 })))
                .then(done, done)
            })

            store.deleteProperty('test')
          })
        })
    })
  })
})
