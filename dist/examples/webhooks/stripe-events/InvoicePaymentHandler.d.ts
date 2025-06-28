import { StripeEventHandler, StripeEventResult } from '../StripeEventHandler';
/**
 * Handles Stripe invoice.payment_succeeded events
 */
export declare class InvoicePaymentHandler extends StripeEventHandler {
    getEventType(): string;
    processStripeEvent(eventData: any): Promise<StripeEventResult>;
    private updateSubscriptionStatus;
    private generateReceipt;
    private updateAccountingSystem;
    private renewServiceAccess;
    private sendInvoiceConfirmation;
    private calculateNextInvoiceDate;
    private calculateServiceEnd;
}
//# sourceMappingURL=InvoicePaymentHandler.d.ts.map