import 'reflect-metadata';
import * as fs from 'fs';
import * as path from 'path';
import { DIContainer } from './DIContainer';
import { ComponentMapKey } from './ComponentMapKey';

/**
 * Component scanner that automatically discovers and registers components
 * Similar to Spring Boot's component scanning
 */
export class ComponentScanner {
    private static instance: ComponentScanner;
    private container = DIContainer.getInstance();
    private scannedDirectories = new Set<string>();
    
    private constructor() {}
    
    static getInstance(): ComponentScanner {
        if (!ComponentScanner.instance) {
            ComponentScanner.instance = new ComponentScanner();
        }
        return ComponentScanner.instance;
    }
    
    /**
     * Automatically scan and register components from specified directories
     */
    async scanComponents(
        baseDir: string = 'src', 
        patterns: string[] = ['**/*.ts', '**/*.js'],
        excludePatterns: string[] = ['**/*.test.ts', '**/*.test.js', '**/*.spec.ts', '**/*.spec.js', '**/node_modules/**', '**/*.d.ts']
    ): Promise<void> {
        const absoluteBaseDir = path.resolve(process.cwd(), baseDir);
        
        if (this.scannedDirectories.has(absoluteBaseDir)) {
            return;
        }
        
        console.log(`🔍 Scanning for components in: ${path.relative(process.cwd(), absoluteBaseDir)}`);
        
        const componentFiles = await this.findComponentFiles(absoluteBaseDir, patterns, excludePatterns);
        
        for (const filePath of componentFiles) {
            try {
                await this.loadAndRegisterComponent(filePath);
            } catch (error) {
                // Only log actual component loading errors, not .d.ts import errors
                if (!filePath.endsWith('.d.ts')) {
                    console.warn(`⚠️ Error loading component from ${path.relative(process.cwd(), filePath)}:`, error instanceof Error ? error.message : error);
                }
            }
        }
        
        this.scannedDirectories.add(absoluteBaseDir);
        
        const registryNames = this.container.getRegistryNames();
        const totalComponents = registryNames.reduce((total, name) => 
            total + (this.container.getRegistryInfo(name)?.size || 0), 0);
            
        console.log(`✅ Component scan complete! Found ${totalComponents} components in ${registryNames.length} registries`);
        if (registryNames.length > 0) {
            console.log(`📦 Registries: ${registryNames.join(', ')}`);
        }
    }
    
    private async findComponentFiles(baseDir: string, patterns: string[], excludePatterns: string[]): Promise<string[]> {
        const allFiles: string[] = [];
        
        const scanDirectory = (dir: string): void => {
            if (!fs.existsSync(dir)) {
                console.warn(`⚠️ Directory does not exist: ${dir}`);
                return;
            }
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                
                if (entry.isDirectory()) {
                    // Skip excluded directories
                    const relativeDirPath = path.relative(baseDir, fullPath);
                    const shouldExcludeDir = excludePatterns.some(pattern => 
                        this.matchesPattern(relativeDirPath, pattern) || 
                        this.matchesPattern(entry.name, pattern)
                    );
                    
                    if (!shouldExcludeDir) {
                        scanDirectory(fullPath);
                    }
                } else if (entry.isFile()) {
                    const relativePath = path.relative(baseDir, fullPath);
                    const matchesInclude = patterns.some(pattern => this.matchesPattern(relativePath, pattern));
                    const matchesExclude = excludePatterns.some(pattern => this.matchesPattern(relativePath, pattern));
                    
                    if (matchesInclude && !matchesExclude) {
                        allFiles.push(fullPath);
                    }
                }
            }
        };
        
        scanDirectory(baseDir);
        return allFiles;
    }
    
    private matchesPattern(filePath: string, pattern: string): boolean {
        // Normalize paths to use forward slashes
        const normalizedPath = filePath.replace(/\\/g, '/');
        const normalizedPattern = pattern.replace(/\\/g, '/');
        
        // Simple but effective glob matching
        if (normalizedPattern === '**/*') {
            return true; // Match everything
        }
        
        // Handle **/*.ext patterns (most common case)
        if (normalizedPattern.startsWith('**/')) {
            const suffix = normalizedPattern.substring(3); // Remove "**/", 
            if (suffix.startsWith('*')) {
                // Pattern like **/*.ts
                const extension = suffix.substring(1); // Remove "*"
                return normalizedPath.endsWith(extension);
            } else {
                // Pattern like **/filename.ext
                return normalizedPath.endsWith('/' + suffix) || normalizedPath === suffix;
            }
        }
        
        // Handle *.ext patterns
        if (normalizedPattern.startsWith('*') && !normalizedPattern.includes('/')) {
            const extension = normalizedPattern.substring(1);
            const fileName = normalizedPath.split('/').pop() || '';
            return fileName.endsWith(extension);
        }
        
        // Handle exact matches
        if (normalizedPattern === normalizedPath) {
            return true;
        }
        
        // Handle directory patterns like **/node_modules/**
        if (normalizedPattern.includes('**')) {
            const parts = normalizedPattern.split('**');
            if (parts.length === 2) {
                const [prefix, suffix] = parts;
                const prefixMatch = !prefix || normalizedPath.startsWith(prefix);
                const suffixMatch = !suffix || normalizedPath.endsWith(suffix);
                const middleMatch = prefix && suffix ? 
                    normalizedPath.includes(prefix) && normalizedPath.includes(suffix) :
                    true;
                return prefixMatch && suffixMatch && middleMatch;
            }
        }
        
        // Fallback: simple wildcard matching
        const regexPattern = normalizedPattern
            .replace(/\./g, '\\.')
            .replace(/\*/g, '.*');
        
        const regex = new RegExp('^' + regexPattern + '$', 'i');
        return regex.test(normalizedPath);
    }
    
    private async loadAndRegisterComponent(filePath: string): Promise<void> {
        const modulePath = this.toModulePath(filePath);
        
        const moduleExports = await import(modulePath);
        
        for (const [exportName, exportValue] of Object.entries(moduleExports)) {
            if (this.isComponentClass(exportValue)) {
                // Component was already registered by the @Component decorator
                // Just log a clean message
                const componentName = (exportValue as any).name || exportName;
                console.log(`🔧 ${componentName} registered`);
            }
        }
    }
    
    private toModulePath(filePath: string): string {
        // Convert absolute path to absolute module path for import()
        // On Windows, we need to ensure we use file:// protocol for absolute paths
        if (path.isAbsolute(filePath)) {
            return filePath;
        }
        
        // For relative paths, make them absolute
        const absolutePath = path.resolve(process.cwd(), filePath);
        return absolutePath;
    }
    
    private isComponentClass(value: any): boolean {
        if (typeof value !== 'function') return false;
        
        try {
            if (!value.prototype) return false;
            const instance = new value();
            return typeof instance.getComponentMapKey === 'function';
        } catch {
            return false;
        }
    }
    
    async scanFiles(filePaths: string[]): Promise<void> {
        console.log(`🔍 Scanning ${filePaths.length} specific files...`);
        
        for (const filePath of filePaths) {
            await this.loadAndRegisterComponent(filePath);
        }
    }
    
    getStats() {
        return {
            scannedDirectories: Array.from(this.scannedDirectories),
            registries: this.container.getRegistryNames(),
            totalComponents: this.container.getRegistryNames()
                .reduce((total, name) => total + (this.container.getRegistryInfo(name)?.size || 0), 0)
        };
    }
} 