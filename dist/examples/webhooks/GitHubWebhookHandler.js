"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubWebhookHandler = void 0;
const ComponentMapDecorators_1 = require("../../decorators/ComponentMapDecorators");
const WebhookHandler_1 = require("./WebhookHandler");
const crypto = __importStar(require("crypto"));
/**
 * GitHub webhook handler with HMAC SHA256 signature validation
 * Handles GitHub-specific webhook events like push, pull requests, issues, etc.
 */
let GitHubWebhookHandler = class GitHubWebhookHandler extends WebhookHandler_1.WebhookHandler {
    getComponentMapKey() {
        return 'github';
    }
    getSupportedEvents() {
        return [
            'push',
            'pull_request',
            'issues',
            'issue_comment',
            'release',
            'star',
            'fork',
            'watch',
            'repository',
            'deployment',
            'workflow_run',
            'check_run'
        ];
    }
    async validateWebhook(payload, secret) {
        this.log('info', 'Validating GitHub webhook signature');
        if (!payload.signature) {
            return {
                isValid: false,
                reason: 'Missing X-Hub-Signature-256 header'
            };
        }
        try {
            // GitHub uses HMAC SHA256 with sha256= prefix
            const expectedSignature = 'sha256=' + crypto
                .createHmac('sha256', secret)
                .update(JSON.stringify(payload.data))
                .digest('hex');
            const actualSignature = payload.signature;
            const isValid = crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(actualSignature));
            if (isValid) {
                this.log('info', 'GitHub webhook signature validation passed');
                return { isValid: true };
            }
            else {
                this.log('warn', 'GitHub webhook signature validation failed');
                return {
                    isValid: false,
                    reason: 'Invalid signature',
                    expectedSignature,
                    actualSignature
                };
            }
        }
        catch (error) {
            this.log('error', 'Error during GitHub webhook validation', error);
            return {
                isValid: false,
                reason: `Validation error: ${error instanceof Error ? error.message : error}`
            };
        }
    }
    async processWebhook(payload) {
        this.log('info', `Processing GitHub webhook: ${payload.type}`, {
            id: payload.id,
            repository: payload.data.repository?.full_name
        });
        const { result, timeMs } = await this.withTiming(async () => {
            switch (payload.type) {
                case 'push':
                    return await this.handlePush(payload);
                case 'pull_request':
                    return await this.handlePullRequest(payload);
                case 'issues':
                    return await this.handleIssue(payload);
                case 'issue_comment':
                    return await this.handleIssueComment(payload);
                case 'release':
                    return await this.handleRelease(payload);
                case 'star':
                    return await this.handleStar(payload);
                case 'fork':
                    return await this.handleFork(payload);
                case 'workflow_run':
                    return await this.handleWorkflowRun(payload);
                default:
                    this.log('warn', `Unhandled GitHub event type: ${payload.type}`);
                    return { message: `Event type ${payload.type} processed (no specific handler)` };
            }
        });
        this.log('info', `GitHub webhook processed successfully in ${timeMs.toFixed(2)}ms`);
        return {
            success: true,
            handlerName: this.getComponentMapKey(),
            processedAt: new Date(),
            responseData: result,
            executionTimeMs: timeMs
        };
    }
    transformPayload(rawPayload) {
        // GitHub-specific payload transformation
        return {
            id: rawPayload.delivery || this.generateId(),
            type: rawPayload.event_type || rawPayload.action || 'unknown',
            data: rawPayload,
            timestamp: new Date(),
            source: this.getComponentMapKey(),
            signature: rawPayload.signature,
            metadata: {
                action: rawPayload.action,
                sender: rawPayload.sender?.login,
                repository: rawPayload.repository?.full_name,
                organization: rawPayload.organization?.login
            }
        };
    }
    async handlePush(payload) {
        const pushData = payload.data;
        const repository = pushData.repository.full_name;
        const branch = pushData.ref.replace('refs/heads/', '');
        const commits = pushData.commits || [];
        this.log('info', `Push to ${repository}:${branch} with ${commits.length} commits`);
        await this.simulateDelay(150);
        return {
            action: 'push_processed',
            repository,
            branch,
            commitCount: commits.length,
            pusher: pushData.pusher.name,
            headCommit: pushData.head_commit?.id
        };
    }
    async handlePullRequest(payload) {
        const pr = payload.data.pull_request;
        const action = payload.data.action;
        this.log('info', `Pull request ${action}: #${pr.number} in ${payload.data.repository.full_name}`);
        await this.simulateDelay(200);
        return {
            action: `pull_request_${action}`,
            repository: payload.data.repository.full_name,
            prNumber: pr.number,
            title: pr.title,
            author: pr.user.login,
            baseBranch: pr.base.ref,
            headBranch: pr.head.ref
        };
    }
    async handleIssue(payload) {
        const issue = payload.data.issue;
        const action = payload.data.action;
        this.log('info', `Issue ${action}: #${issue.number} in ${payload.data.repository.full_name}`);
        await this.simulateDelay(120);
        return {
            action: `issue_${action}`,
            repository: payload.data.repository.full_name,
            issueNumber: issue.number,
            title: issue.title,
            author: issue.user.login,
            labels: issue.labels.map((label) => label.name)
        };
    }
    async handleIssueComment(payload) {
        const comment = payload.data.comment;
        const issue = payload.data.issue;
        this.log('info', `Comment on issue #${issue.number} in ${payload.data.repository.full_name}`);
        await this.simulateDelay(100);
        return {
            action: 'issue_comment_created',
            repository: payload.data.repository.full_name,
            issueNumber: issue.number,
            commentId: comment.id,
            author: comment.user.login,
            body: comment.body.substring(0, 100) + (comment.body.length > 100 ? '...' : '')
        };
    }
    async handleRelease(payload) {
        const release = payload.data.release;
        const action = payload.data.action;
        this.log('info', `Release ${action}: ${release.tag_name} in ${payload.data.repository.full_name}`);
        await this.simulateDelay(180);
        return {
            action: `release_${action}`,
            repository: payload.data.repository.full_name,
            tagName: release.tag_name,
            name: release.name,
            author: release.author.login,
            prerelease: release.prerelease,
            draft: release.draft
        };
    }
    async handleStar(payload) {
        const action = payload.data.action;
        const repository = payload.data.repository;
        this.log('info', `Repository ${action === 'created' ? 'starred' : 'unstarred'}: ${repository.full_name}`);
        await this.simulateDelay(80);
        return {
            action: action === 'created' ? 'repository_starred' : 'repository_unstarred',
            repository: repository.full_name,
            starrer: payload.data.sender.login,
            starCount: repository.stargazers_count
        };
    }
    async handleFork(payload) {
        const forkee = payload.data.forkee;
        const repository = payload.data.repository;
        this.log('info', `Repository forked: ${repository.full_name} -> ${forkee.full_name}`);
        await this.simulateDelay(100);
        return {
            action: 'repository_forked',
            originalRepo: repository.full_name,
            forkedRepo: forkee.full_name,
            forker: payload.data.sender.login,
            forkCount: repository.forks_count
        };
    }
    async handleWorkflowRun(payload) {
        const workflowRun = payload.data.workflow_run;
        const action = payload.data.action;
        this.log('info', `Workflow ${action}: ${workflowRun.name} in ${payload.data.repository.full_name}`);
        await this.simulateDelay(160);
        return {
            action: `workflow_${action}`,
            repository: payload.data.repository.full_name,
            workflowName: workflowRun.name,
            status: workflowRun.status,
            conclusion: workflowRun.conclusion,
            branch: workflowRun.head_branch,
            triggeredBy: workflowRun.triggering_actor?.login
        };
    }
    async simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
exports.GitHubWebhookHandler = GitHubWebhookHandler;
exports.GitHubWebhookHandler = GitHubWebhookHandler = __decorate([
    (0, ComponentMapDecorators_1.Component)(WebhookHandler_1.WebhookHandler)
], GitHubWebhookHandler);
//# sourceMappingURL=GitHubWebhookHandler.js.map