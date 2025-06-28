import { WebhookEventHandler, WebhookEventResult } from '../WebhookEventHandler';
/**
 * Stripe Payment Succeeded Event Handler
 * Handles stripe:payment_intent.succeeded events
 */
export declare class StripePaymentSucceededHandler extends WebhookEventHandler {
    getProvider(): string;
    getEventType(): string;
    processEvent(eventData: any, metadata?: any): Promise<WebhookEventResult>;
    private updateCustomerBalance;
    private sendPaymentConfirmation;
    private updateAnalytics;
    private simulateProcessing;
}
//# sourceMappingURL=StripePaymentSucceededHandler.d.ts.map