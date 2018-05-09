const assert = require('assert')

const {
  default: createAsyncStore,
  persistStore,
  retrievePersistedStore,
  publish
} = require('./createAsyncStore')

const makeAsyncStorageEngine = () => {
  let backingStore = {}
  return {
    setItem: (key, value) => Promise.resolve(backingStore[key] = value),
    getItem: key => Promise.resolve(backingStore[key])
  }
}

describe('createAsyncStore', function () {
  describe('persistence', function () {
    it('should write as json stringified', function (done) {
      const asyncStorageEngine = makeAsyncStorageEngine()
      const store = { test: 1 }

      persistStore(asyncStorageEngine, store)
        .then(() => asyncStorageEngine.getItem('store'))
        .then(result => assert.strictEqual(result, JSON.stringify(store)))
        .then(done, done)
    })

    it('should read back store', function (done) {
      const asyncStorageEngine = makeAsyncStorageEngine()
      const store = { test: 1 }

      persistStore(asyncStorageEngine, store)
        .then(() => retrievePersistedStore(asyncStorageEngine))
        .then(storeCopy => assert.deepStrictEqual(store, storeCopy))
        .then(done, done)
    })

    it('retrieve should return undefined without a asyncStorageEngine', function (done) {
      retrievePersistedStore(null)
        .then(result => assert.strictEqual(result, undefined))
        .then(done, done)
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
    it('should create a store without a asyncStorageEngine and .get without issue', function (done) {
      const store = createAsyncStore()

      const pendingHandle = store.subscribe((key, value) => {
        if (key === '$pending' && value === false) {
          pendingHandle.dispose()

          assert.strictEqual(store.get('test'), undefined)
          done()
        }
      })
    })

    it('should create a store that can get', function (done) {
      const asyncStorageEngine = makeAsyncStorageEngine()
      asyncStorageEngine.setItem('store', JSON.stringify({ test: 1 }))
        .then(() => {
          const store = createAsyncStore(asyncStorageEngine)

          const pendingHandle = store.subscribe((key, value) => {
            if (key === '$pending' && value === false) {
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

      const pendingHandle = store.subscribe((key, value) => {
        if (key === '$pending' && value === false) {
          pendingHandle.dispose()

          store.subscribe((key, value) => {
            assert.strictEqual(key, 'test')
            assert.strictEqual(value, 1)

            asyncStorageEngine.getItem('store')
              .then(result => assert.strictEqual(result, JSON.stringify({ test: 1 })))
              .then(done, done)
          })

          store.set('test', 1)
        }
      })
    })

    it('should create a store that can set and publish only if changed', function (done) {
      // TODO: check for changes on objects
      const asyncStorageEngine = makeAsyncStorageEngine()
      const store = createAsyncStore(asyncStorageEngine)
      let subSpy = null

      const pendingHandle = store.subscribe((key, value) => {
        if (key === '$pending' && value === false) {
          pendingHandle.dispose()

          subSpy = store.subscribe((key, value) => {
            assert.strictEqual(key, 'test')
            assert.strictEqual(value, 1)

            asyncStorageEngine.getItem('store')
              .then(result => assert.strictEqual(result, JSON.stringify({ test: 1 })))
              .then(() => subSpy.dispose())
              .then(() => {
                subSpy = store.subscribe((key, value) => {
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
      asyncStorageEngine.setItem('store', JSON.stringify({ test: 1, other: 2 }))
        .then(() => {
          const store = createAsyncStore(asyncStorageEngine)

          const pendingHandle = store.subscribe((key, value) => {
            if (key === '$pending' && value === false) {
              pendingHandle.dispose()
            }

            store.subscribe((key, value) => {
              assert.strictEqual(key, 'test')
              assert.strictEqual(value, undefined)

              asyncStorageEngine.getItem('store')
                .then(result => assert.strictEqual(result, JSON.stringify({ other: 2 })))
                .then(done, done)
            })

            store.deleteProperty('test')
          })
        })
    })
  })
})
