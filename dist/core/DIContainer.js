"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIContainer = void 0;
require("reflect-metadata");
const SingletonComponentMap_1 = require("./SingletonComponentMap");
/**
 * Registry for a specific component type (supports multiple components per key)
 */
class ComponentRegistry {
    constructor() {
        this.components = new Map();
    }
    register(key, constructor, singleton = true) {
        const metadata = {
            registryName: '',
            componentKey: key,
            constructor,
            singleton
        };
        const existing = this.components.get(key) || [];
        existing.push(metadata);
        this.components.set(key, existing);
    }
    get(key) {
        const metadataList = this.components.get(key);
        if (!metadataList || metadataList.length === 0)
            return undefined;
        // Return the first component (singleton behavior)
        const metadata = metadataList[0];
        // Lazy instantiation
        if (metadata.singleton) {
            if (!metadata.instance) {
                metadata.instance = new metadata.constructor();
            }
            return metadata.instance;
        }
        else {
            return new metadata.constructor();
        }
    }
    getAll(key) {
        const metadataList = this.components.get(key);
        if (!metadataList)
            return [];
        return metadataList.map(metadata => {
            if (metadata.singleton) {
                if (!metadata.instance) {
                    metadata.instance = new metadata.constructor();
                }
                return metadata.instance;
            }
            else {
                return new metadata.constructor();
            }
        });
    }
    getAllAsMap() {
        const result = new Map();
        for (const [key] of this.components) {
            const instance = this.get(key);
            if (instance) {
                result.set(key, instance);
            }
        }
        return result;
    }
    getAllAsCollectionMap() {
        const result = new Map();
        for (const [key] of this.components) {
            const instances = this.getAll(key);
            if (instances.length > 0) {
                result.set(key, instances);
            }
        }
        return result;
    }
    getSingletonComponentMap() {
        return new SingletonComponentMap_1.SingletonComponentMap(this.getAllAsCollectionMap());
    }
    has(key) {
        return this.components.has(key);
    }
    getKeys() {
        return Array.from(this.components.keys());
    }
    size() {
        return this.components.size;
    }
    clear() {
        this.components.clear();
    }
}
/**
 * Main DI Container - Similar to NestJS container with Spring Boot patterns
 */
class DIContainer {
    constructor() {
        this.registries = new Map();
    }
    /**
     * Get the singleton instance
     */
    static getInstance() {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }
        return DIContainer.instance;
    }
    /**
     * Register a component constructor (called by decorators)
     */
    registerComponent(registryName, constructor, singleton = true) {
        if (!this.registries.has(registryName)) {
            this.registries.set(registryName, new ComponentRegistry());
        }
        const registry = this.registries.get(registryName);
        // Create temporary instance to get the key
        const tempInstance = new constructor();
        const key = tempInstance.getComponentMapKey();
        registry.register(key, constructor, singleton);
    }
    /**
     * Get a specific component by registry name and key (first one if multiple)
     */
    get(registryName, key) {
        const registry = this.registries.get(registryName);
        if (!registry)
            return undefined;
        return registry.get(key);
    }
    /**
     * Get all components for a specific key
     */
    getAllForKey(registryName, key) {
        const registry = this.registries.get(registryName);
        if (!registry)
            return [];
        return registry.getAll(key);
    }
    /**
     * Get all components in a registry as a regular Map (singleton behavior)
     */
    getAll(registryName) {
        const registry = this.registries.get(registryName);
        if (!registry)
            return new Map();
        return registry.getAllAsMap();
    }
    /**
     * Get all components in a registry as a SingletonComponentMap (Spring Boot style)
     */
    getSingletonComponentMap(registryName) {
        const registry = this.registries.get(registryName);
        if (!registry)
            return new SingletonComponentMap_1.SingletonComponentMap(new Map());
        return registry.getSingletonComponentMap();
    }
    /**
     * Get all components in a registry as a collection map
     */
    getAllAsCollections(registryName) {
        const registry = this.registries.get(registryName);
        if (!registry)
            return new Map();
        return registry.getAllAsCollectionMap();
    }
    /**
     * Check if a component exists
     */
    has(registryName, key) {
        const registry = this.registries.get(registryName);
        return registry ? registry.has(key) : false;
    }
    /**
     * Get all available keys for a registry
     */
    getKeys(registryName) {
        const registry = this.registries.get(registryName);
        return registry ? registry.getKeys() : [];
    }
    /**
     * Get all registry names
     */
    getRegistryNames() {
        return Array.from(this.registries.keys());
    }
    /**
     * Get registry info for debugging
     */
    getRegistryInfo(registryName) {
        const registry = this.registries.get(registryName);
        if (!registry)
            return undefined;
        return {
            name: registryName,
            size: registry.size(),
            keys: registry.getKeys()
        };
    }
    /**
     * Clear a specific registry
     */
    clearRegistry(registryName) {
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
    clearAll() {
        for (const registry of this.registries.values()) {
            registry.clear();
        }
        this.registries.clear();
    }
}
exports.DIContainer = DIContainer;
//# sourceMappingURL=DIContainer.js.map