import { ComponentMapManager } from '../../core/ComponentMapManager';
import { ComponentRegistry } from '../../core/ComponentRegistry';
import { PhoneVerificationProvider } from './PhoneVerificationProvider';
import { PhoneVerificationProviderType, InitiatePhoneVerificationDTO, CompletePhoneVerificationDTO } from './types';
import { TwilioPhoneVerificationProvider } from './TwilioPhoneVerificationProvider';
import { AWSPhoneVerificationProvider } from './AWSPhoneVerificationProvider';

/**
 * Service that manages phone verification using ComponentMap pattern
 * Demonstrates how to use ComponentMap for strategy pattern implementation
 */
export class PhoneVerificationService {
    private readonly providers: Map<PhoneVerificationProviderType, PhoneVerificationProvider>;
    private readonly registryName = 'phoneVerificationProviders';
    
    constructor() {
        // Initialize registry and register providers
        const registry = ComponentMapManager.getInstance()
            .getRegistry<PhoneVerificationProviderType, PhoneVerificationProvider>(this.registryName);
        
        // Auto-register providers
        this.registerProviders(registry);
        
        // Get the populated map
        this.providers = registry.getAll();
        
        console.log(`📋 PhoneVerificationService initialized with ${this.providers.size} providers:`);
        for (const [key, provider] of this.providers) {
            console.log(`   - ${key}: ${provider.constructor.name}`);
        }
    }
    
    /**
     * Register all available providers in the registry
     */
    private registerProviders(registry: ComponentRegistry<PhoneVerificationProviderType, PhoneVerificationProvider>) {
        const providerInstances = [
            new TwilioPhoneVerificationProvider(),
            new AWSPhoneVerificationProvider()
        ];
        
        providerInstances.forEach(provider => {
            registry.register(provider.getComponentMapKey(), provider);
        });
    }
    
    /**
     * Initiate phone verification using specified provider
     */
    async initiate(providerType: PhoneVerificationProviderType, dto: InitiatePhoneVerificationDTO): Promise<void> {
        const provider = this.providers.get(providerType);
        if (!provider) {
            throw new Error(`Phone verification provider not found: ${providerType}`);
        }
        
        console.log(`\n🚀 Starting verification with ${providerType}...`);
        await provider.initiate(dto);
    }
    
    /**
     * Complete phone verification using specified provider
     */
    async complete(providerType: PhoneVerificationProviderType, dto: CompletePhoneVerificationDTO, phone: string): Promise<void> {
        const provider = this.providers.get(providerType);
        if (!provider) {
            throw new Error(`Phone verification provider not found: ${providerType}`);
        }
        
        console.log(`\n🔍 Completing verification with ${providerType}...`);
        await provider.complete(dto, phone);
    }
    
    /**
     * Get all available provider types
     */
    getAvailableProviders(): PhoneVerificationProviderType[] {
        return Array.from(this.providers.keys());
    }
    
    /**
     * Check if a provider is available
     */
    hasProvider(providerType: PhoneVerificationProviderType): boolean {
        return this.providers.has(providerType);
    }
} 