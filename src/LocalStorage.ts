export default class LocalStorage {
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
