"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FallbackEventHandler = exports.WebhookEventHandler = void 0;
const ComponentMapKey_1 = require("../../core/ComponentMapKey");
/**
 * Abstract webhook event handler class for specific event types
 * Each handler processes a specific event type for a specific provider
 * Key format: "provider:event_type" (e.g., "stripe:payment_intent.succeeded")
 */
class WebhookEventHandler extends ComponentMapKey_1.ComponentMapKey {
    /**
     * Get the component map key in format "provider:event_type"
     */
    getComponentMapKey() {
        return `${this.getProvider()}:${this.getEventType()}`;
    }
    /**
     * Validate if this handler can process the given provider and event type
     */
    canProcessEvent(provider, eventType) {
        return this.getProvider() === provider && this.getEventType() === eventType;
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
        const prefix = `[${timestamp}] [${this.getProvider().toUpperCase()}:${this.getEventType()}]`;
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
            handlerName: this.getComponentMapKey(),
            eventType: this.getEventType(),
            provider: this.getProvider(),
            processedAt: new Date(),
            responseData,
            error,
            executionTimeMs
        };
    }
}
exports.WebhookEventHandler = WebhookEventHandler;
/**
 * Fallback event handler for unknown or unhandled events
 */
class FallbackEventHandler extends WebhookEventHandler {
    getEventType() {
        return '*'; // Wildcard - handles any event
    }
    canProcessEvent(provider, eventType) {
        return this.canHandleProvider(provider);
    }
}
exports.FallbackEventHandler = FallbackEventHandler;
//# sourceMappingURL=WebhookEventHandler.js.map