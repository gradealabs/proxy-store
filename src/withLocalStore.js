import createConnect from './createConnect'
import localStorageStore from './localStorageStore'

export default function withLocalStorage (mapStoreToValues, mapStoreToMethods) {
  return createConnect(mapStoreToValues, mapStoreToMethods, localStorageStore)
}
