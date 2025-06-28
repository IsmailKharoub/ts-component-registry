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
exports.WebhookService = void 0;
const ComponentMapDecorators_1 = require("../../decorators/ComponentMapDecorators");
const WebhookHandler_1 = require("./WebhookHandler");
/**
 * Main webhook service that auto-discovers and routes webhooks
 * Uses the type-driven ComponentMap to find all webhook handlers automatically
 */
class WebhookService {
    constructor() {
        this.secrets = {};
        this.stats = this.initializeStats();
    }
    /**
     * Configure webhook secrets for validation
     */
    configureSecrets(secrets) {
        this.secrets = { ...secrets };
        console.log(`🔐 Configured secrets for providers: ${Object.keys(secrets).join(', ')}`);
    }
    /**
     * Process an incoming webhook
     * Automatically routes to the appropriate handler based on source
     */
    async processWebhook(source, rawPayload, options = {}) {
        const startTime = performance.now();
        try {
            console.log(`📨 Incoming webhook from ${source}`);
            // Get the appropriate handler
            const handler = this.getHandlerForSource(source, options.fallbackToGeneric);
            if (!handler) {
                throw new Error(`No handler found for source: ${source}`);
            }
            // Transform the raw payload
            const payload = handler.transformPayload(rawPayload);
            console.log(`🔄 Transformed payload for ${source}: ${payload.type}`);
            // Validate the webhook if required
            if (options.validateSignature !== false) {
                const secret = this.secrets[source];
                if (secret || options.requireValidation) {
                    const validation = await handler.validateWebhook(payload, secret || '');
                    if (!validation.isValid) {
                        this.stats.validationFailures++;
                        throw new Error(`Webhook validation failed: ${validation.reason}`);
                    }
                    console.log(`✅ Webhook validation passed for ${source}`);
                }
            }
            // Process the webhook
            const result = await handler.processWebhook(payload);
            // Update statistics
            const processingTime = performance.now() - startTime;
            this.updateStats(source, true, processingTime);
            console.log(`🎉 Webhook processed successfully: ${source} in ${processingTime.toFixed(2)}ms`);
            return result;
        }
        catch (error) {
            const processingTime = performance.now() - startTime;
            this.updateStats(source, false, processingTime);
            console.error(`❌ Webhook processing failed for ${source}:`, error);
            return {
                success: false,
                handlerName: source,
                processedAt: new Date(),
                error: error instanceof Error ? error.message : String(error),
                executionTimeMs: processingTime
            };
        }
    }
    /**
     * Process multiple webhooks in parallel
     */
    async processWebhooksBatch(webhooks) {
        console.log(`🔄 Processing ${webhooks.length} webhooks in parallel...`);
        const promises = webhooks.map(webhook => this.processWebhook(webhook.source, webhook.payload, webhook.options));
        const results = await Promise.all(promises);
        const successful = results.filter(r => r.success).length;
        const failed = results.length - successful;
        console.log(`✅ Batch processing complete: ${successful} successful, ${failed} failed`);
        return results;
    }
    /**
     * Get available webhook handlers and their supported events
     */
    getAvailableHandlers() {
        const handlersInfo = {};
        for (const [source, handler] of this.handlers) {
            handlersInfo[source] = handler.getSupportedEvents();
        }
        return handlersInfo;
    }
    /**
     * Check if a handler can process a specific event type
     */
    canHandleEvent(source, eventType) {
        const handler = this.handlers.get(source);
        return handler ? handler.canHandle(eventType) : false;
    }
    /**
     * Get webhook processing statistics
     */
    getStats() {
        return { ...this.stats };
    }
    /**
     * Reset statistics
     */
    resetStats() {
        this.stats = this.initializeStats();
        console.log('📊 Webhook statistics reset');
    }
    /**
     * Get a specific webhook handler by source
     */
    getHandler(source) {
        return (0, ComponentMapDecorators_1.getComponent)(WebhookHandler_1.WebhookHandler, source);
    }
    /**
     * Get all webhook handlers
     */
    getAllHandlers() {
        return (0, ComponentMapDecorators_1.getAllComponents)(WebhookHandler_1.WebhookHandler);
    }
    /**
     * Get detailed information about registered handlers
     */
    getHandlerInfo() {
        return Array.from(this.handlers.entries()).map(([source, handler]) => ({
            source,
            supportedEvents: handler.getSupportedEvents(),
            canHandleAll: handler.getSupportedEvents().includes('*'),
            processingStats: this.stats.handlerStats[source] || {
                processed: 0,
                errors: 0,
                averageTime: 0
            }
        }));
    }
    /**
     * Find the best handler for a webhook source
     */
    getHandlerForSource(source, fallbackToGeneric = true) {
        // Try direct match first
        const directHandler = this.handlers.get(source);
        if (directHandler) {
            return directHandler;
        }
        // If no direct match and fallback is enabled, try generic handler
        if (fallbackToGeneric) {
            const genericHandler = this.handlers.get('generic');
            if (genericHandler) {
                console.log(`⚠️ No specific handler for ${source}, using generic handler`);
                return genericHandler;
            }
        }
        return undefined;
    }
    /**
     * Update processing statistics
     */
    updateStats(source, success, processingTime) {
        this.stats.processedWebhooks++;
        if (!success) {
            this.stats.processingErrors++;
        }
        // Update handler-specific stats
        if (!this.stats.handlerStats[source]) {
            this.stats.handlerStats[source] = {
                processed: 0,
                errors: 0,
                totalTime: 0,
                averageTime: 0
            };
        }
        const handlerStats = this.stats.handlerStats[source];
        handlerStats.processed++;
        handlerStats.totalTime += processingTime;
        handlerStats.averageTime = handlerStats.totalTime / handlerStats.processed;
        if (!success) {
            handlerStats.errors++;
        }
        // Update overall average processing time
        const totalProcessingTime = Object.values(this.stats.handlerStats)
            .reduce((sum, stats) => sum + stats.totalTime, 0);
        this.stats.averageProcessingTime = totalProcessingTime / this.stats.processedWebhooks;
    }
    /**
     * Initialize statistics structure
     */
    initializeStats() {
        return {
            totalHandlers: this.handlers?.size || 0,
            supportedProviders: this.handlers ? Array.from(this.handlers.keys()) : [],
            processedWebhooks: 0,
            validationFailures: 0,
            processingErrors: 0,
            averageProcessingTime: 0,
            handlerStats: {}
        };
    }
    /**
     * Update handler count in stats (call this after component discovery)
     */
    updateHandlerCount() {
        this.stats.totalHandlers = this.handlers.size;
        this.stats.supportedProviders = Array.from(this.handlers.keys());
    }
}
exports.WebhookService = WebhookService;
__decorate([
    (0, ComponentMapDecorators_1.ComponentMap)(WebhookHandler_1.WebhookHandler),
    __metadata("design:type", Map)
], WebhookService.prototype, "handlers", void 0);
//# sourceMappingURL=WebhookService.js.map