export default class LocalStorage {
  constructor () {
    if (!window) {
      throw new Error('LocalStorage requires window object in scope')
    }

    if (!window.localStorage) {
      throw new Error('LocalStorage requires window.localStorage object in scope')
    }
  }

  setStore (store) {
    let payload

    try {
      payload = JSON.stringify(store)
    } catch (e) {
      payload = null
    }

    return window.localStorage.setItem('store', payload)
  }

  getStore () {
    const payload = window.localStorage.getItem('store')

    try {
      return JSON.parse(payload)
    } catch (e) {
      return null
    }
  }
}
