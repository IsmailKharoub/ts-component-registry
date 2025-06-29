import { Component } from '../../../decorators/ComponentMapDecorators';
import { NotificationSender } from '../interfaces/NotificationSender';
import { NotificationType } from '../types/NotificationType';

/**
 * Slack notification sender implementation
 */
@Component(NotificationSender)
export class SlackSender extends NotificationSender {
  getComponentMapKey(): NotificationType { 
    return NotificationType.SLACK;
  }
  
  async send(message: string): Promise<string> {
    // In a real implementation, this would use Slack Web API or webhooks
    return `💬 Slack message sent: ${message}`;
  }
} 