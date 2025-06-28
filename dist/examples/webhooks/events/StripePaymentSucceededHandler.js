"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripePaymentSucceededHandler = void 0;
const ComponentMapDecorators_1 = require("../../../decorators/ComponentMapDecorators");
const WebhookEventHandler_1 = require("../WebhookEventHandler");
/**
 * Stripe Payment Succeeded Event Handler
 * Handles stripe:payment_intent.succeeded events
 */
let StripePaymentSucceededHandler = class StripePaymentSucceededHandler extends WebhookEventHandler_1.WebhookEventHandler {
    getProvider() {
        return 'stripe';
    }
    getEventType() {
        return 'payment_intent.succeeded';
    }
    async processEvent(eventData, metadata) {
        this.log('info', 'Processing Stripe payment succeeded event', {
            paymentId: eventData.id,
            amount: eventData.amount
        });
        const { result, timeMs } = await this.withTiming(async () => {
            // Simulate payment processing logic
            await this.simulateProcessing(200);
            const paymentData = {
                paymentId: eventData.id,
                amount: eventData.amount / 100, // Convert from cents
                currency: eventData.currency,
                customerId: eventData.customer,
                status: eventData.status,
                paymentMethod: eventData.payment_method_types?.[0] || 'unknown'
            };
            // Simulate business logic
            await this.updateCustomerBalance(paymentData);
            await this.sendPaymentConfirmation(paymentData);
            await this.updateAnalytics(paymentData);
            return {
                action: 'payment_processed',
                payment: paymentData,
                notifications: {
                    customerEmail: true,
                    adminAlert: paymentData.amount > 1000, // Alert for large payments
                    analyticsUpdated: true
                },
                nextSteps: ['fulfill_order', 'update_subscription']
            };
        });
        this.log('info', `Payment processing completed in ${timeMs.toFixed(2)}ms`, {
            paymentId: eventData.id,
            amount: eventData.amount / 100
        });
        return this.createResult(true, result, undefined, timeMs);
    }
    async updateCustomerBalance(paymentData) {
        this.log('info', `Updating customer balance for ${paymentData.customerId}`);
        // Simulate database update
        await this.simulateProcessing(50);
    }
    async sendPaymentConfirmation(paymentData) {
        this.log('info', `Sending payment confirmation for $${paymentData.amount}`);
        // Simulate email service
        await this.simulateProcessing(100);
    }
    async updateAnalytics(paymentData) {
        this.log('info', `Updating payment analytics for ${paymentData.currency.toUpperCase()}`);
        // Simulate analytics update
        await this.simulateProcessing(30);
    }
    async simulateProcessing(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
exports.StripePaymentSucceededHandler = StripePaymentSucceededHandler;
exports.StripePaymentSucceededHandler = StripePaymentSucceededHandler = __decorate([
    (0, ComponentMapDecorators_1.Component)(WebhookEventHandler_1.WebhookEventHandler)
], StripePaymentSucceededHandler);
//# sourceMappingURL=StripePaymentSucceededHandler.js.map