export default class SessionStorage {
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
