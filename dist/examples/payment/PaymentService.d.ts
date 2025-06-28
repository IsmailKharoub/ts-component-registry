import { PaymentProcessor, PaymentResult, RefundResult } from './PaymentProcessor';
/**
 * Payment service that uses auto-discovered payment processors
 * No manual registration needed - processors auto-register via @Component decorator
 */
export declare class PaymentService {
    /**
     * Process a payment using the specified provider
     */
    processPayment(provider: string, amount: number, currency?: string): Promise<PaymentResult>;
    /**
     * Validate payment data using the specified provider
     */
    validatePayment(provider: string, paymentData: any): Promise<boolean>;
    /**
     * Process a refund using the specified provider
     */
    processRefund(provider: string, transactionId: string, amount: number): Promise<RefundResult>;
    /**
     * Get all available payment providers (auto-discovered)
     */
    getAvailableProviders(): string[];
    /**
     * Get all payment processors (useful for bulk operations)
     */
    getAllProcessors(): Map<string, PaymentProcessor>;
    /**
     * Get registry statistics
     */
    getStats(): {
        totalProcessors: number;
        availableProviders: string[];
        registryName: string;
    };
    /**
     * Process multiple payments in parallel
     */
    processMultiplePayments(payments: Array<{
        provider: string;
        amount: number;
        currency?: string;
    }>): Promise<PaymentResult[]>;
}
//# sourceMappingURL=PaymentService.d.ts.map