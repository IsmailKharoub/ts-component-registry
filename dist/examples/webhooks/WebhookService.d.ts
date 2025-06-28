import { WebhookHandler, WebhookResult } from './WebhookHandler';
/**
 * Configuration for webhook secrets by provider
 */
export interface WebhookSecrets {
    [provider: string]: string;
}
/**
 * Webhook processing statistics
 */
export interface WebhookStats {
    totalHandlers: number;
    supportedProviders: string[];
    processedWebhooks: number;
    validationFailures: number;
    processingErrors: number;
    averageProcessingTime: number;
    handlerStats: Record<string, {
        processed: number;
        errors: number;
        totalTime: number;
        averageTime: number;
    }>;
}
/**
 * Main webhook service that auto-discovers and routes webhooks
 * Uses the type-driven ComponentMap to find all webhook handlers automatically
 */
export declare class WebhookService {
    private handlers;
    private secrets;
    private stats;
    /**
     * Configure webhook secrets for validation
     */
    configureSecrets(secrets: WebhookSecrets): void;
    /**
     * Process an incoming webhook
     * Automatically routes to the appropriate handler based on source
     */
    processWebhook(source: string, rawPayload: any, options?: {
        validateSignature?: boolean;
        requireValidation?: boolean;
        fallbackToGeneric?: boolean;
    }): Promise<WebhookResult>;
    /**
     * Process multiple webhooks in parallel
     */
    processWebhooksBatch(webhooks: Array<{
        source: string;
        payload: any;
        options?: {
            validateSignature?: boolean;
            requireValidation?: boolean;
            fallbackToGeneric?: boolean;
        };
    }>): Promise<WebhookResult[]>;
    /**
     * Get available webhook handlers and their supported events
     */
    getAvailableHandlers(): Record<string, string[]>;
    /**
     * Check if a handler can process a specific event type
     */
    canHandleEvent(source: string, eventType: string): boolean;
    /**
     * Get webhook processing statistics
     */
    getStats(): WebhookStats;
    /**
     * Reset statistics
     */
    resetStats(): void;
    /**
     * Get a specific webhook handler by source
     */
    getHandler(source: string): WebhookHandler | undefined;
    /**
     * Get all webhook handlers
     */
    getAllHandlers(): Map<string, WebhookHandler>;
    /**
     * Get detailed information about registered handlers
     */
    getHandlerInfo(): Array<{
        source: string;
        supportedEvents: string[];
        canHandleAll: boolean;
        processingStats: {
            processed: number;
            errors: number;
            averageTime: number;
        };
    }>;
    /**
     * Find the best handler for a webhook source
     */
    private getHandlerForSource;
    /**
     * Update processing statistics
     */
    private updateStats;
    /**
     * Initialize statistics structure
     */
    private initializeStats;
    /**
     * Update handler count in stats (call this after component discovery)
     */
    updateHandlerCount(): void;
}
//# sourceMappingURL=WebhookService.d.ts.map