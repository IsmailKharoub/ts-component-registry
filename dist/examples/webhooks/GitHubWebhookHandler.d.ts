import { WebhookHandler, WebhookPayload, WebhookResult, WebhookValidation } from './WebhookHandler';
/**
 * GitHub webhook handler with HMAC SHA256 signature validation
 * Handles GitHub-specific webhook events like push, pull requests, issues, etc.
 */
export declare class GitHubWebhookHandler extends WebhookHandler {
    getComponentMapKey(): string;
    getSupportedEvents(): string[];
    validateWebhook(payload: WebhookPayload, secret: string): Promise<WebhookValidation>;
    processWebhook(payload: WebhookPayload): Promise<WebhookResult>;
    transformPayload(rawPayload: any): WebhookPayload;
    private handlePush;
    private handlePullRequest;
    private handleIssue;
    private handleIssueComment;
    private handleRelease;
    private handleStar;
    private handleFork;
    private handleWorkflowRun;
    private simulateDelay;
}
//# sourceMappingURL=GitHubWebhookHandler.d.ts.map