import { ComponentMapKey } from '../../core/ComponentMapKey';
import { AnalyticsEvent, AnalyticsDataDTO, UserInfo } from './types';

/**
 * Interface for analytics event handlers
 */
export interface AnalyticsHandler extends ComponentMapKey<AnalyticsEvent> {
    handle(data: AnalyticsDataDTO, userInfo: UserInfo): Promise<void>;
}

/**
 * Handler for user signup analytics
 */
export class UserSignupAnalyticsHandler implements AnalyticsHandler {
    getComponentMapKey(): AnalyticsEvent {
        return AnalyticsEvent.USER_SIGNUP;
    }
    
    async handle(data: AnalyticsDataDTO, userInfo: UserInfo): Promise<void> {
        console.log(`📊 UserSignup Analytics: Processing signup for user ${userInfo.userId}`);
        console.log(`   - Event ID: ${data.eventId}`);
        console.log(`   - Email: ${userInfo.email}`);
        console.log(`   - Registration data:`, data.data);
        
        // Simulate analytics processing
        await this.simulateProcessing();
        console.log(`✅ UserSignup Analytics: Completed processing for ${userInfo.userId}`);
    }
    
    private async simulateProcessing(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 200));
    }
}

/**
 * Handler for transaction completed analytics
 */
export class TransactionCompletedAnalyticsHandler implements AnalyticsHandler {
    getComponentMapKey(): AnalyticsEvent {
        return AnalyticsEvent.TRANSACTION_COMPLETED;
    }
    
    async handle(data: AnalyticsDataDTO, userInfo: UserInfo): Promise<void> {
        console.log(`📊 Transaction Analytics: Processing transaction for user ${userInfo.userId}`);
        console.log(`   - Event ID: ${data.eventId}`);
        console.log(`   - Transaction amount: $${data.data.amount}`);
        console.log(`   - Transaction type: ${data.data.type}`);
        
        // Simulate analytics processing
        await this.simulateProcessing();
        console.log(`✅ Transaction Analytics: Completed processing for ${userInfo.userId}`);
    }
    
    private async simulateProcessing(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300));
    }
}

/**
 * Handler for document upload analytics
 */
export class DocumentUploadAnalyticsHandler implements AnalyticsHandler {
    getComponentMapKey(): AnalyticsEvent {
        return AnalyticsEvent.DOCUMENT_UPLOADED;
    }
    
    async handle(data: AnalyticsDataDTO, userInfo: UserInfo): Promise<void> {
        console.log(`📊 Document Analytics: Processing upload for user ${userInfo.userId}`);
        console.log(`   - Event ID: ${data.eventId}`);
        console.log(`   - Document type: ${data.data.documentType}`);
        console.log(`   - File size: ${data.data.fileSize} bytes`);
        
        // Simulate analytics processing
        await this.simulateProcessing();
        console.log(`✅ Document Analytics: Completed processing for ${userInfo.userId}`);
    }
    
    private async simulateProcessing(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 150));
    }
} 