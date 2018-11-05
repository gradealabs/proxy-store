export default class SessionStorage {
  constructor () {
    if (!window) {
      throw new Error('SessionStorage requires window object in scope')
    }

    if (!window.sessionStorage) {
      throw new Error('SessionStorage requires window.sessionStorage object in scope')
    }
  }

  setStore (store) {
    let payload

    try {
      payload = JSON.stringify(store)
    } catch (e) {
      payload = null
    }

    return window.sessionStorage.setItem('store', payload)
  }

  getStore () {
    const payload = window.sessionStorage.getItem('store')

    try {
      return JSON.parse(payload)
    } catch (e) {
      return null
    }
  }
}
