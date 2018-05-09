import EJSON from 'ejson'
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
  let onChangeTimeout = null
  let publishQueue = []
  let store = {}

  const onChange = () => {
    persistStore(asyncStorageEngine, store)

    while (publishQueue.length) {
      const { key, value } = publishQueue.shift()
      publish(subscribers, key, value)
    }
  }

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
      const changed = value !== store[key]

      if (changed) {
        store[key] = value

        publishQueue.push({ key, value })
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

        publishQueue.push({ key, value: undefined })
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
