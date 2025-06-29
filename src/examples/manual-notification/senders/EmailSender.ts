import { NotificationSender } from '../interfaces/NotificationSender';
import { NotificationType } from '../types/NotificationType';

/**
 * Manual Email notification sender implementation
 * NO @Component decorator - requires manual registration 😩
 */
export class EmailSender implements NotificationSender {
  getType(): NotificationType { 
    return NotificationType.EMAIL;
  }
  
  async send(message: string): Promise<string> {
    // In a real implementation, this would integrate with an email service like SendGrid, SES, etc.
    return `📧 Email sent: ${message}`;
  }
} 