/**
 * Types for analytics example
 */

export enum AnalyticsEvent {
    USER_SIGNUP = 'USER_SIGNUP',
    TRANSACTION_COMPLETED = 'TRANSACTION_COMPLETED',
    DOCUMENT_UPLOADED = 'DOCUMENT_UPLOADED',
    LOGIN_ATTEMPT = 'LOGIN_ATTEMPT',
    PASSWORD_RESET = 'PASSWORD_RESET'
}

export enum AnalyticsDataType {
    BUSINESS = 'BUSINESS',
    USER = 'USER',
    TRANSACTION = 'TRANSACTION'
}

export interface AnalyticsDataDTO {
    eventId: string;
    timestamp: Date;
    data: Record<string, any>;
    metadata?: Record<string, any>;
}

export interface UserInfo {
    userId: string;
    email?: string;
    name?: string;
    role?: string;
} 