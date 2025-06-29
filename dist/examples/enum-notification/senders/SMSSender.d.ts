import { NotificationSender } from '../interfaces/NotificationSender';
import { NotificationType } from '../types/NotificationType';
/**
 * SMS notification sender implementation
 */
export declare class SMSSender extends NotificationSender {
    getComponentMapKey(): NotificationType;
    send(message: string): Promise<string>;
}
//# sourceMappingURL=SMSSender.d.ts.map