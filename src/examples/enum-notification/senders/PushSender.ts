import { Component } from '../../../decorators/ComponentMapDecorators';
import { NotificationSender } from '../interfaces/NotificationSender';
import { NotificationType } from '../types/NotificationType';

/**
 * Push notification sender implementation
 */
@Component(NotificationSender)
export class PushSender extends NotificationSender {
  getComponentMapKey(): NotificationType { 
    return NotificationType.PUSH;
  }
  
  async send(message: string): Promise<string> {
    // In a real implementation, this would integrate with Firebase, Apple Push, etc.
    return `🔔 Push notification sent: ${message}`;
  }
} 