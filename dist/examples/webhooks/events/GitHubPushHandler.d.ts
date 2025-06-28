import { WebhookEventHandler, WebhookEventResult } from '../WebhookEventHandler';
/**
 * GitHub Push Event Handler
 * Handles github:push events
 */
export declare class GitHubPushHandler extends WebhookEventHandler {
    getProvider(): string;
    getEventType(): string;
    processEvent(eventData: any, metadata?: any): Promise<WebhookEventResult>;
    private triggerCICD;
    private updateDeploymentStatus;
    private notifyTeam;
    private updateProjectMetrics;
    private simulateProcessing;
}
//# sourceMappingURL=GitHubPushHandler.d.ts.map