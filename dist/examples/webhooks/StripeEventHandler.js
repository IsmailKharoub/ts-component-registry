"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeEventHandler = void 0;
const ComponentMapKey_1 = require("../../core/ComponentMapKey");
/**
 * Abstract base class for Stripe-specific event handlers
 * Each handler processes a specific Stripe event type
 */
class StripeEventHandler extends ComponentMapKey_1.ComponentMapKey {
    /**
     * Get the component map key (the event type)
     */
    getComponentMapKey() {
        return this.getEventType();
    }
    /**
     * Utility method to calculate execution time
     */
    async withTiming(operation) {
        const start = performance.now();
        const result = await operation();
        const timeMs = performance.now() - start;
        return { result, timeMs };
    }
    /**
     * Log event processing activity
     */
    log(level, message, data) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [STRIPE:${this.getEventType()}]`;
        switch (level) {
            case 'info':
                console.log(`${prefix} ℹ️  ${message}`, data ? JSON.stringify(data, null, 2) : '');
                break;
            case 'warn':
                console.warn(`${prefix} ⚠️  ${message}`, data ? JSON.stringify(data, null, 2) : '');
                break;
            case 'error':
                console.error(`${prefix} ❌ ${message}`, data ? JSON.stringify(data, null, 2) : '');
                break;
        }
    }
    /**
     * Create a standardized result object
     */
    createResult(success, responseData, error, executionTimeMs = 0) {
        return {
            success,
            eventType: this.getEventType(),
            handlerName: this.constructor.name,
            processedAt: new Date(),
            responseData,
            error,
            executionTimeMs
        };
    }
    /**
     * Simulate processing delay for demo purposes
     */
    async simulateProcessing(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.StripeEventHandler = StripeEventHandler;
//# sourceMappingURL=StripeEventHandler.js.map