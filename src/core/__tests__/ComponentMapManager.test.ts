import { ComponentMapManager } from '../ComponentMapManager';
import { ComponentRegistry } from '../ComponentRegistry';

describe('ComponentMapManager', () => {
    let manager: ComponentMapManager;

    beforeEach(() => {
        manager = ComponentMapManager.getInstance();
        manager.clearAll(); // Start with clean state
    });

    describe('getInstance', () => {
        it('should return the same instance (singleton)', () => {
            const instance1 = ComponentMapManager.getInstance();
            const instance2 = ComponentMapManager.getInstance();
            
            expect(instance1).toBe(instance2);
        });
    });

    describe('getRegistry', () => {
        it('should create new registry if it does not exist', () => {
            const registry = manager.getRegistry<string, any>('testRegistry');
            
            expect(registry).toBeInstanceOf(ComponentRegistry);
            expect(registry.size()).toBe(0);
        });

        it('should return existing registry if it exists', () => {
            const registry1 = manager.getRegistry<string, any>('testRegistry');
            registry1.register('key1', { name: 'test' });
            
            const registry2 = manager.getRegistry<string, any>('testRegistry');
            
            expect(registry1).toBe(registry2);
            expect(registry2.size()).toBe(1);
            expect(registry2.get('key1')).toEqual({ name: 'test' });
        });

        it('should handle different registry names separately', () => {
            const registry1 = manager.getRegistry<string, any>('registry1');
            const registry2 = manager.getRegistry<string, any>('registry2');
            
            registry1.register('key1', { name: 'test1' });
            registry2.register('key2', { name: 'test2' });
            
            expect(registry1.size()).toBe(1);
            expect(registry2.size()).toBe(1);
            expect(registry1.get('key1')).toEqual({ name: 'test1' });
            expect(registry2.get('key2')).toEqual({ name: 'test2' });
        });
    });

    describe('hasRegistry', () => {
        it('should return false for non-existent registry', () => {
            expect(manager.hasRegistry('nonexistent')).toBe(false);
        });

        it('should return true for existing registry', () => {
            manager.getRegistry('testRegistry');
            expect(manager.hasRegistry('testRegistry')).toBe(true);
        });
    });

    describe('removeRegistry', () => {
        it('should return false when removing non-existent registry', () => {
            expect(manager.removeRegistry('nonexistent')).toBe(false);
        });

        it('should remove existing registry and return true', () => {
            manager.getRegistry('testRegistry');
            expect(manager.hasRegistry('testRegistry')).toBe(true);
            
            const removed = manager.removeRegistry('testRegistry');
            
            expect(removed).toBe(true);
            expect(manager.hasRegistry('testRegistry')).toBe(false);
        });
    });

    describe('clearAll', () => {
        it('should remove all registries', () => {
            manager.getRegistry('registry1');
            manager.getRegistry('registry2');
            manager.getRegistry('registry3');
            
            expect(manager.getRegistryNames().length).toBe(3);
            
            manager.clearAll();
            
            expect(manager.getRegistryNames().length).toBe(0);
        });
    });

    describe('getRegistryNames', () => {
        it('should return empty array when no registries exist', () => {
            expect(manager.getRegistryNames()).toEqual([]);
        });

        it('should return all registry names', () => {
            manager.getRegistry('registry1');
            manager.getRegistry('registry2');
            manager.getRegistry('registry3');
            
            const names = manager.getRegistryNames();
            
            expect(names).toContain('registry1');
            expect(names).toContain('registry2');
            expect(names).toContain('registry3');
            expect(names.length).toBe(3);
        });
    });
}); 