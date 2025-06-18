/**
 * Interface for components that can be registered in a ComponentMap
 * Similar to Spring Boot's @ComponentMapKey annotation
 */
export interface ComponentMapKey<K> {
    /**
     * Returns the key that this component should be registered under
     * This method is equivalent to a method marked with @ComponentMapKey in Spring Boot
     */
    getComponentMapKey(): K;
} 