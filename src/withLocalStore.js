import createConnect from './createConnect'
import localStorageStore from './localStorageStore'

export default function withLocalStorage (mapStoreToValues) {
  return createConnect(mapStoreToValues, localStorageStore)
}
