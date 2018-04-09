export default function createStore (storageEngine = null) {
  let subscribers = []

  const retrievePersistedStore = () => {
    if (!storageEngine) {
      return
    }

    let payload = storageEngine.getItem('store')

    try {
      return JSON.parse(payload)
    } catch (e) {
      return null
    }
  }

  const persistStore = store => {
    if (!storageEngine) {
      return
    }

    let payload

    try {
      payload = JSON.stringify(store)
    } catch (e) {
      payload = null
    }

    return storageEngine.setItem('store', payload)
  }

  const publish = (key, value) => {
    subscribers.forEach(fn => {
      if (fn) {
        fn(key, value)
      }
    })
  }

  let store = retrievePersistedStore() || {}

  return {
    set (key, value) {
      const changed = JSON.stringify(value) !== JSON.stringify(store[key])
      if (changed) {
        store[key] = value
        persistStore(store)
        publish(key, value)
      }
      return store
    },
    get (key) {
      return store[key]
    },
    deleteProperty (target, key) {
      if (key in target) {
        delete store[key]
        persistStore(store)
        publish(key, undefined)
        return store
      }
      return store
    },
    /**
     * Provide a subscribe method on the store that will notify the provided
     * callback with the target object that will be changed (set/del) along
     * with key and value.
     * Returns an object (handle) with a dispose method that should be called
     * to unsubscribe.
     */
    subscribe (fn) {
      var n = subscribers.push(fn)
      return {
        dispose () {
          subscribers[n - 1] = null
        }
      }
    }
  }
}
