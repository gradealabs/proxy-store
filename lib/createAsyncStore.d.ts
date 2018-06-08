export declare const retrievePersistedStore: (asyncStorageEngine: any) => Promise<any>;
export declare const persistStore: (asyncStorageEngine: any, store: any) => Promise<any>;
export default function createAsyncStore(asyncStorageEngine?: any): {
    pending(): boolean;
    set(key: any, value: any): {};
    get(key: any): any;
    deleteProperty(key: any): {};
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
