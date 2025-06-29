"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingletonComponentMap = exports.getAllComponents = exports.getComponent = exports.registerComponents = exports.initializeComponentMaps = exports.InjectComponent = exports.ComponentMap = exports.Component = void 0;
require("reflect-metadata");
const DIContainer_1 = require("../core/DIContainer");
const ComponentScanner_1 = require("../core/ComponentScanner");
const Logger_1 = require("../core/Logger");
// Metadata keys for storing decorator information
const COMPONENT_MAP_FIELDS = Symbol('componentMapFields');
// Global flag to track if components have been scanned
let componentsScanned = false;
function Component(componentTypeOrRegistryName, singleton = true) {
    return function (constructor) {
        let registryName;
        if (typeof componentTypeOrRegistryName === 'string') {
            // Legacy string-based approach
            registryName = componentTypeOrRegistryName;
        }
        else {
            // New type-based approach - use the class name
            registryName = componentTypeOrRegistryName.name;
        }
        DIContainer_1.DIContainer.getInstance().registerComponent(registryName, constructor, singleton);
        return constructor;
    };
}
exports.Component = Component;
function ComponentMap(componentTypeOrRegistryName) {
    return function (target, propertyKey) {
        let registryName;
        if (typeof componentTypeOrRegistryName === 'string') {
            // Legacy string-based approach
            registryName = componentTypeOrRegistryName;
        }
        else {
            // New type-based approach
            registryName = componentTypeOrRegistryName.name;
        }
        // Store metadata about the field
        const existingFields = Reflect.getMetadata(COMPONENT_MAP_FIELDS, target.constructor) || [];
        existingFields.push({ registryName, propertyKey });
        Reflect.defineMetadata(COMPONENT_MAP_FIELDS, existingFields, target.constructor);
        // Define a getter that lazily retrieves all components as SingletonComponentMap
        Object.defineProperty(target, propertyKey, {
            get: function () {
                return DIContainer_1.DIContainer.getInstance().getSingletonComponentMap(registryName);
            },
            enumerable: true,
            configurable: true
        });
    };
}
exports.ComponentMap = ComponentMap;
function InjectComponent(componentTypeOrRegistryName, componentKey) {
    return function (target, propertyKey) {
        let registryName;
        if (typeof componentTypeOrRegistryName === 'string') {
            registryName = componentTypeOrRegistryName;
        }
        else {
            registryName = componentTypeOrRegistryName.name;
        }
        // Define a getter that lazily retrieves the component
        Object.defineProperty(target, propertyKey, {
            get: function () {
                return DIContainer_1.DIContainer.getInstance().get(registryName, componentKey);
            },
            enumerable: true,
            configurable: true
        });
    };
}
exports.InjectComponent = InjectComponent;
/**
 * Initialize method - call this at application startup
 * Scans for all components automatically
 */
async function initializeComponentMaps(scanDirs = ['src'], excludePatterns = [
    '**/*.d.ts', // TypeScript declaration files
    '**/*.{test,spec}.{ts,js}', // Test files
    '**/test-setup.{ts,js}', // Test setup files
    'node_modules', // Node modules
    '**/*.map', // Source map files
]) {
    if (componentsScanned)
        return; // Already scanned
    Logger_1.logger.info('🚀 Starting component auto-discovery...');
    const scanner = ComponentScanner_1.ComponentScanner.getInstance();
    for (const dir of scanDirs) {
        await scanner.scanComponents(dir, ['**/*.{ts,js}'], excludePatterns);
    }
    componentsScanned = true;
    Logger_1.logger.info('✅ Component auto-discovery complete!');
}
exports.initializeComponentMaps = initializeComponentMaps;
function registerComponents(componentTypeOrRegistryName, components, singleton = true) {
    const container = DIContainer_1.DIContainer.getInstance();
    let registryName;
    if (typeof componentTypeOrRegistryName === 'string') {
        registryName = componentTypeOrRegistryName;
    }
    else {
        registryName = componentTypeOrRegistryName.name;
    }
    for (const ComponentClass of components) {
        container.registerComponent(registryName, ComponentClass, singleton);
    }
    Logger_1.logger.info(`📦 Registered ${components.length} components in '${registryName}' registry`);
}
exports.registerComponents = registerComponents;
function getComponent(componentTypeOrRegistryName, key) {
    let registryName;
    if (typeof componentTypeOrRegistryName === 'string') {
        registryName = componentTypeOrRegistryName;
    }
    else {
        registryName = componentTypeOrRegistryName.name;
    }
    return DIContainer_1.DIContainer.getInstance().get(registryName, key);
}
exports.getComponent = getComponent;
function getAllComponents(componentTypeOrRegistryName) {
    let registryName;
    if (typeof componentTypeOrRegistryName === 'string') {
        registryName = componentTypeOrRegistryName;
    }
    else {
        registryName = componentTypeOrRegistryName.name;
    }
    return DIContainer_1.DIContainer.getInstance().getAll(registryName);
}
exports.getAllComponents = getAllComponents;
function getSingletonComponentMap(componentTypeOrRegistryName) {
    let registryName;
    if (typeof componentTypeOrRegistryName === 'string') {
        registryName = componentTypeOrRegistryName;
    }
    else {
        registryName = componentTypeOrRegistryName.name;
    }
    return DIContainer_1.DIContainer.getInstance().getSingletonComponentMap(registryName);
}
exports.getSingletonComponentMap = getSingletonComponentMap;
//# sourceMappingURL=ComponentMapDecorators.js.map