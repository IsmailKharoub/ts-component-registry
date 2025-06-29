import { NotificationSender } from '../interfaces/NotificationSender';
import { NotificationType } from '../types/NotificationType';

export class SlackSender implements NotificationSender {
  getType(): NotificationType { 
    return NotificationType.SLACK;
  }
  
  async send(message: string): Promise<string> {
    return `💬 Slack message sent: ${message}`;
  }
} 