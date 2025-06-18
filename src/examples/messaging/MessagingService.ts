import { ComponentMapManager } from '../../core/ComponentMapManager';
import { ComponentRegistry } from '../../core/ComponentRegistry';
import { MessageProvider } from './MessageProvider';
import { 
    MessageProvider as MessageProviderType, 
    SendMessageDTO, 
    MessageResponse, 
    MessageDeliveryReport,
    MessageType 
} from './types';
import { TwilioMessageProvider } from './TwilioMessageProvider';
import { VonageMessageProvider } from './VonageMessageProvider';

/**
 * Service that manages messaging using ComponentMap pattern
 * Demonstrates intelligent provider selection and fallback mechanisms
 */
export class MessagingService {
    private readonly providers: Map<MessageProviderType, MessageProvider>;
    private readonly registryName = 'messageProviders';
    
    constructor() {
        // Initialize registry and register providers
        const registry = ComponentMapManager.getInstance()
            .getRegistry<MessageProviderType, MessageProvider>(this.registryName);
        
        // Auto-register all message providers
        this.registerProviders(registry);
        
        // Get the populated map
        this.providers = registry.getAll();
        
        console.log(`📨 MessagingService initialized with ${this.providers.size} providers:`);
        for (const [key, provider] of this.providers) {
            console.log(`   - ${key.toUpperCase()}: ${provider.constructor.name}`);
        }
    }
    
    /**
     * Register all available message providers in the registry
     */
    private registerProviders(registry: ComponentRegistry<MessageProviderType, MessageProvider>) {
        const providerInstances = [
            new TwilioMessageProvider(),
            new VonageMessageProvider()
        ];
        
        providerInstances.forEach(provider => {
            registry.register(provider.getComponentMapKey(), provider);
        });
    }
    
    /**
     * Send a message using specified provider
     */
    async sendMessage(providerType: MessageProviderType, message: SendMessageDTO): Promise<MessageResponse> {
        const provider = this.providers.get(providerType);
        if (!provider) {
            throw new Error(`Message provider not found: ${providerType}`);
        }
        
        console.log(`\n📤 Sending message via ${providerType.toUpperCase()}...`);
        return provider.sendMessage(message);
    }
    
    /**
     * Send message with automatic provider selection based on cost
     */
    async sendMessageOptimized(message: SendMessageDTO): Promise<MessageResponse> {
        console.log(`\n🎯 Finding optimal provider for message to ${message.to}...`);
        
        // Get cost estimates from all providers
        const costEstimates = await Promise.all(
            Array.from(this.providers.entries()).map(async ([providerType, provider]) => ({
                provider: providerType,
                cost: await provider.getEstimatedCost(message),
                instance: provider
            }))
        );
        
        // Sort by cost (ascending)
        costEstimates.sort((a, b) => a.cost - b.cost);
        
        console.log(`💰 Cost comparison:`);
        costEstimates.forEach(({ provider, cost }) => {
            console.log(`   - ${provider.toUpperCase()}: $${cost.toFixed(4)}`);
        });
        
        // Use the cheapest provider
        const cheapest = costEstimates[0];
        console.log(`🏆 Selected ${cheapest.provider.toUpperCase()} (cheapest at $${cheapest.cost.toFixed(4)})`);
        
        return cheapest.instance.sendMessage(message);
    }
    
    /**
     * Send message with fallback mechanism
     */
    async sendMessageWithFallback(primaryProvider: MessageProviderType, message: SendMessageDTO): Promise<MessageResponse> {
        console.log(`\n🔄 Attempting to send via ${primaryProvider.toUpperCase()} with fallback...`);
        
        try {
            const provider = this.providers.get(primaryProvider);
            if (!provider) {
                throw new Error(`Primary provider ${primaryProvider} not available`);
            }
            
            return await provider.sendMessage(message);
        } catch (error) {
            console.log(`❌ Primary provider failed: ${error}`);
            
            // Find an alternative provider
            const fallbackProviders = Array.from(this.providers.keys())
                .filter(p => p !== primaryProvider);
            
            if (fallbackProviders.length === 0) {
                throw new Error('No fallback providers available');
            }
            
            const fallbackProvider = fallbackProviders[0];
            console.log(`🔄 Falling back to ${fallbackProvider.toUpperCase()}...`);
            
            const fallback = this.providers.get(fallbackProvider)!;
            return await fallback.sendMessage(message);
        }
    }
    
    /**
     * Send bulk messages with load balancing
     */
    async sendBulkMessages(messages: SendMessageDTO[]): Promise<MessageResponse[]> {
        console.log(`\n📦 Sending ${messages.length} messages with load balancing...`);
        
        const providers = Array.from(this.providers.values());
        const results: Promise<MessageResponse>[] = [];
        
        // Distribute messages across providers using round-robin
        messages.forEach((message, index) => {
            const provider = providers[index % providers.length];
            console.log(`📤 Message ${index + 1} → ${provider.getComponentMapKey().toUpperCase()}`);
            results.push(provider.sendMessage(message));
        });
        
        const responses = await Promise.all(results);
        console.log(`✅ Bulk sending completed: ${responses.length} messages sent`);
        
        return responses;
    }
    
    /**
     * Get delivery status from specific provider
     */
    async getDeliveryStatus(providerType: MessageProviderType, messageId: string): Promise<MessageDeliveryReport> {
        const provider = this.providers.get(providerType);
        if (!provider) {
            throw new Error(`Message provider not found: ${providerType}`);
        }
        
        console.log(`\n📊 Checking delivery status via ${providerType.toUpperCase()}...`);
        return provider.getDeliveryStatus(messageId);
    }
    
    /**
     * Compare pricing across all providers
     */
    async comparePricing(message: SendMessageDTO): Promise<{ provider: MessageProviderType; cost: number }[]> {
        console.log(`\n💰 Comparing pricing for ${message.type} message...`);
        
        const comparisons = await Promise.all(
            Array.from(this.providers.entries()).map(async ([providerType, provider]) => ({
                provider: providerType,
                cost: await provider.getEstimatedCost(message)
            }))
        );
        
        comparisons.forEach(({ provider, cost }) => {
            console.log(`   ${provider.toUpperCase()}: $${cost.toFixed(4)}`);
        });
        
        return comparisons.sort((a, b) => a.cost - b.cost);
    }
    
    /**
     * Get all available providers
     */
    getAvailableProviders(): MessageProviderType[] {
        return Array.from(this.providers.keys());
    }
    
    /**
     * Check if a provider is available
     */
    hasProvider(providerType: MessageProviderType): boolean {
        return this.providers.has(providerType);
    }
    
    /**
     * Get provider-specific features (if available)
     */
    async getProviderFeatures(providerType: MessageProviderType): Promise<any> {
        const provider = this.providers.get(providerType);
        if (!provider) {
            throw new Error(`Message provider not found: ${providerType}`);
        }
        
        console.log(`\n🔧 Getting ${providerType.toUpperCase()} specific features...`);
        
        // Check for provider-specific methods
        if (providerType === MessageProviderType.VONAGE && 'getAccountBalance' in provider) {
            const vonageProvider = provider as VonageMessageProvider;
            return {
                accountBalance: await vonageProvider.getAccountBalance(),
                deliveryInsights: await vonageProvider.getDeliveryInsights()
            };
        }
        
        return { message: 'No additional features available for this provider' };
    }
} 