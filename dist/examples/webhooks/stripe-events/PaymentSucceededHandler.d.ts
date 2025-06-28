import { StripeEventHandler, StripeEventResult } from '../StripeEventHandler';
/**
 * Handles Stripe payment_intent.succeeded events
 */
export declare class PaymentSucceededHandler extends StripeEventHandler {
    getEventType(): string;
    processStripeEvent(eventData: any): Promise<StripeEventResult>;
    private updateCustomerBalance;
    private sendPaymentConfirmation;
    private updateAnalytics;
    private triggerFulfillment;
}
//# sourceMappingURL=PaymentSucceededHandler.d.ts.map