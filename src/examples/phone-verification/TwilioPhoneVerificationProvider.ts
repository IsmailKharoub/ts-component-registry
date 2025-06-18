import { PhoneVerificationProvider } from './PhoneVerificationProvider';
import { PhoneVerificationProviderType, InitiatePhoneVerificationDTO, CompletePhoneVerificationDTO } from './types';

/**
 * Twilio implementation of phone verification
 */
export class TwilioPhoneVerificationProvider implements PhoneVerificationProvider {
    getComponentMapKey(): PhoneVerificationProviderType {
        return PhoneVerificationProviderType.TWILIO;
    }
    
    async initiate(dto: InitiatePhoneVerificationDTO): Promise<void> {
        console.log(`🔸 Twilio: Initiating verification for ${dto.phoneNumber} (${dto.countryCode})`);
        
        // Simulate Twilio API call
        await this.simulateApiCall();
        
        console.log(`✅ Twilio: Verification code sent to ${dto.phoneNumber}`);
    }
    
    async complete(dto: CompletePhoneVerificationDTO, phone: string): Promise<void> {
        console.log(`🔸 Twilio: Completing verification for ${phone} with code ${dto.verificationCode}`);
        
        // Simulate verification check
        await this.simulateApiCall();
        
        if (dto.verificationCode === '123456') {
            console.log(`✅ Twilio: Verification successful for ${phone}`);
        } else {
            console.log(`❌ Twilio: Verification failed for ${phone}`);
            throw new Error('Invalid verification code');
        }
    }
    
    private async simulateApiCall(): Promise<void> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
    }
} 