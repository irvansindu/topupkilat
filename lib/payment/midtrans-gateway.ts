import {
  PaymentGateway,
  PaymentGatewayConfig,
  CreateInvoiceParams,
  CreateInvoiceResult,
  PaymentEvent,
  InvoiceDetails,
} from '../types';
import { createHmac } from 'crypto';

interface MidtransSnapResponse {
  token: string;
  redirect_url: string;
  transaction_id?: string;
  order_id?: string;
}

interface MidtransStatusResponse {
  order_id: string;
  transaction_id: string;
  transaction_status: string;
  payment_type?: string;
  gross_amount: string;
  settlement_time?: string;
  transaction_time?: string;
}

interface MidtransNotification {
  order_id: string;
  transaction_status: string;
  payment_type?: string;
  gross_amount: string;
  status_code?: string;
  signature_key?: string;
  settlement_time?: string;
  transaction_time?: string;
}

export class MidtransGateway implements PaymentGateway {
  private config: PaymentGatewayConfig;
  private snapBaseUrl: string;
  private coreBaseUrl: string;

  constructor(config: PaymentGatewayConfig) {
    this.config = config;
    this.snapBaseUrl = config.sandbox
      ? 'https://app.sandbox.midtrans.com/snap/v1'
      : 'https://app.midtrans.com/snap/v1';
    this.coreBaseUrl = config.sandbox
      ? 'https://api.sandbox.midtrans.com'
      : 'https://api.midtrans.com';
  }

  async createInvoice(params: CreateInvoiceParams): Promise<CreateInvoiceResult> {
    const payload = {
      transaction_details: {
        order_id: params.orderId,
        gross_amount: params.amount,
      },
      item_details: params.items?.map((item) => ({
        id: item.name,
        price: item.price,
        quantity: item.quantity,
        name: item.name,
      })),
      customer_details: {
        email: params.customerEmail,
        phone: params.customerPhone,
      },
      callbacks: {
        finish: params.successRedirectUrl,
      },
      expiry: {
        unit: 'minute',
        duration: 60,
      },
      credit_card: {
        secure: true,
      },
    };

    const response = await fetch(`${this.snapBaseUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: this.getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Midtrans createInvoice failed: ${response.status} ${errorBody}`
      );
    }

    const data = (await response.json()) as MidtransSnapResponse;

    return {
      invoiceId: params.orderId,
      checkoutUrl: data.redirect_url,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
  }

  verifyWebhook(signature: string, payload: MidtransNotification): boolean {
    const providedSignature = signature || payload?.signature_key || '';
    if (!providedSignature) {
      return false;
    }

    const secret = this.config.webhookSecret || this.config.apiKey;
    if (!secret) {
      return false;
    }

    const orderId = payload.order_id;
    const statusCode = payload.status_code;
    const grossAmount = payload.gross_amount;

    if (!orderId || !statusCode || !grossAmount) {
      return false;
    }

    const expectedSignature = createHmac('sha512', secret)
      .update(`${orderId}${statusCode}${grossAmount}${secret}`)
      .digest('hex');

    return providedSignature === expectedSignature;
  }

  parseEvent(payload: MidtransNotification): PaymentEvent {
    const statusMap: Record<string, PaymentEvent['type']> = {
      capture: 'invoice.paid',
      settlement: 'invoice.paid',
      expire: 'invoice.expired',
      failure: 'invoice.failed',
      deny: 'invoice.failed',
      cancel: 'invoice.failed',
    };

    return {
      type: statusMap[payload.transaction_status] || 'invoice.paid',
      invoiceId: payload.order_id,
      orderId: payload.order_id,
      amount: parseInt(payload.gross_amount, 10) || 0,
      paymentMethod: payload.payment_type,
      paidAt: payload.settlement_time
        ? new Date(payload.settlement_time)
        : payload.transaction_time
        ? new Date(payload.transaction_time)
        : undefined,
    };
  }

  async getInvoice(invoiceId: string): Promise<InvoiceDetails> {
    const response = await fetch(`${this.coreBaseUrl}/v2/${invoiceId}/status`, {
      headers: {
        Accept: 'application/json',
        Authorization: this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Midtrans getInvoice failed: ${response.status} ${errorBody}`
      );
    }

    const data = (await response.json()) as MidtransStatusResponse;

    const statusMap: Record<string, InvoiceDetails['status']> = {
      capture: 'paid',
      settlement: 'paid',
      pending: 'pending',
      expire: 'expired',
      failure: 'failed',
      deny: 'failed',
      cancel: 'failed',
    };

    return {
      invoiceId: data.order_id,
      status: statusMap[data.transaction_status] || 'pending',
      amount: parseInt(data.gross_amount, 10) || 0,
      paidAt: data.settlement_time
        ? new Date(data.settlement_time)
        : undefined,
      paymentMethod: data.payment_type,
    };
  }

  private getAuthHeader(): string {
    const key = this.config.apiKey;
    if (!key) {
      throw new Error('Midtrans server key is not configured');
    }

    const encoded = Buffer.from(`${key}:`).toString('base64');
    return `Basic ${encoded}`;
  }
}
