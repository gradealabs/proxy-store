import * as React from 'react'

export const omitFunctions = (obj) => {
  let cleanObj = {}
  Object.keys(obj)
    .filter(key => typeof obj[key] !== 'function')
    .forEach(key => (cleanObj[key] = obj[key]))
  return cleanObj
}

export default function createConnect (mapStoreToValues, store) {
  return function connect (Component) {
    return class extends React.Component {
      unmounted = false
      sub = null

      constructor (props, context) {
        super(props, context)

        this.state = mapStoreToValues(store, props)
      }

      componentDidMount () {
        this.sub = store.subscribe(() => {
          if (this.unmounted) {
            return
          }

          this.setState(Object.assign(
            {},
            this.state,
            omitFunctions(mapStoreToValues(store, this.props))
          ))
        })
      }

      static getDerivedStateFromProps (nextProps, prevState) {
        return Object.assign(
          {},
          prevState,
          omitFunctions(mapStoreToValues(store, nextProps))
        )
      }

      componentWillUnmount () {
        this.unmounted = true
        this.sub && this.sub.dispose && this.sub.dispose()
      }

      render () {
        return <Component {...Object.assign({}, this.state, this.props)} />
      }
    }
  }
}
