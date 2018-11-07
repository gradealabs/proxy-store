import publish from './publish'

export const readStore = storageEngine => {
  if (!storageEngine) {
    return
  }

  return storageEngine.getStore()
}

export const writeStore = (storageEngine, store) => {
  if (!storageEngine) {
    return
  }

  return storageEngine.setStore(store)
}

export default function createStore (storageEngine = null) {
  let subscribers = []
  let storePending = true
  let defaultCachedStore = {}

  const readCachedStore = () => {
    return (storageEngine && storageEngine.getCachedStore)
      ? storageEngine.getCachedStore()
      : defaultCachedStore
  }
  
  const writeCachedStore = store => {
    if (storageEngine && storageEngine.setCachedStore) {
      storageEngine.setCachedStore(store)
    } else {
      defaultCachedStore = store
    }
  }

  const lazyLoadPersistedStore = () => {
    const persistedStore = readStore(storageEngine) || {}
    const store = Object.assign({}, persistedStore || {})
    writeCachedStore(store)
    storePending = false
  }

  const onChange = (change, store) => {
    writeStore(storageEngine, store)
    publish(subscribers, change)
  }

  const set = (key, value, store) => {
    const changed = value !== store[key]

    if (changed) {
      store[key] = value
      onChange({ type: 'set', key, value }, store)
    }
  }

  const deleteProperty = (key, store) => {
    if (key in store) {
      delete store[key]
      onChange({ type: 'deleteProperty', key }, store)
    }
  }

  return {
    set (key, value) {
      if (storePending) {
        lazyLoadPersistedStore()
      }

      let store = readCachedStore()
      set(key, value, store)
      writeCachedStore(store)
    },
    get (key) {
      if (storePending) {
        lazyLoadPersistedStore()
      }

      const store = readCachedStore()
      return store[key]
    },
    deleteProperty (key) {
      if (storePending) {
        lazyLoadPersistedStore()
      }

      let store = readCachedStore()
      deleteProperty(key, store)
      writeCachedStore(store)
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

      if (storePending) {
        lazyLoadPersistedStore()
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
