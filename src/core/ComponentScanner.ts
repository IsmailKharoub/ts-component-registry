import 'reflect-metadata';
import * as path from 'path';
import { DIContainer } from './DIContainer';

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
    exclude: string[] = ['**/*.d.ts', '**/*.{test,spec}.{ts,js}', 'node_modules']
  ): Promise<void> {
    const root = path.resolve(process.cwd(), baseDir);
    if (this.scannedDirs.has(root)) return;

    console.log(`🔍 Scanning: ${path.relative(process.cwd(), root)}`);

    // Use fast-glob for efficient file discovery
    const fg = await import('fast-glob');
    const files = await fg.async(include, {
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
    console.log(`✅ Complete! ${total} components in ${names.length} registries.`, `📦 ${names.join(', ')}`);
  }

  /**
   * Load modules in controlled concurrency
   */
  private async loadInBatches(paths: string[], batchSize: number): Promise<void> {
    for (let i = 0; i < paths.length; i += batchSize) {
      await Promise.all(
        paths.slice(i, i + batchSize).map(p => this.register(p).catch(err =>
          console.warn(`⚠️ Load failed: ${path.relative(process.cwd(), p)}:`, err.message)
        ))
      );
    }
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
        console.log(`🔧 ${(exp as any).name || 'Component'} registered`);
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
    console.log(`🔍 Scanning ${files.length} files...`);
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
    console.log('🧹 Caches cleared');
  }
}
