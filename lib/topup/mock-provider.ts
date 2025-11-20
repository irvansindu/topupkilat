import {
  TopupProvider,
  TopupProviderConfig,
  TopupTarget,
  VerifyTargetResult,
  FulfillParams,
  FulfillResult,
  TopupStatus,
} from '../types';
import { nanoid } from 'nanoid';

export class MockProvider implements TopupProvider {
  private config: TopupProviderConfig;
  private orders: Map<string, any> = new Map();

  constructor(config: TopupProviderConfig) {
    this.config = config;
  }

  async verifyTarget(product: string, target: TopupTarget): Promise<VerifyTargetResult> {
    // Simulate verification with delay
    await this.delay(500);

    // Mock validation logic
    if (product.includes('mlbb') || product.includes('mobile-legends')) {
      if (!target.uid || target.uid.length < 6) {
        return {
          valid: false,
          error: 'Invalid User ID',
        };
      }
      if (target.zoneId && (parseInt(target.zoneId) < 1000 || parseInt(target.zoneId) > 9999)) {
        return {
          valid: false,
          error: 'Invalid Zone ID',
        };
      }
      return {
        valid: true,
        displayName: `Player_${target.uid}`,
      };
    }

    if (product.includes('freefire') || product.includes('ff')) {
      if (!target.uid || target.uid.length < 8) {
        return {
          valid: false,
          error: 'Invalid Player ID',
        };
      }
      return {
        valid: true,
        displayName: `FF_Player_${target.uid.substring(0, 4)}`,
      };
    }

    if (product.includes('ewallet') || product.includes('pulsa')) {
      if (!target.phone || !this.isValidPhoneNumber(target.phone)) {
        return {
          valid: false,
          error: 'Invalid phone number',
        };
      }
      return {
        valid: true,
        displayName: this.maskPhoneNumber(target.phone),
      };
    }

    // Default validation
    return {
      valid: true,
      displayName: 'User',
    };
  }

  async fulfill(params: FulfillParams): Promise<FulfillResult> {
    // Simulate processing delay
    await this.delay(1000);

    const providerOrderId = `mock_${nanoid(12)}`;
    
    // Simulate different scenarios based on config or random
    const scenarios = ['success', 'success', 'success', 'failed', 'processing'];
    const scenario = this.config.sandbox ? 'success' : scenarios[Math.floor(Math.random() * scenarios.length)];

    let status: FulfillResult['status'];
    let message: string | undefined;
    let voucherCode: string | undefined;

    switch (scenario) {
      case 'success':
        status = 'success';
        message = 'Topup berhasil diproses';
        // Generate mock voucher code for voucher-based products
        if (params.product.includes('voucher')) {
          voucherCode = this.generateVoucherCode();
        }
        break;
      case 'failed':
        status = 'failed';
        message = 'Produk sedang tidak tersedia';
        break;
      case 'processing':
        status = 'processing';
        message = 'Sedang diproses oleh sistem';
        break;
      default:
        status = 'pending';
    }

    // Store order for status checking
    this.orders.set(providerOrderId, {
      ...params,
      providerOrderId,
      status,
      message,
      voucherCode,
      createdAt: new Date(),
    });

    return {
      providerOrderId,
      status,
      message,
      voucherCode,
    };
  }

  async getStatus(providerOrderId: string): Promise<TopupStatus> {
    await this.delay(300);

    const order = this.orders.get(providerOrderId);
    
    if (!order) {
      return {
        providerOrderId,
        status: 'failed',
        message: 'Order not found',
      };
    }

    // Simulate status progression for processing orders
    if (order.status === 'processing') {
      const now = Date.now();
      const elapsed = now - order.createdAt.getTime();
      
      // After 5 seconds, change to success
      if (elapsed > 5000) {
        order.status = 'success';
        order.completedAt = new Date();
        order.message = 'Topup berhasil';
        
        if (order.product?.includes('voucher')) {
          order.voucherCode = this.generateVoucherCode();
        }
      }
    }

    return {
      providerOrderId: order.providerOrderId,
      status: order.status,
      message: order.message,
      voucherCode: order.voucherCode,
      completedAt: order.completedAt,
    };
  }

  // Helper methods
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private isValidPhoneNumber(phone: string): boolean {
    // Indonesian phone number validation
    const cleanPhone = phone.replace(/\D/g, '');
    return /^(62|0)?8[1-9][0-9]{7,11}$/.test(cleanPhone);
  }

  private maskPhoneNumber(phone: string): string {
    const clean = phone.replace(/\D/g, '');
    if (clean.length >= 10) {
      return clean.substring(0, 4) + '****' + clean.substring(clean.length - 4);
    }
    return phone;
  }

  private generateVoucherCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) code += '-';
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }
}
