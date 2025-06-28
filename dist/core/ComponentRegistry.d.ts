/**
 * Generic registry for managing components with keys
 */
export declare class ComponentRegistry<K, V> {
    private readonly components;
    /**
     * Register a component with a key
     */
    register(key: K, component: V): void;
    /**
     * Get a component by key
     */
    get(key: K): V | undefined;
    /**
     * Get all registered components as a Map
     */
    getAll(): Map<K, V>;
    /**
     * Get all registered keys
     */
    getKeys(): K[];
    /**
     * Check if a key is registered
     */
    has(key: K): boolean;
    /**
     * Get the number of registered components
     */
    size(): number;
    /**
     * Clear all registered components
     */
    clear(): void;
}
//# sourceMappingURL=ComponentRegistry.d.ts.map