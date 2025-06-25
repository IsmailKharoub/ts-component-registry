import { ComponentMapKey } from '../../core/ComponentMapKey';

/**
 * Payment processor interface
 */
export interface PaymentProcessor extends ComponentMapKey<string> {
    process(amount: number, currency: string): Promise<PaymentResult>;
    validatePayment(paymentData: any): Promise<boolean>;
    refund(transactionId: string, amount: number): Promise<RefundResult>;
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