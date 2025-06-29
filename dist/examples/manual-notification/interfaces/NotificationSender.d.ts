import { NotificationType } from '../types/NotificationType';
/**
 * Manual interface for notification senders
 * WITHOUT library support - no ComponentMapKey base class
 */
export interface NotificationSender {
    /**
     * Manually implement this method in each sender
     * No automatic registration or type safety
     */
    getType(): NotificationType;
    send(message: string): Promise<string>;
}
//# sourceMappingURL=NotificationSender.d.ts.map