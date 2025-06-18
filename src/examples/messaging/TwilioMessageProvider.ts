import { MessageProvider } from './MessageProvider';
import { 
    MessageProvider as MessageProviderType, 
    SendMessageDTO, 
    MessageResponse, 
    MessageDeliveryReport, 
    MessageStatus,
    MessageType 
} from './types';

/**
 * Twilio implementation of messaging services
 * Supports SMS, MMS, and WhatsApp messaging
 */
export class TwilioMessageProvider implements MessageProvider {
    getComponentMapKey(): MessageProviderType {
        return MessageProviderType.TWILIO;
    }
    
    async sendMessage(message: SendMessageDTO): Promise<MessageResponse> {
        console.log(`📱 Twilio: Sending ${message.type.toUpperCase()} to ${message.to}`);
        console.log(`   From: ${message.from}`);
        console.log(`   Text: ${message.text}`);
        
        if (message.media && message.media.length > 0) {
            console.log(`   Media: ${message.media.join(', ')}`);
        }
        
        // Simulate Twilio API call
        await this.simulateApiCall();
        
        const messageId = `twilio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const response: MessageResponse = {
            messageId,
            status: MessageStatus.SENT,
            cost: await this.getEstimatedCost(message),
            provider: MessageProviderType.TWILIO,
            timestamp: new Date()
        };
        
        console.log(`✅ Twilio: Message sent successfully (ID: ${messageId})`);
        return response;
    }
    
    async getDeliveryStatus(messageId: string): Promise<MessageDeliveryReport> {
        console.log(`🔍 Twilio: Checking delivery status for ${messageId}`);
        
        // Simulate API call
        await this.simulateApiCall();
        
        // Simulate different delivery statuses
        const statuses = [MessageStatus.SENT, MessageStatus.DELIVERED, MessageStatus.DELIVERED, MessageStatus.DELIVERED];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        const report: MessageDeliveryReport = {
            messageId,
            status: randomStatus,
            timestamp: new Date()
        };
        
        console.log(`📊 Twilio: Message ${messageId} status: ${randomStatus}`);
        return report;
    }
    
    getSupportedMessageTypes(): MessageProviderType[] {
        return [MessageProviderType.TWILIO];
    }
    
    async getEstimatedCost(message: SendMessageDTO): Promise<number> {
        // Twilio pricing simulation
        const baseCosts = {
            [MessageType.SMS]: 0.0075,      // $0.0075 per SMS
            [MessageType.MMS]: 0.02,        // $0.02 per MMS  
            [MessageType.WHATSAPP]: 0.005   // $0.005 per WhatsApp
        };
        
        let cost = baseCosts[message.type] || baseCosts[MessageType.SMS];
        
        // Additional cost for international messages
        if (!message.to.startsWith('+1')) {
            cost *= 1.5; // 50% markup for international
        }
        
        // MMS media cost
        if (message.type === MessageType.MMS && message.media) {
            cost += message.media.length * 0.005; // $0.005 per media file
        }
        
        return Math.round(cost * 1000) / 1000; // Round to 3 decimal places
    }
    
    private async simulateApiCall(): Promise<void> {
        // Simulate Twilio API latency
        await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
    }
} 