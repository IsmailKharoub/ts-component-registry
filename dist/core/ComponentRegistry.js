"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentRegistry = void 0;
/**
 * Generic registry for managing components with keys
 */
class ComponentRegistry {
    constructor() {
        this.components = new Map();
    }
    /**
     * Register a component with a key
     */
    register(key, component) {
        this.components.set(key, component);
    }
    /**
     * Get a component by key
     */
    get(key) {
        return this.components.get(key);
    }
    /**
     * Get all registered components as a Map
     */
    getAll() {
        return new Map(this.components);
    }
    /**
     * Get all registered keys
     */
    getKeys() {
        return Array.from(this.components.keys());
    }
    /**
     * Check if a key is registered
     */
    has(key) {
        return this.components.has(key);
    }
    /**
     * Get the number of registered components
     */
    size() {
        return this.components.size;
    }
    /**
     * Clear all registered components
     */
    clear() {
        this.components.clear();
    }
}
exports.ComponentRegistry = ComponentRegistry;
//# sourceMappingURL=ComponentRegistry.js.map