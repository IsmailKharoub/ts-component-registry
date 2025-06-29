import { NotificationSender } from '../interfaces/NotificationSender';
import { NotificationType } from '../types/NotificationType';

export class PushSender implements NotificationSender {
  getType(): NotificationType { 
    return NotificationType.PUSH;
  }
  
  async send(message: string): Promise<string> {
    return `🔔 Push notification sent: ${message}`;
  }
} 