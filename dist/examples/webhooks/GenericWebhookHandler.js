"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericWebhookHandler = void 0;
const ComponentMapDecorators_1 = require("../../decorators/ComponentMapDecorators");
const WebhookHandler_1 = require("./WebhookHandler");
/**
 * Generic webhook handler that can process any webhook
 * Useful as a fallback handler or for custom/unknown webhook sources
 */
let GenericWebhookHandler = class GenericWebhookHandler extends WebhookHandler_1.WebhookHandler {
    getComponentMapKey() {
        return 'generic';
    }
    getSupportedEvents() {
        // Wildcard support - can handle any event type
        return ['*'];
    }
    async validateWebhook(payload, secret) {
        this.log('info', 'Validating generic webhook');
        // Basic validation - just check if payload has required fields
        if (!payload.data || typeof payload.data !== 'object') {
            return {
                isValid: false,
                reason: 'Invalid payload data'
            };
        }
        // Optional secret validation if provided
        if (secret && payload.signature) {
            // Simple string comparison for demo
            if (payload.signature !== secret) {
                return {
                    isValid: false,
                    reason: 'Invalid signature',
                    expectedSignature: secret,
                    actualSignature: payload.signature
                };
            }
        }
        this.log('info', 'Generic webhook validation passed');
        return { isValid: true };
    }
    async processWebhook(payload) {
        this.log('info', `Processing generic webhook: ${payload.type}`, {
            id: payload.id,
            source: payload.source,
            dataKeys: Object.keys(payload.data || {})
        });
        const { result, timeMs } = await this.withTiming(async () => {
            // Generic processing - analyze the payload and extract useful info
            const analysis = this.analyzePayload(payload);
            // Simulate some processing time
            await this.simulateDelay(100);
            return {
                action: 'generic_webhook_processed',
                analysis,
                payloadSize: JSON.stringify(payload.data).length,
                eventType: payload.type,
                extractedFields: this.extractCommonFields(payload.data)
            };
        });
        this.log('info', `Generic webhook processed successfully in ${timeMs.toFixed(2)}ms`);
        return {
            success: true,
            handlerName: this.getComponentMapKey(),
            processedAt: new Date(),
            responseData: result,
            executionTimeMs: timeMs
        };
    }
    transformPayload(rawPayload) {
        // Generic payload transformation - try to handle various formats
        return {
            id: rawPayload.id || rawPayload.event_id || rawPayload.webhook_id || this.generateId(),
            type: rawPayload.type || rawPayload.event_type || rawPayload.action || 'generic_event',
            data: rawPayload.data || rawPayload.payload || rawPayload,
            timestamp: new Date(rawPayload.timestamp || rawPayload.created_at || rawPayload.time || Date.now()),
            source: this.getComponentMapKey(),
            signature: rawPayload.signature || rawPayload.auth_token,
            metadata: {
                originalKeys: Object.keys(rawPayload),
                hasId: !!rawPayload.id,
                hasTimestamp: !!(rawPayload.timestamp || rawPayload.created_at || rawPayload.time),
                payloadType: typeof rawPayload
            }
        };
    }
    /**
     * Analyze the webhook payload to extract useful information
     */
    analyzePayload(payload) {
        const data = payload.data;
        return {
            hasUser: !!(data.user || data.author || data.sender || data.actor),
            hasId: !!(data.id || data.event_id || data.transaction_id),
            hasTimestamp: !!(data.timestamp || data.created_at || data.time),
            hasAction: !!(data.action || data.type || data.event_type),
            fieldCount: Object.keys(data).length,
            nestedObjects: this.countNestedObjects(data),
            arrayFields: this.countArrayFields(data),
            stringFields: this.countStringFields(data),
            estimatedImportance: this.estimateImportance(payload)
        };
    }
    /**
     * Extract common fields that might be present in any webhook
     */
    extractCommonFields(data) {
        const common = {};
        // Try to extract user information
        const user = data.user || data.author || data.sender || data.actor;
        if (user) {
            common.user = {
                id: user.id,
                name: user.name || user.username || user.login,
                email: user.email
            };
        }
        // Try to extract IDs
        if (data.id)
            common.id = data.id;
        if (data.event_id)
            common.eventId = data.event_id;
        if (data.transaction_id)
            common.transactionId = data.transaction_id;
        if (data.order_id)
            common.orderId = data.order_id;
        // Try to extract timestamps
        if (data.timestamp)
            common.timestamp = data.timestamp;
        if (data.created_at)
            common.createdAt = data.created_at;
        if (data.updated_at)
            common.updatedAt = data.updated_at;
        // Try to extract action/type
        if (data.action)
            common.action = data.action;
        if (data.type)
            common.type = data.type;
        if (data.status)
            common.status = data.status;
        // Try to extract amount/value
        if (data.amount)
            common.amount = data.amount;
        if (data.value)
            common.value = data.value;
        if (data.price)
            common.price = data.price;
        return common;
    }
    countNestedObjects(obj) {
        let count = 0;
        for (const value of Object.values(obj)) {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                count++;
            }
        }
        return count;
    }
    countArrayFields(obj) {
        let count = 0;
        for (const value of Object.values(obj)) {
            if (Array.isArray(value)) {
                count++;
            }
        }
        return count;
    }
    countStringFields(obj) {
        let count = 0;
        for (const value of Object.values(obj)) {
            if (typeof value === 'string') {
                count++;
            }
        }
        return count;
    }
    /**
     * Estimate the importance/priority of this webhook based on content
     */
    estimateImportance(payload) {
        const data = payload.data;
        const type = payload.type.toLowerCase();
        // High importance indicators
        if (type.includes('payment') || type.includes('transaction') ||
            type.includes('error') || type.includes('failure') ||
            type.includes('security') || type.includes('alert')) {
            return 'high';
        }
        // Medium importance indicators
        if (type.includes('user') || type.includes('order') ||
            type.includes('subscription') || type.includes('created') ||
            data.amount || data.value || data.price) {
            return 'medium';
        }
        // Default to low importance
        return 'low';
    }
    async simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
exports.GenericWebhookHandler = GenericWebhookHandler;
exports.GenericWebhookHandler = GenericWebhookHandler = __decorate([
    (0, ComponentMapDecorators_1.Component)(WebhookHandler_1.WebhookHandler)
], GenericWebhookHandler);
//# sourceMappingURL=GenericWebhookHandler.js.map