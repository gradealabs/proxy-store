const React = require('react')
const Enzyme = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const assert = require('assert')

const {
  default: createStore
} = require('./createStore')

const {
  default: createConnect,
  omitFunctions
} = require('./createConnect')

Enzyme.configure({ adapter: new Adapter() })

const makeStorageEngine = () => {
  let backingStore = {}
  return {
    setItem: (key, value) => backingStore[key] = value,
    getItem: key => backingStore[key]
  }
}

describe('createConnect', function () {
  describe('omitFunctions', function () {
    it('should omit properties that are functions from object', function () {
      const obj = {
        test1: 1,
        test2: true,
        test3: function () {},
        test4: 'test',
        test5: function () {},
        test6: NaN,
        test7: undefined,
        test8: null,
        test9: Infinity
      }

      const objNoFuncs = omitFunctions(obj)
      const objNoFuncsKeys = Object.keys(objNoFuncs)

      assert.deepStrictEqual(['test1', 'test2', 'test4', 'test6', 'test7', 'test8', 'test9'], objNoFuncsKeys)
    })
  })

  describe('integration', function () {
    it('test', function () {
      const storageEngine = makeStorageEngine()
      const store = createStore(storageEngine)

      class Widget extends React.PureComponent {
        render () {
          const { items, addItem } = this.props
        }
      }

      const mapStoreToValues = store => {
        return {
          items: store.get('items') || [],
          addItem: value => {
            store.set('items', [ ...store.get('items') || [], value ])
          }
        }
      }

      const connect = createConnect(mapStoreToValues, store)
      const Component = connect(Widget)

      const wrapper = Enzyme.shallow(<Component />)
    })
  })
})
