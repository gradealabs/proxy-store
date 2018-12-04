import withMemoryStore from '../src/withMemoryStore'
// import withQueryStore from './withQueryStore'

class Widget extends React.PureComponent {
  render () {
    const { items, addItem, removeItem, prefix, setPrefix } = this.props

    return (
      <div>
        <h1>Prefix:</h1>
        <input type='text' value={prefix} onChange={evt => setPrefix(evt.target.value)} />
        <h1>Random numbers:</h1>
        <button onClick={() => addItem(Math.floor(Math.random() * 1000))}>Add random number</button>
        <ul>
          {items.map((value, index) => <li key={index}>{value} <button onClick={() => removeItem(index)}>x</button></li>)}
        </ul>
      </div>
    )
  }
}

// const withStore = withQueryStore
const withStore = withMemoryStore

// withPrefix demonstrates how prop changes from higher-up will re-define the
// handlers below so that these new props are scoped properly in the handlers
function withPrefix (Component) {
  return withStore(store => ({
    prefix: store.get('prefix') || ''
  }), {
    setPrefix: store => prefix => {
      store.set('prefix', prefix)
    }
  })(Component)
}

function withItems (Component) {
  const getItems = store => {
    const items = store.get('items') || []
    return Array.isArray(items) ? items : [items]
  }

  return withStore(store => ({
    items: getItems(store)
  }), {
    addItem: (store, props) => value => {
      const items = getItems(store)
      store.set('items', [ ...items, `${props.prefix}${value}` ])
    },
    removeItem: (store, props) => index => {
      const items = getItems(store)
      store.set('items', items.filter((_, i) => i !== index))
    }
  })(Component)
}

const enhancedWidget = withPrefix(withItems(Widget))

ReactDOM.render(
  React.createElement(enhancedWidget, {}),
  document.getElementById('root')
)
