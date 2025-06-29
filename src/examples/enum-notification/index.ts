import 'reflect-metadata';
import { initializeComponentMaps } from '../../decorators/ComponentMapDecorators';
import { NotificationService } from './services/NotificationService';
import { NotificationType } from './types/NotificationType';

async function main() {
  console.log('🚀 TypeScript Component Registry with Enum Support Example');
  console.log('📁 Organized with proper separation of concerns!\n');
  
  // Auto-discover all @Component decorated classes
  await initializeComponentMaps(['dist']);
  
  const notificationService = new NotificationService();
  
  // Show service statistics
  const stats = notificationService.getStats();
  console.log('📊 Service Statistics:');
  console.log(`   Total Senders: ${stats.totalSenders}`);
  console.log(`   Available Types: [${stats.availableTypes.join(', ')}]`);
  console.log(`   Registered Classes: ${stats.registeredSenders.map(s => s.senderClass).join(', ')}\n`);
  
  // Send different types of notifications using enum values
  console.log('📤 Sending notifications...');
  
  const emailResult = await notificationService.sendNotification(NotificationType.EMAIL, 'Welcome to our app!');
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
    const invalidType = 'fax' as any as NotificationType;
    await notificationService.sendNotification(invalidType, 'This will fail at runtime!');
  } catch (error) {
    console.log('\n❌ Runtime Error:', (error as Error).message);
  }
  
  // Show all available enum values
  console.log('\n🔍 All NotificationType enum values:');
  Object.values(NotificationType).forEach(type => {
    console.log(`  - ${type}`);
  });
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
} 