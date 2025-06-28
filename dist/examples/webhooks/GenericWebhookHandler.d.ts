import { WebhookHandler, WebhookPayload, WebhookResult, WebhookValidation } from './WebhookHandler';
/**
 * Generic webhook handler that can process any webhook
 * Useful as a fallback handler or for custom/unknown webhook sources
 */
export declare class GenericWebhookHandler extends WebhookHandler {
    getComponentMapKey(): string;
    getSupportedEvents(): string[];
    validateWebhook(payload: WebhookPayload, secret: string): Promise<WebhookValidation>;
    processWebhook(payload: WebhookPayload): Promise<WebhookResult>;
    transformPayload(rawPayload: any): WebhookPayload;
    /**
     * Analyze the webhook payload to extract useful information
     */
    private analyzePayload;
    /**
     * Extract common fields that might be present in any webhook
     */
    private extractCommonFields;
    private countNestedObjects;
    private countArrayFields;
    private countStringFields;
    /**
     * Estimate the importance/priority of this webhook based on content
     */
    private estimateImportance;
    private simulateDelay;
}
//# sourceMappingURL=GenericWebhookHandler.d.ts.map