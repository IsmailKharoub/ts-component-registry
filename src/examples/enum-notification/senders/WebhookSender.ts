import { Component } from '../../../decorators/ComponentMapDecorators';
import { NotificationSender } from '../interfaces/NotificationSender';
import { NotificationType } from '../types/NotificationType';

/**
 * Webhook notification sender implementation
 */
@Component(NotificationSender)
export class WebhookSender extends NotificationSender {
  getComponentMapKey(): NotificationType { 
    return NotificationType.WEBHOOK;
  }
  
  async send(message: string): Promise<string> {
    // In a real implementation, this would make HTTP requests to configured webhooks
    return `🔗 Webhook sent: ${message}`;
  }
} 