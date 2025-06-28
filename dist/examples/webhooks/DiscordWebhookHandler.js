"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordWebhookHandler = void 0;
const ComponentMapDecorators_1 = require("../../decorators/ComponentMapDecorators");
const WebhookHandler_1 = require("./WebhookHandler");
/**
 * Discord webhook handler for chat events and interactions
 * Handles Discord-specific webhook events like messages, reactions, etc.
 */
let DiscordWebhookHandler = class DiscordWebhookHandler extends WebhookHandler_1.WebhookHandler {
    getComponentMapKey() {
        return 'discord';
    }
    getSupportedEvents() {
        return [
            'message_create',
            'message_update',
            'message_delete',
            'message_reaction_add',
            'message_reaction_remove',
            'guild_member_add',
            'guild_member_remove',
            'voice_state_update',
            'interaction_create'
        ];
    }
    async validateWebhook(payload, secret) {
        this.log('info', 'Validating Discord webhook');
        // Discord webhooks often use application verification
        // For this demo, we'll do a simple token check
        if (!payload.data.token || payload.data.token !== secret) {
            return {
                isValid: false,
                reason: 'Invalid or missing Discord bot token'
            };
        }
        // Check if the payload has required Discord fields
        if (!payload.data.guild_id && !payload.data.channel_id) {
            return {
                isValid: false,
                reason: 'Missing required Discord webhook fields'
            };
        }
        this.log('info', 'Discord webhook validation passed');
        return { isValid: true };
    }
    async processWebhook(payload) {
        this.log('info', `Processing Discord webhook: ${payload.type}`, {
            id: payload.id,
            guild: payload.data.guild_id,
            channel: payload.data.channel_id
        });
        const { result, timeMs } = await this.withTiming(async () => {
            switch (payload.type) {
                case 'message_create':
                    return await this.handleMessageCreate(payload);
                case 'message_update':
                    return await this.handleMessageUpdate(payload);
                case 'message_delete':
                    return await this.handleMessageDelete(payload);
                case 'message_reaction_add':
                    return await this.handleReactionAdd(payload);
                case 'guild_member_add':
                    return await this.handleMemberJoin(payload);
                case 'guild_member_remove':
                    return await this.handleMemberLeave(payload);
                case 'voice_state_update':
                    return await this.handleVoiceStateUpdate(payload);
                case 'interaction_create':
                    return await this.handleInteraction(payload);
                default:
                    this.log('warn', `Unhandled Discord event type: ${payload.type}`);
                    return { message: `Event type ${payload.type} processed (no specific handler)` };
            }
        });
        this.log('info', `Discord webhook processed successfully in ${timeMs.toFixed(2)}ms`);
        return {
            success: true,
            handlerName: this.getComponentMapKey(),
            processedAt: new Date(),
            responseData: result,
            executionTimeMs: timeMs
        };
    }
    transformPayload(rawPayload) {
        // Discord-specific payload transformation
        return {
            id: rawPayload.id || this.generateId(),
            type: rawPayload.t || rawPayload.type || 'unknown',
            data: rawPayload.d || rawPayload,
            timestamp: new Date(rawPayload.timestamp || Date.now()),
            source: this.getComponentMapKey(),
            metadata: {
                guild_id: rawPayload.d?.guild_id,
                channel_id: rawPayload.d?.channel_id,
                author_id: rawPayload.d?.author?.id,
                bot: rawPayload.d?.author?.bot
            }
        };
    }
    async handleMessageCreate(payload) {
        const message = payload.data;
        this.log('info', `New message in ${message.guild_id}/${message.channel_id} from ${message.author.username}`);
        await this.simulateDelay(80);
        return {
            action: 'message_logged',
            messageId: message.id,
            guildId: message.guild_id,
            channelId: message.channel_id,
            author: message.author.username,
            content: message.content?.substring(0, 100) + (message.content?.length > 100 ? '...' : ''),
            attachments: message.attachments?.length || 0,
            mentions: message.mentions?.length || 0
        };
    }
    async handleMessageUpdate(payload) {
        const message = payload.data;
        this.log('info', `Message edited: ${message.id} in ${message.guild_id}/${message.channel_id}`);
        await this.simulateDelay(60);
        return {
            action: 'message_edited',
            messageId: message.id,
            guildId: message.guild_id,
            channelId: message.channel_id,
            author: message.author?.username,
            editedTimestamp: message.edited_timestamp
        };
    }
    async handleMessageDelete(payload) {
        const deletedMessage = payload.data;
        this.log('info', `Message deleted: ${deletedMessage.id} in ${deletedMessage.guild_id}/${deletedMessage.channel_id}`);
        await this.simulateDelay(70);
        return {
            action: 'message_deleted',
            messageId: deletedMessage.id,
            guildId: deletedMessage.guild_id,
            channelId: deletedMessage.channel_id
        };
    }
    async handleReactionAdd(payload) {
        const reaction = payload.data;
        this.log('info', `Reaction added: ${reaction.emoji.name} to message ${reaction.message_id}`);
        await this.simulateDelay(50);
        return {
            action: 'reaction_added',
            messageId: reaction.message_id,
            guildId: reaction.guild_id,
            channelId: reaction.channel_id,
            userId: reaction.user_id,
            emoji: reaction.emoji.name,
            emojiId: reaction.emoji.id
        };
    }
    async handleMemberJoin(payload) {
        const member = payload.data;
        this.log('info', `New member joined: ${member.user.username} in guild ${member.guild_id}`);
        await this.simulateDelay(120);
        return {
            action: 'member_joined',
            guildId: member.guild_id,
            userId: member.user.id,
            username: member.user.username,
            joinedAt: member.joined_at,
            roles: member.roles?.length || 0
        };
    }
    async handleMemberLeave(payload) {
        const member = payload.data;
        this.log('info', `Member left: ${member.user.username} from guild ${member.guild_id}`);
        await this.simulateDelay(100);
        return {
            action: 'member_left',
            guildId: member.guild_id,
            userId: member.user.id,
            username: member.user.username
        };
    }
    async handleVoiceStateUpdate(payload) {
        const voiceState = payload.data;
        this.log('info', `Voice state update for user ${voiceState.user_id} in guild ${voiceState.guild_id}`);
        await this.simulateDelay(90);
        return {
            action: 'voice_state_changed',
            guildId: voiceState.guild_id,
            userId: voiceState.user_id,
            channelId: voiceState.channel_id,
            muted: voiceState.mute,
            deafened: voiceState.deaf
        };
    }
    async handleInteraction(payload) {
        const interaction = payload.data;
        this.log('info', `Interaction: ${interaction.type} from ${interaction.user?.username || interaction.member?.user?.username}`);
        await this.simulateDelay(150);
        return {
            action: 'interaction_processed',
            interactionId: interaction.id,
            type: interaction.type,
            guildId: interaction.guild_id,
            channelId: interaction.channel_id,
            user: interaction.user?.username || interaction.member?.user?.username,
            commandName: interaction.data?.name
        };
    }
    async simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
exports.DiscordWebhookHandler = DiscordWebhookHandler;
exports.DiscordWebhookHandler = DiscordWebhookHandler = __decorate([
    (0, ComponentMapDecorators_1.Component)(WebhookHandler_1.WebhookHandler)
], DiscordWebhookHandler);
//# sourceMappingURL=DiscordWebhookHandler.js.map