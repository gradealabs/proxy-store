# Store HOCs 3.1.5

**Supports React 16.3+ only. For < 16.3, use [v2.0.3](https://github.com/gradealabs/store-hocs/releases/tag/v2.0.3)**

Store HOCs allows you to store data in an object to be used across components in a similar way to Redux but without the ceremony. The store is completely ad-hoc and you are meant to map the store object to props when used.

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

`withMemoryStore` uses an instance of `MemoryStorage` (which shares much of the same API as `window.localStorage` and `window.sessionStorage`), and as such, anytime `withMemoryStore` is used in your application, it is using the same store instance across the board.

Here is an example of how to create your own HOC that uses its own storage engine. It is almost the same as the memory store implemented in this library:

#### `customStore.js`

```javascript
import { createStore } from '@gradealabs/store-hocs'

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

Asynchronous stores are supported via `createAsyncStore`. The store will be initially empty, but a `pending()` function will be available on the store so that you can choose to show a spinner during the initial load of the store.

Below is an example of a custom async store that leverages React Native's `AsyncStorage`:

#### `asyncStore.js`

```javascript
import { createAsyncStore } from '@gradealabs/store-hocs'
import { AsyncStorage } from 'react-native'

class AsyncStorageAdapter {
  setItem (key, value) {
    return AsyncStorage.setItem(key, value)
  }

  getItem (key) {
    return AsyncStorage.getItem(key)
  }

  removeItem (key) {
    return AsyncStorage.removeItem(key)
  }
}

export default createAsyncStore(new AsyncStorageAdapter())
```

Alternatively, since AsyncStorage already shares the correct API (setItem,
getItem, and removeItem), we could replace `asyncStore.js` with:

```javascript
import { createAsyncStore } from '@gradealabs/store-hocs'
import { AsyncStorage } from 'react-native'

export default createAsyncStore(AsyncStorage)
```

And if you happen to be using Expo, an example of using `SecureStore` could look
like this:

```javascript
import { createAsyncStore } from '@gradealabs/store-hocs'
import { SecureStore } from 'expo'

class AsyncStorageAdapter {
  setItem (key, value) {
    return SecureStore.setItemAsync(key, value)
  }

  getItem (key) {
    return SecureStore.getItemAsync(key)
  }

  removeItem (key) {
    return SecureStore.deleteItemAsync(key)
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

To run unit tests through [mocha](http://mochajs.org/):

    npm test
