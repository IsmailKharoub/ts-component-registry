/**
 * Types and enums for phone verification example
 */

export enum PhoneVerificationProviderType {
    TWILIO = 'TWILIO',
    AWS_SNS = 'AWS_SNS'
}

export interface InitiatePhoneVerificationDTO {
    phoneNumber: string;
    countryCode: string;
    template?: string;
}

export interface CompletePhoneVerificationDTO {
    verificationCode: string;
    sessionId: string;
}

export interface UserInfo {
    userId: string;
    email?: string;
    name?: string;
} 