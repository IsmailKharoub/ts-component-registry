import { ComponentMapKey } from '../../core/ComponentMapKey';
/**
 * Payment processor abstract class
 */
export declare abstract class PaymentProcessor extends ComponentMapKey<string> {
    abstract process(amount: number, currency: string): Promise<PaymentResult>;
    abstract validatePayment(paymentData: any): Promise<boolean>;
    abstract refund(transactionId: string, amount: number): Promise<RefundResult>;
}
/**
 * Payment result interface
 */
export interface PaymentResult {
    transactionId: string;
    status: 'success' | 'failed' | 'pending';
    amount: number;
    currency: string;
    fees: number;
    timestamp: Date;
}
/**
 * Refund result interface
 */
export interface RefundResult {
    refundId: string;
    originalTransactionId: string;
    amount: number;
    status: 'success' | 'failed' | 'pending';
    timestamp: Date;
}
//# sourceMappingURL=PaymentProcessor.d.ts.map