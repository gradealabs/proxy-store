import createConnect from './createConnect'
import memoryStorageStore from './memoryStorageStore'

export default function withMemoryStorage (mapStoreToValues) {
  return createConnect(mapStoreToValues, memoryStorageStore)
}
