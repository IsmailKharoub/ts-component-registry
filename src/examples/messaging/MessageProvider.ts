import { ComponentMapKey } from '../../core/ComponentMapKey';
import { MessageProvider as MessageProviderType, SendMessageDTO, MessageResponse, MessageDeliveryReport } from './types';

/**
 * Interface for messaging service providers
 * Each implementation must provide a unique MessageProviderType as its key
 */
export interface MessageProvider extends ComponentMapKey<MessageProviderType> {
    /**
     * Send a message (SMS, MMS, or WhatsApp)
     */
    sendMessage(message: SendMessageDTO): Promise<MessageResponse>;
    
    /**
     * Get delivery status for a message
     */
    getDeliveryStatus(messageId: string): Promise<MessageDeliveryReport>;
    
    /**
     * Get the provider's supported message types
     */
    getSupportedMessageTypes(): MessageProviderType[];
    
    /**
     * Get pricing information for a message type
     */
    getEstimatedCost(message: SendMessageDTO): Promise<number>;
} 