import { NotificationSender } from "../interfaces/NotificationSender";
import { NotificationType } from "../types/NotificationType";

import { EmailSender } from "../senders/EmailSender";
import { SMSSender } from "../senders/SMSSender";
import { PushSender } from "../senders/PushSender";
import { SlackSender } from "../senders/SlackSender";
import { WebhookSender } from "../senders/WebhookSender";

export class NotificationService {
  private senders: Map<NotificationType, NotificationSender>;

  constructor() {
    this.senders = new Map();

    const emailSender = new EmailSender();
    this.senders.set(emailSender.getType(), emailSender);

    const smsSender = new SMSSender();
    this.senders.set(smsSender.getType(), smsSender);

    const pushSender = new PushSender();
    this.senders.set(pushSender.getType(), pushSender);

    const slackSender = new SlackSender();
    this.senders.set(slackSender.getType(), slackSender);

    const webhookSender = new WebhookSender();
    this.senders.set(webhookSender.getType(), webhookSender);
  }

  /**
   * Send a notification using the specified type
   */
  async sendNotification(
    type: NotificationType,
    message: string
  ): Promise<string> {
    const sender = this.senders.get(type);
    if (!sender) {
      throw new Error(`Unsupported notification type: ${type}`);
    }
    return sender.send(message);
  }

  /**
   * Get all available notification types
   */
  getAvailableTypes(): NotificationType[] {
    return Array.from(this.senders.keys());
  }

  async sendEmail(message: string): Promise<string> {
    return this.sendNotification(NotificationType.EMAIL, message);
  }

  async sendSMS(message: string): Promise<string> {
    return this.sendNotification(NotificationType.SMS, message);
  }

  async sendPush(message: string): Promise<string> {
    return this.sendNotification(NotificationType.PUSH, message);
  }

  async sendSlack(message: string): Promise<string> {
    return this.sendNotification(NotificationType.SLACK, message);
  }

  async sendWebhook(message: string): Promise<string> {
    return this.sendNotification(NotificationType.WEBHOOK, message);
  }

  /**
   * Manual statistics - no automatic discovery help
   */
  getStats() {
    return {
      totalSenders: this.senders.size,
      availableTypes: this.getAvailableTypes(),
      registeredSenders: [
        { type: NotificationType.EMAIL, senderClass: "EmailSender" },
        { type: NotificationType.SMS, senderClass: "SMSSender" },
        { type: NotificationType.PUSH, senderClass: "PushSender" },
        { type: NotificationType.SLACK, senderClass: "SlackSender" },
        { type: NotificationType.WEBHOOK, senderClass: "WebhookSender" },
      ],
    };
  }
}
