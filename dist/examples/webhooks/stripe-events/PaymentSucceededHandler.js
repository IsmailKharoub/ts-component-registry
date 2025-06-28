"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSucceededHandler = void 0;
const ComponentMapDecorators_1 = require("../../../decorators/ComponentMapDecorators");
const StripeEventHandler_1 = require("../StripeEventHandler");
/**
 * Handles Stripe payment_intent.succeeded events
 */
let PaymentSucceededHandler = class PaymentSucceededHandler extends StripeEventHandler_1.StripeEventHandler {
    getEventType() {
        return 'payment_intent.succeeded';
    }
    async processStripeEvent(eventData) {
        this.log('info', 'Processing payment succeeded event', {
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
            await this.triggerFulfillment(paymentData);
            return {
                action: 'payment_processed',
                payment: paymentData,
                notifications: {
                    customerEmail: true,
                    adminAlert: paymentData.amount > 1000, // Alert for large payments
                    analyticsUpdated: true,
                    fulfillmentTriggered: true
                },
                nextSteps: ['fulfill_order', 'update_subscription', 'generate_receipt']
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
        await this.simulateProcessing(50);
    }
    async sendPaymentConfirmation(paymentData) {
        this.log('info', `Sending payment confirmation for $${paymentData.amount}`);
        await this.simulateProcessing(100);
    }
    async updateAnalytics(paymentData) {
        this.log('info', `Updating payment analytics for ${paymentData.currency.toUpperCase()}`);
        await this.simulateProcessing(30);
    }
    async triggerFulfillment(paymentData) {
        this.log('info', `Triggering order fulfillment for payment ${paymentData.paymentId}`);
        await this.simulateProcessing(80);
    }
};
exports.PaymentSucceededHandler = PaymentSucceededHandler;
exports.PaymentSucceededHandler = PaymentSucceededHandler = __decorate([
    (0, ComponentMapDecorators_1.Component)(StripeEventHandler_1.StripeEventHandler)
], PaymentSucceededHandler);
//# sourceMappingURL=PaymentSucceededHandler.js.map