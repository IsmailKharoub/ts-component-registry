import 'reflect-metadata';
import { ComponentMapKey } from '../core/ComponentMapKey';
import { SingletonComponentMap } from '../core/SingletonComponentMap';
type AbstractConstructor<T = {}> = abstract new (...args: any[]) => T;
type Constructor<T = {}> = new (...args: any[]) => T;
/**
 * Component decorator for auto-registration (NestJS style)
 * Automatically registers the component class in the DI container
 */
export declare function Component<K, T extends ComponentMapKey<K>>(componentType: AbstractConstructor<T>, singleton?: boolean): <C extends Constructor<T>>(constructor: C) => C;
export declare function Component<K>(registryName: string, singleton?: boolean): <T extends ComponentMapKey<K>, C extends Constructor<T>>(constructor: C) => C;
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
export declare function ComponentMap<K, V extends ComponentMapKey<K>>(componentType: AbstractConstructor<V>): (target: any, propertyKey: string) => void;
export declare function ComponentMap<K, V extends ComponentMapKey<K>>(registryName: string): (target: any, propertyKey: string) => void;
/**
 * Decorator for injecting a specific component by key
 * Use this to inject a single component by its key
 *
 * @param componentType - The component type class
 * @param componentKey - The specific component key
 */
export declare function InjectComponent<K, V extends ComponentMapKey<K>>(componentType: AbstractConstructor<V>, componentKey: K): (target: any, propertyKey: string) => void;
export declare function InjectComponent<K>(registryName: string, componentKey: K): (target: any, propertyKey: string) => void;
/**
 * Initialize method - call this at application startup
 * Scans for all components automatically
 */
export declare function initializeComponentMaps(scanDirs?: string[], excludePatterns?: string[]): Promise<void>;
/**
 * Utility function to scan and register components from a module
 * Pass an array of component classes to register them all at once
 */
export declare function registerComponents<K, V extends ComponentMapKey<K>>(componentType: AbstractConstructor<V>, components: Array<Constructor<V>>, singleton?: boolean): void;
export declare function registerComponents<K>(registryName: string, components: Array<Constructor<ComponentMapKey<K>>>, singleton?: boolean): void;
/**
 * Get component by component type and key (convenience function)
 */
export declare function getComponent<K, T extends ComponentMapKey<K>>(componentType: AbstractConstructor<T>, key: K): T | undefined;
export declare function getComponent<K, T extends ComponentMapKey<K>>(registryName: string, key: K): T | undefined;
/**
 * Get all components from a component type (convenience function)
 */
export declare function getAllComponents<K, T extends ComponentMapKey<K>>(componentType: AbstractConstructor<T>): Map<K, T>;
export declare function getAllComponents<K, T extends ComponentMapKey<K>>(registryName: string): Map<K, T>;
/**
 * Get SingletonComponentMap from a component type (Spring Boot style)
 */
export declare function getSingletonComponentMap<K, T extends ComponentMapKey<K>>(componentType: AbstractConstructor<T>): SingletonComponentMap<K, T>;
export declare function getSingletonComponentMap<K, T extends ComponentMapKey<K>>(registryName: string): SingletonComponentMap<K, T>;
export {};
//# sourceMappingURL=ComponentMapDecorators.d.ts.map