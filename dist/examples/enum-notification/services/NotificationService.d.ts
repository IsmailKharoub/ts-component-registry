import { NotificationType } from '../types/NotificationType';
/**
 * Main notification service that coordinates all notification senders
 * Uses dependency injection to automatically get all registered senders
 */
export declare class NotificationService {
    private senders;
    /**
     * Send a notification using the specified type
     */
    sendNotification(type: NotificationType, message: string): Promise<string>;
    /**
     * Get all available notification types
     */
    getAvailableTypes(): NotificationType[];
    /**
     * Type-safe convenience methods for each notification type
     */
    sendEmail(message: string): Promise<string>;
    sendSMS(message: string): Promise<string>;
    sendPush(message: string): Promise<string>;
    sendSlack(message: string): Promise<string>;
    sendWebhook(message: string): Promise<string>;
    /**
     * Get statistics about available senders
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