"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
function createConnect(mapStoreToValues, mapStoreToMethods, store) {
    return function (Component) {
        let snapshot = {};
        return class extends React.Component {
            constructor(props, context) {
                super(props, context);
                snapshot = Object.assign({}, snapshot, mapStoreToValues(store, props), mapStoreToMethods ? mapStoreToMethods(store, props) : {});
            }
            componentWillMount() {
                const { props } = this;
                this.sub = store.subscribe(() => {
                    snapshot = Object.assign({}, snapshot, mapStoreToValues(store, this.props));
                    this.forceUpdate();
                });
            }
            componentWillUpdate() {
                snapshot = Object.assign({}, snapshot, mapStoreToValues(store, this.props));
            }
            componentWillUnmount() {
                this.sub && this.sub.dispose && this.sub.dispose();
            }
            render() {
                return React.createElement(Component, Object.assign({}, Object.assign({}, snapshot, this.props)));
            }
        };
    };
}
exports.default = createConnect;
