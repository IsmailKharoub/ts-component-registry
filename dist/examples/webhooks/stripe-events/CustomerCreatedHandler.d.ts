import { StripeEventHandler, StripeEventResult } from '../StripeEventHandler';
/**
 * Handles Stripe customer.created events
 */
export declare class CustomerCreatedHandler extends StripeEventHandler {
    getEventType(): string;
    processStripeEvent(eventData: any): Promise<StripeEventResult>;
    private createCustomerProfile;
    private setupDefaultPreferences;
    private sendWelcomeEmail;
    private initializeRewardPoints;
    private scheduleFollowUp;
}
//# sourceMappingURL=CustomerCreatedHandler.d.ts.map