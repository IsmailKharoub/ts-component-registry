import 'reflect-metadata';
import * as path from 'path';
import { DIContainer } from './DIContainer';
import { logger } from './Logger';

/**
 * High-performance component scanner with fast-glob integration,
 * simplified pattern logic, and streamlined caching.
 */
export class ComponentScanner {
  private static instance: ComponentScanner;
  private container = DIContainer.getInstance();
  private scannedDirs = new Set<string>();
  private moduleCache = new Map<string, any>();

  private constructor() {}

  static getInstance(): ComponentScanner {
    return ComponentScanner.instance || (ComponentScanner.instance = new ComponentScanner());
  }

  /**
   * Scan and register components under baseDir using fast-glob
   */
  async scanComponents(
    baseDir: string = 'src',
    include: string[] = ['**/*.{ts,js,mts,mjs,cts,cjs}'],
    exclude: string[] = [
      '**/*.d.ts',           // TypeScript declaration files
      '**/*.{test,spec}.{ts,js}', // Test files
      '**/test-setup.{ts,js}',    // Test setup files
      'node_modules',        // Node modules
      '**/*.map',           // Source map files
      '**/*.min.js',        // Minified files
    ]
  ): Promise<void> {
    const root = path.resolve(process.cwd(), baseDir);
    if (this.scannedDirs.has(root)) return;

    logger.info(`🔍 Scanning: ${path.relative(process.cwd(), root)}`);

    // Use fast-glob for efficient file discovery
    const { glob } = await import('fast-glob');
    const files = await glob(include, {
      cwd: root,
      ignore: exclude,
      absolute: true,
      onlyFiles: true,
      followSymbolicLinks: false,
    });

    await this.loadInBatches(files, 10);
    this.scannedDirs.add(root);

    const names = this.container.getRegistryNames();
    const total = names.reduce((sum, n) => sum + (this.container.getRegistryInfo(n)?.size || 0), 0);
    logger.info(`✅ Complete! ${total} components in ${names.length} registries.`, `📦 ${names.join(', ')}`);
  }

  /**
   * Load modules in controlled concurrency
   */
  private async loadInBatches(paths: string[], batchSize: number): Promise<void> {
    for (let i = 0; i < paths.length; i += batchSize) {
      await Promise.all(
        paths.slice(i, i + batchSize).map(p => this.register(p).catch(err => {
          // Skip logging for expected/non-critical errors
          if (this.isExpectedError(err, p)) {
            return; // Silently skip expected errors
          }
          logger.warn(`⚠️ Load failed: ${path.relative(process.cwd(), p)}:`, err.message);
        }))
      );
    }
  }

  /**
   * Check if an error is expected and should not be logged
   */
  private isExpectedError(error: Error, filePath: string): boolean {
    const fileName = path.basename(filePath);
    const errorMsg = error.message;

    // Skip logging for these expected cases:
    return (
      // Declaration files that can't find modules
      fileName.endsWith('.d.ts') ||
      // Test setup files in non-test environment
      fileName.includes('test-setup') ||
      // Demo files missing exports (common in examples)
      (fileName.includes('demo') && errorMsg.includes('not defined')) ||
      // Common missing module errors for declaration files
      errorMsg.includes('Cannot find module') ||
      // beforeEach/afterEach not defined (test environment issues)
      errorMsg.includes('beforeEach') || errorMsg.includes('afterEach')
    );
  }

  /**
   * Import and register component exports
   */
  private async register(filePath: string): Promise<void> {
    // Use absolute path for import consistency
    const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
    
    if (this.moduleCache.has(absolutePath)) return;

    const mod = await import(absolutePath);
    this.moduleCache.set(absolutePath, mod);

    for (const exp of Object.values(mod)) {
      if (this.isComponent(exp)) {
        logger.debug(`🔧 ${(exp as any).name || 'Component'} registered`);
      }
    }
  }

  private isComponent(fn: any): boolean {
    if (typeof fn !== 'function') return false;
    const proto = fn.prototype;
    if (!proto) return false;
    try {
      const inst = new fn();
      return typeof inst.getComponentMapKey === 'function';
    } catch {
      return false;
    }
  }

  /**
   * Scan specific file list
   */
  async scanFiles(files: string[]): Promise<void> {
    logger.info(`🔍 Scanning ${files.length} files...`);
    await this.loadInBatches(files, 10);
  }

  getStats() {
    return {
      scannedDirs: Array.from(this.scannedDirs),
      registries: this.container.getRegistryNames(),
      total: this.container.getRegistryNames().reduce(
        (t, n) => t + (this.container.getRegistryInfo(n)?.size || 0),
        0
      ),
      moduleCacheSize: this.moduleCache.size,
    };
  }

  /**
   * Clear internal caches
   */
  clearCaches(): void {
    this.scannedDirs.clear();
    this.moduleCache.clear();
    logger.info('🧹 Caches cleared');
  }
}
