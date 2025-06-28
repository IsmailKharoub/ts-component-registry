import { FallbackEventHandler, WebhookEventResult } from '../WebhookEventHandler';
/**
 * Generic Fallback Event Handler
 * Handles any webhook event when no specific handler is found
 * Key format: "generic:*"
 */
export declare class GenericFallbackHandler extends FallbackEventHandler {
    getProvider(): string;
    canHandleProvider(provider: string): boolean;
    canProcessEvent(provider: string, eventType: string): boolean;
    processEvent(eventData: any, metadata?: any): Promise<WebhookEventResult>;
    private analyzeEventData;
    private countNestedObjects;
    private countArrayFields;
    private estimateImportance;
    private extractCommonInfo;
    private logEventForAnalytics;
    private checkForAlerts;
    private storeEventData;
    private getProcessingRecommendation;
    private simulateProcessing;
}
//# sourceMappingURL=GenericFallbackHandler.d.ts.map