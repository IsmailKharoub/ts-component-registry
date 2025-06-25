import 'reflect-metadata';
import { DIContainer } from '../DIContainer';
import { ComponentMapKey } from '../ComponentMapKey';

// Test interfaces and classes
interface TestProcessor extends ComponentMapKey<string> {
    process(data: string): string;
}

class MockProcessor1 implements TestProcessor {
    getComponentMapKey(): string {
        return 'mock1';
    }
    
    process(data: string): string {
        return `Mock1 processed: ${data}`;
    }
}

class MockProcessor2 implements TestProcessor {
    getComponentMapKey(): string {
        return 'mock2';
    }
    
    process(data: string): string {
        return `Mock2 processed: ${data}`;
    }
}

describe('DIContainer', () => {
    let container: DIContainer;
    
    beforeEach(() => {
        container = DIContainer.getInstance();
        container.clearAll(); // Clean slate for each test
    });
    
    afterEach(() => {
        container.clearAll(); // Clean up after each test
    });
    
    describe('Singleton Pattern', () => {
        it('should return the same instance', () => {
            const instance1 = DIContainer.getInstance();
            const instance2 = DIContainer.getInstance();
            expect(instance1).toBe(instance2);
        });
    });
    
    describe('Component Registration', () => {
        it('should register a component', () => {
            container.registerComponent('test-registry', MockProcessor1);
            
            expect(container.has('test-registry', 'mock1')).toBe(true);
            expect(container.getKeys('test-registry')).toEqual(['mock1']);
        });
        
        it('should register multiple components in the same registry', () => {
            container.registerComponent('test-registry', MockProcessor1);
            container.registerComponent('test-registry', MockProcessor2);
            
            expect(container.has('test-registry', 'mock1')).toBe(true);
            expect(container.has('test-registry', 'mock2')).toBe(true);
            expect(container.getKeys('test-registry')).toEqual(['mock1', 'mock2']);
        });
        
        it('should register components in different registries', () => {
            container.registerComponent('registry1', MockProcessor1);
            container.registerComponent('registry2', MockProcessor2);
            
            expect(container.getRegistryNames()).toEqual(['registry1', 'registry2']);
            expect(container.has('registry1', 'mock1')).toBe(true);
            expect(container.has('registry2', 'mock2')).toBe(true);
        });
    });
    
    describe('Component Retrieval', () => {
        beforeEach(() => {
            container.registerComponent('test-registry', MockProcessor1);
            container.registerComponent('test-registry', MockProcessor2);
        });
        
        it('should retrieve a component by key', () => {
            const processor = container.get<string, TestProcessor>('test-registry', 'mock1');
            
            expect(processor).toBeDefined();
            expect(processor?.getComponentMapKey()).toBe('mock1');
            expect(processor?.process('test')).toBe('Mock1 processed: test');
        });
        
        it('should return undefined for non-existent component', () => {
            const processor = container.get<string, TestProcessor>('test-registry', 'nonexistent');
            expect(processor).toBeUndefined();
        });
        
        it('should return undefined for non-existent registry', () => {
            const processor = container.get<string, TestProcessor>('nonexistent-registry', 'mock1');
            expect(processor).toBeUndefined();
        });
        
        it('should retrieve all components from a registry', () => {
            const all = container.getAll<string, TestProcessor>('test-registry');
            
            expect(all.size).toBe(2);
            expect(all.has('mock1')).toBe(true);
            expect(all.has('mock2')).toBe(true);
            expect(all.get('mock1')?.process('test')).toBe('Mock1 processed: test');
            expect(all.get('mock2')?.process('test')).toBe('Mock2 processed: test');
        });
        
        it('should return empty map for non-existent registry', () => {
            const all = container.getAll<string, TestProcessor>('nonexistent-registry');
            expect(all.size).toBe(0);
        });
    });
    
    describe('Singleton vs Non-Singleton', () => {
        it('should return the same instance for singleton components (default)', () => {
            container.registerComponent('test-registry', MockProcessor1); // Default: singleton
            
            const instance1 = container.get<string, TestProcessor>('test-registry', 'mock1');
            const instance2 = container.get<string, TestProcessor>('test-registry', 'mock1');
            
            expect(instance1).toBe(instance2);
        });
        
        it('should return different instances for non-singleton components', () => {
            container.registerComponent('test-registry', MockProcessor1, false); // Non-singleton
            
            const instance1 = container.get<string, TestProcessor>('test-registry', 'mock1');
            const instance2 = container.get<string, TestProcessor>('test-registry', 'mock1');
            
            expect(instance1).not.toBe(instance2);
            expect(instance1?.getComponentMapKey()).toBe('mock1');
            expect(instance2?.getComponentMapKey()).toBe('mock1');
        });
    });
    
    describe('Registry Management', () => {
        beforeEach(() => {
            container.registerComponent('registry1', MockProcessor1);
            container.registerComponent('registry2', MockProcessor2);
        });
        
        it('should get all registry names', () => {
            const names = container.getRegistryNames();
            expect(names).toEqual(['registry1', 'registry2']);
        });
        
        it('should get registry info', () => {
            const info = container.getRegistryInfo('registry1');
            
            expect(info).toBeDefined();
            expect(info?.name).toBe('registry1');
            expect(info?.size).toBe(1);
            expect(info?.keys).toEqual(['mock1']);
        });
        
        it('should return undefined for non-existent registry info', () => {
            const info = container.getRegistryInfo('nonexistent');
            expect(info).toBeUndefined();
        });
        
        it('should clear a specific registry', () => {
            const cleared = container.clearRegistry('registry1');
            
            expect(cleared).toBe(true);
            expect(container.has('registry1', 'mock1')).toBe(false);
            expect(container.has('registry2', 'mock2')).toBe(true); // Other registry unaffected
        });
        
        it('should return false when clearing non-existent registry', () => {
            const cleared = container.clearRegistry('nonexistent');
            expect(cleared).toBe(false);
        });
        
        it('should clear all registries', () => {
            container.clearAll();
            
            expect(container.getRegistryNames()).toEqual([]);
            expect(container.has('registry1', 'mock1')).toBe(false);
            expect(container.has('registry2', 'mock2')).toBe(false);
        });
    });
    
    describe('Keys and Has Methods', () => {
        beforeEach(() => {
            container.registerComponent('test-registry', MockProcessor1);
            container.registerComponent('test-registry', MockProcessor2);
        });
        
        it('should check if component exists', () => {
            expect(container.has('test-registry', 'mock1')).toBe(true);
            expect(container.has('test-registry', 'mock2')).toBe(true);
            expect(container.has('test-registry', 'nonexistent')).toBe(false);
            expect(container.has('nonexistent-registry', 'mock1')).toBe(false);
        });
        
        it('should get all keys from a registry', () => {
            const keys = container.getKeys('test-registry');
            expect(keys).toEqual(['mock1', 'mock2']);
        });
        
        it('should return empty array for non-existent registry keys', () => {
            const keys = container.getKeys('nonexistent-registry');
            expect(keys).toEqual([]);
        });
    });
}); 