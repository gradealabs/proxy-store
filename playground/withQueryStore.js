import createConnect from '../src/createConnect'
import createStore from '../src/createStore'
import queryString from 'query-string'
import isEqual from 'lodash.isequal'
import createBrowserHistory from 'history/createBrowserHistory'

const browserHistory = createBrowserHistory()

const queryStorageEngine = {
  setStore (store) {
    const oldQuery = queryString.parse(browserHistory.location.search)
    const query = Object.assign({}, oldQuery, store || {})

    if (isEqual(oldQuery, query)) {
      return
    }

    const href = `${browserHistory.location.pathname}?${queryString.stringify(query)}`

    browserHistory.push(href)
  },
  getStore () {
    return typeof browserHistory.location !== 'undefined'
      ? queryString.parse(browserHistory.location.search)
      : {}
  },
  setCachedStore (store) {
    this.setStore(store)
  },
  getCachedStore () {
    return this.getStore()
  }
}

const queryStore = createStore(queryStorageEngine)

export default function withQueryStore (mapStoreToValues) {
  return createConnect(mapStoreToValues, queryStore)
}
