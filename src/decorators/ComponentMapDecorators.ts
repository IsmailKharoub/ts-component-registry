import 'reflect-metadata';
import { DIContainer } from '../core/DIContainer';
import { ComponentMapKey } from '../core/ComponentMapKey';
import { ComponentScanner } from '../core/ComponentScanner';
import { SingletonComponentMap } from '../core/SingletonComponentMap';

// Metadata keys for storing decorator information
const COMPONENT_MAP_FIELDS = Symbol('componentMapFields');

// Global flag to track if components have been scanned
let componentsScanned = false;

/**
 * Component decorator for auto-registration (NestJS style)
 * Automatically registers the component class in the DI container
 * 
 * @param registryName - The name of the registry to register in
 * @param singleton - Whether to create singleton instances (default: true)
 */
export function Component<K>(registryName: string, singleton: boolean = true) {
    return function<T extends ComponentMapKey<K>>(constructor: new (...args: any[]) => T) {
        // Register the component constructor in the DI container
        DIContainer.getInstance().registerComponent(registryName, constructor, singleton);
        
        return constructor;
    };
}

/**
 * ComponentMap decorator (Spring Boot style)
 * Automatically injects all components from a registry into the decorated field
 * Returns a SingletonComponentMap that behaves like Map<K, V> but supports multiple components per key
 * No manual imports or registration needed!
 * 
 * Usage:
 * ```typescript
 * class MyService {
 *   @ComponentMap('payment-processors')
 *   private processors: Map<string, PaymentProcessor>;
 * }
 * ```
 */
export function ComponentMap<K, V extends ComponentMapKey<K>>(registryName: string) {
    return function(target: any, propertyKey: string) {
        // Store metadata about the field
        const existingFields = Reflect.getMetadata(COMPONENT_MAP_FIELDS, target.constructor) || [];
        existingFields.push({ registryName, propertyKey });
        Reflect.defineMetadata(COMPONENT_MAP_FIELDS, existingFields, target.constructor);
        
        // Define a getter that lazily retrieves all components as SingletonComponentMap
        Object.defineProperty(target, propertyKey, {
            get: function() {
                return DIContainer.getInstance().getSingletonComponentMap<K, V>(registryName);
            },
            enumerable: true,
            configurable: true
        });
    };
}

/**
 * Decorator for injecting a specific component by key
 * Use this to inject a single component by its key
 * 
 * @param registryName - The name of the registry to get from
 * @param componentKey - The specific component key
 */
export function InjectComponent<K>(registryName: string, componentKey: K) {
    return function(target: any, propertyKey: string) {
        // Define a getter that lazily retrieves the component
        Object.defineProperty(target, propertyKey, {
            get: function() {
                return DIContainer.getInstance().get(registryName, componentKey);
            },
            enumerable: true,
            configurable: true
        });
    };
}

/**
 * Initialize method - call this at application startup
 * Scans for all components automatically
 */
export async function initializeComponentMaps(
    scanDirs: string[] = ['src'],
    excludePatterns: string[] = ['**/*.test.ts', '**/*.test.js', '**/*.spec.ts', '**/*.spec.js']
): Promise<void> {
    if (componentsScanned) return; // Already scanned
    
    console.log('🚀 Starting component auto-discovery...');
    
    const scanner = ComponentScanner.getInstance();
    
    for (const dir of scanDirs) {
        await scanner.scanComponents(dir, ['**/*.ts', '**/*.js'], excludePatterns);
    }
    
    componentsScanned = true;
    
    console.log('✅ Component auto-discovery complete!');
}

/**
 * Utility function to scan and register components from a module
 * Pass an array of component classes to register them all at once
 */
export function registerComponents<K>(
    registryName: string, 
    components: Array<new (...args: any[]) => ComponentMapKey<K>>,
    singleton: boolean = true
): void {
    const container = DIContainer.getInstance();
    
    for (const ComponentClass of components) {
        container.registerComponent(registryName, ComponentClass, singleton);
    }
    
    console.log(`📦 Registered ${components.length} components in '${registryName}' registry`);
}

/**
 * Get component by registry and key (convenience function)
 */
export function getComponent<K, T extends ComponentMapKey<K>>(
    registryName: string, 
    key: K
): T | undefined {
    return DIContainer.getInstance().get<K, T>(registryName, key);
}

/**
 * Get all components from a registry (convenience function)
 */
export function getAllComponents<K, T extends ComponentMapKey<K>>(
    registryName: string
): Map<K, T> {
    return DIContainer.getInstance().getAll<K, T>(registryName);
}

/**
 * Get SingletonComponentMap from a registry (Spring Boot style)
 */
export function getSingletonComponentMap<K, T extends ComponentMapKey<K>>(
    registryName: string
): SingletonComponentMap<K, T> {
    return DIContainer.getInstance().getSingletonComponentMap<K, T>(registryName);
}