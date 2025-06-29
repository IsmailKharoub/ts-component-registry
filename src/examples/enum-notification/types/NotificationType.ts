/**
 * Enum defining all supported notification types
 * This provides compile-time type safety and prevents typos
 */
export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms', 
  PUSH = 'push',
  SLACK = 'slack',
  WEBHOOK = 'webhook'
} 