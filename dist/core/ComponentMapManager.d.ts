import { ComponentRegistry } from './ComponentRegistry';
/**
 * Singleton manager for component registries
 * Manages multiple named registries, similar to Spring's application context
 */
export declare class ComponentMapManager {
    private static instance;
    private registries;
    private constructor();
    /**
     * Get the singleton instance
     */
    static getInstance(): ComponentMapManager;
    /**
     * Get or create a registry by name
     */
    getRegistry<K, V>(name: string): ComponentRegistry<K, V>;
    /**
     * Check if a registry exists
     */
    hasRegistry(name: string): boolean;
    /**
     * Remove a registry
     */
    removeRegistry(name: string): boolean;
    /**
     * Clear all registries
     */
    clearAll(): void;
    /**
     * Get all registry names
     */
    getRegistryNames(): string[];
}
//# sourceMappingURL=ComponentMapManager.d.ts.map