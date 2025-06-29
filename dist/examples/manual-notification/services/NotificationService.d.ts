import { NotificationType } from '../types/NotificationType';
/**
 * MANUAL NotificationService - Shows all the boilerplate code needed
 * without the ts-component-registry library 😩
 *
 * Problems with this approach:
 * ❌ Manual registration of every sender
 * ❌ Easy to forget adding new senders
 * ❌ Error-prone maintenance
 * ❌ No automatic discovery
 * ❌ Lots of boilerplate code
 * ❌ Manual dependency management
 */
export declare class NotificationService {
    private senders;
    constructor();
    /**
     * Send a notification using the specified type
     */
    sendNotification(type: NotificationType, message: string): Promise<string>;
    /**
     * Get all available notification types
     */
    getAvailableTypes(): NotificationType[];
    /**
     * 😩 MANUAL TYPE-SAFE METHODS - Still need to implement manually
     */
    sendEmail(message: string): Promise<string>;
    sendSMS(message: string): Promise<string>;
    sendPush(message: string): Promise<string>;
    sendSlack(message: string): Promise<string>;
    sendWebhook(message: string): Promise<string>;
    /**
     * Manual statistics - no automatic discovery help
     */
    getStats(): {
        totalSenders: number;
        availableTypes: NotificationType[];
        registeredSenders: {
            type: NotificationType;
            senderClass: string;
        }[];
    };
}
//# sourceMappingURL=NotificationService.d.ts.map