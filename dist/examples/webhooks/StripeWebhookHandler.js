"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeWebhookHandler = void 0;
const ComponentMapDecorators_1 = require("../../decorators/ComponentMapDecorators");
const WebhookHandler_1 = require("./WebhookHandler");
const StripeEventHandler_1 = require("./StripeEventHandler");
const crypto = __importStar(require("crypto"));
/**
 * Enhanced Stripe webhook handler with nested ComponentMap
 * Uses ComponentMap internally to manage event-specific handlers
 * Showcases the nested ComponentMap pattern
 */
let StripeWebhookHandler = class StripeWebhookHandler extends WebhookHandler_1.WebhookHandler {
    getComponentMapKey() {
        return 'stripe';
    }
    getSupportedEvents() {
        // Return all event types from the nested ComponentMap
        return Array.from(this.eventHandlers.keys());
    }
    async validateWebhook(payload, secret) {
        this.log('info', 'Validating Stripe webhook signature');
        if (!payload.signature) {
            return {
                isValid: false,
                reason: 'Missing webhook signature'
            };
        }
        try {
            // Stripe uses HMAC SHA256
            const expectedSignature = crypto
                .createHmac('sha256', secret)
                .update(JSON.stringify(payload.data))
                .digest('hex');
            const actualSignature = payload.signature.replace('sha256=', '');
            const isValid = crypto.timingSafeEqual(Buffer.from(expectedSignature, 'hex'), Buffer.from(actualSignature, 'hex'));
            if (isValid) {
                this.log('info', 'Stripe webhook signature validation passed');
                return { isValid: true };
            }
            else {
                this.log('warn', 'Stripe webhook signature validation failed', {
                    expected: expectedSignature,
                    actual: actualSignature
                });
                return {
                    isValid: false,
                    reason: 'Invalid signature',
                    expectedSignature,
                    actualSignature
                };
            }
        }
        catch (error) {
            this.log('error', 'Error during Stripe webhook validation', error);
            return {
                isValid: false,
                reason: `Validation error: ${error instanceof Error ? error.message : error}`
            };
        }
    }
    async processWebhook(payload) {
        this.log('info', `Processing Stripe webhook: ${payload.type}`, { id: payload.id });
        const { result, timeMs } = await this.withTiming(async () => {
            // 🎯 Use nested ComponentMap to route to specific event handler
            const eventHandler = this.eventHandlers.get(payload.type);
            if (eventHandler) {
                this.log('info', `Routing to specific handler: ${eventHandler.constructor.name}`);
                // Process with the specific event handler
                const stripeResult = await eventHandler.processStripeEvent(payload.data);
                return {
                    routedTo: eventHandler.constructor.name,
                    eventResult: stripeResult,
                    handlerStats: {
                        totalEventHandlers: this.eventHandlers.size,
                        supportedEvents: Array.from(this.eventHandlers.keys()),
                        eventHandlerUsed: payload.type
                    }
                };
            }
            else {
                // Fallback for unsupported events
                this.log('warn', `No specific handler for Stripe event: ${payload.type}`);
                await this.processGenericStripeEvent(payload);
                return {
                    routedTo: 'GenericStripeEventProcessor',
                    message: `Processed ${payload.type} with generic Stripe logic`,
                    availableHandlers: Array.from(this.eventHandlers.keys()),
                    suggestion: 'Consider creating a specific handler for this event type'
                };
            }
        });
        this.log('info', `Stripe webhook processed successfully in ${timeMs.toFixed(2)}ms`);
        return {
            success: true,
            handlerName: this.getComponentMapKey(),
            processedAt: new Date(),
            responseData: result,
            executionTimeMs: timeMs
        };
    }
    transformPayload(rawPayload) {
        // Stripe-specific payload transformation
        return {
            id: rawPayload.id,
            type: rawPayload.type,
            data: rawPayload.data.object,
            timestamp: new Date(rawPayload.created * 1000), // Stripe uses Unix timestamp
            source: this.getComponentMapKey(),
            signature: rawPayload.signature,
            metadata: {
                livemode: rawPayload.livemode,
                api_version: rawPayload.api_version,
                request: rawPayload.request
            }
        };
    }
    /**
     * Get detailed information about nested event handlers
     */
    getEventHandlerInfo() {
        return Array.from(this.eventHandlers.entries()).map(([eventType, handler]) => ({
            eventType,
            handlerClass: handler.constructor.name,
            description: `Handles Stripe ${eventType} events`
        }));
    }
    /**
     * Check if a specific event type is supported
     */
    supportsEventType(eventType) {
        return this.eventHandlers.has(eventType);
    }
    /**
     * Get statistics about the nested ComponentMap
     */
    getNestedComponentMapStats() {
        return {
            totalEventHandlers: this.eventHandlers.size,
            supportedEventTypes: Array.from(this.eventHandlers.keys()),
            handlerDetails: Array.from(this.eventHandlers.entries()).map(([eventType, handler]) => ({
                eventType,
                handlerName: handler.constructor.name
            }))
        };
    }
    /**
     * Generic processing for unsupported Stripe events
     */
    async processGenericStripeEvent(payload) {
        this.log('info', `Processing generic Stripe event: ${payload.type}`);
        // Simulate basic processing
        await this.simulateDelay(100);
        // Log event for analytics
        this.log('info', `Logged ${payload.type} for future analysis`);
    }
    async simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
exports.StripeWebhookHandler = StripeWebhookHandler;
__decorate([
    (0, ComponentMapDecorators_1.ComponentMap)(StripeEventHandler_1.StripeEventHandler),
    __metadata("design:type", Map)
], StripeWebhookHandler.prototype, "eventHandlers", void 0);
exports.StripeWebhookHandler = StripeWebhookHandler = __decorate([
    (0, ComponentMapDecorators_1.Component)(WebhookHandler_1.WebhookHandler)
], StripeWebhookHandler);
//# sourceMappingURL=StripeWebhookHandler.js.map