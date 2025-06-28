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
exports.EnhancedWebhookService = void 0;
const ComponentMapDecorators_1 = require("../../decorators/ComponentMapDecorators");
const WebhookEventHandler_1 = require("./WebhookEventHandler");
/**
 * Enhanced webhook service using nested ComponentMap for event-specific handlers
 * Showcases provider:event_type -> handler mapping with automatic discovery
 */
class EnhancedWebhookService {
    constructor() {
        this.stats = this.initializeStats();
    }
    /**
     * Process a webhook event using the nested handler structure
     */
    async processWebhookEvent(provider, eventType, eventData, metadata) {
        const startTime = performance.now();
        const handlerKey = `${provider}:${eventType}`;
        console.log(`📨 Processing ${handlerKey} event...`);
        try {
            // Find the specific handler for this provider:event combination
            const handler = this.getEventHandler(provider, eventType);
            if (!handler) {
                throw new Error(`No handler found for ${handlerKey}`);
            }
            console.log(`🎯 Routing to handler: ${handler.constructor.name}`);
            // Process the event with the specific handler
            const result = await handler.processEvent(eventData, {
                provider,
                eventType,
                ...metadata
            });
            // Update statistics
            const processingTime = performance.now() - startTime;
            this.updateEventStats(handlerKey, true, processingTime);
            console.log(`✅ Event processed successfully by ${handler.constructor.name} in ${processingTime.toFixed(2)}ms`);
            return result;
        }
        catch (error) {
            const processingTime = performance.now() - startTime;
            this.updateEventStats(handlerKey, false, processingTime);
            console.error(`❌ Event processing failed for ${handlerKey}:`, error);
            return {
                success: false,
                handlerName: handlerKey,
                eventType,
                provider,
                processedAt: new Date(),
                error: error instanceof Error ? error.message : String(error),
                executionTimeMs: processingTime
            };
        }
    }
    /**
     * Process multiple events in parallel with detailed routing
     */
    async processEventsBatch(events) {
        console.log(`🔄 Processing ${events.length} events in parallel...`);
        // Group events by handler for better visibility
        const handlerGroups = this.groupEventsByHandler(events);
        console.log(`📊 Event distribution:`, handlerGroups);
        const promises = events.map(event => this.processWebhookEvent(event.provider, event.eventType, event.eventData, event.metadata));
        const results = await Promise.all(promises);
        const successful = results.filter(r => r.success).length;
        const failed = results.length - successful;
        console.log(`✅ Batch processing complete: ${successful} successful, ${failed} failed`);
        return results;
    }
    /**
     * Get the appropriate handler for a provider:event combination
     */
    getEventHandler(provider, eventType) {
        const exactKey = `${provider}:${eventType}`;
        // Try exact match first
        const exactHandler = this.eventHandlers.get(exactKey);
        if (exactHandler) {
            return exactHandler;
        }
        // Try provider-specific fallback (provider:*)
        const providerFallbackKey = `${provider}:*`;
        const providerFallback = this.eventHandlers.get(providerFallbackKey);
        if (providerFallback) {
            console.log(`⚠️ Using provider fallback for ${exactKey}`);
            return providerFallback;
        }
        // Try generic fallback (generic:*)
        const genericFallback = this.eventHandlers.get('generic:*');
        if (genericFallback) {
            console.log(`⚠️ Using generic fallback for ${exactKey}`);
            return genericFallback;
        }
        return undefined;
    }
    /**
     * Get detailed information about all registered event handlers
     */
    getHandlerMapping() {
        const mapping = {};
        for (const [key, handler] of this.eventHandlers) {
            const isSpecific = !key.includes('*');
            const isFallback = key.includes('*');
            mapping[key] = {
                handlerClass: handler.constructor.name,
                provider: handler.getProvider(),
                eventType: handler.getEventType(),
                isSpecific,
                isFallback,
                processingStats: this.stats.eventStats[key] || {
                    processed: 0,
                    errors: 0,
                    averageTime: 0
                }
            };
        }
        return mapping;
    }
    /**
     * Get enhanced processing statistics
     */
    getEnhancedStats() {
        // Recalculate provider-level aggregations
        this.recalculateProviderStats();
        return { ...this.stats };
    }
    /**
     * Get handler coverage report
     */
    getHandlerCoverage() {
        const specificHandlers = Array.from(this.eventHandlers.keys()).filter(key => !key.includes('*'));
        const fallbackHandlers = Array.from(this.eventHandlers.keys()).filter(key => key.includes('*'));
        const providerCoverage = {};
        // Group by provider
        for (const key of this.eventHandlers.keys()) {
            const [provider, eventType] = key.split(':');
            if (!providerCoverage[provider]) {
                providerCoverage[provider] = {
                    specificEvents: [],
                    hasFallback: false,
                    coverage: 'partial'
                };
            }
            if (eventType === '*') {
                providerCoverage[provider].hasFallback = true;
                providerCoverage[provider].coverage = providerCoverage[provider].specificEvents.length > 0 ? 'complete' : 'fallback-only';
            }
            else {
                providerCoverage[provider].specificEvents.push(eventType);
                providerCoverage[provider].coverage = 'specific';
            }
        }
        return {
            totalHandlers: this.eventHandlers.size,
            specificHandlers: specificHandlers.length,
            fallbackHandlers: fallbackHandlers.length,
            providerCoverage
        };
    }
    /**
     * Simulate webhook events to test the handler system
     */
    async simulateWebhookEvents() {
        console.log('🎭 Simulating various webhook events...\n');
        const testEvents = [
            {
                provider: 'stripe',
                eventType: 'payment_intent.succeeded',
                eventData: {
                    id: 'pi_test_12345',
                    amount: 2999,
                    currency: 'usd',
                    customer: 'cus_test_customer',
                    status: 'succeeded',
                    payment_method_types: ['card']
                }
            },
            {
                provider: 'stripe',
                eventType: 'customer.created',
                eventData: {
                    id: 'cus_test_67890',
                    email: 'test@example.com',
                    name: 'Test Customer',
                    created: Math.floor(Date.now() / 1000)
                }
            },
            {
                provider: 'github',
                eventType: 'push',
                eventData: {
                    repository: { full_name: 'user/test-repo' },
                    ref: 'refs/heads/main',
                    commits: [
                        { id: 'abc123', message: 'Add new test feature', author: { name: 'developer' } }
                    ],
                    pusher: { name: 'developer' },
                    head_commit: { id: 'abc123' }
                }
            },
            {
                provider: 'discord',
                eventType: 'message_create',
                eventData: {
                    id: 'msg_123456',
                    guild_id: 'guild_789',
                    channel_id: 'channel_456',
                    author: { id: 'user_123', username: 'TestUser', bot: false },
                    content: 'Hello, how are you?',
                    timestamp: new Date().toISOString()
                }
            },
            {
                provider: 'unknown_provider',
                eventType: 'custom_event',
                eventData: {
                    event_id: 'custom_123',
                    user: { id: 'user_456', name: 'Custom User' },
                    data: { action: 'custom_action', value: 42 }
                }
            }
        ];
        await this.processEventsBatch(testEvents);
    }
    /**
     * Update handler count after component discovery
     */
    updateHandlerCount() {
        this.stats.totalHandlers = this.eventHandlers.size;
        this.calculateHandlersByProvider();
        this.calculateEventTypesCovered();
    }
    groupEventsByHandler(events) {
        const groups = {};
        for (const event of events) {
            const key = `${event.provider}:${event.eventType}`;
            const handler = this.getEventHandler(event.provider, event.eventType);
            const handlerName = handler ? handler.constructor.name : 'No handler';
            groups[handlerName] = (groups[handlerName] || 0) + 1;
        }
        return groups;
    }
    updateEventStats(handlerKey, success, processingTime) {
        this.stats.processedEvents++;
        if (!success) {
            this.stats.processingErrors++;
        }
        // Update handler-specific stats
        if (!this.stats.eventStats[handlerKey]) {
            this.stats.eventStats[handlerKey] = {
                processed: 0,
                errors: 0,
                totalTime: 0,
                averageTime: 0
            };
        }
        const eventStats = this.stats.eventStats[handlerKey];
        eventStats.processed++;
        eventStats.totalTime += processingTime;
        eventStats.averageTime = eventStats.totalTime / eventStats.processed;
        eventStats.lastProcessed = new Date();
        if (!success) {
            eventStats.errors++;
        }
        // Update overall average
        const totalTime = Object.values(this.stats.eventStats)
            .reduce((sum, stats) => sum + stats.totalTime, 0);
        this.stats.averageProcessingTime = totalTime / this.stats.processedEvents;
    }
    recalculateProviderStats() {
        this.stats.providerStats = {};
        for (const [handlerKey, eventStats] of Object.entries(this.stats.eventStats)) {
            const [provider] = handlerKey.split(':');
            if (!this.stats.providerStats[provider]) {
                this.stats.providerStats[provider] = {
                    totalEvents: 0,
                    errorRate: 0,
                    averageTime: 0,
                    topEvents: []
                };
            }
            const providerStats = this.stats.providerStats[provider];
            providerStats.totalEvents += eventStats.processed;
        }
        // Calculate error rates and averages
        for (const [provider, providerStats] of Object.entries(this.stats.providerStats)) {
            const providerEventStats = Object.entries(this.stats.eventStats)
                .filter(([key]) => key.startsWith(`${provider}:`))
                .map(([, stats]) => stats);
            const totalErrors = providerEventStats.reduce((sum, stats) => sum + stats.errors, 0);
            const totalTime = providerEventStats.reduce((sum, stats) => sum + stats.totalTime, 0);
            providerStats.errorRate = providerStats.totalEvents > 0 ?
                (totalErrors / providerStats.totalEvents) * 100 : 0;
            providerStats.averageTime = providerStats.totalEvents > 0 ?
                totalTime / providerStats.totalEvents : 0;
            // Get top events
            providerStats.topEvents = Object.entries(this.stats.eventStats)
                .filter(([key]) => key.startsWith(`${provider}:`))
                .map(([key, stats]) => ({
                eventType: key.split(':')[1],
                count: stats.processed
            }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 3);
        }
    }
    calculateHandlersByProvider() {
        this.stats.handlersByProvider = {};
        for (const handler of this.eventHandlers.values()) {
            const provider = handler.getProvider();
            this.stats.handlersByProvider[provider] = (this.stats.handlersByProvider[provider] || 0) + 1;
        }
    }
    calculateEventTypesCovered() {
        this.stats.eventTypesCovered = {};
        for (const handler of this.eventHandlers.values()) {
            const provider = handler.getProvider();
            const eventType = handler.getEventType();
            if (!this.stats.eventTypesCovered[provider]) {
                this.stats.eventTypesCovered[provider] = [];
            }
            if (!this.stats.eventTypesCovered[provider].includes(eventType)) {
                this.stats.eventTypesCovered[provider].push(eventType);
            }
        }
    }
    initializeStats() {
        return {
            totalHandlers: 0,
            handlersByProvider: {},
            eventTypesCovered: {},
            processedEvents: 0,
            processingErrors: 0,
            averageProcessingTime: 0,
            eventStats: {},
            providerStats: {}
        };
    }
}
exports.EnhancedWebhookService = EnhancedWebhookService;
__decorate([
    (0, ComponentMapDecorators_1.ComponentMap)(WebhookEventHandler_1.WebhookEventHandler),
    __metadata("design:type", Map)
], EnhancedWebhookService.prototype, "eventHandlers", void 0);
//# sourceMappingURL=EnhancedWebhookService.js.map