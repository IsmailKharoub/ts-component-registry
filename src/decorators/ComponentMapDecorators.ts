import 'reflect-metadata';
import { DIContainer } from '../core/DIContainer';
import { ComponentMapKey } from '../core/ComponentMapKey';
import { ComponentScanner } from '../core/ComponentScanner';
import { SingletonComponentMap } from '../core/SingletonComponentMap';
import { logger } from '../core/Logger';

// Metadata keys for storing decorator information
const COMPONENT_MAP_FIELDS = Symbol('componentMapFields');

// Global flag to track if components have been scanned
let componentsScanned = false;

// Type for abstract constructors
type AbstractConstructor<T = {}> = abstract new (...args: any[]) => T;
type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Component decorator for auto-registration (NestJS style)
 * Automatically registers the component class in the DI container
 */
export function Component<K, T extends ComponentMapKey<K>>(
    componentType: AbstractConstructor<T>,
    singleton?: boolean
): <C extends Constructor<T>>(constructor: C) => C;
export function Component<K>(
    registryName: string, 
    singleton?: boolean
): <T extends ComponentMapKey<K>, C extends Constructor<T>>(constructor: C) => C;
export function Component<K, T extends ComponentMapKey<K>>(
    componentTypeOrRegistryName: AbstractConstructor<T> | string,
    singleton: boolean = true
): any {
    return function<C extends Constructor<T>>(constructor: C): C {
        let registryName: string;
        
        if (typeof componentTypeOrRegistryName === 'string') {
            // Legacy string-based approach
            registryName = componentTypeOrRegistryName;
        } else {
            // New type-based approach - use the class name
            registryName = componentTypeOrRegistryName.name;
        }
        
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
 *   @ComponentMap(PaymentProcessor)
 *   private processors: Map<string, PaymentProcessor>;
 * }
 * ```
 */
export function ComponentMap<K, V extends ComponentMapKey<K>>(
    componentType: AbstractConstructor<V>
): (target: any, propertyKey: string) => void;
export function ComponentMap<K, V extends ComponentMapKey<K>>(
    registryName: string
): (target: any, propertyKey: string) => void;
export function ComponentMap<K, V extends ComponentMapKey<K>>(
    componentTypeOrRegistryName: AbstractConstructor<V> | string
): any {
    return function(target: any, propertyKey: string) {
        let registryName: string;
        
        if (typeof componentTypeOrRegistryName === 'string') {
            // Legacy string-based approach
            registryName = componentTypeOrRegistryName;
        } else {
            // New type-based approach
            registryName = componentTypeOrRegistryName.name;
        }
        
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
 * @param componentType - The component type class
 * @param componentKey - The specific component key
 */
export function InjectComponent<K, V extends ComponentMapKey<K>>(
    componentType: AbstractConstructor<V>,
    componentKey: K
): (target: any, propertyKey: string) => void;
export function InjectComponent<K>(
    registryName: string,
    componentKey: K
): (target: any, propertyKey: string) => void;
export function InjectComponent<K, V extends ComponentMapKey<K>>(
    componentTypeOrRegistryName: AbstractConstructor<V> | string,
    componentKey: K
): any {
    return function(target: any, propertyKey: string) {
        let registryName: string;
        
        if (typeof componentTypeOrRegistryName === 'string') {
            registryName = componentTypeOrRegistryName;
        } else {
            registryName = componentTypeOrRegistryName.name;
        }
        
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
    excludePatterns: string[] = [
        '**/*.d.ts',           // TypeScript declaration files
        '**/*.{test,spec}.{ts,js}', // Test files
        '**/test-setup.{ts,js}',    // Test setup files
        'node_modules',        // Node modules
        '**/*.map',           // Source map files
    ]
): Promise<void> {
    if (componentsScanned) return; // Already scanned
    
    logger.info('🚀 Starting component auto-discovery...');
    
    const scanner = ComponentScanner.getInstance();
    
    for (const dir of scanDirs) {
        await scanner.scanComponents(dir, ['**/*.{ts,js}'], excludePatterns);
    }
    
    componentsScanned = true;
    
    logger.info('✅ Component auto-discovery complete!');
}

/**
 * Utility function to scan and register components from a module
 * Pass an array of component classes to register them all at once
 */
export function registerComponents<K, V extends ComponentMapKey<K>>(
    componentType: AbstractConstructor<V>,
    components: Array<Constructor<V>>,
    singleton?: boolean
): void;
export function registerComponents<K>(
    registryName: string,
    components: Array<Constructor<ComponentMapKey<K>>>,
    singleton?: boolean
): void;
export function registerComponents<K, V extends ComponentMapKey<K>>(
    componentTypeOrRegistryName: AbstractConstructor<V> | string,
    components: Array<Constructor<V>>,
    singleton: boolean = true
): void {
    const container = DIContainer.getInstance();
    
    let registryName: string;
    if (typeof componentTypeOrRegistryName === 'string') {
        registryName = componentTypeOrRegistryName;
    } else {
        registryName = componentTypeOrRegistryName.name;
    }
    
    for (const ComponentClass of components) {
        container.registerComponent(registryName, ComponentClass, singleton);
    }
    
    logger.info(`📦 Registered ${components.length} components in '${registryName}' registry`);
}

/**
 * Get component by component type and key (convenience function)
 */
export function getComponent<K, T extends ComponentMapKey<K>>(
    componentType: AbstractConstructor<T>,
    key: K
): T | undefined;
export function getComponent<K, T extends ComponentMapKey<K>>(
    registryName: string,
    key: K
): T | undefined;
export function getComponent<K, T extends ComponentMapKey<K>>(
    componentTypeOrRegistryName: AbstractConstructor<T> | string,
    key: K
): T | undefined {
    let registryName: string;
    if (typeof componentTypeOrRegistryName === 'string') {
        registryName = componentTypeOrRegistryName;
    } else {
        registryName = componentTypeOrRegistryName.name;
    }
    
    return DIContainer.getInstance().get<K, T>(registryName, key);
}

/**
 * Get all components from a component type (convenience function)
 */
export function getAllComponents<K, T extends ComponentMapKey<K>>(
    componentType: AbstractConstructor<T>
): Map<K, T>;
export function getAllComponents<K, T extends ComponentMapKey<K>>(
    registryName: string
): Map<K, T>;
export function getAllComponents<K, T extends ComponentMapKey<K>>(
    componentTypeOrRegistryName: AbstractConstructor<T> | string
): Map<K, T> {
    let registryName: string;
    if (typeof componentTypeOrRegistryName === 'string') {
        registryName = componentTypeOrRegistryName;
    } else {
        registryName = componentTypeOrRegistryName.name;
    }
    
    return DIContainer.getInstance().getAll<K, T>(registryName);
}

/**
 * Get SingletonComponentMap from a component type (Spring Boot style)
 */
export function getSingletonComponentMap<K, T extends ComponentMapKey<K>>(
    componentType: AbstractConstructor<T>
): SingletonComponentMap<K, T>;
export function getSingletonComponentMap<K, T extends ComponentMapKey<K>>(
    registryName: string
): SingletonComponentMap<K, T>;
export function getSingletonComponentMap<K, T extends ComponentMapKey<K>>(
    componentTypeOrRegistryName: AbstractConstructor<T> | string
): SingletonComponentMap<K, T> {
    let registryName: string;
    if (typeof componentTypeOrRegistryName === 'string') {
        registryName = componentTypeOrRegistryName;
    } else {
        registryName = componentTypeOrRegistryName.name;
    }
    
    return DIContainer.getInstance().getSingletonComponentMap<K, T>(registryName);
}