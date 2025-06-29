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
// 1️⃣ Define your component base class
class NotificationSender extends index_1.ComponentMapKey {
}
// 2️⃣ Implement with @Component decorator
let EmailSender = class EmailSender extends NotificationSender {
    getComponentMapKey() {
        return 'email';
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
        return 'sms';
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
        return 'push';
    }
    async send(message) {
        return `🔔 Push notification sent: ${message}`;
    }
};
PushSender = __decorate([
    (0, index_1.Component)(NotificationSender)
], PushSender);
// 3️⃣ Use with automatic injection
class NotificationService {
    async sendNotification(type, message) {
        const sender = this.senders.get(type);
        if (!sender) {
            throw new Error(`Unsupported notification type: ${type}`);
        }
        return sender.send(message);
    }
    getAvailableTypes() {
        return Array.from(this.senders.keys());
    }
}
__decorate([
    (0, index_1.ComponentMap)(NotificationSender),
    __metadata("design:type", Map)
], NotificationService.prototype, "senders", void 0);
// 4️⃣ Initialize and use
async function main() {
    console.log('🚀 Simple TypeScript Component Registry Example');
    // Auto-discover all @Component decorated classes
    await (0, index_1.initializeComponentMaps)(['dist']);
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
    }
    catch (error) {
        console.log('❌ Error:', error.message);
    }
}
// Run the example
if (require.main === module) {
    main().catch(console.error);
}
//# sourceMappingURL=example.js.map