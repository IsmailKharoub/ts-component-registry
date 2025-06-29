"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackSender = void 0;
const NotificationType_1 = require("../types/NotificationType");
class SlackSender {
    getType() {
        return NotificationType_1.NotificationType.SLACK;
    }
    async send(message) {
        return `💬 Slack message sent: ${message}`;
    }
}
exports.SlackSender = SlackSender;
//# sourceMappingURL=SlackSender.js.map