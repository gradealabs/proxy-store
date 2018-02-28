import createConnect from './createConnect'
import sessionStorageStore from './sessionStorageStore'

export default function withSessionStorage (mapStoreToValues, mapStoreToMethods) {
  return createConnect(mapStoreToValues, mapStoreToMethods, sessionStorageStore)
}
