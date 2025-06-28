import { WebhookEventResult } from './WebhookEventHandler';
/**
 * Enhanced webhook processing statistics with nested handler tracking
 */
export interface EnhancedWebhookStats {
    totalHandlers: number;
    handlersByProvider: Record<string, number>;
    eventTypesCovered: Record<string, string[]>;
    processedEvents: number;
    processingErrors: number;
    averageProcessingTime: number;
    eventStats: Record<string, {
        processed: number;
        errors: number;
        totalTime: number;
        averageTime: number;
        lastProcessed?: Date;
    }>;
    providerStats: Record<string, {
        totalEvents: number;
        errorRate: number;
        averageTime: number;
        topEvents: Array<{
            eventType: string;
            count: number;
        }>;
    }>;
}
/**
 * Enhanced webhook service using nested ComponentMap for event-specific handlers
 * Showcases provider:event_type -> handler mapping with automatic discovery
 */
export declare class EnhancedWebhookService {
    private eventHandlers;
    private stats;
    /**
     * Process a webhook event using the nested handler structure
     */
    processWebhookEvent(provider: string, eventType: string, eventData: any, metadata?: any): Promise<WebhookEventResult>;
    /**
     * Process multiple events in parallel with detailed routing
     */
    processEventsBatch(events: Array<{
        provider: string;
        eventType: string;
        eventData: any;
        metadata?: any;
    }>): Promise<WebhookEventResult[]>;
    /**
     * Get the appropriate handler for a provider:event combination
     */
    private getEventHandler;
    /**
     * Get detailed information about all registered event handlers
     */
    getHandlerMapping(): Record<string, {
        handlerClass: string;
        provider: string;
        eventType: string;
        isSpecific: boolean;
        isFallback: boolean;
        processingStats?: any;
    }>;
    /**
     * Get enhanced processing statistics
     */
    getEnhancedStats(): EnhancedWebhookStats;
    /**
     * Get handler coverage report
     */
    getHandlerCoverage(): {
        totalHandlers: number;
        specificHandlers: number;
        fallbackHandlers: number;
        providerCoverage: Record<string, {
            specificEvents: string[];
            hasFallback: boolean;
            coverage: string;
        }>;
    };
    /**
     * Simulate webhook events to test the handler system
     */
    simulateWebhookEvents(): Promise<void>;
    /**
     * Update handler count after component discovery
     */
    updateHandlerCount(): void;
    private groupEventsByHandler;
    private updateEventStats;
    private recalculateProviderStats;
    private calculateHandlersByProvider;
    private calculateEventTypesCovered;
    private initializeStats;
}
//# sourceMappingURL=EnhancedWebhookService.d.ts.map