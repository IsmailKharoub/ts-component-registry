"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentScanner = void 0;
require("reflect-metadata");
const path = __importStar(require("path"));
const DIContainer_1 = require("./DIContainer");
const Logger_1 = require("./Logger");
/**
 * High-performance component scanner with fast-glob integration,
 * simplified pattern logic, and streamlined caching.
 */
class ComponentScanner {
    constructor() {
        this.container = DIContainer_1.DIContainer.getInstance();
        this.scannedDirs = new Set();
        this.moduleCache = new Map();
    }
    static getInstance() {
        return ComponentScanner.instance || (ComponentScanner.instance = new ComponentScanner());
    }
    /**
     * Scan and register components under baseDir using fast-glob
     */
    async scanComponents(baseDir = 'src', include = ['**/*.{ts,js,mts,mjs,cts,cjs}'], exclude = [
        '**/*.d.ts', // TypeScript declaration files
        '**/*.{test,spec}.{ts,js}', // Test files
        '**/test-setup.{ts,js}', // Test setup files
        'node_modules', // Node modules
        '**/*.map', // Source map files
        '**/*.min.js', // Minified files
    ]) {
        const root = path.resolve(process.cwd(), baseDir);
        if (this.scannedDirs.has(root))
            return;
        Logger_1.logger.info(`🔍 Scanning: ${path.relative(process.cwd(), root)}`);
        // Use fast-glob for efficient file discovery
        const { glob } = await Promise.resolve().then(() => __importStar(require('fast-glob')));
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
        Logger_1.logger.info(`✅ Complete! ${total} components in ${names.length} registries.`, `📦 ${names.join(', ')}`);
    }
    /**
     * Load modules in controlled concurrency
     */
    async loadInBatches(paths, batchSize) {
        for (let i = 0; i < paths.length; i += batchSize) {
            await Promise.all(paths.slice(i, i + batchSize).map(p => this.register(p).catch(err => {
                // Skip logging for expected/non-critical errors
                if (this.isExpectedError(err, p)) {
                    return; // Silently skip expected errors
                }
                Logger_1.logger.warn(`⚠️ Load failed: ${path.relative(process.cwd(), p)}:`, err.message);
            })));
        }
    }
    /**
     * Check if an error is expected and should not be logged
     */
    isExpectedError(error, filePath) {
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
            errorMsg.includes('beforeEach') || errorMsg.includes('afterEach'));
    }
    /**
     * Import and register component exports
     */
    async register(filePath) {
        // Use absolute path for import consistency
        const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
        if (this.moduleCache.has(absolutePath))
            return;
        const mod = await Promise.resolve(`${absolutePath}`).then(s => __importStar(require(s)));
        this.moduleCache.set(absolutePath, mod);
        for (const exp of Object.values(mod)) {
            if (this.isComponent(exp)) {
                Logger_1.logger.debug(`🔧 ${exp.name || 'Component'} registered`);
            }
        }
    }
    isComponent(fn) {
        if (typeof fn !== 'function')
            return false;
        const proto = fn.prototype;
        if (!proto)
            return false;
        try {
            const inst = new fn();
            return typeof inst.getComponentMapKey === 'function';
        }
        catch {
            return false;
        }
    }
    /**
     * Scan specific file list
     */
    async scanFiles(files) {
        Logger_1.logger.info(`🔍 Scanning ${files.length} files...`);
        await this.loadInBatches(files, 10);
    }
    getStats() {
        return {
            scannedDirs: Array.from(this.scannedDirs),
            registries: this.container.getRegistryNames(),
            total: this.container.getRegistryNames().reduce((t, n) => t + (this.container.getRegistryInfo(n)?.size || 0), 0),
            moduleCacheSize: this.moduleCache.size,
        };
    }
    /**
     * Clear internal caches
     */
    clearCaches() {
        this.scannedDirs.clear();
        this.moduleCache.clear();
        Logger_1.logger.info('🧹 Caches cleared');
    }
}
exports.ComponentScanner = ComponentScanner;
//# sourceMappingURL=ComponentScanner.js.map