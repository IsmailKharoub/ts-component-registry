"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericFallbackHandler = void 0;
const ComponentMapDecorators_1 = require("../../../decorators/ComponentMapDecorators");
const WebhookEventHandler_1 = require("../WebhookEventHandler");
/**
 * Generic Fallback Event Handler
 * Handles any webhook event when no specific handler is found
 * Key format: "generic:*"
 */
let GenericFallbackHandler = class GenericFallbackHandler extends WebhookEventHandler_1.FallbackEventHandler {
    getProvider() {
        return 'generic';
    }
    canHandleProvider(provider) {
        // Can handle events from any provider as a fallback
        return true;
    }
    canProcessEvent(provider, eventType) {
        // This is the ultimate fallback - handles everything
        return true;
    }
    async processEvent(eventData, metadata) {
        const provider = metadata?.provider || 'unknown';
        const eventType = metadata?.eventType || 'unknown';
        this.log('info', 'Processing event with generic fallback handler', {
            provider,
            eventType,
            dataKeys: Object.keys(eventData || {})
        });
        const { result, timeMs } = await this.withTiming(async () => {
            // Simulate generic processing
            await this.simulateProcessing(100);
            // Generic analysis of the event data
            const analysis = this.analyzeEventData(eventData, provider, eventType);
            // Simulate generic processing workflows
            await this.logEventForAnalytics(analysis);
            await this.checkForAlerts(analysis);
            await this.storeEventData(eventData, analysis);
            return {
                action: 'generic_event_processed',
                provider,
                eventType,
                analysis,
                processing: {
                    analyticsLogged: true,
                    alertsChecked: true,
                    dataStored: true
                },
                recommendation: this.getProcessingRecommendation(analysis)
            };
        });
        this.log('info', `Generic event processing completed in ${timeMs.toFixed(2)}ms`, {
            provider,
            eventType,
            importance: result?.analysis?.importance
        });
        return this.createResult(true, result, undefined, timeMs);
    }
    analyzeEventData(eventData, provider, eventType) {
        const data = eventData || {};
        return {
            provider,
            eventType,
            hasUser: !!(data.user || data.author || data.sender || data.actor || data.customer),
            hasId: !!(data.id || data.event_id || data.transaction_id),
            hasTimestamp: !!(data.timestamp || data.created_at || data.time || data.created),
            hasAmount: !!(data.amount || data.value || data.price),
            fieldCount: Object.keys(data).length,
            dataSize: JSON.stringify(data).length,
            nestedObjects: this.countNestedObjects(data),
            arrayFields: this.countArrayFields(data),
            importance: this.estimateImportance(provider, eventType, data),
            extractedInfo: this.extractCommonInfo(data)
        };
    }
    countNestedObjects(obj) {
        let count = 0;
        for (const value of Object.values(obj || {})) {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                count++;
            }
        }
        return count;
    }
    countArrayFields(obj) {
        let count = 0;
        for (const value of Object.values(obj || {})) {
            if (Array.isArray(value)) {
                count++;
            }
        }
        return count;
    }
    estimateImportance(provider, eventType, data) {
        const type = eventType.toLowerCase();
        // High importance indicators
        if (type.includes('payment') || type.includes('transaction') ||
            type.includes('error') || type.includes('failure') ||
            type.includes('security') || type.includes('alert') ||
            data.amount > 1000) {
            return 'high';
        }
        // Medium importance indicators
        if (type.includes('user') || type.includes('customer') ||
            type.includes('order') || type.includes('subscription') ||
            type.includes('created') || type.includes('updated') ||
            provider === 'stripe' || provider === 'github') {
            return 'medium';
        }
        return 'low';
    }
    extractCommonInfo(data) {
        const info = {};
        // Extract user/actor information
        const user = data.user || data.author || data.sender || data.actor || data.customer;
        if (user) {
            info.user = {
                id: user.id,
                name: user.name || user.username || user.login,
                email: user.email
            };
        }
        // Extract IDs
        if (data.id)
            info.primaryId = data.id;
        if (data.event_id)
            info.eventId = data.event_id;
        if (data.transaction_id)
            info.transactionId = data.transaction_id;
        // Extract monetary values
        if (data.amount)
            info.amount = data.amount;
        if (data.value)
            info.value = data.value;
        if (data.price)
            info.price = data.price;
        // Extract timestamps
        if (data.timestamp)
            info.timestamp = data.timestamp;
        if (data.created_at)
            info.createdAt = data.created_at;
        if (data.updated_at)
            info.updatedAt = data.updated_at;
        return info;
    }
    async logEventForAnalytics(analysis) {
        this.log('info', `Logging ${analysis.provider}:${analysis.eventType} for analytics`);
        await this.simulateProcessing(30);
    }
    async checkForAlerts(analysis) {
        if (analysis.importance === 'high') {
            this.log('warn', `High importance event detected: ${analysis.provider}:${analysis.eventType}`);
        }
        await this.simulateProcessing(20);
    }
    async storeEventData(eventData, analysis) {
        this.log('info', `Storing event data for ${analysis.provider}:${analysis.eventType}`);
        await this.simulateProcessing(40);
    }
    getProcessingRecommendation(analysis) {
        if (analysis.importance === 'high') {
            return 'Consider creating a specific handler for this event type';
        }
        else if (analysis.fieldCount > 10) {
            return 'Complex event - may benefit from specialized processing';
        }
        else {
            return 'Event processed successfully with generic handler';
        }
    }
    async simulateProcessing(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
exports.GenericFallbackHandler = GenericFallbackHandler;
exports.GenericFallbackHandler = GenericFallbackHandler = __decorate([
    (0, ComponentMapDecorators_1.Component)(WebhookEventHandler_1.WebhookEventHandler)
], GenericFallbackHandler);
//# sourceMappingURL=GenericFallbackHandler.js.map