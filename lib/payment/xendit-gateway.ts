import {
  PaymentGateway,
  PaymentGatewayConfig,
  CreateInvoiceParams,
  CreateInvoiceResult,
  PaymentEvent,
  InvoiceDetails,
} from '../types';
import { createHmac } from 'crypto';

export class XenditGateway implements PaymentGateway {
  private config: PaymentGatewayConfig;
  private baseUrl: string;

  constructor(config: PaymentGatewayConfig) {
    this.config = config;
    this.baseUrl = config.sandbox 
      ? 'https://api.xendit.co/v2'
      : 'https://api.xendit.co/v2';
  }

  async createInvoice(params: CreateInvoiceParams): Promise<CreateInvoiceResult> {
    // TODO: Implement actual Xendit API call
    // This is a stub implementation
    const requestBody = {
      external_id: params.orderId,
      amount: params.amount,
      description: params.description,
      payer_email: params.customerEmail,
      customer: {
        email: params.customerEmail,
        mobile_number: params.customerPhone,
      },
      success_redirect_url: params.successRedirectUrl,
      failure_redirect_url: params.failureRedirectUrl,
      currency: params.currency || 'IDR',
      items: params.items?.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    // Stub response
    return {
      invoiceId: 'xendit_inv_stub',
      checkoutUrl: 'https://checkout.xendit.co/stub',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
  }

  verifyWebhook(signature: string, payload: any, timestamp?: string): boolean {
    // Xendit uses x-callback-token header
    const expectedToken = this.config.webhookSecret;
    return signature === expectedToken;
  }

  parseEvent(payload: any): PaymentEvent {
    // Parse Xendit webhook payload
    const eventTypeMap: Record<string, PaymentEvent['type']> = {
      'PAID': 'invoice.paid',
      'EXPIRED': 'invoice.expired',
      'FAILED': 'invoice.failed',
    };

    return {
      type: eventTypeMap[payload.status] || 'invoice.paid',
      invoiceId: payload.id,
      orderId: payload.external_id,
      amount: payload.amount,
      paymentMethod: payload.payment_method,
      paidAt: payload.paid_at ? new Date(payload.paid_at) : undefined,
    };
  }

  async getInvoice(invoiceId: string): Promise<InvoiceDetails> {
    // TODO: Implement actual Xendit API call
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
