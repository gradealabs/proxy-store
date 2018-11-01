import publish from './publish'

export const retrievePersistedStore = storageEngine => {
  if (!storageEngine) {
    return
  }

  return storageEngine.getStore()
}

export const persistStore = (storageEngine, store) => {
  if (!storageEngine) {
    return
  }

  return storageEngine.setStore(store)
}

export default function createStore (storageEngine = null) {
  let subscribers = []
  let store = retrievePersistedStore(storageEngine) || {}

  const onChange = change => {
    persistStore(storageEngine, store)
    publish(subscribers, change)
  }

  return {
    set (key, value) {
      const changed = value !== store[key]

      if (changed) {
        store[key] = value
        onChange({ type: 'set', key, value })
      }

      return store
    },
    get (key) {
      return store[key]
    },
    deleteProperty (key) {
      if (key in store) {
        delete store[key]
        onChange({ type: 'deleteProperty', key })
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
      if (typeof fn !== 'function') {
        throw new Error('subscribe expects a function as a parameter')
      }

      subscribers.push(fn)

      return {
        dispose () {
          subscribers = subscribers.filter(cb => cb !== fn)
        }
      }
    }
  }
}
