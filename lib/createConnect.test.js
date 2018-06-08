"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Enzyme = require("enzyme");
var Adapter = require("enzyme-adapter-react-16");
var assert = require("assert");
var sinon = require("sinon");
var createStore_1 = require("./createStore");
var createAsyncStore_1 = require("./createAsyncStore");
var _a = require('./createConnect'), createConnect = _a.default, omitFunctions = _a.omitFunctions;
Enzyme.configure({ adapter: new Adapter() });
var makeStorageEngine = function () {
    var backingStore = {};
    return {
        setItem: function (key, value) { return backingStore[key] = value; },
        getItem: function (key) { return backingStore[key]; }
    };
};
var makeAsyncStorageEngine = function () {
    var backingStore = {};
    return {
        setItem: function (key, value) { return new Promise(function (resolve) {
            setTimeout(function () { return resolve(backingStore[key] = value); }, 0);
        }); },
        getItem: function (key) { return new Promise(function (resolve) {
            setTimeout(function () { return resolve(backingStore[key]); }, 0);
        }); }
    };
};
var makeWidget = function () {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.render = function () {
            var items = this.props.items;
            return (React.createElement(React.Fragment, null, items.map(function (item, key) { return React.createElement("div", { key: key }, item); })));
        };
        return class_1;
    }(React.PureComponent));
};
var mapStoreToValues = function (store) {
    return {
        items: store.get('items') || [],
        addItem: function (value) {
            store.set('items', (store.get('items') || []).concat([value]));
        },
        value: store.get('value') || '',
        setValue: function (value) { return store.set('value', value); },
        pending: typeof store.pending === 'function' ? store.pending() : false
    };
};
var commonStoreIntegrationTests = function (wording, makeStorageEngine, createStore) {
    it("should have 0 item divs on next tick (" + wording + ")", function (done) {
        var storageEngine = makeStorageEngine();
        var store = createStore(storageEngine);
        var connect = createConnect(mapStoreToValues, store);
        var Widget = makeWidget();
        var Component = connect(Widget);
        var wrapper = Enzyme.mount(React.createElement(Component, null));
        setTimeout(function () {
            wrapper.update(); // required for `find` to have the most recent tree to search
            assert.strictEqual(wrapper.find('div').length, 0);
            done();
        }, 0);
    });
    it("should have 1 item divs on next tick (" + wording + ")", function (done) {
        var storageEngine = makeStorageEngine();
        var store = createStore(storageEngine);
        var connect = createConnect(mapStoreToValues, store);
        var Widget = makeWidget();
        var Component = connect(Widget);
        var wrapper = Enzyme.mount(React.createElement(Component, null));
        wrapper.childAt(0).props().addItem('test1');
        setTimeout(function () {
            wrapper.update(); // required for `find` to have the most recent tree to search
            assert.strictEqual(wrapper.find('div').length, 1);
            done();
        }, 0);
    });
    it("should have 0 item divs and on next tick have 2 item divs (" + wording + ")", function (done) {
        var storageEngine = makeStorageEngine();
        var store = createStore(storageEngine);
        var connect = createConnect(mapStoreToValues, store);
        var Widget = makeWidget();
        var Component = connect(Widget);
        var wrapper = Enzyme.mount(React.createElement(Component, null));
        wrapper.childAt(0).props().addItem('test1');
        wrapper.childAt(0).props().addItem('test2');
        assert.strictEqual(wrapper.find('div').length, 0);
        setTimeout(function () {
            wrapper.update(); // required for `find` to have the most recent tree to search
            assert.strictEqual(wrapper.find('div').length, 2);
            done();
        }, 0);
    });
    it("should render again if setting value to a different value in next tick (" + wording + ")", function (done) {
        var storageEngine = makeStorageEngine();
        var store = createStore(storageEngine);
        var connect = createConnect(mapStoreToValues, store);
        var Widget = makeWidget();
        var Component = connect(Widget);
        sinon.spy(Widget.prototype, 'render');
        var wrapper = Enzyme.mount(React.createElement(Component, null));
        var expectedRenderCount = 0;
        // initial render when mounted
        expectedRenderCount++;
        // $pending true -> false forces an additional render
        expectedRenderCount += wording === 'async' ? 1 : 0;
        // set to new value
        wrapper.childAt(0).props().setValue('value1');
        expectedRenderCount++;
        setTimeout(function () {
            // set to new value on next tick
            wrapper.childAt(0).props().setValue('value2');
            expectedRenderCount++;
            assert.strictEqual(Widget.prototype.render['callCount'], expectedRenderCount);
            done();
        }, 0);
    });
    it("should render again if setting value to same value again in next tick (" + wording + ")", function (done) {
        var storageEngine = makeStorageEngine();
        var store = createStore(storageEngine);
        var connect = createConnect(mapStoreToValues, store);
        var Widget = makeWidget();
        var Component = connect(Widget);
        sinon.spy(Widget.prototype, 'render');
        var wrapper = Enzyme.mount(React.createElement(Component, null));
        var expectedRenderCount = 0;
        // initial render when mounted
        expectedRenderCount++;
        // $pending true -> false forces an additional render
        expectedRenderCount += wording === 'async' ? 1 : 0;
        // set to new value
        wrapper.childAt(0).props().setValue('valueX');
        expectedRenderCount++;
        setTimeout(function () {
            // set again to same value in next tick (should not re-render)
            wrapper.childAt(0).props().setValue('valueX');
            assert.strictEqual(Widget.prototype.render['callCount'], expectedRenderCount);
            done();
        }, 0);
    });
    it("should render again if setting value to a different value in same tick (" + wording + ")", function () {
        var storageEngine = makeStorageEngine();
        var store = createStore(storageEngine);
        var connect = createConnect(mapStoreToValues, store);
        var Widget = makeWidget();
        var Component = connect(Widget);
        sinon.spy(Widget.prototype, 'render');
        var wrapper = Enzyme.mount(React.createElement(Component, null));
        var expectedRenderCount = 0;
        // initial render when mounted
        expectedRenderCount++;
        // set to new value
        wrapper.childAt(0).props().setValue('value3');
        expectedRenderCount++;
        // set to new value on same tick
        wrapper.childAt(0).props().setValue('value4');
        expectedRenderCount++;
        assert.strictEqual(Widget.prototype.render['callCount'], expectedRenderCount);
    });
};
describe('createConnect', function () {
    describe('omitFunctions', function () {
        it('should omit properties that are functions from object', function () {
            var obj = {
                test1: 1,
                test2: true,
                test3: function () { },
                test4: 'test',
                test5: function () { },
                test6: NaN,
                test7: undefined,
                test8: null,
                test9: Infinity
            };
            var objNoFuncs = omitFunctions(obj);
            var objNoFuncsKeys = Object.keys(objNoFuncs);
            assert.deepStrictEqual(['test1', 'test2', 'test4', 'test6', 'test7', 'test8', 'test9'], objNoFuncsKeys);
        });
    });
    describe('createStore integration', function () {
        commonStoreIntegrationTests('sync', makeStorageEngine, createStore_1.default);
    });
    describe('createAsyncStore integration', function () {
        commonStoreIntegrationTests('async', makeAsyncStorageEngine, createAsyncStore_1.default);
        it('should have prop value for pending as true, then as false on next tick', function (done) {
            var asyncStorageEngine = makeAsyncStorageEngine();
            var store = createAsyncStore_1.default(asyncStorageEngine);
            var connect = createConnect(mapStoreToValues, store);
            var Widget = makeWidget();
            var Component = connect(Widget);
            var wrapper = Enzyme.mount(React.createElement(Component, null));
            assert.strictEqual(wrapper.childAt(0).props().pending, true);
            setTimeout(function () {
                wrapper.update();
                assert.strictEqual(wrapper.childAt(0).props().pending, false);
                done();
            }, 0);
        });
    });
});
