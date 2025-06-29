import { Component } from '../../../decorators/ComponentMapDecorators';
import { NotificationSender } from '../interfaces/NotificationSender';
import { NotificationType } from '../types/NotificationType';

/**
 * SMS notification sender implementation
 */
@Component(NotificationSender)
export class SMSSender extends NotificationSender {
  getComponentMapKey(): NotificationType { 
    return NotificationType.SMS;
  }
  
  async send(message: string): Promise<string> {
    // In a real implementation, this would integrate with Twilio, AWS SNS, etc.
    return `📱 SMS sent: ${message}`;
  }
} 