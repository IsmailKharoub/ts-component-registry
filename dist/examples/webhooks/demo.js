"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runWebhookDemo = void 0;
require("reflect-metadata");
const ComponentMapDecorators_1 = require("../../decorators/ComponentMapDecorators");
const WebhookService_1 = require("./WebhookService");
/**
 * Comprehensive webhook handling demo
 * Shows type-driven auto-discovery and processing of webhooks from multiple providers
 */
async function runWebhookDemo() {
    console.log('🎯 Webhook Auto-Discovery Demo');
    console.log('='.repeat(50));
    // Initialize auto-discovery (like Spring Boot's component scan)
    console.log('🔍 Initializing webhook handler auto-discovery...');
    const scanDirs = __filename.includes('dist') ? ['dist/examples'] : ['src/examples'];
    await (0, ComponentMapDecorators_1.initializeComponentMaps)(scanDirs);
    // Create webhook service (handlers auto-injected via @ComponentMap!)
    const webhookService = new WebhookService_1.WebhookService();
    webhookService.updateHandlerCount(); // Update stats after discovery
    // Configure webhook secrets for validation
    webhookService.configureSecrets({
        'stripe': 'whsec_test_stripe_secret_123',
        'github': 'github_webhook_secret_456',
        'discord': 'discord_bot_token_789'
    });
    console.log('\n📊 Auto-discovered webhook handlers:');
    const handlers = webhookService.getAvailableHandlers();
    for (const [source, events] of Object.entries(handlers)) {
        const eventCount = events.includes('*') ? 'all events' : `${events.length} events`;
        console.log(`  🔧 ${source}: ${eventCount}`);
    }
    console.log('\n📈 Initial Statistics:');
    const initialStats = webhookService.getStats();
    console.log(`  📦 Total Handlers: ${initialStats.totalHandlers}`);
    console.log(`  🏷️  Providers: ${initialStats.supportedProviders.join(', ')}`);
    // Test individual webhook processing
    console.log('\n💳 Testing Stripe Payment Webhook:');
    await testStripeWebhook(webhookService);
    console.log('\n🐙 Testing GitHub Push Webhook:');
    await testGitHubWebhook(webhookService);
    console.log('\n💬 Testing Discord Message Webhook:');
    await testDiscordWebhook(webhookService);
    console.log('\n🔧 Testing Generic Webhook (Unknown Provider):');
    await testGenericWebhook(webhookService);
    console.log('\n🚀 Testing Parallel Webhook Processing:');
    await testParallelWebhooks(webhookService);
    console.log('\n❌ Testing Error Handling:');
    await testErrorHandling(webhookService);
    // Show final statistics
    console.log('\n📊 Final Processing Statistics:');
    const finalStats = webhookService.getStats();
    console.log(`  📨 Total Processed: ${finalStats.processedWebhooks}`);
    console.log(`  ✅ Success Rate: ${((finalStats.processedWebhooks - finalStats.processingErrors) / finalStats.processedWebhooks * 100).toFixed(1)}%`);
    console.log(`  ⚡ Average Time: ${finalStats.averageProcessingTime.toFixed(2)}ms`);
    console.log(`  ❌ Validation Failures: ${finalStats.validationFailures}`);
    console.log(`  🐛 Processing Errors: ${finalStats.processingErrors}`);
    console.log('\n📋 Handler-Specific Statistics:');
    const handlerInfo = webhookService.getHandlerInfo();
    for (const info of handlerInfo) {
        const stats = info.processingStats;
        console.log(`  🔧 ${info.source}: ${stats.processed} processed, ${stats.errors} errors, ${stats.averageTime.toFixed(2)}ms avg`);
    }
    console.log('\n🎉 Webhook Demo Complete!');
    console.log('✨ All handlers were auto-discovered via @ComponentMap(WebhookHandler)');
    console.log('🎯 Zero magic strings - everything is type-driven!');
}
exports.runWebhookDemo = runWebhookDemo;
async function testStripeWebhook(service) {
    const stripePayload = {
        id: 'evt_test_webhook',
        type: 'payment_intent.succeeded',
        data: {
            object: {
                id: 'pi_test_123456',
                amount: 9999,
                currency: 'usd',
                customer: 'cus_test_customer',
                status: 'succeeded'
            }
        },
        created: Math.floor(Date.now() / 1000),
        livemode: false,
        api_version: '2023-10-16',
        signature: 'sha256=test_signature_would_be_here'
    };
    const result = await service.processWebhook('stripe', stripePayload, {
        validateSignature: false // Skip validation for demo
    });
    if (result.success) {
        console.log(`  ✅ Stripe webhook processed: ${result.responseData?.action}`);
        console.log(`  💰 Payment: $${result.responseData?.amount} for customer ${result.responseData?.customer}`);
    }
    else {
        console.log(`  ❌ Failed: ${result.error}`);
    }
}
async function testGitHubWebhook(service) {
    const githubPayload = {
        delivery: 'github_delivery_123',
        event_type: 'push',
        ref: 'refs/heads/main',
        repository: {
            full_name: 'user/awesome-repo',
            stargazers_count: 1337
        },
        commits: [
            { id: 'abc123', message: 'Fix critical bug' },
            { id: 'def456', message: 'Add new feature' }
        ],
        pusher: { name: 'developer' },
        head_commit: { id: 'def456' },
        signature: 'sha256=github_signature_here'
    };
    const result = await service.processWebhook('github', githubPayload, {
        validateSignature: false
    });
    if (result.success) {
        console.log(`  ✅ GitHub webhook processed: ${result.responseData?.action}`);
        console.log(`  📚 Repository: ${result.responseData?.repository}`);
        console.log(`  📝 Commits: ${result.responseData?.commitCount}`);
    }
    else {
        console.log(`  ❌ Failed: ${result.error}`);
    }
}
async function testDiscordWebhook(service) {
    const discordPayload = {
        t: 'message_create',
        d: {
            id: 'discord_msg_123',
            guild_id: 'guild_456',
            channel_id: 'channel_789',
            author: {
                id: 'user_123',
                username: 'CoolUser',
                bot: false
            },
            content: 'Hello from Discord!',
            attachments: [],
            mentions: [],
            token: 'discord_bot_token_789' // Match our configured secret
        }
    };
    const result = await service.processWebhook('discord', discordPayload);
    if (result.success) {
        console.log(`  ✅ Discord webhook processed: ${result.responseData?.action}`);
        console.log(`  👤 Author: ${result.responseData?.author}`);
        console.log(`  📝 Content: ${result.responseData?.content}`);
    }
    else {
        console.log(`  ❌ Failed: ${result.error}`);
    }
}
async function testGenericWebhook(service) {
    const customPayload = {
        event_id: 'custom_event_123',
        event_type: 'user_signup',
        data: {
            user: {
                id: 'user_789',
                email: 'user@example.com',
                name: 'John Doe'
            },
            subscription: {
                plan: 'premium',
                amount: 29.99
            },
            timestamp: new Date().toISOString()
        },
        source: 'custom_app'
    };
    const result = await service.processWebhook('unknown_provider', customPayload, {
        fallbackToGeneric: true
    });
    if (result.success) {
        console.log(`  ✅ Generic webhook processed: ${result.responseData?.action}`);
        console.log(`  🔍 Analysis: ${JSON.stringify(result.responseData?.analysis, null, 2)}`);
        console.log(`  📊 Extracted: ${JSON.stringify(result.responseData?.extractedFields, null, 2)}`);
    }
    else {
        console.log(`  ❌ Failed: ${result.error}`);
    }
}
async function testParallelWebhooks(service) {
    const webhooks = [
        {
            source: 'stripe',
            payload: {
                type: 'customer.created',
                data: { object: { id: 'cus_parallel_1', email: 'customer1@test.com' } }
            },
            options: { validateSignature: false }
        },
        {
            source: 'github',
            payload: {
                event_type: 'star',
                action: 'created',
                repository: { full_name: 'user/repo', stargazers_count: 100 },
                sender: { login: 'stargazer' }
            },
            options: { validateSignature: false }
        },
        {
            source: 'discord',
            payload: {
                t: 'guild_member_add',
                d: {
                    guild_id: 'guild_123',
                    user: { id: 'new_user', username: 'NewMember' },
                    token: 'discord_bot_token_789'
                }
            }
        }
    ];
    const results = await service.processWebhooksBatch(webhooks);
    const successful = results.filter(r => r.success).length;
    console.log(`  🎯 Processed ${results.length} webhooks in parallel: ${successful} successful`);
    results.forEach((result, index) => {
        const status = result.success ? '✅' : '❌';
        console.log(`    ${status} ${webhooks[index].source}: ${result.executionTimeMs.toFixed(2)}ms`);
    });
}
async function testErrorHandling(service) {
    // Test with unsupported provider (no fallback)
    const result1 = await service.processWebhook('unsupported_provider', { test: 'data' }, {
        fallbackToGeneric: false
    });
    console.log(`  🚫 Unsupported provider: ${result1.success ? 'Unexpected success' : result1.error}`);
    // Test with invalid payload
    const result2 = await service.processWebhook('generic', null, {
        validateSignature: false
    });
    console.log(`  🚫 Invalid payload: ${result2.success ? 'Unexpected success' : result2.error}`);
    // Test with validation failure
    const result3 = await service.processWebhook('stripe', {
        type: 'test',
        data: { object: {} },
        signature: 'invalid_signature'
    }, {
        requireValidation: true
    });
    console.log(`  🚫 Validation failure: ${result3.success ? 'Unexpected success' : result3.error}`);
}
// Run the demo if this file is executed directly
if (require.main === module) {
    runWebhookDemo().catch(console.error);
}
//# sourceMappingURL=demo.js.map