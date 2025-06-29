import { NotificationSender } from '../interfaces/NotificationSender';
import { NotificationType } from '../types/NotificationType';
export declare class PushSender implements NotificationSender {
    getType(): NotificationType;
    send(message: string): Promise<string>;
}
//# sourceMappingURL=PushSender.d.ts.map