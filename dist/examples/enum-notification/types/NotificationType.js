"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationType = void 0;
/**
 * Enum defining all supported notification types
 * This provides compile-time type safety and prevents typos
 */
var NotificationType;
(function (NotificationType) {
    NotificationType["EMAIL"] = "email";
    NotificationType["SMS"] = "sms";
    NotificationType["PUSH"] = "push";
    NotificationType["SLACK"] = "slack";
    NotificationType["WEBHOOK"] = "webhook";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
//# sourceMappingURL=NotificationType.js.map