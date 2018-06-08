export default class {
  store = {}

  setItem (key, value) {
    this.store[key] = value
  }

  getItem (key) {
    return this.store[key]
  }

  removeItem (key) {
    delete this.store[key]
  }
}
