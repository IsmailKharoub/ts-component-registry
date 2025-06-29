import { ComponentMap } from '../../../decorators/ComponentMapDecorators';
import { NotificationSender } from '../interfaces/NotificationSender';
import { NotificationType } from '../types/NotificationType';

/**
 * Main notification service that coordinates all notification senders
 * Uses dependency injection to automatically get all registered senders
 */
export class NotificationService {
  @ComponentMap(NotificationSender)
  private senders!: Map<NotificationType, NotificationSender>;
  
  /**
   * Send a notification using the specified type
   */
  async sendNotification(type: NotificationType, message: string): Promise<string> {
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
  
  /**
   * Type-safe convenience methods for each notification type
   */
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