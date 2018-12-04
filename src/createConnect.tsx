import * as React from 'react'

export default function createConnect (mapStoreToValues, handlers, store) {
  return function connect (Component) {
    const mapStoreToHandlers = (store, props) => {
      return Object.keys(handlers).reduce(function (previous, handlerName) {
        return Object.assign({}, previous, { [handlerName]: handlers[handlerName](store, props) })
      }, {})
    }

    return class extends React.Component {
      unmounted: boolean
      sub: { dispose: Function }

      constructor (props, context) {
        super(props, context)

        this.unmounted = false
        this.sub = null

        this.state = Object.assign(
          {},
          mapStoreToValues(store, props),
          mapStoreToHandlers(store, props)
        )
      }

      componentDidMount () {
        this.sub = store.subscribe(() => {
          if (this.unmounted) {
            return
          }

          this.setState(Object.assign(
            {},
            this.state,
            mapStoreToValues(store, this.props)
          ))
        })
      }

      static getDerivedStateFromProps (nextProps, prevState) {
        return Object.assign(
          {},
          prevState,
          mapStoreToValues(store, nextProps),
          mapStoreToHandlers(store, nextProps)
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
