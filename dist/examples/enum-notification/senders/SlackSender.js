"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackSender = void 0;
const ComponentMapDecorators_1 = require("../../../decorators/ComponentMapDecorators");
const NotificationSender_1 = require("../interfaces/NotificationSender");
const NotificationType_1 = require("../types/NotificationType");
/**
 * Slack notification sender implementation
 */
let SlackSender = class SlackSender extends NotificationSender_1.NotificationSender {
    getComponentMapKey() {
        return NotificationType_1.NotificationType.SLACK;
    }
    async send(message) {
        // In a real implementation, this would use Slack Web API or webhooks
        return `💬 Slack message sent: ${message}`;
    }
};
exports.SlackSender = SlackSender;
exports.SlackSender = SlackSender = __decorate([
    (0, ComponentMapDecorators_1.Component)(NotificationSender_1.NotificationSender)
], SlackSender);
//# sourceMappingURL=SlackSender.js.map