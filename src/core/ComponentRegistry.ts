/**
 * Generic registry for managing components with keys
 */
export class ComponentRegistry<K, V> {
    private readonly components = new Map<K, V>();
    
    /**
     * Register a component with a key
     */
    register(key: K, component: V): void {
        this.components.set(key, component);
    }
    
    /**
     * Get a component by key
     */
    get(key: K): V | undefined {
        return this.components.get(key);
    }
    
    /**
     * Get all registered components as a Map
     */
    getAll(): Map<K, V> {
        return new Map(this.components);
    }
    
    /**
     * Get all registered keys
     */
    getKeys(): K[] {
        return Array.from(this.components.keys());
    }
    
    /**
     * Check if a key is registered
     */
    has(key: K): boolean {
        return this.components.has(key);
    }
    
    /**
     * Get the number of registered components
     */
    size(): number {
        return this.components.size;
    }
    
    /**
     * Clear all registered components
     */
    clear(): void {
        this.components.clear();
    }
} 