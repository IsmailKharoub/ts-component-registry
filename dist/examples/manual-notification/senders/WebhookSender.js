"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookSender = void 0;
const NotificationType_1 = require("../types/NotificationType");
class WebhookSender {
    getType() {
        return NotificationType_1.NotificationType.WEBHOOK;
    }
    async send(message) {
        return `🔗 Webhook sent: ${message}`;
    }
}
exports.WebhookSender = WebhookSender;
//# sourceMappingURL=WebhookSender.js.map