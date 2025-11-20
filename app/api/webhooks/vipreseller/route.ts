import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { OrderStatus } from '@prisma/client';

// Webhook endpoint for VIP Reseller callbacks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log webhook for debugging
    console.log('VIP Reseller Webhook received:', body);
    
    // Validate webhook signature if provided
    const signature = request.headers.get('x-signature');
    if (signature) {
      const apiId = process.env.VIPRESELLER_API_ID;
      const apiKey = process.env.VIPRESELLER_API_KEY;

      if (!apiId || !apiKey) {
        console.error('VIP Reseller credentials missing for webhook validation');
        return NextResponse.json(
          { error: 'Server configuration error' },
          { status: 500 }
        );
      }

      const expectedSignature = crypto
        .createHash('md5')
        .update(apiId + apiKey + body.trxid)
        .digest('hex');
      
      if (signature !== expectedSignature) {
        console.error('Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }
    
    // Extract webhook data
    const { trxid, status, note } = body;
    
    if (!trxid) {
      return NextResponse.json(
        { error: 'Transaction ID required' },
        { status: 400 }
      );
    }
    
    // Find order by provider order ID
    const order = await prisma.order.findFirst({
      where: { providerOrderId: trxid },
    });
    
    if (!order) {
      console.error(`Order not found for trxid: ${trxid}`);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Map VIP status to our status
    let newStatus: OrderStatus = order.status as OrderStatus;
    if (status === 'success') {
      newStatus = OrderStatus.SUCCESS;
    } else if (status === 'error' || status === 'failed') {
      newStatus = OrderStatus.FAILED;
    } else if (status === 'partial') {
      newStatus = OrderStatus.FAILED;
    } else if (status === 'process' || status === 'waiting') {
      newStatus = OrderStatus.PROCESSING;
    }
    
    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: newStatus,
        providerStatus: status,
        errorMessage: note || order.errorMessage,
        updatedAt: new Date(),
      },
    });
    
    // Send notification to customer if email provided
    if (order.contactEmail && (newStatus === OrderStatus.SUCCESS || newStatus === OrderStatus.FAILED)) {
      // TODO: Implement email notification
      console.log(`Should send email to ${order.contactEmail} about order ${order.code} status: ${newStatus}`);
    }

    // Send WhatsApp notification if WhatsApp number provided
    if (order.contactWhatsapp && (newStatus === OrderStatus.SUCCESS || newStatus === OrderStatus.FAILED)) {
      // TODO: Implement WhatsApp notification
      console.log(`Should send WhatsApp to ${order.contactWhatsapp} about order ${order.code} status: ${newStatus}`);
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      orderId: order.id,
      orderCode: order.code,
      status: newStatus,
    });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

// GET endpoint to verify webhook URL is working
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'VIP Reseller webhook endpoint is active',
    timestamp: new Date().toISOString(),
  });
}
