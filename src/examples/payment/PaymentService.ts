import { DIContainer } from '../../core/DIContainer';
import { PaymentProcessor, PaymentResult, RefundResult } from './PaymentProcessor';

/**
 * Payment service that uses auto-discovered payment processors
 * No manual registration needed - processors auto-register via @Component decorator
 */
export class PaymentService {
    private container = DIContainer.getInstance();
    
    /**
     * Process a payment using the specified provider
     */
    async processPayment(
        provider: string, 
        amount: number, 
        currency: string = 'USD'
    ): Promise<PaymentResult> {
        const processor = this.container.get<string, PaymentProcessor>('payment-processors', provider);
        
        if (!processor) {
            throw new Error(`Payment provider '${provider}' not found. Available: ${this.getAvailableProviders().join(', ')}`);
        }
        
        console.log(`🚀 Using ${provider} processor for payment`);
        return await processor.process(amount, currency);
    }
    
    /**
     * Validate payment data using the specified provider
     */
    async validatePayment(provider: string, paymentData: any): Promise<boolean> {
        const processor = this.container.get<string, PaymentProcessor>('payment-processors', provider);
        
        if (!processor) {
            throw new Error(`Payment provider '${provider}' not found`);
        }
        
        return await processor.validatePayment(paymentData);
    }
    
    /**
     * Process a refund using the specified provider
     */
    async processRefund(
        provider: string, 
        transactionId: string, 
        amount: number
    ): Promise<RefundResult> {
        const processor = this.container.get<string, PaymentProcessor>('payment-processors', provider);
        
        if (!processor) {
            throw new Error(`Payment provider '${provider}' not found`);
        }
        
        console.log(`🔄 Using ${provider} processor for refund`);
        return await processor.refund(transactionId, amount);
    }
    
    /**
     * Get all available payment providers (auto-discovered)
     */
    getAvailableProviders(): string[] {
        return this.container.getKeys<string>('payment-processors');
    }
    
    /**
     * Get all payment processors (useful for bulk operations)
     */
    getAllProcessors(): Map<string, PaymentProcessor> {
        return this.container.getAll<string, PaymentProcessor>('payment-processors');
    }
    
    /**
     * Get registry statistics
     */
    getStats() {
        const info = this.container.getRegistryInfo('payment-processors');
        return {
            totalProcessors: info?.size || 0,
            availableProviders: info?.keys || [],
            registryName: info?.name || 'payment-processors'
        };
    }
    
    /**
     * Process multiple payments in parallel
     */
    async processMultiplePayments(payments: Array<{
        provider: string;
        amount: number;
        currency?: string;
    }>): Promise<PaymentResult[]> {
        console.log(`🔄 Processing ${payments.length} payments in parallel...`);
        
        const paymentPromises = payments.map(payment => 
            this.processPayment(payment.provider, payment.amount, payment.currency)
        );
        
        return await Promise.all(paymentPromises);
    }
} 