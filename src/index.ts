import 'reflect-metadata';

// Core ComponentMap functionality
export { ComponentMapKey } from './core/ComponentMapKey';
export { DIContainer } from './core/DIContainer';
export { ComponentScanner } from './core/ComponentScanner';
export { SingletonComponentMap } from './core/SingletonComponentMap';

// Logger system
export { Logger, LogLevel, logger } from './core/Logger';
export type { LoggerConfig } from './core/Logger';

// Decorators
export {
    Component,
    ComponentMap,
    InjectComponent,
    initializeComponentMaps,
    registerComponents,
    getComponent,
    getAllComponents,
    getSingletonComponentMap
} from './decorators/ComponentMapDecorators';

