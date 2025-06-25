import 'reflect-metadata';

// Test setup for ComponentMap tests
// Clear DIContainer between tests to avoid test pollution
const { DIContainer } = require('./core/DIContainer');
const container = DIContainer.getInstance();

beforeEach(() => {
    container.clearAll();
}); 