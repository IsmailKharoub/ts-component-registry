# Simple TypeScript Component Registry Example

This is a very simple example demonstrating the core functionality of the TypeScript Component Registry library.

**Location**: `src/examples/simple-notification/example.ts`

## What This Example Shows

The example implements a **notification system** with three different types of senders:
- 📧 **EmailSender** - Sends email notifications
- 📱 **SMSSender** - Sends SMS notifications  
- 🔔 **PushSender** - Sends push notifications

## Key Features Demonstrated

1. **Zero Boilerplate**: No manual registration of components
2. **Automatic Discovery**: Components are automatically found and registered
3. **Dependency Injection**: The `@ComponentMap` decorator automatically injects all implementations
4. **Type Safety**: Full TypeScript support with proper typing
5. **Error Handling**: Graceful handling of unsupported notification types

## How It Works

1. **Define a base class** extending `ComponentMapKey<string>`
2. **Implement components** with the `@Component` decorator
3. **Use dependency injection** with the `@ComponentMap` decorator
4. **Initialize discovery** with `initializeComponentMaps()`

## Running the Example

```bash
# Method 1: Use the npm script (recommended)
npm run example

# Method 2: Direct execution after build
npm run build
node dist/examples/simple-notification/example.js
```

## Expected Output

```
🚀 Simple TypeScript Component Registry Example
✅ Complete! 17 components in 5 registries. 📦 NotificationSender, PaymentProcessor, WebhookHandler, WebhookEventHandler, StripeEventHandler
📋 Available notification types: [ 'email', 'sms', 'push' ]
📧 Email sent: Welcome to our app!
📱 SMS sent: Your verification code is 123456
🔔 Push notification sent: New message received
❌ Error: Unsupported notification type: fax
```

## Code Structure

The example follows the standard pattern:
- `NotificationSender` - Abstract base class defining the interface
- `EmailSender`, `SMSSender`, `PushSender` - Concrete implementations
- `NotificationService` - Service class using dependency injection
- `main()` - Demo function showing usage

This demonstrates how easy it is to eliminate boilerplate code and implement the strategy pattern with automatic component discovery! 