"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const ComponentMapDecorators_1 = require("../../decorators/ComponentMapDecorators");
const NotificationService_1 = require("./services/NotificationService");
const NotificationType_1 = require("./types/NotificationType");
async function main() {
    console.log('🚀 TypeScript Component Registry with Enum Support Example');
    console.log('📁 Organized with proper separation of concerns!\n');
    // Auto-discover all @Component decorated classes
    await (0, ComponentMapDecorators_1.initializeComponentMaps)(['dist']);
    const notificationService = new NotificationService_1.NotificationService();
    // Show service statistics
    const stats = notificationService.getStats();
    console.log('📊 Service Statistics:');
    console.log(`   Total Senders: ${stats.totalSenders}`);
    console.log(`   Available Types: [${stats.availableTypes.join(', ')}]`);
    console.log(`   Registered Classes: ${stats.registeredSenders.map(s => s.senderClass).join(', ')}\n`);
    // Send different types of notifications using enum values
    console.log('📤 Sending notifications...');
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
    // Demonstrate runtime error handling
    try {
        const invalidType = 'fax';
        await notificationService.sendNotification(invalidType, 'This will fail at runtime!');
    }
    catch (error) {
        console.log('\n❌ Runtime Error:', error.message);
    }
    // Show all available enum values
    console.log('\n🔍 All NotificationType enum values:');
    Object.values(NotificationType_1.NotificationType).forEach(type => {
        console.log(`  - ${type}`);
    });
}
// Run the example
if (require.main === module) {
    main().catch(console.error);
}
//# sourceMappingURL=index.js.map