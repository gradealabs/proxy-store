import * as React from 'react'
import createConnect from './createConnect'
import sessionStorageStore from './sessionStorageStore'

export default function withSessionStorage (mapStoreToValues, handlers) {
  return createConnect(mapStoreToValues, handlers, sessionStorageStore)
}
