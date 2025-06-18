import { 
    PhoneVerificationService, 
    PhoneVerificationProviderType,
    AnalyticsService,
    AnalyticsEvent,
    ComponentMapManager,
    PhoneVerificationProvider 
} from './index';

/**
 * Comprehensive demo of ComponentMap functionality
 * Shows how ComponentMap eliminates boilerplate code and implements the Strategy pattern
 */
async function runComponentMapDemo() {
    console.log('🚀 ComponentMap TypeScript Implementation Demo');
    console.log('='.repeat(50));
    
    await demonstratePhoneVerification();
    await demonstrateAnalytics();
    await demonstrateComponentMapInternals();
}

/**
 * Demonstrate phone verification using ComponentMap
 */
async function demonstratePhoneVerification() {
    console.log('\n📱 PHONE VERIFICATION DEMO');
    console.log('-'.repeat(30));
    
    // Initialize service - ComponentMap automatically discovers and registers providers
    const phoneService = new PhoneVerificationService();
    
    console.log(`\n🔍 Available providers: ${phoneService.getAvailableProviders().join(', ')}`);
    
    // Test Twilio provider
    const initiateDto = {
        phoneNumber: '+1234567890',
        countryCode: '+1',
        template: 'verification'
    };
    
    try {
        await phoneService.initiate(PhoneVerificationProviderType.TWILIO, initiateDto);
        
        const completeDto = {
            verificationCode: '123456', // Twilio expects this code
            sessionId: 'session-123'
        };
        
        await phoneService.complete(PhoneVerificationProviderType.TWILIO, completeDto, '+1234567890');
    } catch (error) {
        console.error('Phone verification failed:', error);
    }
    
    // Test AWS provider
    try {
        await phoneService.initiate(PhoneVerificationProviderType.AWS_SNS, initiateDto);
        
        const awsCompleteDto = {
            verificationCode: '654321', // AWS expects this code
            sessionId: 'aws-session-456'
        };
        
        await phoneService.complete(PhoneVerificationProviderType.AWS_SNS, awsCompleteDto, '+1234567890');
    } catch (error) {
        console.error('AWS verification failed:', error);
    }
}

/**
 * Demonstrate analytics processing using ComponentMap
 */
async function demonstrateAnalytics() {
    console.log('\n📊 ANALYTICS DEMO');
    console.log('-'.repeat(20));
    
    // Initialize analytics service - ComponentMap discovers all handlers
    const analyticsService = new AnalyticsService();
    
    const userInfo = {
        userId: 'user-123',
        email: 'john.doe@example.com',
        name: 'John Doe',
        role: 'customer'
    };
    
    // Single event processing
    console.log('\n📈 Processing single events:');
    
    await analyticsService.processEvent(
        AnalyticsEvent.USER_SIGNUP,
        {
            eventId: 'evt-001',
            timestamp: new Date(),
            data: { 
                registrationMethod: 'email',
                marketingConsent: true,
                referralSource: 'google'
            }
        },
        userInfo
    );
    
    await analyticsService.processEvent(
        AnalyticsEvent.TRANSACTION_COMPLETED,
        {
            eventId: 'evt-002',
            timestamp: new Date(),
            data: { 
                amount: 99.99,
                currency: 'USD',
                type: 'subscription',
                paymentMethod: 'credit_card'
            }
        },
        userInfo
    );
    
    // Parallel event processing
    console.log('\n🔄 Processing multiple events in parallel:');
    
    const events = [
        {
            event: AnalyticsEvent.DOCUMENT_UPLOADED,
            data: {
                eventId: 'evt-003',
                timestamp: new Date(),
                data: {
                    documentType: 'identity',
                    fileSize: 2048576,
                    mimeType: 'image/jpeg'
                }
            },
            userInfo
        },
        {
            event: AnalyticsEvent.USER_SIGNUP,
            data: {
                eventId: 'evt-004',
                timestamp: new Date(),
                data: {
                    registrationMethod: 'social',
                    provider: 'google',
                    marketingConsent: false
                }
            },
            userInfo: { ...userInfo, userId: 'user-456', email: 'jane@example.com' }
        }
    ];
    
    await analyticsService.processEvents(events);
    
    // Show analytics stats
    const stats = analyticsService.getStats();
    console.log(`\n📈 Analytics Stats: ${stats.totalHandlers} handlers for ${stats.supportedEvents.length} events`);
}

/**
 * Demonstrate ComponentMap internals and advanced features
 */
async function demonstrateComponentMapInternals() {
    console.log('\n🔧 COMPONENTMAP INTERNALS DEMO');
    console.log('-'.repeat(35));
    
    const manager = ComponentMapManager.getInstance();
    
    console.log(`📋 Active registries: ${manager.getRegistryNames().join(', ')}`);
    
    // Show phone verification registry details
    const phoneRegistry = manager.getRegistry<PhoneVerificationProviderType, PhoneVerificationProvider>('phoneVerificationProviders');
    console.log(`\n📱 Phone Verification Registry:`);
    console.log(`   - Size: ${phoneRegistry.size()}`);
    console.log(`   - Keys: ${phoneRegistry.getKeys().join(', ')}`);
    
    // Show analytics registry details
    const analyticsRegistry = manager.getRegistry('analyticsHandlers');
    console.log(`\n📊 Analytics Registry:`);
    console.log(`   - Size: ${analyticsRegistry.size()}`);
    console.log(`   - Keys: ${analyticsRegistry.getKeys().join(', ')}`);
    
    // Demonstrate direct registry access
    console.log(`\n🔍 Direct Registry Access:`);
    const twilioProvider = phoneRegistry.get(PhoneVerificationProviderType.TWILIO);
    if (twilioProvider) {
        console.log(`   - Found Twilio provider: ${twilioProvider.constructor.name}`);
        console.log(`   - Provider key: ${twilioProvider.getComponentMapKey()}`);
    }
    
    // Show component map benefits
    console.log(`\n✨ ComponentMap Benefits Demonstrated:`);
    console.log(`   ✅ Zero boilerplate - no manual map management`);
    console.log(`   ✅ Type safety - fully typed keys and values`);
    console.log(`   ✅ Strategy pattern - easy to add new implementations`);
    console.log(`   ✅ Auto-discovery - components register themselves`);
    console.log(`   ✅ Centralized management - single source of truth`);
}

/**
 * Show comparison with manual approach (what we avoid)
 */
function showManualApproachComparison() {
    console.log('\n❌ MANUAL APPROACH (What ComponentMap Replaces):');
    console.log('-'.repeat(50));
    
    console.log(`
// Without ComponentMap - lots of boilerplate:
class ManualPhoneService {
    private providers = new Map<PhoneVerificationProviderType, PhoneVerificationProvider>();
    
    constructor() {
        // Manual registration - easy to forget, error-prone
        this.providers.set(PhoneVerificationProviderType.TWILIO, new TwilioProvider());
        this.providers.set(PhoneVerificationProviderType.AWS_SNS, new AWSProvider());
        // Add more providers... manually... every time...
    }
}

// With ComponentMap - zero boilerplate:
class ComponentMapPhoneService {
    private providers: Map<PhoneVerificationProviderType, PhoneVerificationProvider>;
    
    constructor() {
        // Automatic discovery and registration!
        this.providers = ComponentMapManager.getInstance()
            .getRegistry('phoneVerificationProviders').getAll();
    }
}
    `);
}

// Run the demo
if (require.main === module) {
    runComponentMapDemo()
        .then(() => {
            showManualApproachComparison();
            console.log('\n🎉 ComponentMap Demo completed successfully!');
            console.log('💡 Try adding new providers or handlers to see auto-discovery in action.');
        })
        .catch((error) => {
            console.error('Demo failed:', error);
            process.exit(1);
        });
} 