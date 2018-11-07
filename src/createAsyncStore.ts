import publish from './publish'

export const readStore = async (asyncStorageEngine) => {
  if (!asyncStorageEngine || !asyncStorageEngine.getStore) {
    return
  }

  return await asyncStorageEngine.getStore()
}

export const writeStore = async (asyncStorageEngine, store) => {
  if (!asyncStorageEngine || !asyncStorageEngine.setStore) {
    return
  }

  return await asyncStorageEngine.setStore(store)
}

export default function createAsyncStore (asyncStorageEngine = null) {
  let subscribers = []
  let lazyLoaded = false
  let storePending = true
  let defaultCachedStore = {}
  let defaultDeferredStore = {}

  const readCachedStore = () => {
    return (asyncStorageEngine && asyncStorageEngine.getCachedStore)
      ? asyncStorageEngine.getCachedStore()
      : defaultCachedStore
  }
  
  const writeCachedStore = store => {
    if (asyncStorageEngine && asyncStorageEngine.setCachedStore) {
      asyncStorageEngine.setCachedStore(store)
    } else {
      defaultCachedStore = store
    }
  }

  const readDeferredStore = () => {
    return (asyncStorageEngine && asyncStorageEngine.getDeferredStore)
      ? asyncStorageEngine.getDeferredStore()
      : defaultDeferredStore
  }
  
  const writeDeferredStore = store => {
    if (asyncStorageEngine && asyncStorageEngine.setDeferredStore) {
      asyncStorageEngine.setDeferredStore(store)
    } else {
      defaultDeferredStore = store
    }
  }

  const lazyLoadPersistedStore = async () => {
    if (lazyLoaded) {
      return
    }

    lazyLoaded = true

    const persistedStore = await readStore(asyncStorageEngine)
    const deferredStore = readDeferredStore()
    const store = Object.assign({}, persistedStore || {}, deferredStore)
    writeCachedStore(store)
    storePending = false
    publish(subscribers, { type: 'set', key: 'pending', value: storePending })
  }

  const onChange = (change, store) => {
    writeStore(asyncStorageEngine, store)
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
    pending () {
      return storePending
    },
    set (key, value) {
      if (storePending) {
        lazyLoadPersistedStore()
        const store = readDeferredStore()
        set(key, value, store)
        writeDeferredStore(store)
      } else {
        const store = readCachedStore()
        set(key, value, store)
        writeCachedStore(store)
      }
    },
    get (key) {
      if (storePending) {
        lazyLoadPersistedStore()
        const store = readDeferredStore()
        return store[key]
      } else {
        const store = readCachedStore()
        return store[key]
      }
    },
    deleteProperty (key) {
      if (storePending) {
        lazyLoadPersistedStore()
        const store = readDeferredStore()
        deleteProperty(key, store)
        writeDeferredStore(store)
      } else {
        const store = readCachedStore()
        deleteProperty(key, store)
        writeCachedStore(store)
      }
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
