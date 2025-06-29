import { NotificationSender } from '../interfaces/NotificationSender';
import { NotificationType } from '../types/NotificationType';

/**
 * Manual SMS notification sender implementation
 * NO @Component decorator - requires manual registration 😩
 */
export class SMSSender implements NotificationSender {
  getType(): NotificationType { 
    return NotificationType.SMS;
  }
  
  async send(message: string): Promise<string> {
    // In a real implementation, this would integrate with Twilio, AWS SNS, etc.
    return `📱 SMS sent: ${message}`;
  }
} 