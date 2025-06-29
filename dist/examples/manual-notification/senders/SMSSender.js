"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMSSender = void 0;
const NotificationType_1 = require("../types/NotificationType");
/**
 * Manual SMS notification sender implementation
 * NO @Component decorator - requires manual registration 😩
 */
class SMSSender {
    getType() {
        return NotificationType_1.NotificationType.SMS;
    }
    async send(message) {
        // In a real implementation, this would integrate with Twilio, AWS SNS, etc.
        return `📱 SMS sent: ${message}`;
    }
}
exports.SMSSender = SMSSender;
//# sourceMappingURL=SMSSender.js.map