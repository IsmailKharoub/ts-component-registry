"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicePaymentHandler = void 0;
const ComponentMapDecorators_1 = require("../../../decorators/ComponentMapDecorators");
const StripeEventHandler_1 = require("../StripeEventHandler");
/**
 * Handles Stripe invoice.payment_succeeded events
 */
let InvoicePaymentHandler = class InvoicePaymentHandler extends StripeEventHandler_1.StripeEventHandler {
    getEventType() {
        return 'invoice.payment_succeeded';
    }
    async processStripeEvent(eventData) {
        this.log('info', 'Processing invoice payment succeeded event', {
            invoiceId: eventData.id,
            amount: eventData.amount_paid
        });
        const { result, timeMs } = await this.withTiming(async () => {
            // Simulate invoice processing logic
            await this.simulateProcessing(120);
            const invoiceData = {
                invoiceId: eventData.id,
                customerId: eventData.customer,
                subscriptionId: eventData.subscription,
                amountPaid: eventData.amount_paid / 100, // Convert from cents
                currency: eventData.currency,
                paidAt: new Date(eventData.status_transitions?.paid_at * 1000),
                billingPeriod: {
                    start: new Date(eventData.period_start * 1000),
                    end: new Date(eventData.period_end * 1000)
                }
            };
            // Simulate invoice processing workflows
            await this.updateSubscriptionStatus(invoiceData);
            await this.generateReceipt(invoiceData);
            await this.updateAccountingSystem(invoiceData);
            await this.renewServiceAccess(invoiceData);
            await this.sendInvoiceConfirmation(invoiceData);
            return {
                action: 'invoice_processed',
                invoice: invoiceData,
                processing: {
                    subscriptionUpdated: true,
                    receiptGenerated: true,
                    accountingUpdated: true,
                    serviceRenewed: true,
                    confirmationSent: true
                },
                billing: {
                    nextInvoiceDate: this.calculateNextInvoiceDate(invoiceData),
                    serviceActiveUntil: this.calculateServiceEnd(invoiceData),
                    paymentMethod: 'stripe_auto'
                }
            };
        });
        this.log('info', `Invoice processing completed in ${timeMs.toFixed(2)}ms`, {
            invoiceId: eventData.id,
            amount: eventData.amount_paid / 100
        });
        return this.createResult(true, result, undefined, timeMs);
    }
    async updateSubscriptionStatus(invoiceData) {
        this.log('info', `Updating subscription status for ${invoiceData.subscriptionId}`);
        await this.simulateProcessing(40);
    }
    async generateReceipt(invoiceData) {
        this.log('info', `Generating receipt for invoice ${invoiceData.invoiceId}`);
        await this.simulateProcessing(60);
    }
    async updateAccountingSystem(invoiceData) {
        this.log('info', `Updating accounting system for $${invoiceData.amountPaid}`);
        await this.simulateProcessing(35);
    }
    async renewServiceAccess(invoiceData) {
        this.log('info', `Renewing service access for customer ${invoiceData.customerId}`);
        await this.simulateProcessing(50);
    }
    async sendInvoiceConfirmation(invoiceData) {
        this.log('info', `Sending invoice confirmation for ${invoiceData.invoiceId}`);
        await this.simulateProcessing(45);
    }
    calculateNextInvoiceDate(invoiceData) {
        // Simulate calculating next billing date (30 days from end of period)
        const nextDate = new Date(invoiceData.billingPeriod.end);
        nextDate.setDate(nextDate.getDate() + 30);
        return nextDate;
    }
    calculateServiceEnd(invoiceData) {
        // Service active until next billing period
        return this.calculateNextInvoiceDate(invoiceData);
    }
};
exports.InvoicePaymentHandler = InvoicePaymentHandler;
exports.InvoicePaymentHandler = InvoicePaymentHandler = __decorate([
    (0, ComponentMapDecorators_1.Component)(StripeEventHandler_1.StripeEventHandler)
], InvoicePaymentHandler);
//# sourceMappingURL=InvoicePaymentHandler.js.map