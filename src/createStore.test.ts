import * as assert from 'assert'
import createStore, { persistStore, retrievePersistedStore } from './createStore'

const makeStorageEngine = () => {
  let backingStore = {}
  return {
    setItem: (key, value) => backingStore[key] = value,
    getItem: key => backingStore[key]
  }
}

describe('createStore', function () {
  describe('persistence', function () {
    it('should write as json stringified', function () {
      const storageEngine = makeStorageEngine()
      const store = { test: 1 }

      persistStore(storageEngine, store)
      assert.strictEqual(storageEngine.getItem('store'), JSON.stringify(store))
    })

    it('should read back store', function () {
      const storageEngine = makeStorageEngine()
      const store = { test: 1 }

      persistStore(storageEngine, store)
      const storeCopy = retrievePersistedStore(storageEngine)
      assert.deepStrictEqual(store, storeCopy)
    })

    it('retrieve should return undefined without a storageEngine', function () {
      assert.strictEqual(retrievePersistedStore(null), undefined)
    })
  })

  describe('subscribe', function () {
    it('should throw if a non-function is passed to subscribe', function () {
      const storageEngine = makeStorageEngine()
      const store = createStore(storageEngine)

      assert.throws(function () {
        store.subscribe('this is not a function')
      })
    })
  })

  describe('integration', function () {
    it('should create a store without a storageEngine and .get without issue', function () {
      const store = createStore()
      assert.strictEqual(store.get('test'), undefined)
    })

    it('should create a store that can get', function () {
      const storageEngine = makeStorageEngine()
      storageEngine.setItem('store', JSON.stringify({ test: 1 }))
      const store = createStore(storageEngine)
      assert.strictEqual(store.get('test'), 1)
    })

    it('should create a store that can set and publish', function (done) {
      const storageEngine = makeStorageEngine()
      const store = createStore(storageEngine)

      store.subscribe(() => {
        assert.strictEqual(storageEngine.getItem('store'), JSON.stringify({ test: 1 }))
        done()
      })

      store.set('test', 1)
    })

    it('should create a store that can set and publish only if changed', function (done) {
      const storageEngine = makeStorageEngine()
      const store = createStore(storageEngine)
      let subSpy = null

      subSpy = store.subscribe(() => {
        assert.strictEqual(storageEngine.getItem('store'), JSON.stringify({ test: 1 }))
        subSpy.dispose()

        subSpy = store.subscribe(() => {
          assert.fail('should not have published unchanged value')
          subSpy.dispose()
        })
        store.set('test', 1)
        setTimeout(done, 0) // give the subscription a chance to fire first
      })
      store.set('test', 1)
    })

    it('should create a store that can delete and publish', function (done) {
      const storageEngine = makeStorageEngine()
      storageEngine.setItem('store', JSON.stringify({ test: 1, other: 2 }))
      const store = createStore(storageEngine)
      let subSpy = null

      subSpy = store.subscribe(() => {
        assert.strictEqual(storageEngine.getItem('store'), JSON.stringify({ other: 2 }))
        subSpy.dispose()
        done()
      })
      store.deleteProperty('test')
    })
  })
})
