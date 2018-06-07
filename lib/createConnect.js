"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createConnect;
exports.omitFunctions = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const omitFunctions = obj => {
  let cleanObj = {};
  Object.keys(obj).filter(key => typeof obj[key] !== 'function').forEach(key => cleanObj[key] = obj[key]);
  return cleanObj;
};

exports.omitFunctions = omitFunctions;

function createConnect(mapStoreToValues, store) {
  return function connect(Component) {
    return class extends _react.default.Component {
      constructor(props, context) {
        super(props, context);
        this.state = mapStoreToValues(store, props);
      }

      componentDidMount() {
        this.sub = store.subscribe(() => {
          if (this.unmounted) {
            return;
          }

          this.setState(Object.assign({}, this.state, omitFunctions(mapStoreToValues(store, this.props))));
        });
      }

      static getDerivedStateFromProps(nextProps, prevState) {
        return Object.assign({}, prevState, omitFunctions(mapStoreToValues(store, nextProps)));
      }

      componentWillUnmount() {
        this.unmounted = true;
        this.sub && this.sub.dispose && this.sub.dispose();
      }

      render() {
        return _react.default.createElement(Component, Object.assign({}, this.state, this.props));
      }

    };
  };
}