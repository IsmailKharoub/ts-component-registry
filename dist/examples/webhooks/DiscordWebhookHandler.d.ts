import { WebhookHandler, WebhookPayload, WebhookResult, WebhookValidation } from './WebhookHandler';
/**
 * Discord webhook handler for chat events and interactions
 * Handles Discord-specific webhook events like messages, reactions, etc.
 */
export declare class DiscordWebhookHandler extends WebhookHandler {
    getComponentMapKey(): string;
    getSupportedEvents(): string[];
    validateWebhook(payload: WebhookPayload, secret: string): Promise<WebhookValidation>;
    processWebhook(payload: WebhookPayload): Promise<WebhookResult>;
    transformPayload(rawPayload: any): WebhookPayload;
    private handleMessageCreate;
    private handleMessageUpdate;
    private handleMessageDelete;
    private handleReactionAdd;
    private handleMemberJoin;
    private handleMemberLeave;
    private handleVoiceStateUpdate;
    private handleInteraction;
    private simulateDelay;
}
//# sourceMappingURL=DiscordWebhookHandler.d.ts.map