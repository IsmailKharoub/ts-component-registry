import { PaymentProcessor, PaymentResult, RefundResult } from './PaymentProcessor';
/**
 * PayPal payment processor with auto-registration
 */
export declare class PayPalProcessor extends PaymentProcessor {
    getComponentMapKey(): string;
    process(amount: number, currency: string): Promise<PaymentResult>;
    validatePayment(paymentData: any): Promise<boolean>;
    refund(transactionId: string, amount: number): Promise<RefundResult>;
    private simulateDelay;
}
//# sourceMappingURL=PayPalProcessor.d.ts.map