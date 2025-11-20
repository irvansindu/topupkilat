import {
  PaymentGateway,
  PaymentGatewayConfig,
  CreateInvoiceParams,
  CreateInvoiceResult,
  PaymentEvent,
  InvoiceDetails,
} from '../types';
import { createHmac } from 'crypto';

export class MidtransGateway implements PaymentGateway {
  private config: PaymentGatewayConfig;
  private baseUrl: string;

  constructor(config: PaymentGatewayConfig) {
    this.config = config;
    this.baseUrl = config.sandbox 
      ? 'https://api.sandbox.midtrans.com'
      : 'https://api.midtrans.com';
  }

  async createInvoice(params: CreateInvoiceParams): Promise<CreateInvoiceResult> {
    // TODO: Implement actual Midtrans API call
    // This is a stub implementation
    const requestBody = {
      transaction_details: {
        order_id: params.orderId,
        gross_amount: params.amount,
      },
      customer_details: {
        email: params.customerEmail,
        phone: params.customerPhone,
      },
      item_details: params.items?.map(item => ({
        id: item.name,
        price: item.price,
        quantity: item.quantity,
        name: item.name,
      })),
    };

    // Stub response
    return {
      invoiceId: 'midtrans_inv_stub',
      checkoutUrl: 'https://app.sandbox.midtrans.com/snap/stub',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
  }

  verifyWebhook(signature: string, payload: any, timestamp?: string): boolean {
    // Midtrans signature verification
    const signatureKey = this.config.webhookSecret;
    const orderId = payload.order_id;
    const statusCode = payload.status_code;
    const grossAmount = payload.gross_amount;
    
    const expectedSignature = createHmac('sha512', signatureKey)
      .update(`${orderId}${statusCode}${grossAmount}${signatureKey}`)
      .digest('hex');
    
    return signature === expectedSignature;
  }

  parseEvent(payload: any): PaymentEvent {
    // Parse Midtrans webhook payload
    const statusMap: Record<string, PaymentEvent['type']> = {
      'capture': 'invoice.paid',
      'settlement': 'invoice.paid',
      'expire': 'invoice.expired',
      'failure': 'invoice.failed',
      'deny': 'invoice.failed',
    };

    return {
      type: statusMap[payload.transaction_status] || 'invoice.paid',
      invoiceId: payload.transaction_id,
      orderId: payload.order_id,
      amount: parseInt(payload.gross_amount),
      paymentMethod: payload.payment_type,
      paidAt: payload.transaction_time ? new Date(payload.transaction_time) : undefined,
    };
  }

  async getInvoice(invoiceId: string): Promise<InvoiceDetails> {
    // TODO: Implement actual Midtrans API call
    return {
      invoiceId,
      status: 'pending',
      amount: 0,
    };
  }

  private getAuthHeader(): string {
    const encoded = Buffer.from(`${this.config.apiKey}:`).toString('base64');
    return `Basic ${encoded}`;
  }
}
