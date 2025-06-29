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
exports.NotificationService = void 0;
const ComponentMapDecorators_1 = require("../../../decorators/ComponentMapDecorators");
const NotificationSender_1 = require("../interfaces/NotificationSender");
const NotificationType_1 = require("../types/NotificationType");
/**
 * Main notification service that coordinates all notification senders
 * Uses dependency injection to automatically get all registered senders
 */
class NotificationService {
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
     * Type-safe convenience methods for each notification type
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
     * Get statistics about available senders
     */
    getStats() {
        return {
            totalSenders: this.senders.size,
            availableTypes: this.getAvailableTypes(),
            registeredSenders: Array.from(this.senders.entries()).map(([type, sender]) => ({
                type,
                senderClass: sender.constructor.name
            }))
        };
    }
}
exports.NotificationService = NotificationService;
__decorate([
    (0, ComponentMapDecorators_1.ComponentMap)(NotificationSender_1.NotificationSender),
    __metadata("design:type", Map)
], NotificationService.prototype, "senders", void 0);
//# sourceMappingURL=NotificationService.js.map