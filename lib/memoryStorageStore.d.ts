declare const store: {
    set(key: any, value: any): void;
    get(key: any): any;
    deleteProperty(key: any): void;
    subscribe(fn: any): {
        dispose(): void;
    };
};
export default store;
