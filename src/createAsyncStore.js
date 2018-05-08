export const retrievePersistedStore = async (asyncStorageEngine) => {
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

export const persistStore = async (asyncStorageEngine, store) => {
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

export const publish = (subscribers, key, value) => {
  subscribers.forEach(fn => {
    if (fn && typeof fn === 'function') {
      fn(key, value)
    }
  })
}

export default function createAsyncStore (asyncStorageEngine = null) {
  let subscribers = []
  let storePending = true
  let store = {}

  retrievePersistedStore(asyncStorageEngine).then(persistedStore => {
    Object.assign(store, persistedStore || {})
    storePending = false
    publish(subscribers, '$pending', storePending)
  })

  return {
    pending () {
      return storePending
    },
    set (key, value) {
      const changed = JSON.stringify(value) !== JSON.stringify(store[key])
      if (changed) {
        store[key] = value
        persistStore(asyncStorageEngine, store)
        publish(subscribers, key, value)
      }
      return store
    },
    get (key) {
      return store[key]
    },
    deleteProperty (key) {
      if (key in store) {
        delete store[key]
        persistStore(asyncStorageEngine, store)
        publish(subscribers, key, undefined)
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
