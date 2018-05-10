import EJSON from 'ejson'
import publish from './publish'

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

export default function createStore (storageEngine = null) {
  let subscribers = {}
  let subId = 0
  let onChangeTimeout = null
  let store = retrievePersistedStore(storageEngine) || {}

  const onChange = () => {
    persistStore(storageEngine, store)
    publish(subscribers)
  }

  return {
    set (key, value) {
      const changed = value !== store[key]

      if (changed) {
        store[key] = value

        clearTimeout(onChangeTimeout)
        onChangeTimeout = setTimeout(onChange, 0)
      }

      return store
    },
    get (key) {
      return store[key]
    },
    deleteProperty (key) {
      if (key in store) {
        delete store[key]

        clearTimeout(onChangeTimeout)
        onChangeTimeout = setTimeout(onChange, 0)
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
