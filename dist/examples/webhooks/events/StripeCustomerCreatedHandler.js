"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeCustomerCreatedHandler = void 0;
const ComponentMapDecorators_1 = require("../../../decorators/ComponentMapDecorators");
const WebhookEventHandler_1 = require("../WebhookEventHandler");
/**
 * Stripe Customer Created Event Handler
 * Handles stripe:customer.created events
 */
let StripeCustomerCreatedHandler = class StripeCustomerCreatedHandler extends WebhookEventHandler_1.WebhookEventHandler {
    getProvider() {
        return 'stripe';
    }
    getEventType() {
        return 'customer.created';
    }
    async processEvent(eventData, metadata) {
        this.log('info', 'Processing Stripe customer created event', {
            customerId: eventData.id,
            email: eventData.email
        });
        const { result, timeMs } = await this.withTiming(async () => {
            // Simulate customer onboarding logic
            await this.simulateProcessing(150);
            const customerData = {
                customerId: eventData.id,
                email: eventData.email,
                name: eventData.name,
                phone: eventData.phone,
                createdAt: new Date(eventData.created * 1000),
                defaultSource: eventData.default_source,
                balance: eventData.balance
            };
            // Simulate onboarding workflows
            await this.createCustomerProfile(customerData);
            await this.setupDefaultPreferences(customerData);
            await this.sendWelcomeEmail(customerData);
            await this.initializeRewardPoints(customerData);
            return {
                action: 'customer_onboarded',
                customer: customerData,
                onboarding: {
                    profileCreated: true,
                    preferencesSet: true,
                    welcomeEmailSent: true,
                    rewardPointsInitialized: true
                },
                recommendations: [
                    'setup_payment_method',
                    'complete_profile',
                    'subscribe_to_newsletter'
                ]
            };
        });
        this.log('info', `Customer onboarding completed in ${timeMs.toFixed(2)}ms`, {
            customerId: eventData.id,
            email: eventData.email
        });
        return this.createResult(true, result, undefined, timeMs);
    }
    async createCustomerProfile(customerData) {
        this.log('info', `Creating customer profile for ${customerData.email}`);
        // Simulate database operations
        await this.simulateProcessing(60);
    }
    async setupDefaultPreferences(customerData) {
        this.log('info', `Setting up default preferences for ${customerData.customerId}`);
        // Simulate preference initialization
        await this.simulateProcessing(40);
    }
    async sendWelcomeEmail(customerData) {
        this.log('info', `Sending welcome email to ${customerData.email}`);
        // Simulate email service
        await this.simulateProcessing(80);
    }
    async initializeRewardPoints(customerData) {
        this.log('info', `Initializing reward points for ${customerData.customerId}`);
        // Simulate reward system initialization
        await this.simulateProcessing(30);
    }
    async simulateProcessing(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
exports.StripeCustomerCreatedHandler = StripeCustomerCreatedHandler;
exports.StripeCustomerCreatedHandler = StripeCustomerCreatedHandler = __decorate([
    (0, ComponentMapDecorators_1.Component)(WebhookEventHandler_1.WebhookEventHandler)
], StripeCustomerCreatedHandler);
//# sourceMappingURL=StripeCustomerCreatedHandler.js.map