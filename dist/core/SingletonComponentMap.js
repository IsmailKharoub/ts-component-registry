"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingletonComponentMap = void 0;
/**
 * SingletonComponentMap - TypeScript equivalent of the Kotlin implementation
 * Wraps a Map<K, Collection<V>> and exposes it as Map<K, V> by taking the first element
 */
class SingletonComponentMap {
    constructor(originalMap) {
        this.originalMap = originalMap;
    }
    get size() {
        return this.originalMap.size;
    }
    get [Symbol.toStringTag]() {
        return 'SingletonComponentMap';
    }
    keys() {
        return this.originalMap.keys();
    }
    values() {
        const values = [];
        for (const collection of this.originalMap.values()) {
            if (collection.length > 0) {
                values.push(collection[0]);
            }
        }
        return values[Symbol.iterator]();
    }
    entries() {
        const entries = [];
        for (const [key, collection] of this.originalMap.entries()) {
            if (collection.length > 0) {
                entries.push([key, collection[0]]);
            }
        }
        return entries[Symbol.iterator]();
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    has(key) {
        return this.originalMap.has(key);
    }
    get(key) {
        const collection = this.originalMap.get(key);
        return collection && collection.length > 0 ? collection[0] : undefined;
    }
    set(key, value) {
        // For singleton map, we replace the entire collection with a single value
        this.originalMap.set(key, [value]);
        return this;
    }
    delete(key) {
        return this.originalMap.delete(key);
    }
    clear() {
        this.originalMap.clear();
    }
    forEach(callback, thisArg) {
        for (const [key, collection] of this.originalMap.entries()) {
            if (collection.length > 0) {
                callback.call(thisArg, collection[0], key, this);
            }
        }
    }
    isEmpty() {
        return this.originalMap.size === 0;
    }
    /**
     * Get all components for a key (including duplicates)
     */
    getAll(key) {
        return this.originalMap.get(key) || [];
    }
    /**
     * Add a component to the collection for a key
     */
    add(key, value) {
        const existing = this.originalMap.get(key) || [];
        existing.push(value);
        this.originalMap.set(key, existing);
    }
}
exports.SingletonComponentMap = SingletonComponentMap;
//# sourceMappingURL=SingletonComponentMap.js.map