#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface GenerateOptions {
    name: string;
    type: 'provider' | 'handler' | 'service';
    keyType?: string;
    valueType?: string;
    outputDir?: string;
}

class ComponentMapCLI {
    private templates = {
        provider: `import { ComponentMapKey } from '@your-scope/component-map';
import { {{keyType}} } from './types';

export interface {{interfaceName}} extends ComponentMapKey<{{keyType}}> {
    // Define your provider methods here
    process(data: any): Promise<any>;
}`,

        implementation: `import { {{interfaceName}} } from './{{interfaceFile}}';
import { {{keyType}} } from './types';

export class {{className}} implements {{interfaceName}} {
    getComponentMapKey(): {{keyType}} {
        return {{keyType}}.{{enumValue}};
    }
    
    async process(data: any): Promise<any> {
        console.log('Processing with {{className}}:', data);
        // Implement your logic here
        return { success: true, provider: '{{providerName}}' };
    }
}`,

        service: `import { ComponentMapManager } from '@your-scope/component-map';
import { ComponentRegistry } from '@your-scope/component-map';
import { {{interfaceName}} } from './{{interfaceFile}}';
import { {{keyType}} } from './types';

export class {{serviceName}} {
    private readonly providers: Map<{{keyType}}, {{interfaceName}}>;
    private readonly registryName = '{{registryName}}';
    
    constructor() {
        // Initialize registry and register providers
        const registry = ComponentMapManager.getInstance()
            .getRegistry<{{keyType}}, {{interfaceName}}>(this.registryName);
        
        // Auto-register providers here
        // registry.register(providerKey, providerInstance);
        
        this.providers = registry.getAll();
        
        console.log(\`{{serviceName}} initialized with \${this.providers.size} providers\`);
    }
    
    async process(providerKey: {{keyType}}, data: any): Promise<any> {
        const provider = this.providers.get(providerKey);
        if (!provider) {
            throw new Error(\`Provider not found: \${providerKey}\`);
        }
        
        return provider.process(data);
    }
    
    getAvailableProviders(): {{keyType}}[] {
        return Array.from(this.providers.keys());
    }
}`,

        types: `export enum {{keyType}} {
    // Add your provider types here
    // EXAMPLE = 'example'
}

export interface ProcessDataDTO {
    // Define your data structure here
}

export interface ProcessResultDTO {
    // Define your result structure here
    success: boolean;
    provider: string;
}`
    };

    async generate(options: GenerateOptions) {
        console.log(`🚀 Generating ComponentMap ${options.type}...`);
        
        const outputDir = options.outputDir || `./src/examples/${this.kebabCase(options.name)}`;
        
        // Create output directory
        this.ensureDirectoryExists(outputDir);
        
        switch (options.type) {
            case 'provider':
                await this.generateProvider(options, outputDir);
                break;
            case 'service':
                await this.generateService(options, outputDir);
                break;
            default:
                console.error(`❌ Unknown type: ${options.type}`);
                process.exit(1);
        }
        
        console.log(`✅ Generated ${options.type} successfully in ${outputDir}`);
        console.log(`\n📝 Next steps:`);
        console.log(`   1. Update the types in ${outputDir}/types.ts`);
        console.log(`   2. Implement your business logic`);
        console.log(`   3. Register your providers in the service`);
        console.log(`   4. Add tests for your components`);
    }

    private async generateProvider(options: GenerateOptions, outputDir: string) {
        const keyType = options.keyType || `${this.pascalCase(options.name)}ProviderType`;
        const interfaceName = `${this.pascalCase(options.name)}Provider`;
        const className = `Example${this.pascalCase(options.name)}Provider`;
        
        // Generate types file
        const typesContent = this.templates.types
            .replace(/{{keyType}}/g, keyType);
        
        this.writeFile(path.join(outputDir, 'types.ts'), typesContent);
        
        // Generate interface file
        const interfaceContent = this.templates.provider
            .replace(/{{keyType}}/g, keyType)
            .replace(/{{interfaceName}}/g, interfaceName);
        
        this.writeFile(path.join(outputDir, `${this.pascalCase(options.name)}Provider.ts`), interfaceContent);
        
        // Generate example implementation
        const implementationContent = this.templates.implementation
            .replace(/{{interfaceName}}/g, interfaceName)
            .replace(/{{interfaceFile}}/g, `${this.pascalCase(options.name)}Provider`)
            .replace(/{{className}}/g, className)
            .replace(/{{keyType}}/g, keyType)
            .replace(/{{enumValue}}/g, 'EXAMPLE')
            .replace(/{{providerName}}/g, 'example');
        
        this.writeFile(path.join(outputDir, `${className}.ts`), implementationContent);
    }

    private async generateService(options: GenerateOptions, outputDir: string) {
        const keyType = options.keyType || `${this.pascalCase(options.name)}ProviderType`;
        const interfaceName = `${this.pascalCase(options.name)}Provider`;
        const serviceName = `${this.pascalCase(options.name)}Service`;
        
        // Ensure provider files exist
        const interfaceFile = path.join(outputDir, `${this.pascalCase(options.name)}Provider.ts`);
        if (!fs.existsSync(interfaceFile)) {
            console.log(`📝 Creating provider interface first...`);
            await this.generateProvider(options, outputDir);
        }
        
        // Generate service file
        const serviceContent = this.templates.service
            .replace(/{{interfaceName}}/g, interfaceName)
            .replace(/{{interfaceFile}}/g, `${this.pascalCase(options.name)}Provider`)
            .replace(/{{serviceName}}/g, serviceName)
            .replace(/{{keyType}}/g, keyType)
            .replace(/{{registryName}}/g, `${this.camelCase(options.name)}Providers`);
        
        this.writeFile(path.join(outputDir, `${serviceName}.ts`), serviceContent);
    }

    private ensureDirectoryExists(dir: string) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    private writeFile(filePath: string, content: string) {
        fs.writeFileSync(filePath, content);
        console.log(`📄 Created: ${filePath}`);
    }

    private pascalCase(str: string): string {
        return str.replace(/(?:^|[^a-zA-Z0-9])([a-zA-Z0-9])/g, (_, char) => char.toUpperCase());
    }

    private camelCase(str: string): string {
        const pascal = this.pascalCase(str);
        return pascal.charAt(0).toLowerCase() + pascal.slice(1);
    }

    private kebabCase(str: string): string {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }
}

// CLI Interface
function showHelp() {
    console.log(`
🗺️  ComponentMap CLI - Generate boilerplate code

Usage:
  component-map generate <type> <name> [options]

Types:
  provider    Generate a new provider interface and example implementation
  service     Generate a service that manages providers using ComponentMap

Examples:
  component-map generate provider payment
  component-map generate service notification --key-type NotificationProviderType
  component-map generate provider file-storage --output-dir ./src/storage

Options:
  --key-type <type>     Specify the enum type for component keys
  --output-dir <dir>    Specify output directory (default: ./src/examples/<name>)
  --help               Show this help message
`);
}

async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args.includes('--help')) {
        showHelp();
        return;
    }
    
    const [command, type, name] = args;
    
    if (command !== 'generate') {
        console.error('❌ Unknown command. Use "generate"');
        showHelp();
        process.exit(1);
    }
    
    if (!type || !name) {
        console.error('❌ Missing required arguments');
        showHelp();
        process.exit(1);
    }
    
    // Parse options
    const options: GenerateOptions = { name, type: type as any };
    
    for (let i = 3; i < args.length; i += 2) {
        const key = args[i]?.replace('--', '');
        const value = args[i + 1];
        
        if (key === 'key-type') options.keyType = value;
        if (key === 'output-dir') options.outputDir = value;
    }
    
    const cli = new ComponentMapCLI();
    await cli.generate(options);
}

if (require.main === module) {
    main().catch(console.error);
} 