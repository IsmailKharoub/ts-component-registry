/**
 * Types and enums for messaging example
 */

export enum MessageProvider {
    VONAGE = 'vonage',
    TWILIO = 'twilio'
}

export enum MessageType {
    SMS = 'sms',
    MMS = 'mms',
    WHATSAPP = 'whatsapp'
}

export interface SendMessageDTO {
    to: string;
    from: string;
    text: string;
    type: MessageType;
    media?: string[]; // For MMS attachments
    template?: string; // For WhatsApp templates
}

export interface MessageResponse {
    messageId: string;
    status: MessageStatus;
    cost?: number;
    provider: MessageProvider;
    timestamp: Date;
}

export enum MessageStatus {
    SENT = 'sent',
    DELIVERED = 'delivered',
    FAILED = 'failed',
    PENDING = 'pending'
}

export interface MessageDeliveryReport {
    messageId: string;
    status: MessageStatus;
    timestamp: Date;
    errorCode?: string;
    errorMessage?: string;
} 