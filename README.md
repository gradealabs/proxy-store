# Proxy Store

Proxy Store allows you to store data in an object to be used across components in a similar way to Redux but without the ceremony. The store is completely ad-hoc and you are meant to map the store object to props when used.

## Quick Start

The following example shows how to read `items` from a memory-backed store, and how to modify `items`.

When `items` is modified in the store, any component wrapped with `withMemoryStore` will attempt to update (given constraints set out in `shouldComponentUpdate`).

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
        items: store.items || []
      }
    }, store => {
      return {
        addItem: (value) => {
          store.items = [ ...store.items || [], value ] // important to make a copy when using PureComponent
        }
      }
    })(Widget)

There are other HOC helpers available that are backed by different storage mechanisms. Along with the standard memory-store, there is also support for localStorage and sessionStorage. You can use the one that is most suitable to the type of persistance you need.

For example:

- If you want the store to be cleared after a refresh, use the memory store (`withMemoryStore` for example).
- If you want the store to survive a page refresh, use a session store (`withSessionStore` for example).
- If you want the store to survive a session (closing browser, etc), use a local store (`withLocalStore` for example).

### `mapStoreToValues` vs `mapStoreToMethods`

The difference between `mapStoreToValues` and `mapStoreToMethods` is that `mapStoreToValues` is mandatory and is used to inject props into the target component that could cause a re-render if different in a pure component, while `mapStoreToMethods` is used to inject props into the target component, but only on mount, so that new values don't cause a re-render in a pure component.

You could technically define functions in `mapStoreToValues`, but inline functions created within `mapStoreToValues` will cause re-renders in a pure component.

### Custom store

`withMemoryStore` uses an instance of `MemoryStorage` (which shares much of the same API as `window.localStorage` and `window.sessionStorage`), and as such, anytime `withMemoryStore` is used in your application, it is using the same store instance across the board.

Here is an example of how to create your own HOC that uses a different instance:

#### `customStore.js`

    import { createStore, MemoryStorage } from 'proxy-store'

    const storageEngine = new MemoryStorage() // the storageEngine API requires `setItem`, `getItem`, and `removeItem`
    const store = createStore(storageEngine)

    export default store

#### `withCustomStore.js`

    import { createConnect } from 'proxy-store'
    import customStore from './customStore'

    export default function withCustomStorage (mapStoreToValues, mapStoreToMethods) {
      return createConnect(mapStoreToValues, mapStoreToMethods, customStore)
    }

## API

### `withMemoryStore`

    withMemoryStore(
      mapStoreToValues: function,
      ?mapStoreToMethods: function
    )(Component: ReactClass)

### `withSessionStore`

    withSessionStore(
      mapStoreToValues: function,
      ?mapStoreToMethods: function
    )(Component: ReactClass)

### `withLocalStore`

    withLocalStore(
      mapStoreToValues: function,
      ?mapStoreToMethods: function
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