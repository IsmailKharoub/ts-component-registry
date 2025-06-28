/**
 * SingletonComponentMap - TypeScript equivalent of the Kotlin implementation
 * Wraps a Map<K, Collection<V>> and exposes it as Map<K, V> by taking the first element
 */
export declare class SingletonComponentMap<K, V> implements Map<K, V> {
    private originalMap;
    constructor(originalMap: Map<K, V[]>);
    get size(): number;
    get [Symbol.toStringTag](): string;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[K, V]>;
    [Symbol.iterator](): IterableIterator<[K, V]>;
    has(key: K): boolean;
    get(key: K): V | undefined;
    set(key: K, value: V): this;
    delete(key: K): boolean;
    clear(): void;
    forEach(callback: (value: V, key: K, map: this) => void, thisArg?: any): void;
    isEmpty(): boolean;
    /**
     * Get all components for a key (including duplicates)
     */
    getAll(key: K): V[];
    /**
     * Add a component to the collection for a key
     */
    add(key: K, value: V): void;
}
//# sourceMappingURL=SingletonComponentMap.d.ts.map