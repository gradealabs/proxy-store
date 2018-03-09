export default function createAsyncStore (asyncStorageEngine = null) {
  let subscribers = []
  let store = {}

  const retrievePersistedStore = async () => {
    if (!asyncStorageEngine) {
      return
    }

    let payload = await asyncStorageEngine.getItem('store')

    try {
      return JSON.parse(payload)
    } catch (e) {
      return null
    }
  }

  const persistStore = async () => {
    if (!asyncStorageEngine) {
      return
    }

    let payload

    try {
      payload = JSON.stringify(store)
    } catch (e) {
      payload = null
    }

    return await asyncStorageEngine.setItem('store', payload)
  }

  const publish = (target, key, value) => {
    subscribers.forEach(fn => {
      if (fn) {
        fn(target, key, value)
      }
    })
  }

  // Provide a subscribe method on the store that will notify the provided callback
  // with the target object that will be changed (set/del) along with key and value.
  // Returns an object (handle) with a dispose method that should be called to
  // unsubscribe.
  const subscribe = (fn) => {
    var n = subscribers.push(fn)
    return {
      dispose () {
        subscribers[n - 1] = null
      }
    }
  }

  let storePending = false

  Object.defineProperty(store, '$pending', {
    enumerable: true,
    configurable: false,
    get: () => storePending
  })

  retrievePersistedStore().then((persistedStore) => {
    persistedStore = persistedStore || {}
    storePending = true
    Object.assign(proxiedStore, persistedStore)
    publish(proxiedStore, '$pending', storePending)
  })

  Object.defineProperty(store, 'subscribe', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function (fn) {
      return subscribe(fn)
    }
  })

  const proxiedStore = new Proxy(store, {
    set (target, key, value) {
      let changed = JSON.stringify(value) !== JSON.stringify(target[key])
      target[key] = value
      if (changed) {
        persistStore()
        publish(target, key, value)
      }
      return true
    },
    get (target, key) {
      return target[key]
    },
    deleteProperty (target, key) {
      if (key in target) {
        delete target[key]
        persistStore()
        publish(target, key, undefined)
        return true
      }
      return false
    }
  })

  return proxiedStore
}
