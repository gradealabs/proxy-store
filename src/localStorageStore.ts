import createStore from './createStore'
import MemoryStorage from './MemoryStorage'
import LocalStorage from './LocalStorage'

let storageEngine

try {
  storageEngine = new LocalStorage()
} catch (_) {
  storageEngine = new MemoryStorage()
}

const store = createStore(storageEngine)

export default store
