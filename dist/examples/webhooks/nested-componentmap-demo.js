"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runNestedComponentMapDemo = void 0;
require("reflect-metadata");
const ComponentMapDecorators_1 = require("../../decorators/ComponentMapDecorators");
const WebhookService_1 = require("./WebhookService");
/**
 * Nested ComponentMap Demo
 * Showcases how ComponentMap can be used inside provider handlers
 * to manage event-specific handlers at a granular level
 */
async function runNestedComponentMapDemo() {
    console.log('🎯 Nested ComponentMap Demo - ComponentMap Inside Providers');
    console.log('='.repeat(70));
    console.log('📋 Architecture Overview:');
    console.log('  Level 1: Provider Handlers (WebhookHandler)');
    console.log('    └─ stripe → StripeWebhookHandler');
    console.log('    └─ github → GitHubWebhookHandler');
    console.log('    └─ discord → DiscordWebhookHandler');
    console.log('');
    console.log('  Level 2: Event Handlers (Inside Each Provider)');
    console.log('    └─ StripeWebhookHandler uses @ComponentMap(StripeEventHandler)');
    console.log('        ├─ payment_intent.succeeded → PaymentSucceededHandler');
    console.log('        ├─ customer.created → CustomerCreatedHandler');
    console.log('        └─ invoice.payment_succeeded → InvoicePaymentHandler');
    console.log('');
    // Initialize component auto-discovery
    console.log('🔍 Initializing nested ComponentMap auto-discovery...');
    const scanDirs = __filename.includes('dist') ? ['dist/examples'] : ['src/examples'];
    await (0, ComponentMapDecorators_1.initializeComponentMaps)(scanDirs);
    // Create webhook service
    const webhookService = new WebhookService_1.WebhookService();
    // Show provider-level handlers
    console.log('\n📊 Level 1: Auto-discovered Provider Handlers:');
    const providers = webhookService.getAvailableHandlers();
    for (const [provider, events] of Object.entries(providers)) {
        console.log(`  🏷️  ${provider}: ${events.length} event types supported`);
    }
    // Show nested event handlers for Stripe
    console.log('\n🎯 Level 2: Nested ComponentMap - Stripe Event Handlers:');
    await demonstrateStripeNestedHandlers(webhookService);
    // Test the nested routing
    console.log('\n🧪 Testing Nested ComponentMap Routing:');
    await testNestedRouting(webhookService);
    // Show the power of the nested pattern
    console.log('\n⚡ Benefits of Nested ComponentMap Pattern:');
    console.log('  ✅ Separation of Concerns: Provider logic vs Event logic');
    console.log('  ✅ Scalability: Easy to add new events within providers');
    console.log('  ✅ Maintainability: Each event handler is independent');
    console.log('  ✅ Type Safety: Full TypeScript support at all levels');
    console.log('  ✅ Auto-Discovery: Both levels use @Component decorators');
    console.log('  ✅ Flexibility: Mix of specific and generic handlers');
    console.log('\n🎉 Nested ComponentMap Demo Complete!');
    console.log('✨ This pattern shows how ComponentMap can be composed');
    console.log('   hierarchically for complex, multi-level architectures!');
}
exports.runNestedComponentMapDemo = runNestedComponentMapDemo;
async function demonstrateStripeNestedHandlers(webhookService) {
    // Get the Stripe handler and inspect its nested ComponentMap
    const stripeHandler = webhookService.getHandler('stripe');
    if (stripeHandler && 'getNestedComponentMapStats' in stripeHandler) {
        const stats = stripeHandler.getNestedComponentMapStats();
        console.log(`  📦 Total Stripe Event Handlers: ${stats.totalEventHandlers}`);
        console.log('  🎯 Nested Handler Mapping:');
        for (const detail of stats.handlerDetails) {
            console.log(`    └─ ${detail.eventType} → ${detail.handlerClass}`);
        }
        // Show additional handler info
        if ('getEventHandlerInfo' in stripeHandler) {
            const handlerInfo = stripeHandler.getEventHandlerInfo();
            console.log('\n  📋 Handler Descriptions:');
            for (const info of handlerInfo) {
                console.log(`    • ${info.handlerClass}: ${info.description}`);
            }
        }
    }
    else {
        console.log('  ⚠️  Stripe handler not found or doesn\'t support nested inspection');
    }
}
async function testNestedRouting(webhookService) {
    console.log('  🔄 Testing multi-level routing...\n');
    // Test 1: Stripe payment with nested handler
    console.log('  Test 1: Stripe Payment Event (Nested Handler)');
    const stripeResult = await webhookService.processWebhook('stripe', {
        id: 'evt_nested_test_1',
        type: 'payment_intent.succeeded',
        data: {
            object: {
                id: 'pi_nested_test',
                amount: 2999,
                currency: 'usd',
                customer: 'cus_nested_test',
                status: 'succeeded',
                payment_method_types: ['card']
            }
        },
        created: Math.floor(Date.now() / 1000)
    }, { validateSignature: false });
    if (stripeResult.success) {
        const routedTo = stripeResult.responseData?.routedTo;
        const eventResult = stripeResult.responseData?.eventResult;
        console.log(`    ✅ Level 1: Routed to StripeWebhookHandler`);
        console.log(`    ✅ Level 2: Routed to ${routedTo}`);
        console.log(`    ✅ Result: ${eventResult?.responseData?.action}`);
        console.log(`    ⚡ Total Processing: ${stripeResult.executionTimeMs.toFixed(2)}ms`);
    }
    else {
        console.log(`    ❌ Failed: ${stripeResult.error}`);
    }
    // Test 2: Stripe customer creation with nested handler
    console.log('\n  Test 2: Stripe Customer Event (Nested Handler)');
    const customerResult = await webhookService.processWebhook('stripe', {
        id: 'evt_nested_test_2',
        type: 'customer.created',
        data: {
            object: {
                id: 'cus_nested_test_2',
                email: 'nested@example.com',
                name: 'Nested Test Customer',
                created: Math.floor(Date.now() / 1000)
            }
        },
        created: Math.floor(Date.now() / 1000)
    }, { validateSignature: false });
    if (customerResult.success) {
        const routedTo = customerResult.responseData?.routedTo;
        const eventResult = customerResult.responseData?.eventResult;
        console.log(`    ✅ Level 1: Routed to StripeWebhookHandler`);
        console.log(`    ✅ Level 2: Routed to ${routedTo}`);
        console.log(`    ✅ Result: ${eventResult?.responseData?.action}`);
        console.log(`    ⚡ Total Processing: ${customerResult.executionTimeMs.toFixed(2)}ms`);
    }
    else {
        console.log(`    ❌ Failed: ${customerResult.error}`);
    }
    // Test 3: Unsupported Stripe event (fallback)
    console.log('\n  Test 3: Unsupported Stripe Event (Fallback)');
    const unsupportedResult = await webhookService.processWebhook('stripe', {
        id: 'evt_nested_test_3',
        type: 'subscription.trial_will_end',
        data: {
            object: {
                id: 'sub_unsupported_test',
                status: 'trialing'
            }
        },
        created: Math.floor(Date.now() / 1000)
    }, { validateSignature: false });
    if (unsupportedResult.success) {
        const routedTo = unsupportedResult.responseData?.routedTo;
        const suggestion = unsupportedResult.responseData?.suggestion;
        console.log(`    ✅ Level 1: Routed to StripeWebhookHandler`);
        console.log(`    ✅ Level 2: Routed to ${routedTo} (fallback)`);
        console.log(`    💡 Suggestion: ${suggestion}`);
        console.log(`    ⚡ Total Processing: ${unsupportedResult.executionTimeMs.toFixed(2)}ms`);
    }
    else {
        console.log(`    ❌ Failed: ${unsupportedResult.error}`);
    }
    // Test 4: Compare with provider that doesn't use nested ComponentMap
    console.log('\n  Test 4: Non-Nested Provider (GitHub)');
    const githubResult = await webhookService.processWebhook('github', {
        delivery: 'github_nested_test',
        event_type: 'push',
        repository: { full_name: 'user/nested-test-repo' },
        ref: 'refs/heads/main',
        commits: [
            { id: 'abc123', message: 'Test nested ComponentMap pattern' }
        ],
        pusher: { name: 'developer' },
        head_commit: { id: 'abc123' }
    }, { validateSignature: false });
    if (githubResult.success) {
        console.log(`    ✅ Level 1: Routed to GitHubWebhookHandler (traditional)`);
        console.log(`    ✅ Result: ${githubResult.responseData?.action}`);
        console.log(`    ⚡ Total Processing: ${githubResult.executionTimeMs.toFixed(2)}ms`);
    }
    else {
        console.log(`    ❌ Failed: ${githubResult.error}`);
    }
}
// Run the demo if this file is executed directly
if (require.main === module) {
    runNestedComponentMapDemo().catch(console.error);
}
//# sourceMappingURL=nested-componentmap-demo.js.map