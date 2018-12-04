import * as React from 'react'
import createConnect from './createConnect'
import memoryStorageStore from './memoryStorageStore'

export default function withMemoryStorage (mapStoreToValues, handlers) {
  return createConnect(mapStoreToValues, handlers, memoryStorageStore)
}
