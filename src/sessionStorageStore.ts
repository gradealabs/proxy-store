import createStore from './createStore'
import MemoryStorage from './MemoryStorage'
import SessionStorage from './SessionStorage'

const isClient = typeof window !== 'undefined'
const storageEngine = isClient ? new SessionStorage() : new MemoryStorage()
const store = createStore(storageEngine)

export default store
