import 'reflect-metadata';
import { ComponentMapManager } from '../core/ComponentMapManager';
import { ComponentMapKey } from '../core/ComponentMapKey';

// Metadata keys for storing decorator information
const COMPONENT_MAP_KEY_METADATA = Symbol('componentMapKey');
const COMPONENT_MAP_METADATA = Symbol('componentMap');
const REGISTRY_NAME_METADATA = Symbol('registryName');

/**
 * Decorator for marking methods that return the component map key
 * Equivalent to Spring Boot's @ComponentMapKey annotation
 */
export function ComponentMapKeyDecorator<T>(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(COMPONENT_MAP_KEY_METADATA, propertyKey, target.constructor);
}

/**
 * Decorator for marking properties to be injected with component maps
 * Equivalent to Spring Boot's @ComponentMap annotation
 */
export function ComponentMapDecorator<K, V>(registryName: string) {
    return function(target: any, propertyKey: string) {
        Reflect.defineMetadata(COMPONENT_MAP_METADATA, { registryName, propertyKey }, target.constructor);
    };
}

/**
 * Auto-registration decorator for components
 * Automatically registers the component in the specified registry
 */
export function Component<K>(registryName: string) {
    return function<T extends ComponentMapKey<K>>(constructor: new (...args: any[]) => T) {
        // Store registry name for later use
        Reflect.defineMetadata(REGISTRY_NAME_METADATA, registryName, constructor);
        
        // Register the component automatically when the class is defined
        const instance = new constructor();
        const key = instance.getComponentMapKey();
        
        const registry = ComponentMapManager.getInstance().getRegistry<K, T>(registryName);
        registry.register(key, instance);
        
        return constructor;
    };
}

/**
 * Utility function to initialize component maps for a service instance
 * Should be called in the constructor of services that use @ComponentMapDecorator
 */
export function initializeComponentMaps(target: any): void {
    const componentMapMetadata = Reflect.getMetadata(COMPONENT_MAP_METADATA, target.constructor);
    
    if (componentMapMetadata) {
        const { registryName, propertyKey } = componentMapMetadata;
        const registry = ComponentMapManager.getInstance().getRegistry(registryName);
        target[propertyKey] = registry.getAll();
    }
}

/**
 * Auto-discovery function to register all components in a module
 * Call this with an array of component classes to auto-register them
 */
export function autoRegisterComponents<K>(components: Array<new (...args: any[]) => ComponentMapKey<K>>): void {
    for (const ComponentClass of components) {
        const registryName = Reflect.getMetadata(REGISTRY_NAME_METADATA, ComponentClass);
        
        if (registryName) {
            const instance = new ComponentClass();
            const key = instance.getComponentMapKey();
            const registry = ComponentMapManager.getInstance().getRegistry<K, ComponentMapKey<K>>(registryName);
            registry.register(key, instance);
        }
    }
} 