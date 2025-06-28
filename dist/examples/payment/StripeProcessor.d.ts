import { PaymentProcessor, PaymentResult, RefundResult } from './PaymentProcessor';
/**
 * Stripe payment processor with auto-registration
 */
export declare class StripeProcessor extends PaymentProcessor {
    getComponentMapKey(): string;
    process(amount: number, currency: string): Promise<PaymentResult>;
    validatePayment(paymentData: any): Promise<boolean>;
    refund(transactionId: string, amount: number): Promise<RefundResult>;
    private simulateDelay;
}
//# sourceMappingURL=StripeProcessor.d.ts.map