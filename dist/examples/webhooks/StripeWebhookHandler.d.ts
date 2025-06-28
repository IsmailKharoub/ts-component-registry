import { WebhookHandler, WebhookPayload, WebhookResult, WebhookValidation } from './WebhookHandler';
/**
 * Enhanced Stripe webhook handler with nested ComponentMap
 * Uses ComponentMap internally to manage event-specific handlers
 * Showcases the nested ComponentMap pattern
 */
export declare class StripeWebhookHandler extends WebhookHandler {
    private eventHandlers;
    getComponentMapKey(): string;
    getSupportedEvents(): string[];
    validateWebhook(payload: WebhookPayload, secret: string): Promise<WebhookValidation>;
    processWebhook(payload: WebhookPayload): Promise<WebhookResult>;
    transformPayload(rawPayload: any): WebhookPayload;
    /**
     * Get detailed information about nested event handlers
     */
    getEventHandlerInfo(): Array<{
        eventType: string;
        handlerClass: string;
        description: string;
    }>;
    /**
     * Check if a specific event type is supported
     */
    supportsEventType(eventType: string): boolean;
    /**
     * Get statistics about the nested ComponentMap
     */
    getNestedComponentMapStats(): {
        totalEventHandlers: number;
        supportedEventTypes: string[];
        handlerDetails: Array<{
            eventType: string;
            handlerName: string;
        }>;
    };
    /**
     * Generic processing for unsupported Stripe events
     */
    private processGenericStripeEvent;
    private simulateDelay;
}
//# sourceMappingURL=StripeWebhookHandler.d.ts.map