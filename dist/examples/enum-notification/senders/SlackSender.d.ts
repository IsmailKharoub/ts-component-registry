import { NotificationSender } from '../interfaces/NotificationSender';
import { NotificationType } from '../types/NotificationType';
/**
 * Slack notification sender implementation
 */
export declare class SlackSender extends NotificationSender {
    getComponentMapKey(): NotificationType;
    send(message: string): Promise<string>;
}
//# sourceMappingURL=SlackSender.d.ts.map