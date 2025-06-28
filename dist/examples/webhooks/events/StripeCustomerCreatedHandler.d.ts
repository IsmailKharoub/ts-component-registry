import { WebhookEventHandler, WebhookEventResult } from '../WebhookEventHandler';
/**
 * Stripe Customer Created Event Handler
 * Handles stripe:customer.created events
 */
export declare class StripeCustomerCreatedHandler extends WebhookEventHandler {
    getProvider(): string;
    getEventType(): string;
    processEvent(eventData: any, metadata?: any): Promise<WebhookEventResult>;
    private createCustomerProfile;
    private setupDefaultPreferences;
    private sendWelcomeEmail;
    private initializeRewardPoints;
    private simulateProcessing;
}
//# sourceMappingURL=StripeCustomerCreatedHandler.d.ts.map