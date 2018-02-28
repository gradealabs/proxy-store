const createConnect = require('./lib/createConnect').default
const createStore = require('./lib/createStore').default
const MemoryStorage = require('./lib/MemoryStorage').default

const localStorageStore = require('./lib/localStorageStore').default
const memoryStorageStore = require('./lib/memoryStorageStore').default
const sessionStorageStore = require('./lib/sessionStorageStore').default

const withLocalStorage = require('./lib/withLocalStorage').default
const withMemoryStorage = require('./lib/withMemoryStorage').default
const withSessionStorage = require('./lib/withSessionStorage').default

module.exports = {
  createConnect,
  createStore,
  MemoryStorage,
  localStorageStore,
  memoryStorageStore,
  sessionStorageStore,
  withLocalStorage,
  withMemoryStorage,
  withSessionStorage
}
