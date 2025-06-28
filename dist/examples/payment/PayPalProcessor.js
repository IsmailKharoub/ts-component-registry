"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayPalProcessor = void 0;
const ComponentMapDecorators_1 = require("../../decorators/ComponentMapDecorators");
const PaymentProcessor_1 = require("./PaymentProcessor");
/**
 * PayPal payment processor with auto-registration
 */
let PayPalProcessor = class PayPalProcessor extends PaymentProcessor_1.PaymentProcessor {
    getComponentMapKey() {
        return 'paypal';
    }
    async process(amount, currency) {
        console.log(`🟦 Processing $${amount} ${currency.toUpperCase()} payment via PayPal...`);
        // Simulate PayPal API call
        await this.simulateDelay(700);
        return {
            transactionId: `paypal_tx_${Date.now()}`,
            status: 'success',
            amount,
            currency,
            fees: amount * 0.034 + 0.49, // PayPal's standard fee
            timestamp: new Date()
        };
    }
    async validatePayment(paymentData) {
        console.log('🔍 Validating PayPal payment data...');
        // Simulate validation logic
        await this.simulateDelay(300);
        return paymentData && (paymentData.email || paymentData.phoneNumber);
    }
    async refund(transactionId, amount) {
        console.log(`💸 Processing PayPal refund for ${transactionId}: $${amount}`);
        // Simulate PayPal refund API call
        await this.simulateDelay(400);
        return {
            refundId: `paypal_refund_${Date.now()}`,
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
exports.PayPalProcessor = PayPalProcessor;
exports.PayPalProcessor = PayPalProcessor = __decorate([
    (0, ComponentMapDecorators_1.Component)(PaymentProcessor_1.PaymentProcessor)
], PayPalProcessor);
//# sourceMappingURL=PayPalProcessor.js.map