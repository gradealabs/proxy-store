import createStore from './createStore'
import MemoryStorage from './MemoryStorage'

const isClient = typeof window !== 'undefined'
const storageEngine = isClient ? window.sessionStorage : new MemoryStorage()
const store = createStore(storageEngine)

export default store
