import { ComponentRegistry } from './ComponentRegistry';

/**
 * Singleton manager for component registries
 * Manages multiple named registries, similar to Spring's application context
 */
export class ComponentMapManager {
    private static instance: ComponentMapManager;
    private registries = new Map<string, ComponentRegistry<any, any>>();
    
    private constructor() {}
    
    /**
     * Get the singleton instance
     */
    static getInstance(): ComponentMapManager {
        if (!ComponentMapManager.instance) {
            ComponentMapManager.instance = new ComponentMapManager();
        }
        return ComponentMapManager.instance;
    }
    
    /**
     * Get or create a registry by name
     */
    getRegistry<K, V>(name: string): ComponentRegistry<K, V> {
        if (!this.registries.has(name)) {
            this.registries.set(name, new ComponentRegistry<K, V>());
        }
        return this.registries.get(name)!;
    }
    
    /**
     * Check if a registry exists
     */
    hasRegistry(name: string): boolean {
        return this.registries.has(name);
    }
    
    /**
     * Remove a registry
     */
    removeRegistry(name: string): boolean {
        return this.registries.delete(name);
    }
    
    /**
     * Clear all registries
     */
    clearAll(): void {
        this.registries.clear();
    }
    
    /**
     * Get all registry names
     */
    getRegistryNames(): string[] {
        return Array.from(this.registries.keys());
    }
} 