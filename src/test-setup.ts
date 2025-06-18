import 'reflect-metadata';

// Global test setup
beforeEach(() => {
  // Clear ComponentMapManager between tests to avoid test pollution
  const { ComponentMapManager } = require('./core/ComponentMapManager');
  const manager = ComponentMapManager.getInstance();
  manager.clearAll();
}); 