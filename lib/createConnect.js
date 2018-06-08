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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
exports.omitFunctions = function (obj) {
    var cleanObj = {};
    Object.keys(obj)
        .filter(function (key) { return typeof obj[key] !== 'function'; })
        .forEach(function (key) { return (cleanObj[key] = obj[key]); });
    return cleanObj;
};
function createConnect(mapStoreToValues, store) {
    return function connect(Component) {
        return /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1(props, context) {
                var _this = _super.call(this, props, context) || this;
                _this.unmounted = false;
                _this.sub = null;
                _this.state = mapStoreToValues(store, props);
                return _this;
            }
            class_1.prototype.componentDidMount = function () {
                var _this = this;
                this.sub = store.subscribe(function () {
                    if (_this.unmounted) {
                        return;
                    }
                    _this.setState(Object.assign({}, _this.state, exports.omitFunctions(mapStoreToValues(store, _this.props))));
                });
            };
            class_1.getDerivedStateFromProps = function (nextProps, prevState) {
                return Object.assign({}, prevState, exports.omitFunctions(mapStoreToValues(store, nextProps)));
            };
            class_1.prototype.componentWillUnmount = function () {
                this.unmounted = true;
                this.sub && this.sub.dispose && this.sub.dispose();
            };
            class_1.prototype.render = function () {
                return React.createElement(Component, __assign({}, Object.assign({}, this.state, this.props)));
            };
            return class_1;
        }(React.Component));
    };
}
exports.default = createConnect;
