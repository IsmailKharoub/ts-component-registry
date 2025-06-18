import { ComponentRegistry } from '../ComponentRegistry';

describe('ComponentRegistry', () => {
    let registry: ComponentRegistry<string, any>;

    beforeEach(() => {
        registry = new ComponentRegistry<string, any>();
    });

    describe('register', () => {
        it('should register a component with a key', () => {
            const component = { name: 'test' };
            registry.register('key1', component);
            
            expect(registry.get('key1')).toBe(component);
        });

        it('should overwrite existing component with same key', () => {
            const component1 = { name: 'test1' };
            const component2 = { name: 'test2' };
            
            registry.register('key1', component1);
            registry.register('key1', component2);
            
            expect(registry.get('key1')).toBe(component2);
        });
    });

    describe('get', () => {
        it('should return undefined for non-existent key', () => {
            expect(registry.get('nonexistent')).toBeUndefined();
        });

        it('should return registered component', () => {
            const component = { name: 'test' };
            registry.register('key1', component);
            
            expect(registry.get('key1')).toBe(component);
        });
    });

    describe('getAll', () => {
        it('should return empty map when no components registered', () => {
            const all = registry.getAll();
            expect(all.size).toBe(0);
        });

        it('should return all registered components', () => {
            const component1 = { name: 'test1' };
            const component2 = { name: 'test2' };
            
            registry.register('key1', component1);
            registry.register('key2', component2);
            
            const all = registry.getAll();
            expect(all.size).toBe(2);
            expect(all.get('key1')).toBe(component1);
            expect(all.get('key2')).toBe(component2);
        });

        it('should return a copy of the internal map', () => {
            const component = { name: 'test' };
            registry.register('key1', component);
            
            const all = registry.getAll();
            all.delete('key1');
            
            // Original registry should still have the component
            expect(registry.get('key1')).toBe(component);
        });
    });

    describe('getKeys', () => {
        it('should return empty array when no components registered', () => {
            expect(registry.getKeys()).toEqual([]);
        });

        it('should return all registered keys', () => {
            registry.register('key1', { name: 'test1' });
            registry.register('key2', { name: 'test2' });
            
            const keys = registry.getKeys();
            expect(keys).toContain('key1');
            expect(keys).toContain('key2');
            expect(keys.length).toBe(2);
        });
    });

    describe('has', () => {
        it('should return false for non-existent key', () => {
            expect(registry.has('nonexistent')).toBe(false);
        });

        it('should return true for registered key', () => {
            registry.register('key1', { name: 'test' });
            expect(registry.has('key1')).toBe(true);
        });
    });

    describe('size', () => {
        it('should return 0 when no components registered', () => {
            expect(registry.size()).toBe(0);
        });

        it('should return correct count of registered components', () => {
            registry.register('key1', { name: 'test1' });
            registry.register('key2', { name: 'test2' });
            
            expect(registry.size()).toBe(2);
        });
    });

    describe('clear', () => {
        it('should remove all registered components', () => {
            registry.register('key1', { name: 'test1' });
            registry.register('key2', { name: 'test2' });
            
            expect(registry.size()).toBe(2);
            
            registry.clear();
            
            expect(registry.size()).toBe(0);
            expect(registry.get('key1')).toBeUndefined();
            expect(registry.get('key2')).toBeUndefined();
        });
    });
}); 