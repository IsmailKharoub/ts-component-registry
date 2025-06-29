import { ComponentMapKey } from '../../../core/ComponentMapKey';
import { NotificationType } from '../types/NotificationType';

/**
 * Abstract base class for notification senders
 * Each implementation must provide a unique enum key and send method
 */
export abstract class NotificationSender extends ComponentMapKey<NotificationType> {
  abstract send(message: string): Promise<string>;
} 