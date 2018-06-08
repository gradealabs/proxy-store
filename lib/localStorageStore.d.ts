declare const store: {
    set(key: any, value: any): any;
    get(key: any): any;
    deleteProperty(key: any): any;
    subscribe(fn: any): {
        dispose(): void;
    };
};
export default store;
