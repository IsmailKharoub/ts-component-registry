"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const ComponentMapDecorators_1 = require("../../decorators/ComponentMapDecorators");
const PaymentProcessor_1 = require("./PaymentProcessor");
/**
 * Payment service that uses auto-discovered payment processors
 * No manual registration needed - processors auto-register via @Component decorator
 */
class PaymentService {
    /**
     * Process a payment using the specified provider
     */
    async processPayment(provider, amount, currency = 'USD') {
        const processor = (0, ComponentMapDecorators_1.getComponent)(PaymentProcessor_1.PaymentProcessor, provider);
        if (!processor) {
            throw new Error(`Payment provider '${provider}' not found. Available: ${this.getAvailableProviders().join(', ')}`);
        }
        console.log(`🚀 Using ${provider} processor for payment`);
        return await processor.process(amount, currency);
    }
    /**
     * Validate payment data using the specified provider
     */
    async validatePayment(provider, paymentData) {
        const processor = (0, ComponentMapDecorators_1.getComponent)(PaymentProcessor_1.PaymentProcessor, provider);
        if (!processor) {
            throw new Error(`Payment provider '${provider}' not found`);
        }
        return await processor.validatePayment(paymentData);
    }
    /**
     * Process a refund using the specified provider
     */
    async processRefund(provider, transactionId, amount) {
        const processor = (0, ComponentMapDecorators_1.getComponent)(PaymentProcessor_1.PaymentProcessor, provider);
        if (!processor) {
            throw new Error(`Payment provider '${provider}' not found`);
        }
        console.log(`🔄 Using ${provider} processor for refund`);
        return await processor.refund(transactionId, amount);
    }
    /**
     * Get all available payment providers (auto-discovered)
     */
    getAvailableProviders() {
        const processors = (0, ComponentMapDecorators_1.getAllComponents)(PaymentProcessor_1.PaymentProcessor);
        return Array.from(processors.keys());
    }
    /**
     * Get all payment processors (useful for bulk operations)
     */
    getAllProcessors() {
        return (0, ComponentMapDecorators_1.getAllComponents)(PaymentProcessor_1.PaymentProcessor);
    }
    /**
     * Get registry statistics
     */
    getStats() {
        const processors = (0, ComponentMapDecorators_1.getAllComponents)(PaymentProcessor_1.PaymentProcessor);
        return {
            totalProcessors: processors.size,
            availableProviders: Array.from(processors.keys()),
            registryName: PaymentProcessor_1.PaymentProcessor.name
        };
    }
    /**
     * Process multiple payments in parallel
     */
    async processMultiplePayments(payments) {
        console.log(`🔄 Processing ${payments.length} payments in parallel...`);
        const paymentPromises = payments.map(payment => this.processPayment(payment.provider, payment.amount, payment.currency));
        return await Promise.all(paymentPromises);
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=PaymentService.js.map