"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookHandler = void 0;
const ComponentMapKey_1 = require("../../core/ComponentMapKey");
/**
 * Abstract webhook handler class
 * Extend this to create handlers for specific webhook providers
 */
class WebhookHandler extends ComponentMapKey_1.ComponentMapKey {
    /**
     * Check if this handler can process the given event type
     */
    canHandle(eventType) {
        return this.getSupportedEvents().includes(eventType) ||
            this.getSupportedEvents().includes('*'); // wildcard support
    }
    /**
     * Transform the raw webhook data into standardized WebhookPayload format
     * Override this method if the provider uses a different payload structure
     */
    transformPayload(rawPayload) {
        return {
            id: rawPayload.id || this.generateId(),
            type: rawPayload.type || rawPayload.event_type || 'unknown',
            data: rawPayload.data || rawPayload,
            timestamp: new Date(rawPayload.timestamp || rawPayload.created || Date.now()),
            source: this.getComponentMapKey(),
            signature: rawPayload.signature || rawPayload.headers?.['webhook-signature'],
            metadata: rawPayload.metadata || {}
        };
    }
    /**
     * Generate a unique ID for webhooks that don't provide one
     */
    generateId() {
        return `webhook_${this.getComponentMapKey()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
     * Log webhook processing activity
     */
    log(level, message, data) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${this.getComponentMapKey().toUpperCase()}]`;
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
}
exports.WebhookHandler = WebhookHandler;
//# sourceMappingURL=WebhookHandler.js.map