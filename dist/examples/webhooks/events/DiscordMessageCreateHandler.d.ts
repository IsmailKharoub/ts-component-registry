import { WebhookEventHandler, WebhookEventResult } from '../WebhookEventHandler';
/**
 * Discord Message Create Event Handler
 * Handles discord:message_create events
 */
export declare class DiscordMessageCreateHandler extends WebhookEventHandler {
    getProvider(): string;
    getEventType(): string;
    processEvent(eventData: any, metadata?: any): Promise<WebhookEventResult>;
    private analyzeMessage;
    private moderateContent;
    private updateUserActivity;
    private checkForCommands;
    private extractTopics;
    private simulateProcessing;
}
//# sourceMappingURL=DiscordMessageCreateHandler.d.ts.map