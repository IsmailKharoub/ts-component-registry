import 'reflect-metadata';
/**
 * Event handler service demonstrating multiple handlers per event type
 */
declare enum EventType {
    USER_SIGNUP = "user_signup",
    PAYMENT_COMPLETED = "payment_completed",
    ORDER_SHIPPED = "order_shipped"
}
export declare class EventHandlerService {
    private handlers;
    handleEvent(eventType: EventType, eventData: any): Promise<void>;
    getRegisteredEventTypes(): EventType[];
}
/**
 * Demo showcasing Spring Boot-style ComponentMap usage
 * Components are auto-discovered without manual imports!
 */
declare function runSpringBootStyleDemo(): Promise<void>;
export { runSpringBootStyleDemo };
//# sourceMappingURL=demo.d.ts.map