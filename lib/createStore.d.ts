export declare const retrievePersistedStore: (storageEngine: any) => any;
export declare const persistStore: (storageEngine: any, store: any) => any;
export default function createStore(storageEngine?: any): {
    set(key: any, value: any): any;
    get(key: any): any;
    deleteProperty(key: any): any;
    /**
     * Provide a subscribe method on the store that will notify the provided
     * callback with the target object that will be changed (set/del) along
     * with key and value.
     * Returns an object (handle) with a dispose method that should be called
     * to unsubscribe.
     */
    subscribe(fn: any): {
        dispose(): void;
    };
};
