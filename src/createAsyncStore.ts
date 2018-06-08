import * as EJSON from 'ejson'
import publish from './publish'

export const retrievePersistedStore = async (asyncStorageEngine) => {
  if (!asyncStorageEngine) {
    return
  }

  let payload = await asyncStorageEngine.getItem('store')

  try {
    return EJSON.parse(payload)
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
    payload = EJSON.stringify(store)
  } catch (e) {
    payload = null
  }

  return await asyncStorageEngine.setItem('store', payload)
}

export default function createAsyncStore (asyncStorageEngine = null) {
  let subscribers = {}
  let subId = 0
  let storePending = true
  let store = {}

  const onChange = change => {
    persistStore(asyncStorageEngine, store)
    publish(subscribers, change)
  }

  retrievePersistedStore(asyncStorageEngine).then(persistedStore => {
    Object.assign(store, persistedStore || {})
    storePending = false
    publish(subscribers, { type: 'set', key: 'pending', value: storePending })
  })

  return {
    pending () {
      return storePending
    },
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

      subId = subId + 1
      subscribers[subId] = fn

      return {
        dispose () {
          delete subscribers[subId]
        }
      }
    }
  }
}