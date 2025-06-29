"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushSender = void 0;
const NotificationType_1 = require("../types/NotificationType");
class PushSender {
    getType() {
        return NotificationType_1.NotificationType.PUSH;
    }
    async send(message) {
        return `🔔 Push notification sent: ${message}`;
    }
}
exports.PushSender = PushSender;
//# sourceMappingURL=PushSender.js.map