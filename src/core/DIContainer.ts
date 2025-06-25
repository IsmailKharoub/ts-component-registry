import 'reflect-metadata';
import { ComponentMapKey } from './ComponentMapKey';
import { SingletonComponentMap } from './SingletonComponentMap';

/**
 * Metadata for registered components
 */
interface ComponentMetadata<K> {
    registryName: string;
    componentKey: K;
    constructor: new (...args: any[]) => ComponentMapKey<K>;
    instance?: ComponentMapKey<K>;
    singleton: boolean;
}

/**
 * Registry for a specific component type (supports multiple components per key)
 */
class ComponentRegistry<K> {
    private components = new Map<K, ComponentMetadata<K>[]>();
    
    register<T extends ComponentMapKey<K>>(
        key: K, 
        constructor: new (...args: any[]) => T, 
        singleton: boolean = true
    ): void {
        const metadata: ComponentMetadata<K> = {
            registryName: '',
            componentKey: key,
            constructor,
            singleton
        };
        
        const existing = this.components.get(key) || [];
        existing.push(metadata);
        this.components.set(key, existing);
    }
    
    get<T extends ComponentMapKey<K>>(key: K): T | undefined {
        const metadataList = this.components.get(key);
        if (!metadataList || metadataList.length === 0) return undefined;
        
        // Return the first component (singleton behavior)
        const metadata = metadataList[0];
        
        // Lazy instantiation
        if (metadata.singleton) {
            if (!metadata.instance) {
                metadata.instance = new metadata.constructor();
            }
            return metadata.instance as T;
        } else {
            return new metadata.constructor() as T;
        }
    }
    
    getAll<T extends ComponentMapKey<K>>(key: K): T[] {
        const metadataList = this.components.get(key);
        if (!metadataList) return [];
        
        return metadataList.map(metadata => {
            if (metadata.singleton) {
                if (!metadata.instance) {
                    metadata.instance = new metadata.constructor();
                }
                return metadata.instance as T;
            } else {
                return new metadata.constructor() as T;
            }
        });
    }
    
    getAllAsMap<T extends ComponentMapKey<K>>(): Map<K, T> {
        const result = new Map<K, T>();
        for (const [key] of this.components) {
            const instance = this.get<T>(key);
            if (instance) {
                result.set(key, instance);
            }
        }
        return result;
    }
    
    getAllAsCollectionMap<T extends ComponentMapKey<K>>(): Map<K, T[]> {
        const result = new Map<K, T[]>();
        for (const [key] of this.components) {
            const instances = this.getAll<T>(key);
            if (instances.length > 0) {
                result.set(key, instances);
            }
        }
        return result;
    }
    
    getSingletonComponentMap<T extends ComponentMapKey<K>>(): SingletonComponentMap<K, T> {
        return new SingletonComponentMap(this.getAllAsCollectionMap<T>());
    }
    
    has(key: K): boolean {
        return this.components.has(key);
    }
    
    getKeys(): K[] {
        return Array.from(this.components.keys());
    }
    
    size(): number {
        return this.components.size;
    }
    
    clear(): void {
        this.components.clear();
    }
}

/**
 * Main DI Container - Similar to NestJS container with Spring Boot patterns
 */
export class DIContainer {
    private static instance: DIContainer;
    private registries = new Map<string, ComponentRegistry<any>>();
    
    private constructor() {}
    
    /**
     * Get the singleton instance
     */
    static getInstance(): DIContainer {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }
        return DIContainer.instance;
    }
    
    /**
     * Register a component constructor (called by decorators)
     */
    registerComponent<K, T extends ComponentMapKey<K>>(
        registryName: string,
        constructor: new (...args: any[]) => T,
        singleton: boolean = true
    ): void {
        if (!this.registries.has(registryName)) {
            this.registries.set(registryName, new ComponentRegistry<K>());
        }
        
        const registry = this.registries.get(registryName)!;
        
        // Create temporary instance to get the key
        const tempInstance = new constructor();
        const key = tempInstance.getComponentMapKey();
        
        registry.register(key, constructor, singleton);
    }
    
    /**
     * Get a specific component by registry name and key (first one if multiple)
     */
    get<K, T extends ComponentMapKey<K>>(registryName: string, key: K): T | undefined {
        const registry = this.registries.get(registryName);
        if (!registry) return undefined;
        
        return registry.get<T>(key);
    }
    
    /**
     * Get all components for a specific key
     */
    getAllForKey<K, T extends ComponentMapKey<K>>(registryName: string, key: K): T[] {
        const registry = this.registries.get(registryName);
        if (!registry) return [];
        
        return registry.getAll<T>(key);
    }
    
    /**
     * Get all components in a registry as a regular Map (singleton behavior)
     */
    getAll<K, T extends ComponentMapKey<K>>(registryName: string): Map<K, T> {
        const registry = this.registries.get(registryName);
        if (!registry) return new Map();
        
        return registry.getAllAsMap<T>();
    }
    
    /**
     * Get all components in a registry as a SingletonComponentMap (Spring Boot style)
     */
    getSingletonComponentMap<K, T extends ComponentMapKey<K>>(registryName: string): SingletonComponentMap<K, T> {
        const registry = this.registries.get(registryName);
        if (!registry) return new SingletonComponentMap(new Map());
        
        return registry.getSingletonComponentMap<T>();
    }
    
    /**
     * Get all components in a registry as a collection map
     */
    getAllAsCollections<K, T extends ComponentMapKey<K>>(registryName: string): Map<K, T[]> {
        const registry = this.registries.get(registryName);
        if (!registry) return new Map();
        
        return registry.getAllAsCollectionMap<T>();
    }
    
    /**
     * Check if a component exists
     */
    has<K>(registryName: string, key: K): boolean {
        const registry = this.registries.get(registryName);
        return registry ? registry.has(key) : false;
    }
    
    /**
     * Get all available keys for a registry
     */
    getKeys<K>(registryName: string): K[] {
        const registry = this.registries.get(registryName);
        return registry ? registry.getKeys() : [];
    }
    
    /**
     * Get all registry names
     */
    getRegistryNames(): string[] {
        return Array.from(this.registries.keys());
    }
    
    /**
     * Get registry info for debugging
     */
    getRegistryInfo(registryName: string): { name: string; size: number; keys: any[] } | undefined {
        const registry = this.registries.get(registryName);
        if (!registry) return undefined;
        
        return {
            name: registryName,
            size: registry.size(),
            keys: registry.getKeys()
        };
    }
    
    /**
     * Clear a specific registry
     */
    clearRegistry(registryName: string): boolean {
        const registry = this.registries.get(registryName);
        if (registry) {
            registry.clear();
            return true;
        }
        return false;
    }
    
    /**
     * Clear all registries
     */
    clearAll(): void {
        for (const registry of this.registries.values()) {
            registry.clear();
        }
        this.registries.clear();
    }
} 