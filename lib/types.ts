// Core Types
export interface PaymentGatewayConfig {
  apiKey: string;
  apiSecret?: string;
  webhookSecret: string;
  baseUrl?: string;
  sandbox?: boolean;
}

export interface TopupProviderConfig {
  apiKey: string;
  apiSecret?: string;
  baseUrl?: string;
  sandbox?: boolean;
}

// Payment Gateway Interface
export interface PaymentGateway {
  createInvoice(params: CreateInvoiceParams): Promise<CreateInvoiceResult>;
  verifyWebhook(signature: string, payload: any, timestamp?: string): boolean;
  parseEvent(payload: any): PaymentEvent;
  getInvoice(invoiceId: string): Promise<InvoiceDetails>;
}

export interface CreateInvoiceParams {
  orderId: string;
  amount: number;
  currency?: string;
  customerEmail: string;
  customerPhone?: string;
  description: string;
  items?: InvoiceItem[];
  successRedirectUrl?: string;
  failureRedirectUrl?: string;
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

export interface CreateInvoiceResult {
  invoiceId: string;
  checkoutUrl?: string;
  qrString?: string;
  expiresAt: Date;
  paymentInstructions?: PaymentInstruction[];
}

export interface PaymentInstruction {
  method: string;
  bank?: string;
  accountNumber?: string;
  accountName?: string;
  amount: number;
  instructions?: string[];
}

export interface InvoiceDetails {
  invoiceId: string;
  status: 'pending' | 'paid' | 'expired' | 'failed';
  amount: number;
  paidAt?: Date;
  paymentMethod?: string;
}

export interface PaymentEvent {
  type: 'invoice.paid' | 'invoice.expired' | 'invoice.failed';
  invoiceId: string;
  orderId?: string;
  amount: number;
  paymentMethod?: string;
  paidAt?: Date;
}

// Topup Provider Interface
export interface TopupProvider {
  verifyTarget(product: string, target: TopupTarget): Promise<VerifyTargetResult>;
  fulfill(params: FulfillParams): Promise<FulfillResult>;
  getStatus(providerOrderId: string): Promise<TopupStatus>;
}

export interface TopupTarget {
  uid?: string;
  zoneId?: string;
  phone?: string;
}

export interface VerifyTargetResult {
  valid: boolean;
  displayName?: string;
  error?: string;
}

export interface FulfillParams {
  orderId: string;
  product: string;
  denomination: number;
  target: TopupTarget;
  customerEmail?: string;
  customerPhone?: string;
}

export interface FulfillResult {
  providerOrderId: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  message?: string;
  voucherCode?: string;
}

export interface TopupStatus {
  providerOrderId: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  message?: string;
  voucherCode?: string;
  completedAt?: Date;
}

// Queue Job Types
export interface FulfillTopupJob {
  orderId: string;
  idempotencyKey: string;
}

export interface ProcessPaymentWebhookJob {
  webhookId: string;
  payload: any;
  signature: string;
  timestamp?: string;
}

export interface RefundOrderJob {
  orderId: string;
  reason: string;
}

// Pricing Types
export interface PricingResult {
  basePrice: number;
  feeFlat: number;
  feePct: number;
  promoDiscount: number;
  total: number;
}

// Security Types
export interface IdempotencyRecord {
  key: string;
  result: any;
  createdAt: Date;
}

// Notification Types
export interface NotificationParams {
  type: 'order_success' | 'order_failed' | 'payment_received';
  orderId: string;
  email?: string;
  phone?: string;
  data: Record<string, any>;
}

// Additional Types for VIP Reseller Integration
export interface TopupRequest {
  orderId: string;
  product: string;
  denomination: number;
  target: {
    userId?: string;
    zoneId?: string;
    phone?: string;
    email?: string;
  };
  customerEmail?: string;
  customerPhone?: string;
}

export interface TopupResponse {
  status: 'success' | 'processing' | 'failed';
  providerOrderId: string | null;
  message?: string;
  serialNumber?: string;
  voucherCode?: string;
  balance?: number;
  price?: number;
}

export interface BalanceResponse {
  balance: number;
  currency: string;
}

export interface ProductInfo {
  code: string;
  name: string;
  game: string;
  price: number;
  status: boolean;
}
