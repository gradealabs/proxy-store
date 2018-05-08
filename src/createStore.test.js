const assert = require('assert')

const {
  default: createStore,
  persistStore,
  retrievePersistedStore,
  publish
} = require('./createStore')

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

  describe('publish', function () {
    it('should execute each function with key, value in subscribers', function () {
      let counter = 0

      const subscribers = [
        0,
        true,
        (a, b) => counter = counter + (a * 1) + (b * 1),  // 5
        (a, b) => counter = counter + (a * 2) + (b * 2),  // 10
        undefined,
        (a, b) => counter = counter + (a * 3) + (b * 3),   // 15
        null
      ]

      publish(subscribers, 2, 3)
      assert.strictEqual(counter, 30)
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

    it('should create a store that can set and publish', function () {
      const storageEngine = makeStorageEngine()
      const store = createStore(storageEngine)

      store.subscribe((key, value) => {
        assert.strictEqual(key, 'test')
        assert.strictEqual(value, 1)
      })

      store.set('test', 1)
      assert.strictEqual(storageEngine.getItem('store'), JSON.stringify({ test: 1 }))
    })

    it('should create a store that can set and publish only if changed', function () {
      const storageEngine = makeStorageEngine()
      const store = createStore(storageEngine)
      let subSpy = null

      subSpy = store.subscribe((key, value) => {
        assert.strictEqual(key, 'test')
        assert.strictEqual(value, 1)
      })
      store.set('test', 1)
      assert.strictEqual(storageEngine.getItem('store'), JSON.stringify({ test: 1 }))
      subSpy.dispose()

      subSpy = store.subscribe((key, value) => {
        assert.fail('should not have published unchanged value')
      })
      store.set('test', 1)
      subSpy.dispose()
    })

    it('should create a store that can delete and publish', function () {
      const storageEngine = makeStorageEngine()
      storageEngine.setItem('store', JSON.stringify({ test: 1, other: 2 }))
      const store = createStore(storageEngine)

      store.subscribe((key, value) => {
        assert.strictEqual(key, 'test')
        assert.strictEqual(value, undefined)
      })

      store.deleteProperty('test')
      assert.strictEqual(storageEngine.getItem('store'), JSON.stringify({ other: 2 }))
    })
  })
})
