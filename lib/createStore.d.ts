export declare const readStore: (storageEngine: any) => any;
export declare const writeStore: (storageEngine: any, store: any) => any;
export default function createStore(storageEngine?: any): {
    set(key: any, value: any): void;
    get(key: any): any;
    deleteProperty(key: any): void;
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
