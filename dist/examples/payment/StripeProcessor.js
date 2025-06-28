"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeProcessor = void 0;
const ComponentMapDecorators_1 = require("../../decorators/ComponentMapDecorators");
const PaymentProcessor_1 = require("./PaymentProcessor");
/**
 * Stripe payment processor with auto-registration
 */
let StripeProcessor = class StripeProcessor extends PaymentProcessor_1.PaymentProcessor {
    getComponentMapKey() {
        return 'stripe';
    }
    async process(amount, currency) {
        console.log(`💳 Processing $${amount} ${currency.toUpperCase()} payment via Stripe...`);
        // Simulate Stripe API call
        await this.simulateDelay(500);
        return {
            transactionId: `stripe_tx_${Date.now()}`,
            status: 'success',
            amount,
            currency,
            fees: amount * 0.029 + 0.30, // Stripe's standard fee
            timestamp: new Date()
        };
    }
    async validatePayment(paymentData) {
        console.log('🔍 Validating Stripe payment data...');
        // Simulate validation logic
        await this.simulateDelay(200);
        return paymentData && paymentData.cardNumber && paymentData.expiryDate;
    }
    async refund(transactionId, amount) {
        console.log(`💸 Processing refund for ${transactionId}: $${amount}`);
        // Simulate Stripe refund API call
        await this.simulateDelay(300);
        return {
            refundId: `stripe_refund_${Date.now()}`,
            originalTransactionId: transactionId,
            amount,
            status: 'success',
            timestamp: new Date()
        };
    }
    async simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
exports.StripeProcessor = StripeProcessor;
exports.StripeProcessor = StripeProcessor = __decorate([
    (0, ComponentMapDecorators_1.Component)(PaymentProcessor_1.PaymentProcessor)
], StripeProcessor);
//# sourceMappingURL=StripeProcessor.js.map