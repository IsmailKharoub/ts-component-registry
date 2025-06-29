"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSender = void 0;
const NotificationType_1 = require("../types/NotificationType");
/**
 * Manual Email notification sender implementation
 * NO @Component decorator - requires manual registration 😩
 */
class EmailSender {
    getType() {
        return NotificationType_1.NotificationType.EMAIL;
    }
    async send(message) {
        // In a real implementation, this would integrate with an email service like SendGrid, SES, etc.
        return `📧 Email sent: ${message}`;
    }
}
exports.EmailSender = EmailSender;
//# sourceMappingURL=EmailSender.js.map