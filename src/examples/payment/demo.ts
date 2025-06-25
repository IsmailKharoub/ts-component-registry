import 'reflect-metadata';

// Import components - they auto-register via @Component decorator
import './StripeProcessor';     // 🔧 Registered component in 'payment-processors' registry
import './PayPalProcessor';     // 🔧 Registered component in 'payment-processors' registry

import { PaymentService } from './PaymentService';
import { DIContainer } from '../../core/DIContainer';

/**
 * Demo showcasing TRUE auto-discovery with DI Container
 * Components register themselves just by being imported!
 */
async function runAutoDiscoveryDemo() {
    console.log('🎉 ComponentMap Auto-Discovery Demo');
    console.log('=' .repeat(40));
    
    // No manual registration needed! Components auto-registered when imported
    const paymentService = new PaymentService();
    const container = DIContainer.getInstance();
    
    // Show what was auto-discovered
    console.log('\n🔍 Auto-Discovery Results:');
    const stats = paymentService.getStats();
    console.log(`📊 Found ${stats.totalProcessors} payment processors: ${stats.availableProviders.join(', ')}`);
    
    // Show container internals
    console.log('\n🏗️ DI Container State:');
    console.log(`📦 Registry Names: ${container.getRegistryNames().join(', ')}`);
    const registryInfo = container.getRegistryInfo('payment-processors');
    console.log(`🎯 Payment Processors Registry: ${registryInfo?.size} components`);
    
    // Test individual processor retrieval
    console.log('\n💳 Testing Individual Processor Access:');
    
    // Get Stripe processor directly from container
    const stripeProcessor = container.get('payment-processors', 'stripe');
    console.log(`✅ Stripe processor: ${stripeProcessor ? 'Found' : 'Not found'}`);
    
    // Get PayPal processor directly from container  
    const paypalProcessor = container.get('payment-processors', 'paypal');
    console.log(`✅ PayPal processor: ${paypalProcessor ? 'Found' : 'Not found'}`);
    
    // Test non-existent processor
    const unknownProcessor = container.get('payment-processors', 'bitcoin');
    console.log(`❌ Bitcoin processor: ${unknownProcessor ? 'Found' : 'Not found (expected)'}`);
    
    // Test payment processing
    console.log('\n💰 Testing Payment Processing:');
    
    try {
        // Single payments
        const stripeResult = await paymentService.processPayment('stripe', 99.99, 'USD');
        console.log(`✅ Stripe payment: ${stripeResult.transactionId} ($${stripeResult.fees.toFixed(2)} fees)`);
        
        const paypalResult = await paymentService.processPayment('paypal', 149.50, 'USD');
        console.log(`✅ PayPal payment: ${paypalResult.transactionId} ($${paypalResult.fees.toFixed(2)} fees)`);
        
        // Parallel payments
        console.log('\n🔄 Testing Parallel Payments:');
        const parallelPayments = [
            { provider: 'stripe', amount: 25.00 },
            { provider: 'paypal', amount: 50.00 },
            { provider: 'stripe', amount: 75.00 }
        ];
        
        const results = await paymentService.processMultiplePayments(parallelPayments);
        console.log(`✅ Processed ${results.length} payments in parallel`);
        results.forEach(result => {
            console.log(`   💸 ${result.transactionId}: $${result.amount} (fees: $${result.fees.toFixed(2)})`);
        });
        
        // Test refunds
        console.log('\n💸 Testing Refunds:');
        const refundResult = await paymentService.processRefund('stripe', stripeResult.transactionId, 99.99);
        console.log(`✅ Refund processed: ${refundResult.refundId}`);
        
    } catch (error) {
        console.error('❌ Payment processing failed:', error);
    }
    
    // Test validation
    console.log('\n🔍 Testing Payment Validation:');
    
    const stripeData = { cardNumber: '4242424242424242', expiryDate: '12/25' };
    const isStripeValid = await paymentService.validatePayment('stripe', stripeData);
    console.log(`✅ Stripe validation: ${isStripeValid ? 'Valid' : 'Invalid'}`);
    
    const paypalData = { email: 'user@example.com' };
    const isPayPalValid = await paymentService.validatePayment('paypal', paypalData);
    console.log(`✅ PayPal validation: ${isPayPalValid ? 'Valid' : 'Invalid'}`);
    
    // Demonstrate error handling
    console.log('\n❌ Testing Error Handling:');
    try {
        await paymentService.processPayment('bitcoin', 100.00);
    } catch (error) {
        console.log(`✅ Expected error caught: ${error instanceof Error ? error.message : error}`);
    }
    
    console.log('\n🎉 Auto-Discovery Demo Complete!');
    console.log('✨ No manual registration was needed - everything was discovered automatically!');
}

// Run the demo if this file is executed directly
if (require.main === module) {
    runAutoDiscoveryDemo().catch(console.error);
}

export { runAutoDiscoveryDemo }; 