import createStore from './createStore'
import MemoryStorage from './MemoryStorage'
import SessionStorage from './SessionStorage'

let storageEngine

try {
  storageEngine = new SessionStorage()
} catch (_) {
  storageEngine = new MemoryStorage()
}

const store = createStore(storageEngine)

export default store
