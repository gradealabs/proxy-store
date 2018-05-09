import EJSON from 'ejson'

export const retrievePersistedStore = storageEngine => {
  if (!storageEngine) {
    return
  }

  let payload = storageEngine.getItem('store')

  try {
    return EJSON.parse(payload)
  } catch (e) {
    return null
  }
}

export const persistStore = (storageEngine, store) => {
  if (!storageEngine) {
    return
  }

  let payload

  try {
    payload = EJSON.stringify(store)
  } catch (e) {
    payload = null
  }

  return storageEngine.setItem('store', payload)
}

export const publish = (subscribers, key, value) => {
  subscribers.forEach(fn => {
    if (fn && typeof fn === 'function') {
      fn(key, value)
    }
  })
}

export default function createStore (storageEngine = null) {
  let subscribers = []
  let store = retrievePersistedStore(storageEngine) || {}

  return {
    set (key, value) {
      const changed = value !== store[key]
      if (changed) {
        store[key] = value
        // TODO: debounce persist and publish
        persistStore(storageEngine, store)
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
        // TODO: debounce persist and publish
        persistStore(storageEngine, store)
        publish(subscribers, key, undefined)
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
      // TODO: use an object instead of an array, leverage a counter (like subId)
      // and Object.keys(subscribers).map(parseInt).sort() to iterate in order.
      // TODO: move check for function here, instead of when iterating
      var n = subscribers.push(fn)
      return {
        dispose () {
          subscribers[n - 1] = null
        }
      }
    }
  }
}
