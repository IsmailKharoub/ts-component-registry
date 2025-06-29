import { Component } from '../../../decorators/ComponentMapDecorators';
import { NotificationSender } from '../interfaces/NotificationSender';
import { NotificationType } from '../types/NotificationType';

/**
 * Email notification sender implementation
 */
@Component(NotificationSender)
export class EmailSender extends NotificationSender {
  getComponentMapKey(): NotificationType { 
    return NotificationType.EMAIL;
  }
  
  async send(message: string): Promise<string> {
    // In a real implementation, this would integrate with an email service like SendGrid, SES, etc.
    return `📧 Email sent: ${message}`;
  }
} 