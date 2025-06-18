import { ComponentMapManager } from '../../core/ComponentMapManager';
import { ComponentRegistry } from '../../core/ComponentRegistry';
import { AnalyticsHandler, UserSignupAnalyticsHandler, TransactionCompletedAnalyticsHandler, DocumentUploadAnalyticsHandler } from './AnalyticsHandler';
import { AnalyticsEvent, AnalyticsDataDTO, UserInfo } from './types';

/**
 * Service that manages analytics processing using ComponentMap pattern
 * Demonstrates how ComponentMap can manage multiple handlers for different event types
 */
export class AnalyticsService {
    private readonly handlers: Map<AnalyticsEvent, AnalyticsHandler>;
    private readonly registryName = 'analyticsHandlers';
    
    constructor() {
        // Initialize registry and register handlers
        const registry = ComponentMapManager.getInstance()
            .getRegistry<AnalyticsEvent, AnalyticsHandler>(this.registryName);
        
        // Auto-register all available handlers
        this.registerHandlers(registry);
        
        // Get the populated map
        this.handlers = registry.getAll();
        
        console.log(`📈 AnalyticsService initialized with ${this.handlers.size} handlers:`);
        for (const [event, handler] of this.handlers) {
            console.log(`   - ${event}: ${handler.constructor.name}`);
        }
    }
    
    /**
     * Register all available analytics handlers
     */
    private registerHandlers(registry: ComponentRegistry<AnalyticsEvent, AnalyticsHandler>) {
        const handlerInstances = [
            new UserSignupAnalyticsHandler(),
            new TransactionCompletedAnalyticsHandler(),
            new DocumentUploadAnalyticsHandler()
        ];
        
        handlerInstances.forEach(handler => {
            registry.register(handler.getComponentMapKey(), handler);
        });
    }
    
    /**
     * Process an analytics event using the appropriate handler
     */
    async processEvent(event: AnalyticsEvent, data: AnalyticsDataDTO, userInfo: UserInfo): Promise<void> {
        const handler = this.handlers.get(event);
        if (!handler) {
            console.warn(`⚠️  No handler found for analytics event: ${event}`);
            return;
        }
        
        console.log(`\n🎯 Processing analytics event: ${event}`);
        await handler.handle(data, userInfo);
    }
    
    /**
     * Process multiple events in parallel
     */
    async processEvents(events: Array<{ event: AnalyticsEvent; data: AnalyticsDataDTO; userInfo: UserInfo }>): Promise<void> {
        console.log(`\n🔄 Processing ${events.length} analytics events in parallel...`);
        
        const promises = events.map(({ event, data, userInfo }) => 
            this.processEvent(event, data, userInfo)
        );
        
        await Promise.all(promises);
        console.log(`✅ All analytics events processed successfully`);
    }
    
    /**
     * Get all supported event types
     */
    getSupportedEvents(): AnalyticsEvent[] {
        return Array.from(this.handlers.keys());
    }
    
    /**
     * Check if an event type is supported
     */
    supportsEvent(event: AnalyticsEvent): boolean {
        return this.handlers.has(event);
    }
    
    /**
     * Get analytics statistics
     */
    getStats(): { totalHandlers: number; supportedEvents: AnalyticsEvent[] } {
        return {
            totalHandlers: this.handlers.size,
            supportedEvents: this.getSupportedEvents()
        };
    }
} 