import { PhoneVerificationProvider } from './PhoneVerificationProvider';
import { PhoneVerificationProviderType, InitiatePhoneVerificationDTO, CompletePhoneVerificationDTO } from './types';

/**
 * AWS SNS implementation of phone verification
 */
export class AWSPhoneVerificationProvider implements PhoneVerificationProvider {
    getComponentMapKey(): PhoneVerificationProviderType {
        return PhoneVerificationProviderType.AWS_SNS;
    }
    
    async initiate(dto: InitiatePhoneVerificationDTO): Promise<void> {
        console.log(`🔸 AWS SNS: Initiating verification for ${dto.phoneNumber} (${dto.countryCode})`);
        
        // Simulate AWS SNS API call
        await this.simulateApiCall();
        
        console.log(`✅ AWS SNS: SMS sent to ${dto.phoneNumber}`);
    }
    
    async complete(dto: CompletePhoneVerificationDTO, phone: string): Promise<void> {
        console.log(`🔸 AWS SNS: Completing verification for ${phone} with code ${dto.verificationCode}`);
        
        // Simulate verification check
        await this.simulateApiCall();
        
        if (dto.verificationCode === '654321') {
            console.log(`✅ AWS SNS: Verification successful for ${phone}`);
        } else {
            console.log(`❌ AWS SNS: Verification failed for ${phone}`);
            throw new Error('Invalid verification code for AWS SNS');
        }
    }
    
    private async simulateApiCall(): Promise<void> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
    }
} 