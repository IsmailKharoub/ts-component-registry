/**
 * SingletonComponentMap - TypeScript equivalent of the Kotlin implementation
 * Wraps a Map<K, Collection<V>> and exposes it as Map<K, V> by taking the first element
 */
export class SingletonComponentMap<K, V> implements Map<K, V> {
    private originalMap: Map<K, V[]>;
    
    constructor(originalMap: Map<K, V[]>) {
        this.originalMap = originalMap;
    }
    
    get size(): number {
        return this.originalMap.size;
    }
    
    get [Symbol.toStringTag](): string {
        return 'SingletonComponentMap';
    }
    
    keys(): IterableIterator<K> {
        return this.originalMap.keys();
    }
    
    values(): IterableIterator<V> {
        const values: V[] = [];
        for (const collection of this.originalMap.values()) {
            if (collection.length > 0) {
                values.push(collection[0]);
            }
        }
        return values[Symbol.iterator]();
    }
    
    entries(): IterableIterator<[K, V]> {
        const entries: [K, V][] = [];
        for (const [key, collection] of this.originalMap.entries()) {
            if (collection.length > 0) {
                entries.push([key, collection[0]]);
            }
        }
        return entries[Symbol.iterator]();
    }
    
    [Symbol.iterator](): IterableIterator<[K, V]> {
        return this.entries();
    }
    
    has(key: K): boolean {
        return this.originalMap.has(key);
    }
    
    get(key: K): V | undefined {
        const collection = this.originalMap.get(key);
        return collection && collection.length > 0 ? collection[0] : undefined;
    }
    
    set(key: K, value: V): this {
        // For singleton map, we replace the entire collection with a single value
        this.originalMap.set(key, [value]);
        return this;
    }
    
    delete(key: K): boolean {
        return this.originalMap.delete(key);
    }
    
    clear(): void {
        this.originalMap.clear();
    }
    
    forEach(callback: (value: V, key: K, map: this) => void, thisArg?: any): void {
        for (const [key, collection] of this.originalMap.entries()) {
            if (collection.length > 0) {
                callback.call(thisArg, collection[0], key, this);
            }
        }
    }
    
    isEmpty(): boolean {
        return this.originalMap.size === 0;
    }
    
    /**
     * Get all components for a key (including duplicates)
     */
    getAll(key: K): V[] {
        return this.originalMap.get(key) || [];
    }
    
    /**
     * Add a component to the collection for a key
     */
    add(key: K, value: V): void {
        const existing = this.originalMap.get(key) || [];
        existing.push(value);
        this.originalMap.set(key, existing);
    }
} 