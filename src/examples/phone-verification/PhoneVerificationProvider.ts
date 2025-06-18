import { ComponentMapKey } from '../../core/ComponentMapKey';
import { PhoneVerificationProviderType, InitiatePhoneVerificationDTO, CompletePhoneVerificationDTO } from './types';

/**
 * Interface for phone verification providers
 * Each implementation must provide a unique PhoneVerificationProviderType as its key
 */
export interface PhoneVerificationProvider extends ComponentMapKey<PhoneVerificationProviderType> {
    /**
     * Initiate phone verification process
     */
    initiate(dto: InitiatePhoneVerificationDTO): Promise<void>;
    
    /**
     * Complete phone verification process
     */
    complete(dto: CompletePhoneVerificationDTO, phone: string): Promise<void>;
} 