import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { PaymentGatewayFactory } from '@/lib/payment/gateway-factory';
import { Queue } from 'bullmq';
import { queueConnection, queueNames } from '@/lib/queue/config';

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-webhook-signature') || '';
    const timestamp = request.headers.get('x-webhook-timestamp') || '';
    const payload = await request.json();
    
    // Store webhook event
    const webhookEvent = await prisma.webhookEvent.create({
      data: {
        source: 'payment',
        eventId: payload.id || `${Date.now()}`,
        signature,
        payloadJson: payload,
      },
    });
    
    // Verify webhook signature
    const gatewayConfig = {
      apiKey: process.env.PAYMENT_API_KEY || '',
      webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || '',
      sandbox: process.env.NODE_ENV !== 'production',
    };
    
    const gateway = PaymentGatewayFactory.create(
      process.env.PAYMENT_PROVIDER || 'mock',
      gatewayConfig
    );
    
    const isValid = gateway.verifyWebhook(signature, payload, timestamp);
    
    if (!isValid) {
      console.error('Invalid webhook signature');
      await prisma.webhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          error: 'Invalid signature',
        },
      });
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    // Parse event
    const event = gateway.parseEvent(payload);
    
    // Handle payment events
    if (event.type === 'invoice.paid') {
      // Find order by payment reference
      const order = await prisma.order.findFirst({
        where: {
          paymentRef: event.invoiceId,
        },
      });
      
      if (!order) {
        console.error('Order not found for invoice:', event.invoiceId);
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }
      
      // Update order status
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          paidAt: event.paidAt || new Date(),
          paymentMethod: event.paymentMethod,
        },
      });
      
      // Log transaction with JSON-safe payload
      const paymentPayload: Prisma.InputJsonValue = JSON.parse(JSON.stringify(event));

      await prisma.transactionLog.create({
        data: {
          orderId: order.id,
          type: 'PAYMENT_RECEIVED',
          payloadJson: paymentPayload,
        },
      });
      
      // Queue fulfill topup job
      const fulfillQueue = new Queue(queueNames.FULFILL_TOPUP, {
        connection: queueConnection,
      });
      
      await fulfillQueue.add(
        'fulfill',
        {
          orderId: order.id,
          idempotencyKey: order.idempotencyKey,
        },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        }
      );
    }
    
    // Mark webhook as processed
    await prisma.webhookEvent.update({
      where: { id: webhookEvent.id },
      data: {
        processedAt: new Date(),
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
