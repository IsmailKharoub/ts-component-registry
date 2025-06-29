import { NotificationSender } from '../interfaces/NotificationSender';
import { NotificationType } from '../types/NotificationType';
/**
 * Webhook notification sender implementation
 */
export declare class WebhookSender extends NotificationSender {
    getComponentMapKey(): NotificationType;
    send(message: string): Promise<string>;
}
//# sourceMappingURL=WebhookSender.d.ts.map