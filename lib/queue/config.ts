import { ConnectionOptions } from 'bullmq';
import Redis from 'ioredis';

export const getRedisConnection = (): Redis => {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  
  return new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
};

export const queueConnection: ConnectionOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
};

export const queueNames = {
  FULFILL_TOPUP: 'fulfill-topup',
  PAYMENT_WEBHOOK: 'payment-webhook',
  SEND_NOTIFICATION: 'send-notification',
  REFUND_ORDER: 'refund-order',
} as const;

export type QueueName = typeof queueNames[keyof typeof queueNames];
