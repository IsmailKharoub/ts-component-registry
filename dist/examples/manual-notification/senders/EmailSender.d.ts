import { NotificationSender } from '../interfaces/NotificationSender';
import { NotificationType } from '../types/NotificationType';
/**
 * Manual Email notification sender implementation
 * NO @Component decorator - requires manual registration 😩
 */
export declare class EmailSender implements NotificationSender {
    getType(): NotificationType;
    send(message: string): Promise<string>;
}
//# sourceMappingURL=EmailSender.d.ts.map