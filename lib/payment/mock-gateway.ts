import {
  PaymentGateway,
  PaymentGatewayConfig,
  CreateInvoiceParams,
  CreateInvoiceResult,
  PaymentEvent,
  InvoiceDetails,
} from '../types';
import { createHmac } from 'crypto';
import { nanoid } from 'nanoid';

export class MockGateway implements PaymentGateway {
  private config: PaymentGatewayConfig;
  private invoices: Map<string, any> = new Map();

  constructor(config: PaymentGatewayConfig) {
    this.config = config;
  }

  async createInvoice(params: CreateInvoiceParams): Promise<CreateInvoiceResult> {
    const invoiceId = `mock_inv_${nanoid(10)}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store invoice for later retrieval
    this.invoices.set(invoiceId, {
      ...params,
      invoiceId,
      status: 'pending',
      createdAt: new Date(),
      expiresAt,
    });

    // Mock payment instructions
    const paymentInstructions = [
      {
        method: 'BANK_TRANSFER',
        bank: 'BCA',
        accountNumber: '1234567890',
        accountName: 'PT TOPUP KILAT',
        amount: params.amount,
        instructions: [
          'Transfer sesuai jumlah yang tertera',
          'Simpan bukti pembayaran',
        ],
      },
      {
        method: 'QRIS',
        amount: params.amount,
        instructions: [
          'Scan QR code menggunakan aplikasi e-wallet',
          'Konfirmasi pembayaran',
        ],
      },
    ];

    // Generate mock QR string
    const qrString = `00020101021126610014ID.CO.QRIS.WWW011893600914${invoiceId}0214${params.orderId}0303UME51440014ID.CO.QRIS.WWW0215ID10200000000000303UME5204541153033605802ID5910TOPUPKILAT6015JAKARTA SELATAN61051234062070703A016304${this.generateChecksum(invoiceId)}`;

    return {
      invoiceId,
      checkoutUrl: `${process.env.APP_BASE_URL}/api/mock-payment/${invoiceId}`,
      qrString,
      expiresAt,
      paymentInstructions,
    };
  }

  verifyWebhook(signature: string, payload: any, timestamp?: string): boolean {
    const expectedSignature = this.generateWebhookSignature(payload, timestamp);
    return signature === expectedSignature;
  }

  parseEvent(payload: any): PaymentEvent {
    // Mock event parsing
    return {
      type: payload.event_type || 'invoice.paid',
      invoiceId: payload.invoice_id,
      orderId: payload.external_id,
      amount: payload.amount,
      paymentMethod: payload.payment_method || 'MOCK',
      paidAt: payload.paid_at ? new Date(payload.paid_at) : new Date(),
    };
  }

  async getInvoice(invoiceId: string): Promise<InvoiceDetails> {
    const invoice = this.invoices.get(invoiceId);
    
    if (!invoice) {
      // Return mock data for testing
      return {
        invoiceId,
        status: 'pending',
        amount: 0,
      };
    }

    return {
      invoiceId: invoice.invoiceId,
      status: invoice.status,
      amount: invoice.amount,
      paidAt: invoice.paidAt,
      paymentMethod: invoice.paymentMethod,
    };
  }

  // Helper methods
  private generateWebhookSignature(payload: any, timestamp?: string): string {
    const data = timestamp 
      ? `${timestamp}${JSON.stringify(payload)}`
      : JSON.stringify(payload);
    
    return createHmac('sha256', this.config.webhookSecret)
      .update(data)
      .digest('hex');
  }

  private generateChecksum(data: string): string {
    // Simple checksum for mock QR code
    return data.slice(-4).toUpperCase();
  }

  // Mock method to simulate payment (for testing)
  async simulatePayment(invoiceId: string, paymentMethod: string = 'QRIS'): Promise<PaymentEvent> {
    const invoice = this.invoices.get(invoiceId);
    
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    invoice.status = 'paid';
    invoice.paidAt = new Date();
    invoice.paymentMethod = paymentMethod;

    return {
      type: 'invoice.paid',
      invoiceId: invoice.invoiceId,
      orderId: invoice.orderId,
      amount: invoice.amount,
      paymentMethod,
      paidAt: invoice.paidAt,
    };
  }
}
