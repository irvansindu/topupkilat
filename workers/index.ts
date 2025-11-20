import { Worker } from 'bullmq';
import { prisma } from '../lib/prisma';
import { TopupProviderFactory } from '../lib/topup/provider-factory';
import { TopupTarget } from '../lib/types';
import { PaymentGatewayFactory } from '../lib/payment/gateway-factory';
import { queueConnection, queueNames } from '../lib/queue/config';
import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

// Fulfill Topup Worker
const fulfillTopupWorker = new Worker(
  queueNames.FULFILL_TOPUP,
  async (job) => {
    const { orderId } = job.data;
    
    logger.info({ orderId, jobId: job.id }, 'Processing fulfill topup job');
    
    try {
      // Get order details
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          product: true,
          denomination: true,
        },
      });
      
      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }
      
      // Check if already processed (idempotency)
      if (order.status === 'SUCCESS') {
        logger.info({ orderId }, 'Order already successful, skipping');
        return { status: 'already_processed' };
      }
      
      // Update order status to processing
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PROCESSING' },
      });
      
      // Get topup provider
      const providerConfig = {
        apiKey: process.env.TOPUP_API_KEY || '',
        apiSecret: process.env.TOPUP_API_SECRET || '',
        sandbox: process.env.NODE_ENV !== 'production',
      };
      
      const provider = TopupProviderFactory.create(
        process.env.TOPUP_PROVIDER || 'mock',
        providerConfig
      );
      
      // Execute topup
      const target = order.targetJson as TopupTarget;
      const result = await provider.fulfill({
        orderId: order.id,
        product: order.product.providerKey,
        denomination: order.denomination.amountNumeric,
        target,
        customerEmail: order.contactEmail,
        customerPhone: order.contactWhatsapp,
      });
      
      // Update order based on result
      if (result.status === 'success') {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'SUCCESS',
            providerOrderId: result.providerOrderId,
            providerStatus: result.status,
            successAt: new Date(),
          },
        });
        
        // If voucher-based, update voucher stock
        if (result.voucherCode && order.product.type === 'GAME') {
          const voucher = await prisma.voucherStock.findFirst({
            where: {
              productId: order.productId,
              status: 'AVAILABLE',
            },
          });
          
          if (voucher) {
            await prisma.voucherStock.update({
              where: { id: voucher.id },
              data: {
                status: 'USED',
                assignedOrderId: orderId,
                usedAt: new Date(),
              },
            });
          }
        }
        
        logger.info({ orderId, providerOrderId: result.providerOrderId }, 'Topup successful');
        
      } else if (result.status === 'processing') {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            providerOrderId: result.providerOrderId,
            providerStatus: result.status,
          },
        });
        
        logger.info({ orderId }, 'Topup still processing, will check status later');
        
      } else {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'FAILED',
            providerOrderId: result.providerOrderId,
            providerStatus: result.status,
            errorMessage: result.message,
          },
        });
        
        logger.error({ orderId, message: result.message }, 'Topup failed');
      }
      
      // Log transaction
      const topupPayload = JSON.parse(JSON.stringify(result));

      await prisma.transactionLog.create({
        data: {
          orderId,
          type: 'TOPUP_RESULT',
          payloadJson: topupPayload,
        },
      });
      
      return result;
    } catch (error) {
      logger.error({ orderId, error }, 'Error processing topup');
      
      // Update order status to failed
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'FAILED',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      
      throw error;
    }
  },
  { connection: queueConnection }
);

// Payment Webhook Worker
const paymentWebhookWorker = new Worker(
  queueNames.PAYMENT_WEBHOOK,
  async (job) => {
    const { webhookId, payload, signature, timestamp } = job.data;
    
    logger.info({ webhookId, jobId: job.id }, 'Processing payment webhook');
    
    try {
      // Process webhook based on payment provider
      const gatewayConfig = {
        apiKey: process.env.PAYMENT_API_KEY || '',
        webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || '',
        sandbox: process.env.NODE_ENV !== 'production',
      };
      
      const gateway = PaymentGatewayFactory.create(
        process.env.PAYMENT_PROVIDER || 'mock',
        gatewayConfig
      );
      
      // Verify and parse event
      const isValid = gateway.verifyWebhook(signature, payload, timestamp);
      if (!isValid) {
        throw new Error('Invalid webhook signature');
      }
      
      const event = gateway.parseEvent(payload);
      
      // Handle based on event type
      if (event.type === 'invoice.paid') {
        // Already handled in the webhook endpoint
        // This worker can do additional processing like sending notifications
        logger.info({ invoiceId: event.invoiceId }, 'Payment confirmed');
      }
      
      return { status: 'processed', event };
    } catch (error) {
      logger.error({ webhookId, error }, 'Error processing payment webhook');
      throw error;
    }
  },
  { connection: queueConnection }
);

// Send Notification Worker
const sendNotificationWorker = new Worker(
  queueNames.SEND_NOTIFICATION,
  async (job) => {
    const { type, orderId, email } = job.data;
    
    logger.info({ orderId, type }, 'Sending notification');
    
    try {
      // TODO: Implement actual notification sending
      // This could integrate with SendGrid for email
      // or WhatsApp Business API for WhatsApp messages
      
      if (type === 'order_success') {
        logger.info({ orderId, email }, 'Order success notification sent');
      } else if (type === 'order_failed') {
        logger.info({ orderId, email }, 'Order failure notification sent');
      } else if (type === 'payment_received') {
        logger.info({ orderId, email }, 'Payment received notification sent');
      }
      
      return { status: 'sent' };
    } catch (error) {
      logger.error({ orderId, error }, 'Error sending notification');
      throw error;
    }
  },
  { connection: queueConnection }
);

// Worker lifecycle events
fulfillTopupWorker.on('completed', (job) => {
  logger.info({ jobId: job.id }, 'Fulfill topup job completed');
});

fulfillTopupWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, error: err }, 'Fulfill topup job failed');
});

paymentWebhookWorker.on('completed', (job) => {
  logger.info({ jobId: job.id }, 'Payment webhook job completed');
});

paymentWebhookWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, error: err }, 'Payment webhook job failed');
});

sendNotificationWorker.on('completed', (job) => {
  logger.info({ jobId: job.id }, 'Send notification job completed');
});

sendNotificationWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, error: err }, 'Send notification job failed');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing workers...');
  await fulfillTopupWorker.close();
  await paymentWebhookWorker.close();
  await sendNotificationWorker.close();
  await prisma.$disconnect();
  process.exit(0);
});

logger.info('Workers started successfully');
logger.info({
  workers: [
    queueNames.FULFILL_TOPUP,
    queueNames.PAYMENT_WEBHOOK,
    queueNames.SEND_NOTIFICATION,
  ],
}, 'Listening for jobs...');
