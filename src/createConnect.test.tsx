import * as React from 'react'
import * as PropTypes from 'prop-types'
import * as Enzyme from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import * as assert from 'assert'
import * as sinon from 'sinon'

import createStore from './createStore'
import createAsyncStore from './createAsyncStore'

const {
  default: createConnect,
  omitFunctions
} = require('./createConnect')

Enzyme.configure({ adapter: new Adapter() })

const makeStorageEngine = () => {
  let backingStore = null
  return {
    setStore: store => (backingStore = store),
    getStore: () => backingStore
  }
}

const makeAsyncStorageEngine = () => {
  let backingStore = null
  return {
    setStore: store => new Promise(resolve => {
      setTimeout(() => resolve(backingStore = store), 0)
    }),
    getStore: () => new Promise(resolve => {
      setTimeout(() => resolve(backingStore), 0)
    })
  }
}

const makeWidget = () => {
  return class extends React.PureComponent<{ items: string[] }> {
    render () {
      const { items } = this.props
      return (
        <React.Fragment>
          {items.map((item, key) => <div key={key}>{item}</div>)}
        </React.Fragment>
      )
    }
  }
}

const mapStoreToValues = store => {
  return {
    items: store.get('items') || [],
    addItem: value => {
      store.set('items', [ ...store.get('items') || [], value ])
    },
    value: store.get('value') || '',
    setValue: value => store.set('value', value),
    pending: typeof store.pending === 'function' ? store.pending() : false
  }
}

const commonStoreIntegrationTests = (wording, makeStorageEngine, createStore) => {
  it(`should have 0 item divs on next tick (${wording})`, function (done) {
    const storageEngine = makeStorageEngine()
    const store = createStore(storageEngine)
    const connect = createConnect(mapStoreToValues, store)
    const Widget = makeWidget()
    const Component = connect(Widget)
    const wrapper = Enzyme.mount(<Component />)

    setTimeout(function () {
      wrapper.update()  // required for `find` to have the most recent tree to search
      assert.strictEqual(wrapper.find('div').length, 0)
      done()
    }, 1)
  })

  it(`should have 1 item divs on next tick (${wording})`, function (done) {
    const storageEngine = makeStorageEngine()
    const store = createStore(storageEngine)
    const connect = createConnect(mapStoreToValues, store)
    const Widget = makeWidget()
    const Component = connect(Widget)
    const wrapper = Enzyme.mount(<Component />)

    wrapper.childAt(0).props().addItem('test1')
    setTimeout(function () {
      wrapper.update()  // required for `find` to have the most recent tree to search
      assert.strictEqual(wrapper.find('div').length, 1)
      done()
    }, 1)
  })

  it(`should have 0 item divs and on next tick have 2 item divs (${wording})`, function (done) {
    const storageEngine = makeStorageEngine()
    const store = createStore(storageEngine)
    const connect = createConnect(mapStoreToValues, store)
    const Widget = makeWidget()
    const Component = connect(Widget)
    const wrapper = Enzyme.mount(<Component />)

    wrapper.childAt(0).props().addItem('test1')
    wrapper.childAt(0).props().addItem('test2')
    assert.strictEqual(wrapper.find('div').length, 0)
    setTimeout(function () {
      wrapper.update()  // required for `find` to have the most recent tree to search
      assert.strictEqual(wrapper.find('div').length, 2)
      done()
    }, 1)
  })

  it(`should render again if setting value to a different value in next tick (${wording})`, function (done) {
    const storageEngine = makeStorageEngine()
    const store = createStore(storageEngine)
    const connect = createConnect(mapStoreToValues, store)
    const Widget = makeWidget()
    const Component = connect(Widget)
    sinon.spy(Widget.prototype, 'render')
    const wrapper = Enzyme.mount(<Component />)

    let expectedRenderCount = 0

    // initial render when mounted
    expectedRenderCount++

    // $pending true -> false forces an additional render
    expectedRenderCount += wording === 'async' ? 1 : 0

    // set to new value
    wrapper.childAt(0).props().setValue('value1')
    expectedRenderCount++

    setTimeout(function () {
      // set to new value on next tick
      wrapper.childAt(0).props().setValue('value2')
      expectedRenderCount++

      assert.strictEqual(Widget.prototype.render['callCount'], expectedRenderCount)

      done()
    }, 2)
  })

  it(`should render again if setting value to same value again in next tick (${wording})`, function (done) {
    const storageEngine = makeStorageEngine()
    const store = createStore(storageEngine)
    const connect = createConnect(mapStoreToValues, store)
    const Widget = makeWidget()
    const Component = connect(Widget)
    sinon.spy(Widget.prototype, 'render')
    const wrapper = Enzyme.mount(<Component />)

    let expectedRenderCount = 0

    // initial render when mounted
    expectedRenderCount++

    // $pending true -> false forces an additional render
    expectedRenderCount += wording === 'async' ? 1 : 0

    // set to new value
    wrapper.childAt(0).props().setValue('valueX')
    expectedRenderCount++

    setTimeout(function () {
      // set again to same value in next tick (should not re-render)
      wrapper.childAt(0).props().setValue('valueX')

      assert.strictEqual(Widget.prototype.render['callCount'], expectedRenderCount)

      done()
    }, 2)
  })

  it(`should render again if setting value to a different value in same tick (${wording})`, function () {
    const storageEngine = makeStorageEngine()
    const store = createStore(storageEngine)
    const connect = createConnect(mapStoreToValues, store)
    const Widget = makeWidget()
    const Component = connect(Widget)
    sinon.spy(Widget.prototype, 'render')
    const wrapper = Enzyme.mount(<Component />)

    let expectedRenderCount = 0

    // initial render when mounted
    expectedRenderCount++

    // set to new value
    wrapper.childAt(0).props().setValue('value3')
    expectedRenderCount++

    // set to new value on same tick
    wrapper.childAt(0).props().setValue('value4')
    expectedRenderCount++

    assert.strictEqual(Widget.prototype.render['callCount'], expectedRenderCount)
  })
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

  describe('createStore integration', function () {
    commonStoreIntegrationTests('sync', makeStorageEngine, createStore)
  })

  describe('createAsyncStore integration', function () {
    commonStoreIntegrationTests('async', makeAsyncStorageEngine, createAsyncStore)

    it('should have prop value for pending as true, then as false on next tick', function (done) {
      const asyncStorageEngine = makeAsyncStorageEngine()
      const store = createAsyncStore(asyncStorageEngine)
      const connect = createConnect(mapStoreToValues, store)
      const Widget = makeWidget()
      const Component = connect(Widget)
      const wrapper = Enzyme.mount(<Component />)

      assert.strictEqual(wrapper.childAt(0).props().pending, true)
      setTimeout(function () {
        wrapper.update()
        assert.strictEqual(wrapper.childAt(0).props().pending, false)
        done()
      }, 2)
    })
  })
})
