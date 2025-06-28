import { ComponentMapKey } from '../../core/ComponentMapKey';
/**
 * Generic webhook payload interface
 */
export interface WebhookPayload {
    id: string;
    type: string;
    data: any;
    timestamp: Date;
    source: string;
    signature?: string;
    metadata?: Record<string, any>;
}
/**
 * Webhook processing result
 */
export interface WebhookResult {
    success: boolean;
    handlerName: string;
    processedAt: Date;
    responseData?: any;
    error?: string;
    executionTimeMs: number;
}
/**
 * Webhook validation result
 */
export interface WebhookValidation {
    isValid: boolean;
    reason?: string;
    expectedSignature?: string;
    actualSignature?: string;
}
/**
 * Abstract webhook handler class
 * Extend this to create handlers for specific webhook providers
 */
export declare abstract class WebhookHandler extends ComponentMapKey<string> {
    /**
     * Validate the webhook payload and signature
     * Override this method to implement provider-specific validation
     */
    abstract validateWebhook(payload: WebhookPayload, secret: string): Promise<WebhookValidation>;
    /**
     * Process the webhook payload
     * Override this method to implement provider-specific processing logic
     */
    abstract processWebhook(payload: WebhookPayload): Promise<WebhookResult>;
    /**
     * Get the supported webhook event types for this handler
     * Override this method to specify which events this handler can process
     */
    abstract getSupportedEvents(): string[];
    /**
     * Check if this handler can process the given event type
     */
    canHandle(eventType: string): boolean;
    /**
     * Transform the raw webhook data into standardized WebhookPayload format
     * Override this method if the provider uses a different payload structure
     */
    transformPayload(rawPayload: any): WebhookPayload;
    /**
     * Generate a unique ID for webhooks that don't provide one
     */
    protected generateId(): string;
    /**
     * Utility method to calculate execution time
     */
    protected withTiming<T>(operation: () => Promise<T>): Promise<{
        result: T;
        timeMs: number;
    }>;
    /**
     * Log webhook processing activity
     */
    protected log(level: 'info' | 'warn' | 'error', message: string, data?: any): void;
}
//# sourceMappingURL=WebhookHandler.d.ts.map