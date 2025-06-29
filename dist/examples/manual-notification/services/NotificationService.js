"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const NotificationType_1 = require("../types/NotificationType");
// 😩 MANUAL IMPORTS - Must remember to import each sender
const EmailSender_1 = require("../senders/EmailSender");
const SMSSender_1 = require("../senders/SMSSender");
const PushSender_1 = require("../senders/PushSender");
const SlackSender_1 = require("../senders/SlackSender");
const WebhookSender_1 = require("../senders/WebhookSender");
/**
 * MANUAL NotificationService - Shows all the boilerplate code needed
 * without the ts-component-registry library 😩
 *
 * Problems with this approach:
 * ❌ Manual registration of every sender
 * ❌ Easy to forget adding new senders
 * ❌ Error-prone maintenance
 * ❌ No automatic discovery
 * ❌ Lots of boilerplate code
 * ❌ Manual dependency management
 */
class NotificationService {
    constructor() {
        // 😩 MANUAL REGISTRATION - Must manually instantiate and register each sender
        this.senders = new Map();
        // 😩 Must remember to add EVERY sender manually
        const emailSender = new EmailSender_1.EmailSender();
        this.senders.set(emailSender.getType(), emailSender);
        const smsSender = new SMSSender_1.SMSSender();
        this.senders.set(smsSender.getType(), smsSender);
        const pushSender = new PushSender_1.PushSender();
        this.senders.set(pushSender.getType(), pushSender);
        const slackSender = new SlackSender_1.SlackSender();
        this.senders.set(slackSender.getType(), slackSender);
        const webhookSender = new WebhookSender_1.WebhookSender();
        this.senders.set(webhookSender.getType(), webhookSender);
        // 😩 What if we add GooglePaySender? 
        // We MUST remember to:
        // 1. Import it at the top
        // 2. Instantiate it here  
        // 3. Register it manually
        // 4. Update all tests
        // EASY TO FORGET! 💥
    }
    /**
     * Send a notification using the specified type
     */
    async sendNotification(type, message) {
        const sender = this.senders.get(type);
        if (!sender) {
            throw new Error(`Unsupported notification type: ${type}`);
        }
        return sender.send(message);
    }
    /**
     * Get all available notification types
     */
    getAvailableTypes() {
        return Array.from(this.senders.keys());
    }
    /**
     * 😩 MANUAL TYPE-SAFE METHODS - Still need to implement manually
     */
    async sendEmail(message) {
        return this.sendNotification(NotificationType_1.NotificationType.EMAIL, message);
    }
    async sendSMS(message) {
        return this.sendNotification(NotificationType_1.NotificationType.SMS, message);
    }
    async sendPush(message) {
        return this.sendNotification(NotificationType_1.NotificationType.PUSH, message);
    }
    async sendSlack(message) {
        return this.sendNotification(NotificationType_1.NotificationType.SLACK, message);
    }
    async sendWebhook(message) {
        return this.sendNotification(NotificationType_1.NotificationType.WEBHOOK, message);
    }
    /**
     * Manual statistics - no automatic discovery help
     */
    getStats() {
        return {
            totalSenders: this.senders.size,
            availableTypes: this.getAvailableTypes(),
            // 😩 Must manually create this list
            registeredSenders: [
                { type: NotificationType_1.NotificationType.EMAIL, senderClass: 'EmailSender' },
                { type: NotificationType_1.NotificationType.SMS, senderClass: 'SMSSender' },
                { type: NotificationType_1.NotificationType.PUSH, senderClass: 'PushSender' },
                { type: NotificationType_1.NotificationType.SLACK, senderClass: 'SlackSender' },
                { type: NotificationType_1.NotificationType.WEBHOOK, senderClass: 'WebhookSender' }
                // 😩 Easy to forget updating this when adding new senders!
            ]
        };
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=NotificationService.js.map