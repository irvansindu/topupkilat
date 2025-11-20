import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { vipResellerPrepaid } from '@/lib/topup/vipreseller-prepaid';
import { OrderStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      productCode, 
      phoneNumber, 
      denominationId,
      customerEmail,
      customerPhone 
    } = body;

    // Validate input
    if (!productCode || !phoneNumber || !denominationId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get denomination details
    const denomination = await prisma.denomination.findUnique({
      where: { id: denominationId },
      include: { product: true },
    });

    if (!denomination) {
      return NextResponse.json(
        { error: 'Denomination not found' },
        { status: 404 }
      );
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        productId: denomination.productId,
        denominationId: denomination.id,
        targetJson: {
          phone: phoneNumber,
          type: denomination.product.type,
        },
        contactEmail: customerEmail || '',
        contactWhatsapp: customerPhone || '',
        gateway: 'VIPRESELLER',
        status: 'PENDING',
        total: denomination.priceSell,
        paymentMethod: 'UNPAID',
      },
    });

    // Call VIP Reseller API
    const vipResponse = await vipResellerPrepaid.orderPrepaid(
      denomination.code || productCode,
      phoneNumber
    );

    if (vipResponse.result && vipResponse.data) {
      // Update order with VIP Reseller transaction ID
      await prisma.order.update({
        where: { id: order.id },
        data: {
          providerOrderId: vipResponse.data.trxid,
          status: 'PROCESSING',
          providerStatus: vipResponse.data.status,
          errorMessage: null,
        },
      });

      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderCode: order.code,
        providerOrderId: vipResponse.data.trxid,
        status: vipResponse.data.status,
        message: vipResponse.message,
        balance: vipResponse.data.balance,
      });
    } else {
      // Order failed
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'FAILED',
          errorMessage: vipResponse.message ?? order.errorMessage,
          providerStatus: vipResponse.data?.status,
        },
      });

      return NextResponse.json(
        { 
          success: false,
          error: vipResponse.message || 'Order failed',
          orderId: order.id,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error processing prepaid order:', error);
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    );
  }
}

// Check order status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('orderId');
    const providerOrderId = searchParams.get('trxid');

    if (!orderId && !providerOrderId) {
      return NextResponse.json(
        { error: 'Order ID or Transaction ID required' },
        { status: 400 }
      );
    }

    // Get order from database
    const order = await prisma.order.findFirst({
      where: orderId 
        ? { id: orderId }
        : { providerOrderId: providerOrderId || '' },
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

    // If order is still processing, check status from VIP Reseller
    if (order.status === 'PROCESSING' && order.providerOrderId) {
      const statusResponse = await vipResellerPrepaid.checkPrepaidStatus(
        order.providerOrderId
      );

      if (statusResponse.result && statusResponse.data && statusResponse.data.length > 0) {
        const vipStatus = statusResponse.data[0];
        
        // Map VIP status to our status
        let newStatus: OrderStatus = order.status;
        if (vipStatus.status === 'success') {
          newStatus = OrderStatus.SUCCESS;
        } else if (vipStatus.status === 'error') {
          newStatus = OrderStatus.FAILED;
        } else if (vipStatus.status === 'partial') {
          newStatus = OrderStatus.FAILED;
        }

        // Update order status if changed
        if (newStatus !== order.status) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: newStatus,
              providerStatus: vipStatus.status,
              errorMessage: vipStatus.note || order.errorMessage,
            },
          });
          order.status = newStatus;
          order.providerStatus = vipStatus.status;
          order.errorMessage = vipStatus.note || order.errorMessage;
        }
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        code: order.code,
        status: order.status,
        product: order.product.name,
        denomination: order.denomination?.label,
        target: order.targetJson,
        amount: order.total,
        createdAt: order.createdAt,
        providerStatus: order.providerStatus,
        errorMessage: order.errorMessage,
      },
    });
  } catch (error) {
    console.error('Error checking order status:', error);
    return NextResponse.json(
      { error: 'Failed to check order status' },
      { status: 500 }
    );
  }
}
