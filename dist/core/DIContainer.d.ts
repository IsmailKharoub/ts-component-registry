import 'reflect-metadata';
import { ComponentMapKey } from './ComponentMapKey';
import { SingletonComponentMap } from './SingletonComponentMap';
/**
 * Main DI Container - Similar to NestJS container with Spring Boot patterns
 */
export declare class DIContainer {
    private static instance;
    private registries;
    private constructor();
    /**
     * Get the singleton instance
     */
    static getInstance(): DIContainer;
    /**
     * Register a component constructor (called by decorators)
     */
    registerComponent<K, T extends ComponentMapKey<K>>(registryName: string, constructor: new (...args: any[]) => T, singleton?: boolean): void;
    /**
     * Get a specific component by registry name and key (first one if multiple)
     */
    get<K, T extends ComponentMapKey<K>>(registryName: string, key: K): T | undefined;
    /**
     * Get all components for a specific key
     */
    getAllForKey<K, T extends ComponentMapKey<K>>(registryName: string, key: K): T[];
    /**
     * Get all components in a registry as a regular Map (singleton behavior)
     */
    getAll<K, T extends ComponentMapKey<K>>(registryName: string): Map<K, T>;
    /**
     * Get all components in a registry as a SingletonComponentMap (Spring Boot style)
     */
    getSingletonComponentMap<K, T extends ComponentMapKey<K>>(registryName: string): SingletonComponentMap<K, T>;
    /**
     * Get all components in a registry as a collection map
     */
    getAllAsCollections<K, T extends ComponentMapKey<K>>(registryName: string): Map<K, T[]>;
    /**
     * Check if a component exists
     */
    has<K>(registryName: string, key: K): boolean;
    /**
     * Get all available keys for a registry
     */
    getKeys<K>(registryName: string): K[];
    /**
     * Get all registry names
     */
    getRegistryNames(): string[];
    /**
     * Get registry info for debugging
     */
    getRegistryInfo(registryName: string): {
        name: string;
        size: number;
        keys: any[];
    } | undefined;
    /**
     * Clear a specific registry
     */
    clearRegistry(registryName: string): boolean;
    /**
     * Clear all registries
     */
    clearAll(): void;
}
//# sourceMappingURL=DIContainer.d.ts.map