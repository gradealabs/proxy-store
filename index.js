const createConnect = require('./lib/createConnect')
const createStore = require('./lib/createStore')
const MemoryStorage = require('./lib/MemoryStorage')

const localStorageStore = require('./lib/localStorageStore')
const memoryStorageStore = require('./lib/memoryStorageStore')
const sessionStorageStore = require('./lib/sessionStorageStore')

const withLocalStorage = require('./lib/withLocalStorage')
const withMemoryStorage = require('./lib/withMemoryStorage')
const withSessionStorage = require('./lib/withSessionStorage')

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
