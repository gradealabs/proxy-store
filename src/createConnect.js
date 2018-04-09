import * as React from 'react'

export default function createConnect (mapStoreToValues, store) {
  return function (Component) {
    let snapshot = {}

    return class extends React.Component {
      constructor (props, context) {
        super(props, context)

        snapshot = Object.assign(
          {},
          snapshot,
          mapStoreToValues(store, props)
        )
      }

      omitFunctions (obj) {
        let cleanObj = {}
        Object.keys(obj)
          .filter(key => typeof obj[key] !== 'function')
          .forEach(key => (cleanObj[key] = obj[key]))
        return cleanObj
      }

      componentWillMount () {
        const { props } = this
        this.sub = store.subscribe(() => {
          snapshot = Object.assign(
            {},
            snapshot,
            this.omitFunctions(mapStoreToValues(store, this.props))
          )
          this.forceUpdate()
        })
      }

      componentWillUpdate () {
        snapshot = Object.assign(
          {},
          snapshot,
          this.omitFunctions(mapStoreToValues(store, this.props))
        )
      }

      componentWillUnmount () {
        this.sub && this.sub.dispose && this.sub.dispose()
      }

      render () {
        return <Component {...Object.assign({}, snapshot, this.props)} />
      }
    }
  }
}
