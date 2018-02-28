# Proxy Store

Proxy Store allows you to store data in an object to be used across components
in a similar way to Redux but without the ceremony. The store is completely
ad-hoc and you are meant to map the store object to props when used.

## Quick Start

The following example shows how to read `items` from a memory-backed store,
and how to modify it. When `items` is modified in the store, a re-rendering
will take place wherever `withMemoryStorage` is also being used as an HOC.

    import React from 'react'
    import { withMemoryStorage } from 'proxy-store'

    class Widget extends React.Component {
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

    export default withMemoryStorage(store => {
      return {
        items: store.items || []
      }
    }, store => {
      return {
        addItem: (value) => {
          store.items = [ ...store.items, value ] // important to make a copy
        }
      }
    })(Widget)

There are other HOC helpers available that are backed by different storage
mechanisms. Along with the standard memory-store, there is also support for
localStorage and sessionStorage. You can use the one that is most suitable
to the type of persistance you need.

For example:

- If you want the store to be cleared after a refresh, use the memory store
  (`withMemoryStorage` for example).
- If you want the store to survive a page refresh, use a session store
  (`withSessionStorage` for example).
- If you want the store to survive a session (closing browser, etc), use a
  local store (`withLocalStorage` for example).

## API

### withMemoryStorage

  withMemoryStorage(
    mapStoreToValues: function,
    ?mapStoreToMethods: function
  )(Component: ReactClass)

### withSessionStorage

  withSessionStorage(
    mapStoreToProps: function
  )(Component: ReactClass)

### withLocalStorage

  withLocalStorage(
    mapStoreToProps: function
  )(Component: ReactClass)

## Building

To build the source

    npm run build

## Testing

Unit tests are expected to be colocated next to the module/file they are testing
and have the following suffix `.test.js`.

To run unit tests through [istanbul](https://istanbul.js.org/) and
[mocha](http://mochajs.org/)

    npm test

## Maintenance

To check what modules in `node_modules` are outdated:

    npm run audit

To update outdated modules while respecting the semver rules in the package.json:

    npm update

To update a module to the latest major version (replacing what you have):

    npm install themodule@latest -S (if to save in dependencies)
    npm install themodule@latest -D (if to save in devDependencies)