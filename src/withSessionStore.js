import * as React from 'react'
import createConnect from './createConnect'
import sessionStorageStore from './sessionStorageStore'

export default function withSessionStorage (mapStoreToValues) {
  return createConnect(mapStoreToValues, sessionStorageStore)
}
