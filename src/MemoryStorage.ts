export default class MemoryStorage {
  store: any

  constructor () {
    this.store = null
  }

  setStore (value) {
    this.store = value
  }

  getStore () {
    return this.store
  }
}
