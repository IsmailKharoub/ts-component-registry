import { ComponentMapKey } from '../../core/ComponentMapKey';
/**
 * Webhook event processing result
 */
export interface WebhookEventResult {
    success: boolean;
    handlerName: string;
    eventType: string;
    provider: string;
    processedAt: Date;
    responseData?: any;
    error?: string;
    executionTimeMs: number;
}
/**
 * Abstract webhook event handler class for specific event types
 * Each handler processes a specific event type for a specific provider
 * Key format: "provider:event_type" (e.g., "stripe:payment_intent.succeeded")
 */
export declare abstract class WebhookEventHandler extends ComponentMapKey<string> {
    /**
     * Get the webhook provider this handler supports (e.g., "stripe", "github")
     */
    abstract getProvider(): string;
    /**
     * Get the event type this handler supports (e.g., "payment_intent.succeeded", "push")
     */
    abstract getEventType(): string;
    /**
     * Process the specific webhook event
     */
    abstract processEvent(eventData: any, metadata?: any): Promise<WebhookEventResult>;
    /**
     * Get the component map key in format "provider:event_type"
     */
    getComponentMapKey(): string;
    /**
     * Validate if this handler can process the given provider and event type
     */
    canProcessEvent(provider: string, eventType: string): boolean;
    /**
     * Utility method to calculate execution time
     */
    protected withTiming<T>(operation: () => Promise<T>): Promise<{
        result: T;
        timeMs: number;
    }>;
    /**
     * Log event processing activity
     */
    protected log(level: 'info' | 'warn' | 'error', message: string, data?: any): void;
    /**
     * Create a standardized result object
     */
    protected createResult(success: boolean, responseData?: any, error?: string, executionTimeMs?: number): WebhookEventResult;
}
/**
 * Fallback event handler for unknown or unhandled events
 */
export declare abstract class FallbackEventHandler extends WebhookEventHandler {
    getEventType(): string;
    /**
     * Check if this fallback handler can process events for the given provider
     */
    abstract canHandleProvider(provider: string): boolean;
    canProcessEvent(provider: string, eventType: string): boolean;
}
//# sourceMappingURL=WebhookEventHandler.d.ts.map