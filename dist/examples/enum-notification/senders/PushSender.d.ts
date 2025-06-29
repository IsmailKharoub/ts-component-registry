import { NotificationSender } from '../interfaces/NotificationSender';
import { NotificationType } from '../types/NotificationType';
/**
 * Push notification sender implementation
 */
export declare class PushSender extends NotificationSender {
    getComponentMapKey(): NotificationType;
    send(message: string): Promise<string>;
}
//# sourceMappingURL=PushSender.d.ts.map