import { NotificationSender } from '../interfaces/NotificationSender';
import { NotificationType } from '../types/NotificationType';
/**
 * Email notification sender implementation
 */
export declare class EmailSender extends NotificationSender {
    getComponentMapKey(): NotificationType;
    send(message: string): Promise<string>;
}
//# sourceMappingURL=EmailSender.d.ts.map