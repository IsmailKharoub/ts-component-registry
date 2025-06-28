"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordMessageCreateHandler = void 0;
const ComponentMapDecorators_1 = require("../../../decorators/ComponentMapDecorators");
const WebhookEventHandler_1 = require("../WebhookEventHandler");
/**
 * Discord Message Create Event Handler
 * Handles discord:message_create events
 */
let DiscordMessageCreateHandler = class DiscordMessageCreateHandler extends WebhookEventHandler_1.WebhookEventHandler {
    getProvider() {
        return 'discord';
    }
    getEventType() {
        return 'message_create';
    }
    async processEvent(eventData, metadata) {
        const author = eventData.author?.username || 'unknown';
        const guildId = eventData.guild_id;
        const channelId = eventData.channel_id;
        this.log('info', 'Processing Discord message create event', {
            messageId: eventData.id,
            author,
            guild: guildId,
            channel: channelId
        });
        const { result, timeMs } = await this.withTiming(async () => {
            // Simulate message processing logic
            await this.simulateProcessing(80);
            const messageData = {
                messageId: eventData.id,
                guildId,
                channelId,
                author: {
                    id: eventData.author?.id,
                    username: eventData.author?.username,
                    discriminator: eventData.author?.discriminator,
                    isBot: eventData.author?.bot || false
                },
                content: eventData.content,
                attachments: eventData.attachments?.length || 0,
                mentions: eventData.mentions?.length || 0,
                timestamp: new Date(eventData.timestamp)
            };
            // Simulate message analysis and actions
            const analysis = await this.analyzeMessage(messageData);
            await this.moderateContent(messageData, analysis);
            await this.updateUserActivity(messageData);
            await this.checkForCommands(messageData);
            return {
                action: 'message_processed',
                message: messageData,
                analysis,
                moderation: {
                    flagged: analysis.containsInappropriateContent,
                    action: analysis.containsInappropriateContent ? 'content_flagged' : 'approved'
                },
                userActivity: {
                    updated: true,
                    streakIncremented: !messageData.author.isBot
                },
                botResponse: analysis.requiresResponse
            };
        });
        this.log('info', `Message processing completed in ${timeMs.toFixed(2)}ms`, {
            messageId: eventData.id,
            author,
            analysisScore: result?.analysis?.sentimentScore
        });
        return this.createResult(true, result, undefined, timeMs);
    }
    async analyzeMessage(messageData) {
        this.log('info', `Analyzing message from ${messageData.author.username}`);
        // Simulate message analysis
        await this.simulateProcessing(60);
        const content = messageData.content?.toLowerCase() || '';
        const hasQuestion = content.includes('?') || content.includes('help');
        const hasMention = messageData.mentions > 0;
        const hasAttachment = messageData.attachments > 0;
        return {
            sentimentScore: Math.random() * 2 - 1, // -1 to 1
            containsInappropriateContent: content.includes('spam') || content.includes('abuse'),
            requiresResponse: hasQuestion || hasMention,
            complexity: content.length + (hasAttachment ? 50 : 0),
            topics: this.extractTopics(content),
            engagement: {
                hasQuestion,
                hasMention,
                hasAttachment,
                wordCount: content.split(' ').length
            }
        };
    }
    async moderateContent(messageData, analysis) {
        if (analysis.containsInappropriateContent) {
            this.log('warn', `Flagging inappropriate content from ${messageData.author.username}`, {
                messageId: messageData.messageId
            });
            await this.simulateProcessing(100);
        }
    }
    async updateUserActivity(messageData) {
        if (!messageData.author.isBot) {
            this.log('info', `Updating activity for user ${messageData.author.username}`);
            await this.simulateProcessing(40);
        }
    }
    async checkForCommands(messageData) {
        const content = messageData.content || '';
        if (content.startsWith('!') || content.startsWith('/')) {
            this.log('info', `Processing potential bot command: ${content.substring(0, 20)}...`);
            await this.simulateProcessing(80);
        }
    }
    extractTopics(content) {
        const topics = [];
        if (content.includes('game') || content.includes('play'))
            topics.push('gaming');
        if (content.includes('code') || content.includes('bug'))
            topics.push('programming');
        if (content.includes('music') || content.includes('song'))
            topics.push('music');
        if (content.includes('help') || content.includes('support'))
            topics.push('support');
        return topics;
    }
    async simulateProcessing(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
exports.DiscordMessageCreateHandler = DiscordMessageCreateHandler;
exports.DiscordMessageCreateHandler = DiscordMessageCreateHandler = __decorate([
    (0, ComponentMapDecorators_1.Component)(WebhookEventHandler_1.WebhookEventHandler)
], DiscordMessageCreateHandler);
//# sourceMappingURL=DiscordMessageCreateHandler.js.map