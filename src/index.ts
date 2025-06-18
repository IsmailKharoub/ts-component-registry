// Core ComponentMap exports
export { ComponentRegistry } from './core/ComponentRegistry';
export { ComponentMapManager } from './core/ComponentMapManager';
export { ComponentMapKey } from './core/ComponentMapKey';

// Decorator exports
export { 
    ComponentMapKeyDecorator,
    ComponentMapDecorator,
    Component,
    initializeComponentMaps,
    autoRegisterComponents
} from './decorators/ComponentMapDecorators';

// Phone Verification Example exports
export { PhoneVerificationProviderType } from './examples/phone-verification/types';
export type { 
    InitiatePhoneVerificationDTO, 
    CompletePhoneVerificationDTO 
} from './examples/phone-verification/types';
export { PhoneVerificationProvider } from './examples/phone-verification/PhoneVerificationProvider';
export { TwilioPhoneVerificationProvider } from './examples/phone-verification/TwilioPhoneVerificationProvider';
export { AWSPhoneVerificationProvider } from './examples/phone-verification/AWSPhoneVerificationProvider';
export { PhoneVerificationService } from './examples/phone-verification/PhoneVerificationService';

// Analytics Example exports
export { AnalyticsEvent } from './examples/analytics/types';
export type { AnalyticsDataDTO, UserInfo } from './examples/analytics/types';
export { 
    AnalyticsHandler,
    UserSignupAnalyticsHandler,
    TransactionCompletedAnalyticsHandler,
    DocumentUploadAnalyticsHandler
} from './examples/analytics/AnalyticsHandler';
export { AnalyticsService } from './examples/analytics/AnalyticsService';

// Messaging Example exports
export { MessageProvider as MessageProviderType, MessageType, MessageStatus } from './examples/messaging/types';
export type { 
    SendMessageDTO, 
    MessageResponse, 
    MessageDeliveryReport 
} from './examples/messaging/types';
export { MessageProvider } from './examples/messaging/MessageProvider';
export { TwilioMessageProvider } from './examples/messaging/TwilioMessageProvider';
export { VonageMessageProvider } from './examples/messaging/VonageMessageProvider';
export { MessagingService } from './examples/messaging/MessagingService'; 