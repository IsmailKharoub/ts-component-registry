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
require("reflect-metadata");
const index_1 = require("../../index");
// 1️⃣ Define an enum for notification types
var NotificationType;
(function (NotificationType) {
    NotificationType["EMAIL"] = "email";
    NotificationType["SMS"] = "sms";
    NotificationType["PUSH"] = "push";
    NotificationType["SLACK"] = "slack";
    NotificationType["WEBHOOK"] = "webhook";
})(NotificationType || (NotificationType = {}));
// 2️⃣ Define your component base class using the enum
class NotificationSender extends index_1.ComponentMapKey {
}
// 3️⃣ Implement with @Component decorator using enum values
let EmailSender = class EmailSender extends NotificationSender {
    getComponentMapKey() {
        return NotificationType.EMAIL;
    }
    async send(message) {
        return `📧 Email sent: ${message}`;
    }
};
EmailSender = __decorate([
    (0, index_1.Component)(NotificationSender)
], EmailSender);
let SMSSender = class SMSSender extends NotificationSender {
    getComponentMapKey() {
        return NotificationType.SMS;
    }
    async send(message) {
        return `📱 SMS sent: ${message}`;
    }
};
SMSSender = __decorate([
    (0, index_1.Component)(NotificationSender)
], SMSSender);
let PushSender = class PushSender extends NotificationSender {
    getComponentMapKey() {
        return NotificationType.PUSH;
    }
    async send(message) {
        return `🔔 Push notification sent: ${message}`;
    }
};
PushSender = __decorate([
    (0, index_1.Component)(NotificationSender)
], PushSender);
let SlackSender = class SlackSender extends NotificationSender {
    getComponentMapKey() {
        return NotificationType.SLACK;
    }
    async send(message) {
        return `💬 Slack message sent: ${message}`;
    }
};
SlackSender = __decorate([
    (0, index_1.Component)(NotificationSender)
], SlackSender);
let WebhookSender = class WebhookSender extends NotificationSender {
    getComponentMapKey() {
        return NotificationType.WEBHOOK;
    }
    async send(message) {
        return `🔗 Webhook sent: ${message}`;
    }
};
WebhookSender = __decorate([
    (0, index_1.Component)(NotificationSender)
], WebhookSender);
// 4️⃣ Use with automatic injection - now with enum type safety!
class NotificationService {
    async sendNotification(type, message) {
        const sender = this.senders.get(type);
        if (!sender) {
            throw new Error(`Unsupported notification type: ${type}`);
        }
        return sender.send(message);
    }
    getAvailableTypes() {
        console.log('🔍 Available notification types:', Array.from(this.senders));
        return Array.from(this.senders.keys());
    }
    // Type-safe methods for each notification type
    async sendEmail(message) {
        return this.sendNotification(NotificationType.EMAIL, message);
    }
    async sendSMS(message) {
        return this.sendNotification(NotificationType.SMS, message);
    }
    async sendPush(message) {
        return this.sendNotification(NotificationType.PUSH, message);
    }
    async sendSlack(message) {
        return this.sendNotification(NotificationType.SLACK, message);
    }
    async sendWebhook(message) {
        return this.sendNotification(NotificationType.WEBHOOK, message);
    }
}
__decorate([
    (0, index_1.ComponentMap)(NotificationSender),
    __metadata("design:type", Map)
], NotificationService.prototype, "senders", void 0);
// 5️⃣ Initialize and use with full enum type safety
async function main() {
    console.log('🚀 TypeScript Component Registry with Enum Support Example');
    // Auto-discover all @Component decorated classes
    await (0, index_1.initializeComponentMaps)(['dist']);
    const notificationService = new NotificationService();
    console.log('\n📋 Available notification types:', notificationService.getAvailableTypes());
    // Send different types of notifications using enum values
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
    // Demonstrate type safety - this will show compile-time error if you use wrong enum
    try {
        // This works - using proper enum value
        await notificationService.sendNotification(NotificationType.EMAIL, 'This works!');
        // Now let's demonstrate runtime error by trying to use an invalid enum value
        // We'll simulate what happens if someone bypasses TypeScript checks
        const invalidType = 'fax';
        await notificationService.sendNotification(invalidType, 'This will fail at runtime!');
    }
    catch (error) {
        console.log('\n❌ Runtime Error:', error.message);
    }
    // Also demonstrate the difference between enum and string
    console.log('\n🔒 Type Safety Demonstration:');
    console.log('✅ Using enum:', NotificationType.EMAIL);
    console.log('❌ Raw string would cause TypeScript error at compile time');
    console.log('   // This line would fail TypeScript compilation:');
    console.log('   // await notificationService.sendNotification("email", "message");');
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
//# sourceMappingURL=example.js.map