"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentMapManager = void 0;
const ComponentRegistry_1 = require("./ComponentRegistry");
/**
 * Singleton manager for component registries
 * Manages multiple named registries, similar to Spring's application context
 */
class ComponentMapManager {
    constructor() {
        this.registries = new Map();
    }
    /**
     * Get the singleton instance
     */
    static getInstance() {
        if (!ComponentMapManager.instance) {
            ComponentMapManager.instance = new ComponentMapManager();
        }
        return ComponentMapManager.instance;
    }
    /**
     * Get or create a registry by name
     */
    getRegistry(name) {
        if (!this.registries.has(name)) {
            this.registries.set(name, new ComponentRegistry_1.ComponentRegistry());
        }
        return this.registries.get(name);
    }
    /**
     * Check if a registry exists
     */
    hasRegistry(name) {
        return this.registries.has(name);
    }
    /**
     * Remove a registry
     */
    removeRegistry(name) {
        return this.registries.delete(name);
    }
    /**
     * Clear all registries
     */
    clearAll() {
        this.registries.clear();
    }
    /**
     * Get all registry names
     */
    getRegistryNames() {
        return Array.from(this.registries.keys());
    }
}
exports.ComponentMapManager = ComponentMapManager;
//# sourceMappingURL=ComponentMapManager.js.map