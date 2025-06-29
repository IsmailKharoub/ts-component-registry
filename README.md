# 🔥 TypeScript Component Registry

> **Eliminate boilerplate code with automatic component discovery**  
> A TypeScript library that provides automatic dependency injection and component mapping using decorators. Zero configuration, maximum productivity.

[![npm version](https://badge.fury.io/js/ts-component-registry.svg)](https://badge.fury.io/js/ts-component-registry)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

## 🚀 Why TypeScript Component Registry?

**Stop writing boilerplate code for strategy patterns!** This library automatically discovers and injects your implementations using simple decorators, so you can focus on business logic instead of manual registration.

### ❌ The Old Way (Lots of Boilerplate)
```typescript
class PaymentService {
  private processors = new Map<string, PaymentProcessor>();
  
  constructor() {
    // Manual registration - error-prone and tedious 😩
    this.processors.set('stripe', new StripeProcessor());
    this.processors.set('paypal', new PayPalProcessor());
    this.processors.set('apple-pay', new ApplePayProcessor());
    // Forgot to add the new GooglePayProcessor? Runtime error! 💥
  }
}
```

### ✅ The Component Registry Way (Zero Boilerplate)
```typescript
// 1️⃣ Define your component base class
abstract class PaymentProcessor extends ComponentMapKey<string> {
  abstract process(amount: number): Promise<string>;
}

// 2️⃣ Just annotate your implementations
@Component(PaymentProcessor)
class StripeProcessor extends PaymentProcessor {
  getComponentMapKey() { return 'stripe'; }
  async process(amount: number) { return `Charged $${amount} via Stripe`; }
}

@Component(PaymentProcessor)
class PayPalProcessor extends PaymentProcessor {
  getComponentMapKey() { return 'paypal'; }
  async process(amount: number) { return `Charged $${amount} via PayPal`; }
}

// 3️⃣ Auto-inject all components
class PaymentService {
  @ComponentMap(PaymentProcessor)
  private processors!: Map<string, PaymentProcessor>;
  
  // That's it! All processors are automatically discovered and injected 🎉
}

// 4️⃣ One line to start auto-discovery
await initializeComponentMaps(['dist/src']);
```

## ⚡ Quick Start

### Installation
```bash
npm install ts-component-registry
```

### Zero Configuration Setup
No need to import `reflect-metadata` manually - the library handles it automatically! 🎉

Just import and start using:
```typescript
import { Component, ComponentMap } from 'ts-component-registry';
// That's it! reflect-metadata is imported automatically
```

### 30-Second Example
```typescript
import { Component, ComponentMap, initializeComponentMaps, ComponentMapKey } from 'ts-component-registry';

// 1️⃣ Define your component base class
abstract class PaymentProcessor extends ComponentMapKey<string> {
  abstract process(amount: number): Promise<string>;
}

// 2️⃣ Implement with @Component decorator
@Component(PaymentProcessor)
class StripeProcessor extends PaymentProcessor {
  getComponentMapKey(): string { return 'stripe'; }
  
  async process(amount: number): Promise<string> {
    return `Charged $${amount} via Stripe`;
  }
}

@Component(PaymentProcessor)
class PayPalProcessor extends PaymentProcessor {
  getComponentMapKey(): string { return 'paypal'; }
  
  async process(amount: number): Promise<string> {
    return `Charged $${amount} via PayPal`;
  }
}

// 3️⃣ Use with automatic injection
class PaymentService {
  @ComponentMap(PaymentProcessor)
  private processors!: Map<string, PaymentProcessor>;
  
  async charge(method: string, amount: number): Promise<string> {
    const processor = this.processors.get(method);
    if (!processor) throw new Error(`Unsupported payment method: ${method}`);
    return processor.process(amount);
  }
  
  getAvailableProviders(): string[] {
    return Array.from(this.processors.keys());
  }
}

// 4️⃣ Initialize and use
async function main() {
  // Auto-discover all @Component decorated classes
  await initializeComponentMaps(['dist/src']);
  
  const paymentService = new PaymentService();
  
  console.log('Available providers:', paymentService.getAvailableProviders());
  // Output: ['stripe', 'paypal']
  
  const result = await paymentService.charge('stripe', 99.99);
  console.log(result); // "Charged $99.99 via Stripe"
}

main().catch(console.error);
```

## 🎯 Perfect For These Use Cases

<details>
<summary><strong>🔒 Authentication Providers</strong></summary>

```typescript
enum AuthProvider { OAUTH = 'oauth', SAML = 'saml', LOCAL = 'local' }

abstract class AuthHandler extends ComponentMapKey<AuthProvider> {
  abstract authenticate(credentials: any): Promise<User>;
}

@Component(AuthHandler)
class OAuthHandler extends AuthHandler {
  getComponentMapKey() { return AuthProvider.OAUTH; }
  async authenticate(token: string): Promise<User> {
    // OAuth implementation
  }
}

@Component(AuthHandler)
class SAMLHandler extends AuthHandler {
  getComponentMapKey() { return AuthProvider.SAML; }
  async authenticate(assertion: string): Promise<User> {
    // SAML implementation
  }
}

class AuthService {
  @ComponentMap(AuthHandler)
  private handlers!: Map<AuthProvider, AuthHandler>;
  
  async authenticate(provider: AuthProvider, credentials: any): Promise<User> {
    const handler = this.handlers.get(provider);
    if (!handler) throw new Error(`Unsupported auth provider: ${provider}`);
    return handler.authenticate(credentials);
  }
}
```
</details>

<details>
<summary><strong>📁 File Processors</strong></summary>

```typescript
abstract class FileProcessor extends ComponentMapKey<string> {
  abstract process(file: Buffer): Promise<ProcessedFile>;
}

@Component(FileProcessor)
class PDFProcessor extends FileProcessor {
  getComponentMapKey() { return '.pdf'; }
  async process(file: Buffer): Promise<ProcessedFile> {
    // PDF processing logic
  }
}

@Component(FileProcessor)
class ImageProcessor extends FileProcessor {
  getComponentMapKey() { return '.jpg'; }
  async process(file: Buffer): Promise<ProcessedFile> {
    // Image processing logic
  }
}

class FileService {
  @ComponentMap(FileProcessor)
  private processors!: Map<string, FileProcessor>;
  
  async processFile(filename: string, file: Buffer): Promise<ProcessedFile> {
    const extension = path.extname(filename);
    const processor = this.processors.get(extension);
    if (!processor) throw new Error(`Unsupported file type: ${extension}`);
    return processor.process(file);
  }
}
```
</details>

<details>
<summary><strong>🔔 Notification Services</strong></summary>

```typescript
enum NotificationType { EMAIL = 'email', SMS = 'sms', PUSH = 'push' }

abstract class NotificationSender extends ComponentMapKey<NotificationType> {
  abstract send(message: string, recipient: string): Promise<void>;
}

@Component(NotificationSender)
class EmailSender extends NotificationSender {
  getComponentMapKey() { return NotificationType.EMAIL; }
  async send(message: string, recipient: string): Promise<void> {
    // Email sending logic
  }
}

@Component(NotificationSender)
class SMSSender extends NotificationSender {
  getComponentMapKey() { return NotificationType.SMS; }
  async send(message: string, recipient: string): Promise<void> {
    // SMS sending logic
  }
}

class NotificationService {
  @ComponentMap(NotificationSender)
  private senders!: Map<NotificationType, NotificationSender>;
  
  async sendNotification(type: NotificationType, message: string, recipient: string): Promise<void> {
    const sender = this.senders.get(type);
    if (!sender) throw new Error(`Unsupported notification type: ${type}`);
    await sender.send(message, recipient);
  }
  
  async broadcast(message: string, recipient: string): Promise<void> {
    const promises = Array.from(this.senders.values()).map(sender => 
      sender.send(message, recipient)
    );
    await Promise.all(promises);
  }
}
```
</details>

## 🏗️ Core Concepts

### ComponentMapKey Base Class
Every component must extend this abstract class to provide its unique key:

```typescript
abstract class ComponentMapKey<K> {
  /**
   * Returns the unique key this component should be registered under
   */
  abstract getComponentMapKey(): K;
}
```

### @Component Decorator
Marks a class for automatic discovery and registration:

```typescript
// Type-based approach (recommended)
@Component(BaseComponentClass, singleton?: boolean)

// String-based approach (legacy)
@Component(registryName: string, singleton?: boolean)
```

**Examples:**
```typescript
@Component(PaymentProcessor)           // Type-based, singleton (default)
@Component(PaymentProcessor, false)    // Type-based, new instance each time
@Component('handlers', true)           // String-based, explicitly singleton
```

### @ComponentMap Decorator
Automatically injects all components from a registry:

```typescript
// Type-based approach (recommended)
@ComponentMap(BaseComponentClass)

// String-based approach (legacy)
@ComponentMap(registryName: string)
```

**Example:**
```typescript
class MyService {
  @ComponentMap(PaymentProcessor)
  private processors!: Map<string, PaymentProcessor>;
  
  @ComponentMap(CacheProvider)
  private caches!: Map<CacheType, CacheProvider>;
}
```

### @InjectComponent Decorator
Inject a specific component by its key:

```typescript
class OrderService {
  @InjectComponent(PaymentProcessor, 'stripe')
  private stripeProcessor!: PaymentProcessor;
  
  @InjectComponent(NotificationSender, NotificationType.EMAIL)
  private emailSender!: NotificationSender;
}
```

### Auto-Discovery Process
Call `initializeComponentMaps()` to scan and register all components:

```typescript
await initializeComponentMaps(
  scanDirs?: string[],           // Directories to scan (default: ['src'])
  excludePatterns?: string[]     // Patterns to exclude (default: test files)
);
```

**Example:**
```typescript
// Scan default directories
await initializeComponentMaps();

// Scan specific directories
await initializeComponentMaps(['dist/src', 'dist/plugins']);

// Custom exclude patterns
await initializeComponentMaps(['src'], ['**/*.test.ts', '**/temp/**']);
```

## 🔧 Logger Configuration

The library includes a built-in logger system with configurable levels:

```typescript
import { Logger, LogLevel, logger } from 'ts-component-registry';

// Configure logger for your needs
Logger.configure({
    level: LogLevel.INFO,        // DEBUG, INFO, WARN, ERROR, SILENT
    enableColors: true,          // Colorized output
    enableTimestamp: false,      // Add timestamps
    prefix: '[MyApp]'           // Custom prefix
});

// Use in your code
logger.info('🚀 Application starting...');
logger.warn('⚠️ Deprecated feature used');
logger.error('❌ Something went wrong');

// Silent mode for production
if (process.env.NODE_ENV === 'production') {
    Logger.configure({ level: LogLevel.SILENT });
}
```

**Logger Levels:**
- `LogLevel.DEBUG` - Shows all messages (including component registration details)
- `LogLevel.INFO` - Shows info, warn, and error messages (default)
- `LogLevel.WARN` - Shows only warnings and errors
- `LogLevel.ERROR` - Shows only errors
- `LogLevel.SILENT` - No output

## 🚀 Advanced Usage

### Type-Based vs String-Based Registration

```typescript
// ✅ Type-based approach (recommended)
abstract class PaymentProcessor extends ComponentMapKey<string> {
  abstract process(amount: number): Promise<string>;
}

@Component(PaymentProcessor)  // Uses class name as registry
class StripeProcessor extends PaymentProcessor { /* ... */ }

class PaymentService {
  @ComponentMap(PaymentProcessor)  // Type-safe injection
  private processors!: Map<string, PaymentProcessor>;
}

// ⚠️ String-based approach (legacy)
@Component('payment-processors')
class PayPalProcessor extends PaymentProcessor { /* ... */ }

class PaymentService {
  @ComponentMap('payment-processors')
  private processors!: Map<string, PaymentProcessor>;
}
```

### Manual Component Registration
Register components programmatically:

```typescript
import { registerComponents } from 'ts-component-registry';

// Register multiple components at once
registerComponents(PaymentProcessor, [
  StripeProcessor,
  PayPalProcessor,
  ApplePayProcessor
]);

// Or register with string-based registry
registerComponents('custom-handlers', [
  CustomHandler1,
  CustomHandler2
], false); // Non-singleton
```

### Manual Component Access
Access components programmatically when needed:

```typescript
import { getComponent, getAllComponents, getSingletonComponentMap } from 'ts-component-registry';

// Get a specific component
const stripeProcessor = getComponent(PaymentProcessor, 'stripe');

// Get all components from a registry
const allProcessors = getAllComponents(PaymentProcessor);

// Get a SingletonComponentMap (same as @ComponentMap injection)
const processorMap = getSingletonComponentMap(PaymentProcessor);

// Check what's available
console.log('Available processors:', Array.from(allProcessors.keys()));
```

### Complex Key Types
Use any type as a component key:

```typescript
// String keys
@Component(UserHandler)
class UserHandler extends ComponentMapKey<string> {
  getComponentMapKey() { return 'user'; }
}

// Enum keys
@Component(DataProcessor)
class JSONProcessor extends ComponentMapKey<DataType> {
  getComponentMapKey() { return DataType.JSON; }
}

// Complex object keys
interface RouteKey {
  method: string;
  path: string;
  version: string;
}

@Component(APIRoute)
class UsersRoute extends ComponentMapKey<RouteKey> {
  getComponentMapKey() { 
    return { method: 'GET', path: '/api/users', version: 'v1' }; 
  }
}
```

### Singleton vs Non-Singleton
Control instance creation behavior:

```typescript
// Singleton (default) - same instance returned every time
@Component(CacheProvider)
class RedisCache extends CacheProvider {
  private connection: Redis;
  
  constructor() {
    super();
    this.connection = new Redis(); // Created once
  }
}

// Non-singleton - new instance every time
@Component(RequestHandler, false)
class HTTPRequestHandler extends RequestHandler {
  private requestId: string;
  
  constructor() {
    super();
    this.requestId = generateId(); // Unique per request
  }
}
```

## 🧪 Testing Guide

### Unit Testing
```typescript
import { DIContainer } from 'ts-component-registry';

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let mockProcessor: jest.Mocked<PaymentProcessor>;
  
  beforeEach(() => {
    // Clear all registries before each test
    DIContainer.getInstance().clearAll();
    
    // Create and register mock
    mockProcessor = {
      getComponentMapKey: jest.fn().mockReturnValue('stripe'),
      process: jest.fn().mockResolvedValue('mock payment processed')
    } as any;
    
    DIContainer.getInstance().registerComponent(
      'PaymentProcessor',
      () => mockProcessor
    );
    
    paymentService = new PaymentService();
  });
  
  it('should process payment using correct processor', async () => {
    const result = await paymentService.charge('stripe', 100);
    
    expect(mockProcessor.process).toHaveBeenCalledWith(100);
    expect(result).toBe('mock payment processed');
  });
});
```

### Integration Testing
```typescript
describe('PaymentService Integration', () => {
  beforeAll(async () => {
    // Use real components for integration tests
    await initializeComponentMaps(['dist/src']);
  });
  
  it('should discover all payment processors', () => {
    const container = DIContainer.getInstance();
    const registryNames = container.getRegistryNames();
    
    expect(registryNames).toContain('PaymentProcessor');
    
    const allProcessors = getAllComponents(PaymentProcessor);
    expect(allProcessors.size).toBeGreaterThan(0);
    expect(allProcessors.has('stripe')).toBe(true);
    expect(allProcessors.has('paypal')).toBe(true);
  });
  
  it('should process real payments', async () => {
    const paymentService = new PaymentService();
    const providers = paymentService.getAvailableProviders();
    
    expect(providers).toContain('stripe');
    expect(providers).toContain('paypal');
    
    // Test with real implementation
    const result = await paymentService.charge('stripe', 10.00);
    expect(result).toContain('Stripe');
  });
});
```

## 🔧 Framework Integration

### Express.js
```typescript
import express from 'express';
import { initializeComponentMaps, ComponentMap } from 'ts-component-registry';

abstract class RequestHandler extends ComponentMapKey<string> {
  abstract handle(req: express.Request, res: express.Response): Promise<void>;
}

class APIRouter {
  @ComponentMap(RequestHandler)
  private handlers!: Map<string, RequestHandler>;
  
  setupRoutes(app: express.Application) {
    app.use('/api/:resource/:action', async (req, res, next) => {
      const handlerKey = `${req.params.resource}:${req.params.action}`;
      const handler = this.handlers.get(handlerKey);
      
      if (handler) {
        await handler.handle(req, res);
      } else {
        res.status(404).json({ error: 'Endpoint not found' });
      }
    });
  }
}

// Initialize
async function startServer() {
  await initializeComponentMaps(['dist/src']);
  
  const app = express();
  const router = new APIRouter();
  router.setupRoutes(app);
  
  app.listen(3000);
}
```

### NestJS
```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ComponentMap, initializeComponentMaps } from 'ts-component-registry';

@Injectable()
export class PaymentService implements OnModuleInit {
  @ComponentMap(PaymentProcessor)
  private processors!: Map<string, PaymentProcessor>;
  
  async onModuleInit() {
    // Initialize ComponentMap in NestJS lifecycle
    await initializeComponentMaps(['dist/src']);
  }
  
  async processPayment(method: string, amount: number): Promise<string> {
    const processor = this.processors.get(method);
    if (!processor) {
      throw new BadRequestException(`Unsupported payment method: ${method}`);
    }
    return processor.process(amount);
  }
}
```

## 🛠️ Troubleshooting

### Common Issues

<details>
<summary><strong>❌ "reflect-metadata" must be imported</strong></summary>

**Problem:** Getting runtime errors about reflect-metadata

**Solution:** The library automatically imports reflect-metadata, but if you still have issues, ensure you're importing from the library:
```typescript
// ✅ Correct - automatic setup
import { Component, ComponentMap } from 'ts-component-registry';

```
</details>

<details>
<summary><strong>❌ Components not being discovered</strong></summary>

**Problem:** `@ComponentMap` injection returns empty map

**Solution:** Make sure you call `initializeComponentMaps()`:
```typescript
// ✅ Correct: Initialize before using services
await initializeComponentMaps(['dist/src']);

const service = new MyService(); // Now components are injected
```

**Debug:** Check what was discovered:
```typescript
import { DIContainer } from 'ts-component-registry';

const container = DIContainer.getInstance();
console.log('Registries:', container.getRegistryNames());
```
</details>

<details>
<summary><strong>❌ TypeScript compilation errors</strong></summary>

**Problem:** Decorator-related compilation errors

**Solution:** Update your `tsconfig.json`:
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "target": "ES2020",
    "lib": ["ES2020"]
  }
}
```
</details>

<details>
<summary><strong>❌ Components not found in production</strong></summary>

**Problem:** Works in development but not in production build

**Solution:** Scan the compiled JavaScript files:
```typescript
// Development
await initializeComponentMaps(['src']);

// Production
await initializeComponentMaps(['dist']);
```
</details>

## 📚 API Reference

### Core Classes

#### ComponentMapKey<K>
```typescript
abstract class ComponentMapKey<K> {
  abstract getComponentMapKey(): K;
}
```
Base class that all components must extend.

#### DIContainer
```typescript
class DIContainer {
  static getInstance(): DIContainer
  registerComponent<K>(registryName: string, constructor: Function, singleton?: boolean): void
  get<K, T>(registryName: string, key: K): T | undefined
  getAll<K, T>(registryName: string): Map<K, T>
  getSingletonComponentMap<K, T>(registryName: string): SingletonComponentMap<K, T>
  clearAll(): void
  getRegistryNames(): string[]
}
```

#### Logger
```typescript
class Logger {
  static getInstance(): Logger
  static configure(config: LoggerConfig): void
  setLevel(level: LogLevel): void
  enableColors(enable: boolean): void
  enableTimestamp(enable: boolean): void
  setPrefix(prefix: string): void
  debug(message: string, ...args: any[]): void
  info(message: string, ...args: any[]): void
  warn(message: string, ...args: any[]): void
  error(message: string, ...args: any[]): void
}
```

### Decorators

#### @Component()
```typescript
@Component(componentType: AbstractConstructor<T>, singleton?: boolean = true)
@Component(registryName: string, singleton?: boolean = true)
```

#### @ComponentMap()
```typescript
@ComponentMap(componentType: AbstractConstructor<T>)
@ComponentMap(registryName: string)
```

#### @InjectComponent()
```typescript
@InjectComponent(componentType: AbstractConstructor<T>, componentKey: K)
@InjectComponent(registryName: string, componentKey: K)
```

### Utility Functions

#### initializeComponentMaps()
```typescript
async function initializeComponentMaps(
  scanDirs?: string[],
  excludePatterns?: string[]
): Promise<void>
```

#### registerComponents()
```typescript
function registerComponents<K, V>(
  componentType: AbstractConstructor<V>,
  components: Array<Constructor<V>>,
  singleton?: boolean
): void
```

#### getComponent()
```typescript
function getComponent<K, T>(
  componentType: AbstractConstructor<T>,
  key: K
): T | undefined
```

#### getAllComponents()
```typescript
function getAllComponents<K, T>(
  componentType: AbstractConstructor<T>
): Map<K, T>
```

#### getSingletonComponentMap()
```typescript
function getSingletonComponentMap<K, T>(
  componentType: AbstractConstructor<T>
): SingletonComponentMap<K, T>
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
git clone https://github.com/IsmailKharoub/ts-component-registry
cd ts-component-registry
npm install
npm run build
npm test
```

### Running Tests
```bash
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 📄 License

MIT © [Ismail Kharoub](LICENSE)

---

<div align="center">
  <strong>Made with ❤️ for developers who hate boilerplate code</strong>
  <br>
  <br>
  <a href="https://github.com/IsmailKharoub/ts-component-registry">⭐ Star on GitHub</a> •
  <a href="https://npmjs.com/package/ts-component-registry">📦 NPM Package</a> •
  <a href="https://github.com/IsmailKharoub/ts-component-registry/issues">🐛 Report Bug</a> •
  <a href="https://github.com/IsmailKharoub/ts-component-registry/discussions">💬 Discussions</a>
</div> 