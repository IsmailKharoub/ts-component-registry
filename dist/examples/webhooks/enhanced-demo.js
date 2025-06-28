"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runEnhancedWebhookDemo = void 0;
require("reflect-metadata");
const ComponentMapDecorators_1 = require("../../decorators/ComponentMapDecorators");
const EnhancedWebhookService_1 = require("./EnhancedWebhookService");
/**
 * Enhanced Webhook System Demo
 * Showcases nested ComponentMap for managing handlers per event type
 * Demonstrates provider:event_type -> handler mapping with automatic discovery
 */
async function runEnhancedWebhookDemo() {
    console.log('🚀 Enhanced Webhook System Demo - Nested ComponentMap Showcase');
    console.log('='.repeat(80));
    console.log('🎯 Key Features Demonstrated:');
    console.log('  • Nested ComponentMap structure: provider:event_type -> handler');
    console.log('  • Automatic handler discovery with @Component(WebhookEventHandler)');
    console.log('  • Granular event routing and processing');
    console.log('  • Fallback mechanism hierarchy');
    console.log('  • Comprehensive analytics and statistics');
    console.log('  • Zero magic strings - everything is type-driven!');
    console.log();
    // Initialize component auto-discovery
    console.log('🔍 Initializing webhook event handler auto-discovery...');
    const scanDirs = __filename.includes('dist') ? ['dist/examples'] : ['src/examples'];
    await (0, ComponentMapDecorators_1.initializeComponentMaps)(scanDirs);
    // Create enhanced webhook service
    const webhookService = new EnhancedWebhookService_1.EnhancedWebhookService();
    webhookService.updateHandlerCount();
    // Show handler mapping structure
    console.log('\n📊 Auto-discovered Handler Mapping:');
    const handlerMapping = webhookService.getHandlerMapping();
    console.log('┌─────────────────────────────────────────────────────────────────┐');
    console.log('│ Provider:Event Type           → Handler Class                   │');
    console.log('├─────────────────────────────────────────────────────────────────┤');
    for (const [key, info] of Object.entries(handlerMapping)) {
        const type = info.isSpecific ? '🎯' : '🔧';
        const padding = ' '.repeat(Math.max(0, 30 - key.length));
        console.log(`│ ${type} ${key}${padding} → ${info.handlerClass}`.padEnd(66) + '│');
    }
    console.log('└─────────────────────────────────────────────────────────────────┘');
    // Show handler coverage
    console.log('\n📈 Handler Coverage Analysis:');
    const coverage = webhookService.getHandlerCoverage();
    console.log(`  📦 Total Handlers: ${coverage.totalHandlers}`);
    console.log(`  🎯 Specific Handlers: ${coverage.specificHandlers}`);
    console.log(`  🔧 Fallback Handlers: ${coverage.fallbackHandlers}`);
    console.log('\n  📋 Provider Coverage:');
    for (const [provider, providerCoverage] of Object.entries(coverage.providerCoverage)) {
        const events = providerCoverage.specificEvents.join(', ') || 'none';
        const fallback = providerCoverage.hasFallback ? '✅' : '❌';
        console.log(`    🏷️  ${provider}: ${providerCoverage.coverage} (events: ${events}, fallback: ${fallback})`);
    }
    // Test individual event processing
    console.log('\n🎭 Testing Individual Event Processing:');
    await testSpecificEventHandling(webhookService);
    // Test batch processing
    console.log('\n🚀 Testing Parallel Batch Processing:');
    await testBatchEventProcessing(webhookService);
    // Test fallback mechanisms
    console.log('\n🔄 Testing Fallback Mechanisms:');
    await testFallbackHandling(webhookService);
    // Simulate realistic webhook load
    console.log('\n📊 Simulating Realistic Webhook Load:');
    await simulateWebhookLoad(webhookService);
    // Show comprehensive statistics
    console.log('\n📊 Comprehensive Processing Statistics:');
    showDetailedStatistics(webhookService);
    console.log('\n🎉 Enhanced Webhook Demo Complete!');
    console.log('✨ Showcased Features:');
    console.log('  • Nested ComponentMap: provider:event_type → handler');
    console.log('  • Type-driven auto-discovery with zero magic strings');
    console.log('  • Granular event routing and specialized processing');
    console.log('  • Multi-level fallback mechanisms');
    console.log('  • Real-time analytics and performance monitoring');
    console.log('  • Enterprise-ready scalability and maintainability');
}
exports.runEnhancedWebhookDemo = runEnhancedWebhookDemo;
async function testSpecificEventHandling(service) {
    console.log('  🎯 Testing specific event handlers...');
    // Test Stripe payment success
    const stripeResult = await service.processWebhookEvent('stripe', 'payment_intent.succeeded', {
        id: 'pi_specific_test',
        amount: 4999,
        currency: 'usd',
        customer: 'cus_vip_customer',
        status: 'succeeded',
        payment_method_types: ['card']
    });
    console.log(`    ✅ Stripe Payment: ${stripeResult.success ? stripeResult.responseData?.action : stripeResult.error}`);
    // Test GitHub push
    const githubResult = await service.processWebhookEvent('github', 'push', {
        repository: { full_name: 'company/production-app' },
        ref: 'refs/heads/main',
        commits: [
            { id: 'commit1', message: 'Add new payment feature with tests', author: { name: 'developer' } },
            { id: 'commit2', message: 'Fix critical security vulnerability', author: { name: 'security-team' } }
        ],
        pusher: { name: 'developer' },
        head_commit: { id: 'commit2' }
    });
    console.log(`    ✅ GitHub Push: ${githubResult.success ? githubResult.responseData?.action : githubResult.error}`);
    // Test Discord message
    const discordResult = await service.processWebhookEvent('discord', 'message_create', {
        id: 'msg_specific_test',
        guild_id: 'guild_production',
        channel_id: 'channel_support',
        author: { id: 'user_customer', username: 'CustomerSupport', bot: false },
        content: 'Can someone help me with payment issues?',
        timestamp: new Date().toISOString()
    });
    console.log(`    ✅ Discord Message: ${discordResult.success ? discordResult.responseData?.action : discordResult.error}`);
}
async function testBatchEventProcessing(service) {
    console.log('  🔄 Processing multiple events in parallel...');
    const batchEvents = [
        {
            provider: 'stripe',
            eventType: 'customer.created',
            eventData: {
                id: 'cus_batch_001',
                email: 'batch1@example.com',
                name: 'Batch Customer 1',
                created: Math.floor(Date.now() / 1000)
            }
        },
        {
            provider: 'stripe',
            eventType: 'payment_intent.succeeded',
            eventData: {
                id: 'pi_batch_001',
                amount: 1999,
                currency: 'usd',
                customer: 'cus_batch_001'
            }
        },
        {
            provider: 'github',
            eventType: 'push',
            eventData: {
                repository: { full_name: 'user/feature-branch' },
                ref: 'refs/heads/feature/new-ui',
                commits: [{ id: 'ui-commit', message: 'Update UI components' }]
            }
        },
        {
            provider: 'discord',
            eventType: 'message_create',
            eventData: {
                id: 'msg_batch_001',
                guild_id: 'guild_dev',
                channel_id: 'channel_general',
                author: { username: 'Developer', bot: false },
                content: 'New deployment is live!'
            }
        }
    ];
    const batchResults = await service.processEventsBatch(batchEvents);
    const successful = batchResults.filter(r => r.success).length;
    console.log(`    ✅ Batch Results: ${successful}/${batchResults.length} events processed successfully`);
    // Show processing time breakdown
    batchResults.forEach((result, index) => {
        const event = batchEvents[index];
        const status = result.success ? '✅' : '❌';
        console.log(`      ${status} ${event.provider}:${event.eventType} - ${result.executionTimeMs.toFixed(2)}ms`);
    });
}
async function testFallbackHandling(service) {
    console.log('  🔧 Testing fallback mechanisms...');
    // Test unknown event type for known provider
    const unknownEvent = await service.processWebhookEvent('stripe', 'unknown_event_type', { id: 'test_unknown', data: 'test' });
    console.log(`    🔧 Unknown Stripe Event: ${unknownEvent.success ? 'Handled by fallback' : unknownEvent.error}`);
    // Test completely unknown provider
    const unknownProvider = await service.processWebhookEvent('shopify', 'order.created', {
        id: 'order_123',
        total: 299.99,
        customer: { email: 'customer@example.com' }
    });
    console.log(`    🔧 Unknown Provider: ${unknownProvider.success ? 'Handled by generic fallback' : unknownProvider.error}`);
    // Test complex unknown event
    const complexUnknown = await service.processWebhookEvent('custom_saas', 'subscription.billing.failed', {
        subscription_id: 'sub_custom_123',
        customer: { id: 'cust_456', tier: 'enterprise' },
        billing: { amount: 999.99, currency: 'USD', attempt: 3 },
        metadata: { priority: 'high', team: 'billing' }
    });
    console.log(`    🔧 Complex Unknown: ${complexUnknown.success ? 'Analyzed and processed' : complexUnknown.error}`);
}
async function simulateWebhookLoad(service) {
    console.log('  📊 Simulating realistic webhook load...');
    const loadEvents = [];
    // Generate diverse webhook events
    for (let i = 0; i < 20; i++) {
        const eventTypes = [
            { provider: 'stripe', eventType: 'payment_intent.succeeded', weight: 30 },
            { provider: 'stripe', eventType: 'customer.created', weight: 20 },
            { provider: 'github', eventType: 'push', weight: 25 },
            { provider: 'discord', eventType: 'message_create', weight: 15 },
            { provider: 'unknown', eventType: 'custom.event', weight: 10 }
        ];
        // Weighted random selection
        const random = Math.random() * 100;
        let cumulative = 0;
        let selectedEvent = eventTypes[0];
        for (const eventType of eventTypes) {
            cumulative += eventType.weight;
            if (random <= cumulative) {
                selectedEvent = eventType;
                break;
            }
        }
        loadEvents.push({
            provider: selectedEvent.provider,
            eventType: selectedEvent.eventType,
            eventData: generateEventData(selectedEvent.provider, selectedEvent.eventType, i),
            metadata: { simulation: true, iteration: i }
        });
    }
    const startTime = performance.now();
    const loadResults = await service.processEventsBatch(loadEvents);
    const totalTime = performance.now() - startTime;
    const successful = loadResults.filter(r => r.success).length;
    const avgTime = loadResults.reduce((sum, r) => sum + r.executionTimeMs, 0) / loadResults.length;
    console.log(`    📊 Load Test Results:`);
    console.log(`      🎯 Events: ${loadResults.length} processed in ${totalTime.toFixed(2)}ms`);
    console.log(`      ✅ Success Rate: ${((successful / loadResults.length) * 100).toFixed(1)}%`);
    console.log(`      ⚡ Average Time: ${avgTime.toFixed(2)}ms per event`);
    console.log(`      🚀 Throughput: ${(loadResults.length / (totalTime / 1000)).toFixed(1)} events/second`);
}
function generateEventData(provider, eventType, iteration) {
    switch (`${provider}:${eventType}`) {
        case 'stripe:payment_intent.succeeded':
            return {
                id: `pi_load_${iteration}`,
                amount: Math.floor(Math.random() * 10000) + 1000,
                currency: ['usd', 'eur', 'gbp'][iteration % 3],
                customer: `cus_load_${iteration}`,
                status: 'succeeded'
            };
        case 'stripe:customer.created':
            return {
                id: `cus_load_${iteration}`,
                email: `load${iteration}@example.com`,
                name: `Load Customer ${iteration}`,
                created: Math.floor(Date.now() / 1000)
            };
        case 'github:push':
            return {
                repository: { full_name: `user/repo-${iteration}` },
                ref: 'refs/heads/main',
                commits: [{ id: `commit_${iteration}`, message: `Load test commit ${iteration}` }]
            };
        case 'discord:message_create':
            return {
                id: `msg_load_${iteration}`,
                guild_id: `guild_${iteration % 5}`,
                channel_id: `channel_${iteration % 3}`,
                author: { username: `LoadUser${iteration}`, bot: false },
                content: `Load test message ${iteration}`
            };
        default:
            return {
                id: `event_${iteration}`,
                type: eventType,
                data: { iteration, random: Math.random() }
            };
    }
}
function showDetailedStatistics(service) {
    const stats = service.getEnhancedStats();
    console.log('┌─────────────────────────────────────────────────────────────────┐');
    console.log('│                    PROCESSING STATISTICS                        │');
    console.log('├─────────────────────────────────────────────────────────────────┤');
    console.log(`│ Total Handlers: ${stats.totalHandlers.toString().padEnd(47)} │`);
    console.log(`│ Events Processed: ${stats.processedEvents.toString().padEnd(45)} │`);
    console.log(`│ Processing Errors: ${stats.processingErrors.toString().padEnd(44)} │`);
    console.log(`│ Average Time: ${stats.averageProcessingTime.toFixed(2)}ms`.padEnd(66) + '│');
    console.log('├─────────────────────────────────────────────────────────────────┤');
    console.log('│                   HANDLER BREAKDOWN                            │');
    console.log('├─────────────────────────────────────────────────────────────────┤');
    for (const [provider, count] of Object.entries(stats.handlersByProvider)) {
        const events = stats.eventTypesCovered[provider]?.join(', ') || 'none';
        console.log(`│ ${provider}: ${count} handlers (${events})`.padEnd(66) + '│');
    }
    console.log('├─────────────────────────────────────────────────────────────────┤');
    console.log('│                   PROVIDER PERFORMANCE                         │');
    console.log('├─────────────────────────────────────────────────────────────────┤');
    for (const [provider, providerStats] of Object.entries(stats.providerStats)) {
        if (providerStats.totalEvents > 0) {
            console.log(`│ ${provider}:`.padEnd(20) +
                `${providerStats.totalEvents} events, ` +
                `${providerStats.errorRate.toFixed(1)}% errors, ` +
                `${providerStats.averageTime.toFixed(2)}ms avg`.padEnd(46) + '│');
        }
    }
    console.log('├─────────────────────────────────────────────────────────────────┤');
    console.log('│                   TOP EVENT HANDLERS                           │');
    console.log('├─────────────────────────────────────────────────────────────────┤');
    const topEvents = Object.entries(stats.eventStats)
        .sort(([, a], [, b]) => b.processed - a.processed)
        .slice(0, 5);
    for (const [handlerKey, eventStats] of topEvents) {
        if (eventStats.processed > 0) {
            console.log(`│ ${handlerKey}: `.padEnd(35) +
                `${eventStats.processed} processed, ` +
                `${eventStats.averageTime.toFixed(2)}ms avg`.padEnd(31) + '│');
        }
    }
    console.log('└─────────────────────────────────────────────────────────────────┘');
}
// Run the demo if this file is executed directly
if (require.main === module) {
    runEnhancedWebhookDemo().catch(console.error);
}
//# sourceMappingURL=enhanced-demo.js.map