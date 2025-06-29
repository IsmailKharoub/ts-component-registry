import 'reflect-metadata';
import { Component, ComponentMap, initializeComponentMaps, ComponentMapKey } from '../../index';

// 1️⃣ Define your component base class
abstract class NotificationSender extends ComponentMapKey<string> {
  abstract send(message: string): Promise<string>;
}

// 2️⃣ Implement with @Component decorator
@Component(NotificationSender)
class EmailSender extends NotificationSender {
  getComponentMapKey(): string { 
    return 'email'; 
  }
  
  async send(message: string): Promise<string> {
    return `📧 Email sent: ${message}`;
  }
}

@Component(NotificationSender)
class SMSSender extends NotificationSender {
  getComponentMapKey(): string { 
    return 'sms'; 
  }
  
  async send(message: string): Promise<string> {
    return `📱 SMS sent: ${message}`;
  }
}

@Component(NotificationSender)
class PushSender extends NotificationSender {
  getComponentMapKey(): string { 
    return 'push'; 
  }
  
  async send(message: string): Promise<string> {
    return `🔔 Push notification sent: ${message}`;
  }
}

// 3️⃣ Use with automatic injection
class NotificationService {
  @ComponentMap(NotificationSender)
  private senders!: Map<string, NotificationSender>;
  
  async sendNotification(type: string, message: string): Promise<string> {
    const sender = this.senders.get(type);
    if (!sender) {
      throw new Error(`Unsupported notification type: ${type}`);
    }
    return sender.send(message);
  }
  
  getAvailableTypes(): string[] {
    return Array.from(this.senders.keys());
  }
}

// 4️⃣ Initialize and use
async function main() {
  console.log('🚀 Simple TypeScript Component Registry Example');
  
  // Auto-discover all @Component decorated classes
  await initializeComponentMaps(['dist']);
  
  const notificationService = new NotificationService();
  
  console.log('\n📋 Available notification types:', notificationService.getAvailableTypes());
  
  // Send different types of notifications
  const emailResult = await notificationService.sendNotification('email', 'Welcome to our app!');
  console.log(emailResult);
  
  const smsResult = await notificationService.sendNotification('sms', 'Your verification code is 123456');
  console.log(smsResult);
  
  const pushResult = await notificationService.sendNotification('push', 'New message received');
  console.log(pushResult);
  
  // Try an unsupported type
  try {
    await notificationService.sendNotification('fax', 'This will fail');
  } catch (error) {
    console.log('❌ Error:', (error as Error).message);
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
} 