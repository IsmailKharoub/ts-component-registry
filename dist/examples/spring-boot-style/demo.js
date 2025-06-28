"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSpringBootStyleDemo = exports.EventHandlerService = void 0;
require("reflect-metadata");
const ComponentMapDecorators_1 = require("../../decorators/ComponentMapDecorators");
const ComponentMapKey_1 = require("../../core/ComponentMapKey");
const PaymentProcessor_1 = require("../payment/PaymentProcessor");
/**
 * Payment service using Spring Boot style @ComponentMap injection
 * No manual imports or registration needed!
 */
class PaymentService {
    /**
     * Process a payment using auto-discovered processors
     */
    async processPayment(provider, amount, currency = 'USD') {
        console.log(`🚀 Processing payment with ${provider}...`);
        const processor = this.processors.get(provider);
        if (!processor) {
            const available = Array.from(this.processors.keys()).join(', ');
            throw new Error(`Payment provider '${provider}' not found. Available: ${available}`);
        }
        return await processor.process(amount, currency);
    }
    /**
     * Get all available payment providers
     */
    getAvailableProviders() {
        return Array.from(this.processors.keys());
    }
    /**
     * Get processor statistics
     */
    getStats() {
        return {
            totalProcessors: this.processors.size,
            availableProviders: this.getAvailableProviders()
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
__decorate([
    (0, ComponentMapDecorators_1.ComponentMap)(PaymentProcessor_1.PaymentProcessor),
    __metadata("design:type", Map)
], PaymentService.prototype, "processors", void 0);
/**
 * Event handler service demonstrating multiple handlers per event type
 */
var EventType;
(function (EventType) {
    EventType["USER_SIGNUP"] = "user_signup";
    EventType["PAYMENT_COMPLETED"] = "payment_completed";
    EventType["ORDER_SHIPPED"] = "order_shipped";
})(EventType || (EventType = {}));
class EventHandler extends ComponentMapKey_1.ComponentMapKey {
}
class EventHandlerService {
    async handleEvent(eventType, eventData) {
        console.log(`📨 Handling event: ${eventType}`);
        const handler = this.handlers.get(eventType);
        if (!handler) {
            console.warn(`⚠️ No handler found for event type: ${eventType}`);
            return;
        }
        await handler.handle(eventData);
    }
    getRegisteredEventTypes() {
        return Array.from(this.handlers.keys());
    }
}
exports.EventHandlerService = EventHandlerService;
__decorate([
    (0, ComponentMapDecorators_1.ComponentMap)(EventHandler),
    __metadata("design:type", Map)
], EventHandlerService.prototype, "handlers", void 0);
/**
 * Demo showcasing Spring Boot-style ComponentMap usage
 * Components are auto-discovered without manual imports!
 */
async function runSpringBootStyleDemo() {
    console.log('🎯 Spring Boot Style ComponentMap Demo');
    console.log('='.repeat(45));
    // Determine if we're running from compiled code or source
    const isCompiledDemo = __filename.includes('dist');
    const scanDirs = isCompiledDemo ? ['dist/examples'] : ['src/examples'];
    const filePatterns = isCompiledDemo ? ['**/*.js'] : ['**/*.ts', '**/*.js'];
    // Initialize auto-discovery (like Spring Boot's component scan)
    console.log('🔍 Initializing component auto-discovery...');
    await (0, ComponentMapDecorators_1.initializeComponentMaps)(scanDirs);
    console.log('\n💼 Testing Payment Service:');
    const paymentService = new PaymentService();
    // Show what was auto-discovered
    const stats = paymentService.getStats();
    console.log(`📊 Auto-discovered ${stats.totalProcessors} payment processors: ${stats.availableProviders.join(', ')}`);
    try {
        // Test individual payments
        console.log('\n💳 Processing individual payments:');
        const stripeResult = await paymentService.processPayment('stripe', 99.99, 'USD');
        console.log(`✅ Stripe: ${stripeResult.transactionId} (fees: $${stripeResult.fees.toFixed(2)})`);
        const paypalResult = await paymentService.processPayment('paypal', 149.50, 'USD');
        console.log(`✅ PayPal: ${paypalResult.transactionId} (fees: $${paypalResult.fees.toFixed(2)})`);
        // Test parallel payments
        console.log('\n🔄 Processing parallel payments:');
        const parallelPayments = [
            { provider: 'stripe', amount: 25.00 },
            { provider: 'paypal', amount: 50.00 },
            { provider: 'stripe', amount: 75.00 }
        ];
        const results = await paymentService.processMultiplePayments(parallelPayments);
        console.log(`✅ Processed ${results.length} payments successfully`);
        // Test error handling
        console.log('\n❌ Testing error handling:');
        try {
            await paymentService.processPayment('bitcoin', 100.00);
        }
        catch (error) {
            console.log(`✅ Expected error: ${error instanceof Error ? error.message : error}`);
        }
    }
    catch (error) {
        console.error('❌ Payment processing failed:', error);
    }
    console.log('\n📨 Testing Event Handler Service:');
    const eventService = new EventHandlerService();
    const eventTypes = eventService.getRegisteredEventTypes();
    console.log(`📋 Registered event types: ${eventTypes.join(', ')}`);
    // Test event handling
    await eventService.handleEvent(EventType.USER_SIGNUP, {
        userId: 'user123',
        email: 'user@example.com'
    });
    await eventService.handleEvent(EventType.PAYMENT_COMPLETED, {
        transactionId: 'tx123',
        amount: 99.99
    });
    console.log('\n🎉 Spring Boot Style Demo Complete!');
    console.log('✨ Everything was auto-discovered - no manual imports needed!');
    console.log('🔧 Components registered themselves via @Component decorators');
    console.log('💉 Services got their dependencies via @ComponentMap injection');
    console.log('🎯 Type-driven registries - no more magic strings!');
}
exports.runSpringBootStyleDemo = runSpringBootStyleDemo;
// Run the demo if this file is executed directly
if (require.main === module) {
    runSpringBootStyleDemo().catch(console.error);
}
//# sourceMappingURL=demo.js.map