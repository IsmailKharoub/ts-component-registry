# ComponentMap: Porting from Spring Boot to TypeScript

## Table of Contents
1. [What is ComponentMap?](#what-is-componentmap)
2. [How ComponentMap Works](#how-componentmap-works)
3. [Examples from the Codebase](#examples-from-the-codebase)
4. [TypeScript Implementation Strategies](#typescript-implementation-strategies)
5. [Basic TypeScript Implementation](#basic-typescript-implementation)
6. [Advanced TypeScript Implementation with Decorators](#advanced-typescript-implementation-with-decorators)
7. [NestJS Implementation](#nestjs-implementation)
8. [Real-world Usage Examples](#real-world-usage-examples)
9. [Best Practices](#best-practices)

## What is ComponentMap?

**ComponentMap** is a Spring Boot library (`dev.krud:spring-componentmap`) that provides automatic dependency injection of maps of beans based on keys. It's essentially a sophisticated implementation of the **Strategy Pattern** that eliminates boilerplate code for managing collections of related services.

### Key Features:
- **Automatic Map Population**: Spring automatically discovers all beans implementing an interface and creates a map
- **Flexible Key Types**: Keys can be strings, enums, complex objects, or any type
- **Strategy Pattern**: Perfect for implementing strategy pattern without manual registration
- **Type Safety**: Full compile-time type checking
- **Zero Boilerplate**: No manual registration or configuration needed

### The Problem it Solves:
Instead of manually managing maps of handlers/providers/resolvers like this:

```kotlin
// Manual approach - lots of boilerplate
@Service 
class HandlerManager {
    private val handlers = mapOf(
        "type1" to handler1,
        "type2" to handler2,
        // ... manually add each handler
    )
}
```

ComponentMap automatically creates these maps for you:

```kotlin
// ComponentMap approach - zero boilerplate
@Service
class HandlerManager {
    @ComponentMap
    private lateinit var handlers: Map<String, Handler>
    // Map is automatically populated with all Handler implementations
}
```

## How ComponentMap Works

### Core Annotations:

1. **`@ComponentMapKey`**: Marks a method/property that returns the key for the component
2. **`@ComponentMap`**: Marks a field that should be injected with a map of components
3. **`ComponentMapPostProcessor`**: The Spring post-processor that handles the magic

### The Process:

1. **Discovery Phase**: Spring scans for all beans that implement interfaces with `@ComponentMapKey`
2. **Key Extraction**: For each bean, it calls the method/property marked with `@ComponentMapKey` to get the key
3. **Map Creation**: Creates a map where keys are the extracted values and values are the bean instances
4. **Injection**: Injects the populated map into fields marked with `@ComponentMap`

## Examples from the Codebase

### Simple String Key Example:
```kotlin
// Interface with key definition
interface PhoneVerificationProvider {
    @ComponentMapKey
    fun getType(): PhoneVerificationProviderType  // Enum key
    
    fun initiate(dto: InitiatePhoneVerificationDTO)
    fun complete(dto: CompletePhoneVerificationDTO, phone: String)
}

// Service that uses the map
@Service
class PhoneVerificationServiceImpl {
    @ComponentMap
    private lateinit var phoneVerificationProviderMap: Map<PhoneVerificationProviderType, PhoneVerificationProvider>
    
    fun initiate(dto: InitiatePhoneVerificationDTO) {
        val provider = phoneVerificationProviderMap[PhoneVerificationProviderType.TWILIO]
        provider?.initiate(dto)
    }
}
```

### Complex Key Example (Pair):
```kotlin
interface DeeplinkActionHandler {
    @ComponentMapKey
    fun getActionTypePair(): Pair<DeeplinkType, DeeplinkAction>  // Complex key
    
    fun handleAction(deeplink: Deeplink, userInfo: UserInfo)
}

// Usage
@ComponentMap
private lateinit var actionHandlers: Map<Pair<DeeplinkType, DeeplinkAction>, DeeplinkActionHandler>
```

### Property-based Key:
```kotlin
interface EntityDisplayResolver<T : AbstractEntity> {
    @get:ComponentMapKey
    val type: String  // Property as key
    
    val entityClazz: KClass<T>
    fun getDisplayRO(entity: T): EntityDisplayRO
}
```

### Multiple ComponentMaps:
```kotlin
@Service
class ConversationFlowManagerImpl {
    @ComponentMap
    private lateinit var flowResolvers: Map<ConversationFlowType, ConversationFlowResolver>

    @ComponentMap
    private lateinit var conversationActionHandlers: Map<ConversationActionTypes, ConversationActionHandler<ConversationAction>>

    @ComponentMap
    private lateinit var globalInputHandlers: Map<String, GlobalInputHandler>
}
```

## TypeScript Implementation Strategies

### Strategy 1: Simple Registry Pattern
Basic implementation without decorators - most straightforward for existing codebases.

### Strategy 2: Decorator-based Implementation  
More sophisticated approach using TypeScript decorators to mimic Spring's annotations.

### Strategy 3: NestJS Module
Leveraging NestJS's dependency injection system for a Spring-like experience.

## Basic TypeScript Implementation

### Core Registry Implementation:

```typescript
// ComponentRegistry.ts
export class ComponentRegistry<K, V> {
    private readonly components = new Map<K, V>();
    
    register(key: K, component: V): void {
        this.components.set(key, component);
    }
    
    get(key: K): V | undefined {
        return this.components.get(key);
    }
    
    getAll(): Map<K, V> {
        return new Map(this.components);
    }
    
    getKeys(): K[] {
        return Array.from(this.components.keys());
    }
}

// ComponentMapManager.ts
export class ComponentMapManager {
    private static instance: ComponentMapManager;
    private registries = new Map<string, ComponentRegistry<any, any>>();
    
    static getInstance(): ComponentMapManager {
        if (!ComponentMapManager.instance) {
            ComponentMapManager.instance = new ComponentMapManager();
        }
        return ComponentMapManager.instance;
    }
    
    getRegistry<K, V>(name: string): ComponentRegistry<K, V> {
        if (!this.registries.has(name)) {
            this.registries.set(name, new ComponentRegistry<K, V>());
        }
        return this.registries.get(name)!;
    }
}
```

### Interface Definition:

```typescript
// Define the interface with key extraction
export interface ComponentMapKey<K> {
    getComponentMapKey(): K;
}

// Example: Phone Verification Provider
export enum PhoneVerificationProviderType {
    TWILIO = 'TWILIO',
    AWS_SNS = 'AWS_SNS'
}

export interface PhoneVerificationProvider extends ComponentMapKey<PhoneVerificationProviderType> {
    initiate(dto: InitiatePhoneVerificationDTO): Promise<void>;
    complete(dto: CompletePhoneVerificationDTO, phone: string): Promise<void>;
}
```

### Implementation:

```typescript
// TwilioPhoneVerificationProvider.ts
export class TwilioPhoneVerificationProvider implements PhoneVerificationProvider {
    getComponentMapKey(): PhoneVerificationProviderType {
        return PhoneVerificationProviderType.TWILIO;
    }
    
    async initiate(dto: InitiatePhoneVerificationDTO): Promise<void> {
        // Twilio implementation
        console.log('Initiating verification via Twilio');
    }
    
    async complete(dto: CompletePhoneVerificationDTO, phone: string): Promise<void> {
        // Twilio implementation
        console.log('Completing verification via Twilio');
    }
}

// AWSPhoneVerificationProvider.ts
export class AWSPhoneVerificationProvider implements PhoneVerificationProvider {
    getComponentMapKey(): PhoneVerificationProviderType {
        return PhoneVerificationProviderType.AWS_SNS;
    }
    
    async initiate(dto: InitiatePhoneVerificationDTO): Promise<void> {
        // AWS SNS implementation
        console.log('Initiating verification via AWS SNS');
    }
    
    async complete(dto: CompletePhoneVerificationDTO, phone: string): Promise<void> {
        // AWS SNS implementation  
        console.log('Completing verification via AWS SNS');
    }
}
```

### Service Using ComponentMap:

```typescript
// PhoneVerificationService.ts
export class PhoneVerificationService {
    private readonly providers: Map<PhoneVerificationProviderType, PhoneVerificationProvider>;
    
    constructor() {
        // Initialize registry and register providers
        const registry = ComponentMapManager.getInstance()
            .getRegistry<PhoneVerificationProviderType, PhoneVerificationProvider>('phoneVerificationProviders');
        
        // Auto-register providers (could be done via initialization)
        this.registerProviders(registry);
        
        this.providers = registry.getAll();
    }
    
    private registerProviders(registry: ComponentRegistry<PhoneVerificationProviderType, PhoneVerificationProvider>) {
        const providerInstances = [
            new TwilioPhoneVerificationProvider(),
            new AWSPhoneVerificationProvider()
        ];
        
        providerInstances.forEach(provider => {
            registry.register(provider.getComponentMapKey(), provider);
        });
    }
    
    async initiate(dto: InitiatePhoneVerificationDTO): Promise<void> {
        const provider = this.providers.get(PhoneVerificationProviderType.TWILIO);
        if (!provider) {
            throw new Error('Phone verification provider not found');
        }
        
        await provider.initiate(dto);
    }
}
```

## Advanced TypeScript Implementation with Decorators

### Decorator Definitions:

```typescript
// decorators.ts
import 'reflect-metadata';

const COMPONENT_MAP_KEY_METADATA = Symbol('componentMapKey');
const COMPONENT_MAP_METADATA = Symbol('componentMap');

// Decorator for marking key methods
export function ComponentMapKey<T>(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(COMPONENT_MAP_KEY_METADATA, propertyKey, target.constructor);
}

// Decorator for marking properties to be injected with component maps
export function ComponentMap<K, V>(registryName: string) {
    return function(target: any, propertyKey: string) {
        Reflect.defineMetadata(COMPONENT_MAP_METADATA, { registryName, propertyKey }, target.constructor);
    };
}

// Auto-registration decorator for components
export function Component<K>(registryName: string) {
    return function<T extends ComponentMapKey<K>>(constructor: new (...args: any[]) => T) {
        // Register the component automatically
        const instance = new constructor();
        const key = instance.getComponentMapKey();
        
        const registry = ComponentMapManager.getInstance().getRegistry<K, T>(registryName);
        registry.register(key, instance);
    };
}
```

### Using Decorators:

```typescript
// With decorators
export interface PhoneVerificationProvider extends ComponentMapKey<PhoneVerificationProviderType> {
    @ComponentMapKey
    getComponentMapKey(): PhoneVerificationProviderType;
    
    initiate(dto: InitiatePhoneVerificationDTO): Promise<void>;
    complete(dto: CompletePhoneVerificationDTO, phone: string): Promise<void>;
}

@Component<PhoneVerificationProviderType>('phoneVerificationProviders')
export class TwilioPhoneVerificationProvider implements PhoneVerificationProvider {
    @ComponentMapKey
    getComponentMapKey(): PhoneVerificationProviderType {
        return PhoneVerificationProviderType.TWILIO;
    }
    
    // ... implementation
}

export class PhoneVerificationService {
    @ComponentMap<PhoneVerificationProviderType, PhoneVerificationProvider>('phoneVerificationProviders')
    private providers!: Map<PhoneVerificationProviderType, PhoneVerificationProvider>;
    
    constructor() {
        // Initialize component maps
        this.initializeComponentMaps();
    }
    
    private initializeComponentMaps() {
        const registry = ComponentMapManager.getInstance()
            .getRegistry<PhoneVerificationProviderType, PhoneVerificationProvider>('phoneVerificationProviders');
        this.providers = registry.getAll();
    }
}
```

## NestJS Implementation

NestJS provides the closest experience to Spring Boot's dependency injection:

### Module Definition:

```typescript
// phone-verification.module.ts
import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

@Module({
    imports: [DiscoveryModule],
    providers: [
        PhoneVerificationService,
        TwilioPhoneVerificationProvider,
        AWSPhoneVerificationProvider,
        ComponentMapService,
    ],
    exports: [PhoneVerificationService],
})
export class PhoneVerificationModule {}
```

### ComponentMap Service:

```typescript
// component-map.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';

@Injectable()
export class ComponentMapService implements OnModuleInit {
    constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly metadataScanner: MetadataScanner,
    ) {}
    
    async onModuleInit() {
        await this.buildComponentMaps();
    }
    
    private async buildComponentMaps() {
        const providers = this.discoveryService.getProviders();
        
        for (const provider of providers) {
            if (!provider.instance) continue;
            
            const prototype = Object.getPrototypeOf(provider.instance);
            const keyMethod = this.findComponentMapKeyMethod(prototype);
            
            if (keyMethod && typeof provider.instance[keyMethod] === 'function') {
                const key = provider.instance[keyMethod]();
                const registryName = this.getRegistryName(provider.instance.constructor);
                
                if (registryName) {
                    const registry = ComponentMapManager.getInstance().getRegistry(registryName);
                    registry.register(key, provider.instance);
                }
            }
        }
    }
    
    private findComponentMapKeyMethod(prototype: any): string | null {
        return Reflect.getMetadata(COMPONENT_MAP_KEY_METADATA, prototype.constructor);
    }
    
    private getRegistryName(constructor: any): string | null {
        return Reflect.getMetadata('registryName', constructor);
    }
}
```

### Usage in NestJS:

```typescript
// phone-verification.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PhoneVerificationService implements OnModuleInit {
    private providers: Map<PhoneVerificationProviderType, PhoneVerificationProvider> = new Map();
    
    onModuleInit() {
        const registry = ComponentMapManager.getInstance()
            .getRegistry<PhoneVerificationProviderType, PhoneVerificationProvider>('phoneVerificationProviders');
        this.providers = registry.getAll();
    }
    
    async initiate(dto: InitiatePhoneVerificationDTO): Promise<void> {
        const provider = this.providers.get(PhoneVerificationProviderType.TWILIO);
        if (!provider) {
            throw new Error('Provider not found');
        }
        await provider.initiate(dto);
    }
}
```

## Real-world Usage Examples

### 1. Analytics Handlers (Complex Key)

```typescript
// AnalyticsEvent types
export enum AnalyticsEvent {
    USER_SIGNUP = 'USER_SIGNUP',
    TRANSACTION_COMPLETED = 'TRANSACTION_COMPLETED',
    DOCUMENT_UPLOADED = 'DOCUMENT_UPLOADED'
}

export enum AnalyticsDataType {
    BUSINESS = 'BUSINESS',
    USER = 'USER',
    TRANSACTION = 'TRANSACTION'
}

export interface AnalyticsHandler extends ComponentMapKey<AnalyticsEvent> {
    handle(data: AnalyticsDataDTO, userInfo: UserInfo): Promise<void>;
}

// Implementation
export class UserSignupAnalyticsHandler implements AnalyticsHandler {
    getComponentMapKey(): AnalyticsEvent {
        return AnalyticsEvent.USER_SIGNUP;
    }
    
    async handle(data: AnalyticsDataDTO, userInfo: UserInfo): Promise<void> {
        // Handle user signup analytics
        console.log(`Processing user signup analytics for user ${userInfo.userId}`);
    }
}

// Service
export class AnalyticsService {
    private handlers: Map<AnalyticsEvent, AnalyticsHandler>;
    
    constructor() {
        const registry = ComponentMapManager.getInstance()
            .getRegistry<AnalyticsEvent, AnalyticsHandler>('analyticsHandlers');
        this.handlers = registry.getAll();
    }
    
    async processEvent(event: AnalyticsEvent, data: AnalyticsDataDTO, userInfo: UserInfo): Promise<void> {
        const handler = this.handlers.get(event);
        if (!handler) {
            throw new Error(`No handler found for analytics event: ${event}`);
        }
        
        await handler.handle(data, userInfo);
    }
}
```

### 2. Document Analysis Handlers

```typescript
export enum DocumentAnalysisType {
    OCR = 'OCR',
    AI_ANALYSIS = 'AI_ANALYSIS',
    METADATA_EXTRACTION = 'METADATA_EXTRACTION'
}

export interface DocumentAnalysisHandler extends ComponentMapKey<DocumentAnalysisType> {
    analyzeDocument(fileBytes: Uint8Array, mimeType: string, prompt?: string): Promise<string | null>;
}

export class OCRDocumentAnalysisHandler implements DocumentAnalysisHandler {
    getComponentMapKey(): DocumentAnalysisType {
        return DocumentAnalysisType.OCR;
    }
    
    async analyzeDocument(fileBytes: Uint8Array, mimeType: string, prompt?: string): Promise<string | null> {
        // OCR implementation
        console.log('Performing OCR analysis');
        return 'OCR extracted text';
    }
}

export class DocumentAnalysisManager {
    private services: Map<DocumentAnalysisType, DocumentAnalysisHandler>;
    
    constructor() {
        const registry = ComponentMapManager.getInstance()
            .getRegistry<DocumentAnalysisType, DocumentAnalysisHandler>('documentAnalysisHandlers');
        this.services = registry.getAll();
    }
    
    async analyzeDocument(fileBytes: Uint8Array, mimeType: string, prompt?: string): Promise<string | null> {
        if (this.services.size === 0) {
            console.log('No document analysis handlers available');
            return null;
        }
        
        const service = this.services.values().next().value;
        if (!service) {
            console.log('No document analysis handler available');
            return null;
        }
        
        console.log(`Using document analysis handler: ${service.getComponentMapKey()}`);
        return service.analyzeDocument(fileBytes, mimeType, prompt);
    }
}
```

### 3. Conversation Action Handlers

```typescript
export enum ConversationActionType {
    SAY = 'SAY',
    ASK = 'ASK',
    MENU = 'MENU',
    PROCESS_STATE = 'PROCESS_STATE'
}

export interface ConversationAction {
    actionType: ConversationActionType;
    data?: any;
}

export interface ConversationActionHandler<T extends ConversationAction> extends ComponentMapKey<ConversationActionType> {
    handle(context: ConversationContext, action: T): Promise<void>;
}

export class SayConversationActionHandler implements ConversationActionHandler<ConversationAction> {
    getComponentMapKey(): ConversationActionType {
        return ConversationActionType.SAY;
    }
    
    async handle(context: ConversationContext, action: ConversationAction): Promise<void> {
        console.log(`Saying: ${action.data?.message}`);
        // Implementation for SAY action
    }
}

export class ConversationFlowManager {
    private conversationActionHandlers: Map<ConversationActionType, ConversationActionHandler<ConversationAction>>;
    
    constructor() {
        const registry = ComponentMapManager.getInstance()
            .getRegistry<ConversationActionType, ConversationActionHandler<ConversationAction>>('conversationActionHandlers');
        this.conversationActionHandlers = registry.getAll();
    }
    
    async executeActions(context: ConversationContext, actions: ConversationAction[]): Promise<void> {
        for (const action of actions) {
            const handler = this.conversationActionHandlers.get(action.actionType);
            if (!handler) {
                throw new Error(`Unsupported action type: ${action.actionType}`);
            }
            
            await handler.handle(context, action);
        }
    }
}
```

## Best Practices

### 1. Type Safety
```typescript
// Always use generics for type safety
interface Handler<K, V> extends ComponentMapKey<K> {
    process(data: V): Promise<void>;
}

// Registry should be strongly typed
const registry = ComponentMapManager.getInstance()
    .getRegistry<MyKeyType, MyHandlerType>('handlerRegistry');
```

### 2. Error Handling
```typescript
export class ServiceWithComponentMap {
    private handlers: Map<KeyType, HandlerType>;
    
    constructor() {
        this.handlers = this.initializeHandlers();
    }
    
    private initializeHandlers(): Map<KeyType, HandlerType> {
        try {
            const registry = ComponentMapManager.getInstance()
                .getRegistry<KeyType, HandlerType>('handlers');
            const map = registry.getAll();
            
            if (map.size === 0) {
                console.warn('No handlers found in registry');
            }
            
            return map;
        } catch (error) {
            console.error('Failed to initialize handlers:', error);
            return new Map();
        }
    }
    
    public async process(key: KeyType, data: any): Promise<void> {
        const handler = this.handlers.get(key);
        if (!handler) {
            throw new Error(`No handler found for key: ${key}`);
        }
        
        await handler.process(data);
    }
}
```

### 3. Lazy Initialization
```typescript
export class LazyComponentMapService {
    private _handlers?: Map<KeyType, HandlerType>;
    
    private get handlers(): Map<KeyType, HandlerType> {
        if (!this._handlers) {
            const registry = ComponentMapManager.getInstance()
                .getRegistry<KeyType, HandlerType>('handlers');
            this._handlers = registry.getAll();
        }
        return this._handlers;
    }
    
    public process(key: KeyType): void {
        const handler = this.handlers.get(key);
        handler?.process();
    }
}
```

### 4. Testing
```typescript
// Mock component map for testing
describe('ServiceWithComponentMap', () => {
    beforeEach(() => {
        // Clear registry before each test
        ComponentMapManager.getInstance()['registries'].clear();
    });
    
    it('should handle requests correctly', async () => {
        // Set up test registry
        const registry = ComponentMapManager.getInstance()
            .getRegistry<KeyType, HandlerType>('handlers');
        
        const mockHandler = {
            getComponentMapKey: () => KeyType.TEST,
            process: jest.fn()
        };
        
        registry.register(KeyType.TEST, mockHandler);
        
        const service = new ServiceWithComponentMap();
        await service.process(KeyType.TEST, {});
        
        expect(mockHandler.process).toHaveBeenCalled();
    });
});
```

### 5. Documentation
```typescript
/**
 * Registry for document analysis handlers.
 * 
 * Handlers are automatically discovered and registered based on their
 * ComponentMapKey implementation. Each handler should return a unique
 * DocumentAnalysisType from getComponentMapKey().
 * 
 * @example
 * ```typescript
 * class MyAnalysisHandler implements DocumentAnalysisHandler {
 *   getComponentMapKey(): DocumentAnalysisType {
 *     return DocumentAnalysisType.CUSTOM;
 *   }
 * }
 * ```
 */
export const DOCUMENT_ANALYSIS_REGISTRY = 'documentAnalysisHandlers';
```

## Conclusion

ComponentMap is a powerful pattern for implementing the Strategy pattern with minimal boilerplate. The TypeScript implementations shown here provide similar functionality to the Spring Boot version, with varying levels of sophistication:

1. **Basic Registry**: Simple, explicit, works everywhere
2. **Decorator-based**: More Spring-like, requires experimental decorators
3. **NestJS**: Most Spring-like experience with full DI integration

Choose the approach that best fits your existing architecture and team preferences. The NestJS approach is recommended for new projects, while the basic registry approach works well for adding ComponentMap patterns to existing codebases. 