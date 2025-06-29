"use strict";
// 😩 NO reflect-metadata needed but NO automation either!
// This is the OLD WAY - lots of boilerplate and error-prone maintenance
Object.defineProperty(exports, "__esModule", { value: true });
// Import the manual service and types
const NotificationService_1 = require("./services/NotificationService");
const NotificationType_1 = require("./types/NotificationType");
/**
 * MANUAL APPROACH Demo - Shows what you have to do WITHOUT ts-component-registry
 *
 * 🚨 PROBLEMS WITH THIS APPROACH:
 * ❌ Manual registration of every component
 * ❌ Easy to forget adding new components
 * ❌ Error-prone maintenance
 * ❌ Lots of boilerplate code
 * ❌ No automatic discovery
 * ❌ Manual dependency management
 * ❌ Must remember to import everything
 * ❌ Must manually update constructor when adding components
 * ❌ No compile-time safety for missing registrations
 */
async function main() {
    console.log('😩 MANUAL Notification System (WITHOUT ts-component-registry)');
    console.log('📁 Shows all the boilerplate code your library eliminates!\n');
    // 😩 NO automatic discovery - everything is manual
    console.log('🔧 Manual Setup Required:');
    console.log('   ❌ Import each sender class manually');
    console.log('   ❌ Instantiate each sender in constructor');
    console.log('   ❌ Register each sender manually');
    console.log('   ❌ Update constructor when adding new senders');
    console.log('   ❌ Remember to update imports');
    console.log('   ❌ Update statistics manually\n');
    // Manual instantiation - no magic, just boilerplate 😩
    const notificationService = new NotificationService_1.NotificationService();
    // Show service statistics
    const stats = notificationService.getStats();
    console.log('📊 Manual Service Statistics:');
    console.log(`   Total Senders: ${stats.totalSenders}`);
    console.log(`   Available Types: [${stats.availableTypes.join(', ')}]`);
    console.log(`   Manually Registered: ${stats.registeredSenders.map(s => s.senderClass).join(', ')}\n`);
    // Send notifications - same API but lots of hidden complexity 😩
    console.log('📤 Sending notifications (same API, lots of hidden boilerplate)...');
    const emailResult = await notificationService.sendNotification(NotificationType_1.NotificationType.EMAIL, 'Welcome to our app!');
    console.log(emailResult);
    const smsResult = await notificationService.sendSMS('Your verification code is 123456');
    console.log(smsResult);
    const pushResult = await notificationService.sendPush('New message received');
    console.log(pushResult);
    const slackResult = await notificationService.sendSlack('Deployment successful! 🎉');
    console.log(slackResult);
    const webhookResult = await notificationService.sendWebhook('User action detected');
    console.log(webhookResult);
    // Error handling works the same
    try {
        const invalidType = 'fax';
        await notificationService.sendNotification(invalidType, 'This will fail at runtime!');
    }
    catch (error) {
        console.log('\n❌ Runtime Error:', error.message);
    }
    // Show the pain points
    console.log('\n🔥 PAIN POINTS of Manual Approach:');
    console.log('\n1. 😩 Adding a new sender (e.g., TeamsNotificationSender):');
    console.log('   ❌ Step 1: Create the class file');
    console.log('   ❌ Step 2: Add import to NotificationService');
    console.log('   ❌ Step 3: Add manual instantiation in constructor');
    console.log('   ❌ Step 4: Add manual registration call');
    console.log('   ❌ Step 5: Update getStats() method manually');
    console.log('   ❌ Step 6: Remember to update tests');
    console.log('   ❌ Step 7: Hope you didn\'t forget anything!');
    console.log('\n2. 😩 What happens when you forget a step?');
    console.log('   💥 Runtime errors!');
    console.log('   💥 Missing functionality!');
    console.log('   💥 Inconsistent behavior!');
    console.log('   💥 Hard-to-debug issues!');
    console.log('\n3. 😩 Maintenance nightmare:');
    console.log('   🐛 Easy to introduce bugs');
    console.log('   🐛 No compile-time safety');
    console.log('   🐛 Must manually keep everything in sync');
    console.log('   🐛 Code reviews become error-prone');
    console.log('\n✨ VS ts-component-registry approach:');
    console.log('   ✅ Just add @Component decorator');
    console.log('   ✅ Automatic discovery');
    console.log('   ✅ Zero boilerplate');
    console.log('   ✅ Type-safe');
    console.log('   ✅ Compile-time errors if you mess up');
    console.log('   ✅ No manual registration needed');
    console.log('\n📊 Code Comparison:');
    console.log('   😩 Manual approach: ~200+ lines of boilerplate');
    console.log('   ✨ With ts-component-registry: ~50 lines + decorators');
    console.log('   🎉 75% less code + automatic safety!');
    console.log('\n📁 File Structure (Manual):');
    console.log('  src/examples/manual-notification/');
    console.log('  ├── types/NotificationType.ts      # Same enum');
    console.log('  ├── interfaces/NotificationSender.ts # Plain interface (no ComponentMapKey)');
    console.log('  ├── senders/                       # NO @Component decorators');
    console.log('  │   ├── EmailSender.ts             # Manual implementation');
    console.log('  │   ├── SMSSender.ts               # Manual implementation');
    console.log('  │   ├── PushSender.ts              # Manual implementation');
    console.log('  │   ├── SlackSender.ts             # Manual implementation');
    console.log('  │   └── WebhookSender.ts           # Manual implementation');
    console.log('  ├── services/NotificationService.ts # 😩 LOTS of boilerplate');
    console.log('  └── index.ts                       # Manual demo');
    console.log('\n🎯 The Value Proposition is Clear:');
    console.log('   ts-component-registry eliminates ALL this boilerplate! 🚀');
}
// Run the manual example
if (require.main === module) {
    main().catch(console.error);
}
//# sourceMappingURL=index.js.map