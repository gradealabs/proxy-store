import * as React from 'react'

export default function createConnect (mapStoreToValues, handlers, store) {
  const mapStoreToValuesOmitted = typeof mapStoreToValues !== 'function' && typeof mapStoreToValues === 'object' && Object.keys(mapStoreToValues).length && store === undefined
  const handlersOmitted = typeof mapStoreToValues === 'function' && store === undefined

  const _mapStoreToValues = mapStoreToValuesOmitted ? null : mapStoreToValues
  const _handlers = mapStoreToValuesOmitted ? mapStoreToValues : (handlersOmitted ? null : handlers)
  const _store = mapStoreToValuesOmitted ? handlers : (handlersOmitted ? handlers : store)

  return function connect (Component) {
    const mapStoreToHandlers = props => {
      return Object.keys(_handlers).reduce(function (previous, handlerName) {
        return Object.assign({}, previous, { [handlerName]: _handlers[handlerName](_store, props) })
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
          _mapStoreToValues(_store, props),
          mapStoreToHandlers(props)
        )
      }

      componentDidMount () {
        this.sub = _store.subscribe(() => {
          if (this.unmounted) {
            return
          }

          this.setState(Object.assign(
            {},
            this.state,
            _mapStoreToValues(_store, this.props)
          ))
        })
      }

      static getDerivedStateFromProps (nextProps, prevState) {
        return Object.assign(
          {},
          prevState,
          _mapStoreToValues(_store, nextProps),
          mapStoreToHandlers(nextProps)
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
