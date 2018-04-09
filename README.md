# Proxy Store 2.0.0

Proxy Store allows you to store data in an object to be used across components in a similar way to Redux but without the ceremony. The store is completely ad-hoc and you are meant to map the store object to props when used.

## Quick Start

The following example shows how to read `items` from a memory-backed store, and how to modify `items`.

When `items` is modified in the store, any component wrapped with `withMemoryStore` will attempt to update (given constraints set out in `shouldComponentUpdate`).

```javascript
import React from 'react'
import { withMemoryStore } from 'proxy-store'

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
    addItem: (value) => {
      store.items.set([ ...store.items || [], value ]) // important to make a copy when using PureComponent
    }
  }
})(Widget)
```

We don't encourage the exact set-up above -- we recommend that you encapsulate your custom HOC into its own named HOC, which gives you the benefit of re-use and an alternative to a schema.

For example:

#### `withItems.js`

```javascript
import { withMemoryStore } from 'proxy-store'

export default function () {
  return withMemoryStore(store => {
    return {
      items: store.get('items') || [],
      addItem: (value) => {
        store.items.set([ ...store.items || [], value ]) // important to make a copy when using PureComponent
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

There are other HOC helpers available that are backed by different storage engines. Along with the standard memory store, there is also support for localStorage and sessionStorage. You can use the one that is most suitable to the type of persistance you need:

- If you want the store to be cleared after a refresh, use the memory store (`withMemoryStore` for example).
- If you want the store to survive a page refresh, use a session store (`withSessionStore` for example).
- If you want the store to survive a session (closing browser, etc), use a local store (`withLocalStore` for example).

### Custom store

`withMemoryStore` uses an instance of `MemoryStorage` (which shares much of the same API as `window.localStorage` and `window.sessionStorage`), and as such, anytime `withMemoryStore` is used in your application, it is using the same store instance across the board.

Here is an example of how to create your own HOC that uses its own storage engine. It is almost the same as the memory store implemented in this library:

#### `customStore.js`

```javascript
import { createStore } from 'proxy-store'

// the storageEngine API requires `setItem`, `getItem`, and `removeItem`
const myStorageEngine = {
  data: {},
  setItem (key, value) {
    this.data[key] = value
  },
  getItem (key) {
    return this.data[key]
  },
  removeItem (key) {
    delete this.data[key]
  }
}

const store = createStore(myStorageEngine)

export default store
```

#### `withCustomStore.js`

```javascript
import { createConnect } from 'proxy-store'
import customStore from './customStore'

export default function withCustomStore (mapStoreToValues) {
  return createConnect(mapStoreToValues, customStore)
}
```

### Async store

Asynchronous stores are supported via `createAsyncStore`. The store will be initially empty, but a `pending()` function will be available on the store so that you can choose to show a spinner during the initial load of the store.

Below is an example of a custom async store that leverages React Native's `AsyncStorage`:

#### `asyncStore.js`

```javascript
import { createAsyncStore } from 'proxy-store'
import { AsyncStorage } from 'react-native'

class AsyncStorageAdapter {
  async setItem (key, value) {
    return await AsyncStorage.setItem(key, value)
  }

  async getItem (key) {
    return await AsyncStorage.getItem(key)
  }

  async removeItem (key) {
    return await AsyncStorage.removeItem(key)
  }
}

const store = createAsyncStore(new AsyncStorageAdapter())

export default store
```

#### `withAsyncStore.js`

```javascript
import { createConnect } from 'proxy-store'
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
    addItem: (value) => {
      store.set('items', [ ...store.items || [], value ]) // important to make a copy when using PureComponent
    }
  }
})(Widget)
```

## API

### `withMemoryStore`

    withMemoryStore(
      mapStoreToValues: function
    )(Component: ReactClass)

### `withSessionStore`

    withSessionStore(
      mapStoreToValues: function
    )(Component: ReactClass)

### `withLocalStore`

    withLocalStore(
      mapStoreToValues: function
    )(Component: ReactClass)

## Building

To build the source

    npm run build

## Testing

Unit tests are expected to be colocated next to the module/file they are testing and have the following suffix `.test.js`.

To run unit tests through [istanbul](https://istanbul.js.org/) and [mocha](http://mochajs.org/)

    npm test

## Maintenance

To check what modules in `node_modules` are outdated:

    npm run audit

To update outdated modules while respecting the semver rules in the package.json:

    npm update

To update a module to the latest major version (replacing what you have):

    npm install themodule@latest -S (if to save in dependencies)
    npm install themodule@latest -D (if to save in devDependencies)