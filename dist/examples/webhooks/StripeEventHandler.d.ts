import { ComponentMapKey } from '../../core/ComponentMapKey';
/**
 * Stripe event processing result
 */
export interface StripeEventResult {
    success: boolean;
    eventType: string;
    handlerName: string;
    processedAt: Date;
    responseData?: any;
    error?: string;
    executionTimeMs: number;
}
/**
 * Abstract base class for Stripe-specific event handlers
 * Each handler processes a specific Stripe event type
 */
export declare abstract class StripeEventHandler extends ComponentMapKey<string> {
    /**
     * Get the Stripe event type this handler supports
     */
    abstract getEventType(): string;
    /**
     * Process the Stripe event
     */
    abstract processStripeEvent(eventData: any): Promise<StripeEventResult>;
    /**
     * Get the component map key (the event type)
     */
    getComponentMapKey(): string;
    /**
     * Utility method to calculate execution time
     */
    protected withTiming<T>(operation: () => Promise<T>): Promise<{
        result: T;
        timeMs: number;
    }>;
    /**
     * Log event processing activity
     */
    protected log(level: 'info' | 'warn' | 'error', message: string, data?: any): void;
    /**
     * Create a standardized result object
     */
    protected createResult(success: boolean, responseData?: any, error?: string, executionTimeMs?: number): StripeEventResult;
    /**
     * Simulate processing delay for demo purposes
     */
    protected simulateProcessing(ms: number): Promise<void>;
}
//# sourceMappingURL=StripeEventHandler.d.ts.map