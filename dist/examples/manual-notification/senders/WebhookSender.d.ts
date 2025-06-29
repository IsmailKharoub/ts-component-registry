import { NotificationSender } from '../interfaces/NotificationSender';
import { NotificationType } from '../types/NotificationType';
export declare class WebhookSender implements NotificationSender {
    getType(): NotificationType;
    send(message: string): Promise<string>;
}
//# sourceMappingURL=WebhookSender.d.ts.map