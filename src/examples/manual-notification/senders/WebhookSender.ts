import { NotificationSender } from '../interfaces/NotificationSender';
import { NotificationType } from '../types/NotificationType';

export class WebhookSender implements NotificationSender {
  getType(): NotificationType { 
    return NotificationType.WEBHOOK;
  }
  
  async send(message: string): Promise<string> {
    return `🔗 Webhook sent: ${message}`;
  }
} 