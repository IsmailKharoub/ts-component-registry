import { NotificationSender } from '../interfaces/NotificationSender';
import { NotificationType } from '../types/NotificationType';
/**
 * Manual SMS notification sender implementation
 * NO @Component decorator - requires manual registration 😩
 */
export declare class SMSSender implements NotificationSender {
    getType(): NotificationType;
    send(message: string): Promise<string>;
}
//# sourceMappingURL=SMSSender.d.ts.map