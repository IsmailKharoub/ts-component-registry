import { NotificationSender } from '../interfaces/NotificationSender';
import { NotificationType } from '../types/NotificationType';
export declare class SlackSender implements NotificationSender {
    getType(): NotificationType;
    send(message: string): Promise<string>;
}
//# sourceMappingURL=SlackSender.d.ts.map