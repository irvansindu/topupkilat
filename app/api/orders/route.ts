import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { PricingEngine } from '@/lib/pricing';
import { PaymentGatewayFactory } from '@/lib/payment/gateway-factory';
import { generateOrderCode, generateIdempotencyKey } from '@/lib/utils';

const createOrderSchema = z.object({
  productId: z.string(),
  denominationId: z.string(),
  target: z.object({
    uid: z.string().optional(),
    zoneId: z.string().optional(),
    phone: z.string().optional(),
  }),
  contactEmail: z.string().email(),
  contactWhatsapp: z.string(),
  promoCode: z.string().optional(),
  paymentMethod: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createOrderSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.flatten() },
        { status: 400 }
      );
    }
    
    const data = validation.data;
    
    // Get product and denomination
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      include: { denominations: true },
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    const denomination = product.denominations.find(
      (denom: (typeof product.denominations)[number]) => denom.id === data.denominationId
    );
    
    if (!denomination) {
      return NextResponse.json(
        { error: 'Denomination not found' },
        { status: 404 }
      );
    }
    
    // Check promo code if provided
    let promo = null;
    if (data.promoCode) {
      promo = await prisma.promo.findUnique({
        where: { code: data.promoCode },
      });
      
      if (!promo) {
        return NextResponse.json(
          { error: 'Invalid promo code' },
          { status: 400 }
        );
      }
      
      // Validate promo
      const now = new Date();
      if (now < promo.startAt || now > promo.endAt) {
        return NextResponse.json(
          { error: 'Promo code has expired' },
          { status: 400 }
        );
      }
      
      if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
        return NextResponse.json(
          { error: 'Promo code usage limit reached' },
          { status: 400 }
        );
      }
    }
    
    // Calculate pricing
    const pricing = PricingEngine.calculate(denomination, promo);
    
    // Generate idempotency key
    const idempotencyKey = generateIdempotencyKey({
      ...data,
      timestamp: Date.now(),
    });
    
    // Check if order already exists with this idempotency key
    const existingOrder = await prisma.order.findUnique({
      where: { idempotencyKey },
    });
    
    if (existingOrder) {
      return NextResponse.json({
        order: existingOrder,
      });
    }
    
    // Create order
    const order = await prisma.order.create({
      data: {
        code: generateOrderCode(),
        productId: product.id,
        denominationId: denomination.id,
        targetJson: data.target,
        contactEmail: data.contactEmail,
        contactWhatsapp: data.contactWhatsapp,
        promoCode: data.promoCode,
        gateway: process.env.PAYMENT_PROVIDER || 'mock',
        paymentMethod: data.paymentMethod,
        status: 'PENDING',
        total: pricing.total,
        idempotencyKey,
      },
      include: {
        product: true,
        denomination: true,
      },
    });
    
    // Create payment invoice
    const gatewayConfig = {
      apiKey: process.env.PAYMENT_API_KEY || '',
      webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || '',
      sandbox: process.env.NODE_ENV !== 'production',
    };
    
    const gateway = PaymentGatewayFactory.create(
      process.env.PAYMENT_PROVIDER || 'mock',
      gatewayConfig
    );
    
    const invoice = await gateway.createInvoice({
      orderId: order.id,
      amount: order.total,
      customerEmail: order.contactEmail,
      customerPhone: order.contactWhatsapp,
      description: `Top Up ${product.name} - ${denomination.label}`,
      // Biarkan Midtrans / browser yang meng-encode URL, jangan encode dua kali di sini
      successRedirectUrl: `${process.env.APP_BASE_URL}/order/${order.code}/success?email=${order.contactEmail}`,
      failureRedirectUrl: `${process.env.APP_BASE_URL}/order/${order.code}/failed?email=${order.contactEmail}`,
    });
    
    // Update order with payment reference
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentRef: invoice.invoiceId,
        status: 'WAITING_PAYMENT',
      },
    });
    
    // Log transaction (ensure JSON-serializable payload)
    const transactionPayload: Prisma.InputJsonValue = JSON.parse(
      JSON.stringify({
        pricing,
        invoice,
      })
    );

    await prisma.transactionLog.create({
      data: {
        orderId: order.id,
        type: 'ORDER_CREATED',
        payloadJson: transactionPayload,
      },
    });
    
    // Update promo usage if used
    if (promo) {
      await prisma.promo.update({
        where: { id: promo.id },
        data: {
          usedCount: {
            increment: 1,
          },
        },
      });
    }
    
    return NextResponse.json({
      order: {
        ...order,
        paymentUrl: invoice.checkoutUrl,
        qrCode: invoice.qrString,
        paymentInstructions: invoice.paymentInstructions,
        expiresAt: invoice.expiresAt,
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const email = searchParams.get('email');
    
    if (!code || !email) {
      return NextResponse.json(
        { error: 'Order code and email are required' },
        { status: 400 }
      );
    }
    
    const order = await prisma.order.findFirst({
      where: {
        code,
        contactEmail: email,
      },
      include: {
        product: true,
        denomination: true,
      },
    });
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
