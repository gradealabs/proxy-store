"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createConnect;
exports.omitFunctions = void 0;

var React = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

var omitFunctions = function omitFunctions(obj) {
  var cleanObj = {};
  Object.keys(obj).filter(function (key) {
    return typeof obj[key] !== 'function';
  }).forEach(function (key) {
    return cleanObj[key] = obj[key];
  });
  return cleanObj;
};

exports.omitFunctions = omitFunctions;

function createConnect(mapStoreToValues, store) {
  return function (Component) {
    var snapshot = {};
    return (
      /*#__PURE__*/
      function (_React$Component) {
        function _class(props, context) {
          var _this;

          _classCallCheck(this, _class);

          _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, props, context));
          snapshot = Object.assign({}, snapshot, mapStoreToValues(store, props));
          return _this;
        }

        _createClass(_class, [{
          key: "componentWillMount",
          value: function componentWillMount() {
            var _this2 = this;

            var props = this.props;
            this.sub = store.subscribe(function () {
              snapshot = Object.assign({}, snapshot, omitFunctions(mapStoreToValues(store, _this2.props)));

              _this2.forceUpdate();
            });
          }
        }, {
          key: "componentWillUpdate",
          value: function componentWillUpdate() {
            snapshot = Object.assign({}, snapshot, omitFunctions(mapStoreToValues(store, this.props)));
          }
        }, {
          key: "componentWillUnmount",
          value: function componentWillUnmount() {
            this.sub && this.sub.dispose && this.sub.dispose();
          }
        }, {
          key: "render",
          value: function render() {
            return React.createElement(Component, Object.assign({}, snapshot, this.props));
          }
        }]);

        _inherits(_class, _React$Component);

        return _class;
      }(React.Component)
    );
  };
}