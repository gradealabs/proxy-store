import withMemoryStore from '../src/withMemoryStore'

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

const enhancedWidget = withMemoryStore(store => {
  return {
    items: store.get('items') || [],
    addItem: value => {
      store.set('items', [ ...store.get('items') || [], value ]) // important to make a copy when using PureComponent
    }
  }
})(Widget)

ReactDOM.render(
  React.createElement(enhancedWidget, {}),
  document.getElementById('root')
)
