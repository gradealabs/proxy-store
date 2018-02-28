import createConnect from './createConnect'
import memoryStorageStore from './memoryStorageStore'

export default function withMemoryStorage (mapStoreToValues, mapStoreToMethods) {
  return createConnect(mapStoreToValues, mapStoreToMethods, memoryStorageStore)
}
