// import withMemoryStore from '../src/withMemoryStore'
import withQueryStore from './withQueryStore'

class Widget extends React.PureComponent {
  render () {
    const { items, addItem, removeItem } = this.props

    return (
      <div>
        <h1>Random numbers:</h1>
        <button onClick={() => addItem(Math.floor(Math.random() * 1000))}>Add random number</button>
        <ul>
          {items.map((value, index) => <li key={index}>{value} <button onClick={() => removeItem(index)}>x</button></li>)}
        </ul>
      </div>
    )
  }
}

const withStore = withQueryStore // withMemoryStore

const enhancedWidget = withStore(store => {
  const getItems = () => {
    const items = store.get('items') || []
    return Array.isArray(items) ? items : [items]
  }

  return {
    items: getItems(),
    addItem: value => {
      const items = getItems()
      store.set('items', [ ...items, value ])
    },
    removeItem: index => {
      const items = getItems()
      store.set('items', items.filter((_, i) => i !== index))
    }
  }
})(Widget)

ReactDOM.render(
  React.createElement(enhancedWidget, {}),
  document.getElementById('root')
)
