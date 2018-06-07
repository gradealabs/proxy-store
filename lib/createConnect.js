"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createConnect;
exports.omitFunctions = void 0;

var _assign = _interopRequireDefault(require("@babel/runtime/core-js/object/assign"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _keys = _interopRequireDefault(require("@babel/runtime/core-js/object/keys"));

var _react = _interopRequireDefault(require("react"));

var omitFunctions = function omitFunctions(obj) {
  var cleanObj = {};
  (0, _keys.default)(obj).filter(function (key) {
    return typeof obj[key] !== 'function';
  }).forEach(function (key) {
    return cleanObj[key] = obj[key];
  });
  return cleanObj;
};

exports.omitFunctions = omitFunctions;

function createConnect(mapStoreToValues, store) {
  return function connect(Component) {
    return (
      /*#__PURE__*/
      function (_React$Component) {
        (0, _inherits2.default)(_class, _React$Component);

        function _class(props, context) {
          var _this;

          (0, _classCallCheck2.default)(this, _class);
          _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(_class).call(this, props, context));
          _this.state = mapStoreToValues(store, props);
          return _this;
        }

        (0, _createClass2.default)(_class, [{
          key: "componentDidMount",
          value: function componentDidMount() {
            var _this2 = this;

            this.sub = store.subscribe(function () {
              if (_this2.unmounted) {
                return;
              }

              _this2.setState((0, _assign.default)({}, _this2.state, omitFunctions(mapStoreToValues(store, _this2.props))));
            });
          }
        }, {
          key: "componentWillUnmount",
          value: function componentWillUnmount() {
            this.unmounted = true;
            this.sub && this.sub.dispose && this.sub.dispose();
          }
        }, {
          key: "render",
          value: function render() {
            return _react.default.createElement(Component, (0, _assign.default)({}, this.state, this.props));
          }
        }], [{
          key: "getDerivedStateFromProps",
          value: function getDerivedStateFromProps(nextProps, prevState) {
            return (0, _assign.default)({}, prevState, omitFunctions(mapStoreToValues(store, nextProps)));
          }
        }]);
        return _class;
      }(_react.default.Component)
    );
  };
}