import createStore from './createStore'
import MemoryStorage from './MemoryStorage'
import LocalStorage from './LocalStorage'

const isClient = typeof window !== 'undefined'
const storageEngine = isClient ? new LocalStorage() : new MemoryStorage()
const store = createStore(storageEngine)

export default store
