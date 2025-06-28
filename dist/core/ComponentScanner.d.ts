import 'reflect-metadata';
/**
 * High-performance component scanner with fast-glob integration,
 * simplified pattern logic, and streamlined caching.
 */
export declare class ComponentScanner {
    private static instance;
    private container;
    private scannedDirs;
    private moduleCache;
    private constructor();
    static getInstance(): ComponentScanner;
    /**
     * Scan and register components under baseDir using fast-glob
     */
    scanComponents(baseDir?: string, include?: string[], exclude?: string[]): Promise<void>;
    /**
     * Load modules in controlled concurrency
     */
    private loadInBatches;
    /**
     * Import and register component exports
     */
    private register;
    private isComponent;
    /**
     * Scan specific file list
     */
    scanFiles(files: string[]): Promise<void>;
    getStats(): {
        scannedDirs: string[];
        registries: string[];
        total: number;
        moduleCacheSize: number;
    };
    /**
     * Clear internal caches
     */
    clearCaches(): void;
}
//# sourceMappingURL=ComponentScanner.d.ts.map