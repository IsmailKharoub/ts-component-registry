import { PhoneVerificationProvider } from './PhoneVerificationProvider';
import { PhoneVerificationProviderType, InitiatePhoneVerificationDTO, CompletePhoneVerificationDTO } from './types';

/**
 * New Google/Firebase implementation of phone verification
 * Demonstrates how easy it is to add new providers to the ComponentMap system
 */
export class GooglePhoneVerificationProvider implements PhoneVerificationProvider {
    getComponentMapKey(): PhoneVerificationProviderType {
        // Since we only had TWILIO and AWS_SNS in the enum, let's extend it for this demo
        return 'GOOGLE' as PhoneVerificationProviderType;
    }
    
    async initiate(dto: InitiatePhoneVerificationDTO): Promise<void> {
        console.log(`🔸 Google/Firebase: Initiating verification for ${dto.phoneNumber} (${dto.countryCode})`);
        
        // Simulate Google Firebase Auth API call
        await this.simulateApiCall();
        
        console.log(`✅ Google/Firebase: Verification code sent via Firebase to ${dto.phoneNumber}`);
    }
    
    async complete(dto: CompletePhoneVerificationDTO, phone: string): Promise<void> {
        console.log(`🔸 Google/Firebase: Completing verification for ${phone} with code ${dto.verificationCode}`);
        
        // Simulate verification check
        await this.simulateApiCall();
        
        if (dto.verificationCode === '999888') {
            console.log(`✅ Google/Firebase: Verification successful for ${phone}`);
        } else {
            console.log(`❌ Google/Firebase: Verification failed for ${phone}`);
            throw new Error('Invalid verification code for Google/Firebase');
        }
    }
    
    private async simulateApiCall(): Promise<void> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 400));
    }
} 