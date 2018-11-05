# Store HOCs 4.0.1

**Supports React 16.3+ only**

Store HOCs allows you to read and write from shared state across components in a similar way to Redux but without the ceremony. The store is completely ad-hoc and you are meant to map the store object to props when used.

An important design goal of Store HOCs is that it should be trivial to change _where_ state is stored. By using `withMemoryStore`, your state will be persisted to memory. If you wish to persist state across page reloads, you may wish to use `withLocalStore`, without requiring any changes to your own code. You could potentially store the state remotely via a network request, or perhaps even in the query string. Store HOCs is fully extensible and also provides many examples of alterative storage engines.

## Quick Start

The following example shows how to read `items` from a memory-backed store, and how to modify `items`.

When `items` is modified in the store, any component wrapped with `withMemoryStore` will attempt to update (given constraints set out in `shouldComponentUpdate`).

```javascript
import React from 'react'
import { withMemoryStore } from '@gradealabs/store-hocs'

class Widget extends React.PureComponent {
  render () {
    const { items, addItem } = this.props

    return (
      <div>
        <h1>Random numbers:</h1>
        <ul>
          {items.map((value, index) => <li key={index}>{value}</li>)}
        </ul>
        <button onClick={() => addItem(Math.random())}>Add random number</button>
      </div>
    )
  }
}

export default withMemoryStore(store => {
  return {
    items: store.get('items') || [],
    addItem: value => {
      store.set('items', [ ...store.get('items') || [], value ]) // important to make a copy when using PureComponent
    }
  }
})(Widget)
```

We don't encourage the exact set-up above -- we recommend that you encapsulate your custom HOC into its own named HOC, which gives you the benefit of re-use and an alternative to a schema.

For example:

#### `withItems.js`

```javascript
import { withMemoryStore } from '@gradealabs/store-hocs'

export default function () {
  return withMemoryStore(store => {
    return {
      items: store.get('items') || [],
      addItem: value => {
        store.set('items', [ ...store.get('items') || [], value ]) // important to make a copy when using PureComponent
      }
    }
  })
}
```

Usage in the example above:

```javascript
...
import withItems from './withItems'

class Widget extends React.PureComponent {
  ...
}

export default withItems()(Widget)
```

### Alternative storage engines

There are other HOC helpers available that are backed by different storage engines. Along with the standard memory store, there is also support for localStorage and sessionStorage. You can use the one that is most suitable to the type of persistence you need:

- If you want the store to be cleared after a refresh, use the memory store (`withMemoryStore` for example).
- If you want the store to survive a page refresh, use a session store (`withSessionStore` for example).
- If you want the store to survive a session (closing browser, etc), use a local store (`withLocalStore` for example).

### Custom store

`withMemoryStore` uses an instance of `MemoryStorage`, and as such, anytime `withMemoryStore` is used in your application, it is using the same store instance across the board.

Here is an example of how to create your own HOC that uses its own storage engine. It is almost the same as the memory store implemented in this library:

#### `customStore.js`

```javascript
import { createStore } from '@gradealabs/store-hocs'

// the storageEngine API requires `setItem`, `getItem`, and `removeItem`
const myStorageEngine = {
  store: {},
  setStore (store) {
    this.store = store
  },
  getStore () {
    return this.store
  }
}

export default createStore(myStorageEngine)
```

#### `withCustomStore.js`

```javascript
import { createConnect } from '@gradealabs/store-hocs'
import customStore from './customStore'

export default function withCustomStore (mapStoreToValues) {
  return createConnect(mapStoreToValues, customStore)
}
```

### Async store

Asynchronous stores are supported via `createAsyncStore`. The store will initially be empty, but a `pending()` function will be available on the store so that you can choose to show a spinner during the initial load of the store.

Below is an example of a custom async store that leverages React Native's `AsyncStorage`:

#### `asyncStore.js`

```javascript
import { createAsyncStore } from '@gradealabs/store-hocs'
import { AsyncStorage } from 'react-native'

class AsyncStorageAdapter {
  setStore (store) {
    let payload

    try {
      payload = JSON.stringify(store)
    } catch (e) {
      payload = null
    }

    return AsyncStorage.setItem('store', payload)
  }

  getStore () {
    const payload = AsyncStorage.getItem('store')

    try {
      return JSON.parse(payload)
    } catch (e) {
      return null
    }
  }
}

export default createAsyncStore(new AsyncStorageAdapter())
```

If you happen to be using Expo, an example of using `SecureStore` could look
like this:

#### `asyncStore.js`

```javascript
import { createAsyncStore } from '@gradealabs/store-hocs'
import { SecureStore } from 'expo'

class AsyncStorageAdapter {
  setStore (store) {
    return SecureStore.setItemAsync('store', store)
  }

  getStore () {
    return SecureStore.getItemAsync('store')
  }
}

export default createAsyncStore(new AsyncStorageAdapter())
```

#### `withAsyncStore.js`

```javascript
import { createConnect } from '@gradealabs/store-hocs'
import asyncStore from './asyncStore'

export default function withAsyncStore (mapStoreToValues) {
  return createConnect(mapStoreToValues, asyncStore)
}
```

#### `Widget.js`

```javascript
import React from 'react'
import withAsyncStore from './withAsyncStore'

class Widget extends React.PureComponent {
  render () {
    const { loading, items, addItem } = this.props

    if (loading) {
      return <div>Loading...</div>
    }

    return (
      <div>
        <h1>Random numbers:</h1>
        <ul>
          {items.map((value, index) => <li key={index}>{value}</li>)}
        </ul>
        <button onClick={() => addItem(Math.random())}>Add random number</button>
      </div>
    )
  }
}

export default withAsyncStore(store => {
  return {
    loading: store.pending() || false,
    items: store.get('items') || [],
    addItem: value => {
      store.set('items', [ ...store.get('items') || [], value ]) // important to make a copy when using PureComponent
    }
  }
})(Widget)
```

### Other useful stores

You can easily store state in the query string in this manner:

#### `queryStore.js`

```javascript
import { createStore } from '@gradealabs/store-hocs'
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
  }
}

export default createStore(queryStorageEngine)
```

#### `withQueryStore.js`

```javascript
import { createConnect } from '@gradealabs/store-hocs'
import queryStore from './queryStore'

export default function withQueryStore (mapStoreToValues) {
  return createConnect(mapStoreToValues, queryStore)
}
```

#### `Widget.js`

```javascript
import React from 'react'
import withQueryStore from './withQueryStore'

class Widget extends React.PureComponent {
  render () {
    const { items, addItem } = this.props

    return (
      <div>
        <h1>Random numbers:</h1>
        <ul>
          {items.map((value, index) => <li key={index}>{value}</li>)}
        </ul>
        <button onClick={() => addItem(Math.random())}>Add random number</button>
      </div>
    )
  }
}

export default withQueryStore(store => {
  return {
    items: store.get('items') || [],
    addItem: value => {
      store.set('items', [ ...store.get('items') || [], value ]) // important to make a copy when using PureComponent
    }
  }
})(Widget)
```

## Building

To build the source

    npm run build

## Testing

Unit tests are expected to be colocated next to the module/file they are testing and have the following suffix `.test.ts(x)`.

To run unit tests through [mocha](http://mochajs.org/):

    npm test
