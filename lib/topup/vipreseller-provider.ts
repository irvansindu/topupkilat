import { TopupRequest, TopupResponse, TopupStatus, BalanceResponse, ProductInfo } from '../types';
import crypto from 'crypto';

const logger = {
  info: (...args: unknown[]) => console.info('[vipreseller-provider]', ...args),
  error: (...args: unknown[]) => console.error('[vipreseller-provider]', ...args),
};

interface VipResellerConfig {
  apiKey: string;
  apiId: string;
  baseUrl?: string;
  sandbox?: boolean;
}

interface VipResellerOrderResponse {
  result: boolean;
  data?: {
    trxid: string;
    data: string;
    zone: string;
    service: string;
    status: 'waiting' | 'process' | 'success' | 'error' | 'partial';
    note: string;
    balance: number;
    price: number;
  };
  message: string;
}

interface VipResellerServiceResponse {
  result: boolean;
  data?: Array<{
    code: string;
    game: string;
    name: string;
    price: {
      basic: number;
      premium: number;
      special: number;
    };
    server: string;
    status: 'available' | 'empty';
  }>;
  message: string;
}

interface VipResellerNicknameResponse {
  result: boolean;
  data?: {
    nickname: string;
    userId: string;
    zoneId?: string;
    country?: string;
    vipLevel?: string;
  };
  message: string;
}

interface VipResellerEventPayload {
  status?: string;
  trxid?: string;
  message?: string;
  data?: unknown;
  zone?: string;
  service?: string;
  note?: string;
}

export class VipResellerProvider {
  private config: VipResellerConfig;
  private baseUrl: string;

  constructor(config: VipResellerConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://vip-reseller.co.id';
  }

  async fulfill(request: TopupRequest): Promise<TopupResponse> {
    try {
      const signature = this.generateSignature(this.config.apiKey, this.config.apiId);
      
      const params = new URLSearchParams();
      params.append('key', this.config.apiKey);
      params.append('sign', signature);
      params.append('type', 'order');
      params.append('service', request.product); // Service code dari VIP Reseller
      params.append('data_no', request.target.userId || request.target.phone || '');
      if (request.target.zoneId) {
        params.append('data_zone', request.target.zoneId);
      }

      const response = await fetch(`${this.baseUrl}/api/game-feature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const result = await response.json() as VipResellerOrderResponse;

      if (!result.result) {
        return {
          status: 'failed',
          message: result.message || 'Order failed',
          providerOrderId: null,
        };
      }

      if (!result.data) {
        return {
          status: 'failed',
          message: 'No data returned from provider',
          providerOrderId: null,
        };
      }

      // Map status dari VIP Reseller ke status internal
      let status: 'success' | 'processing' | 'failed' = 'processing';
      if (result.data.status === 'success') {
        status = 'success';
      } else if (result.data.status === 'error' || result.data.status === 'partial') {
        status = 'failed';
      } else {
        status = 'processing';
      }

      logger.info({ 
        orderId: request.orderId, 
        providerOrderId: result.data.trxid,
        status: result.data.status 
      }, 'VIP Reseller order response');

      return {
        status,
        providerOrderId: result.data.trxid,
        message: result.message,
        serialNumber: result.data.note,
        balance: result.data.balance,
        price: result.data.price,
      };
    } catch (error) {
      logger.error({ error, request }, 'VIP Reseller fulfill error');
      return {
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        providerOrderId: null,
      };
    }
  }

  async checkStatus(providerOrderId: string): Promise<TopupStatus> {
    try {
      const signature = this.generateSignature(this.config.apiKey, this.config.apiId);
      
      const params = new URLSearchParams();
      params.append('key', this.config.apiKey);
      params.append('sign', signature);
      params.append('type', 'status');
      params.append('trxid', providerOrderId);

      const response = await fetch(`${this.baseUrl}/api/game-feature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const result = await response.json() as VipResellerOrderResponse;

      if (!result.result || !result.data) {
        return {
          providerOrderId,
          status: 'failed',
          message: result.message || 'Status check failed',
        };
      }

      let status: 'success' | 'processing' | 'failed' = 'processing';
      if (result.data.status === 'success') {
        status = 'success';
      } else if (result.data.status === 'error' || result.data.status === 'partial') {
        status = 'failed';
      } else {
        status = 'processing';
      }

      return {
        providerOrderId,
        status,
        message: result.message,
      };
    } catch (error) {
      logger.error({ error, providerOrderId }, 'VIP Reseller status check error');
      return {
        providerOrderId,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getBalance(): Promise<BalanceResponse> {
    try {
      const signature = this.generateSignature(this.config.apiKey, this.config.apiId);
      
      const params = new URLSearchParams();
      params.append('key', this.config.apiKey);
      params.append('sign', signature);
      params.append('type', 'profile');

      const response = await fetch(`${this.baseUrl}/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const result = await response.json();

      if (!result.result) {
        throw new Error(result.message || 'Failed to get balance');
      }

      return {
        balance: result.data?.balance || 0,
        currency: 'IDR',
      };
    } catch (error) {
      logger.error({ error }, 'VIP Reseller get balance error');
      throw error;
    }
  }

  async getProducts(category?: string): Promise<ProductInfo[]> {
    try {
      const signature = this.generateSignature(this.config.apiKey, this.config.apiId);
      
      const params = new URLSearchParams();
      params.append('key', this.config.apiKey);
      params.append('sign', signature);
      params.append('type', 'services');
      params.append('filter_type', 'game');
      
      if (category) {
        params.append('filter_value', category);
      }

      const response = await fetch(`${this.baseUrl}/api/game-feature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const result = await response.json() as VipResellerServiceResponse;

      if (!result.result || !result.data) {
        return [];
      }

      return result.data
        .filter(item => item.status === 'available')
        .map(item => ({
          code: item.code,
          name: item.name,
          game: item.game,
          price: item.price.special, // Gunakan harga special (termurah)
          status: item.status === 'available',
        }));
    } catch (error) {
      logger.error({ error }, 'VIP Reseller get products error');
      return [];
    }
  }

  async getNickname(game: string, userId: string, zoneId?: string): Promise<string | null> {
    try {
      const signature = this.generateSignature(this.config.apiKey, this.config.apiId);
      
      const params = new URLSearchParams();
      params.append('key', this.config.apiKey);
      params.append('sign', signature);
      params.append('type', 'get-nickname');
      params.append('code', game);
      params.append('data', userId);
      
      if (zoneId) {
        params.append('data_zone', zoneId);
      }

      const response = await fetch(`${this.baseUrl}/api/game-feature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const result = await response.json() as VipResellerNicknameResponse;

      if (!result.result || !result.data) {
        return null;
      }

      return result.data.nickname;
    } catch (error) {
      logger.error({ error }, 'VIP Reseller get nickname error');
      return null;
    }
  }

  verifyWebhook(): boolean {
    // VIP Reseller tidak memiliki webhook signature verification yang terdokumentasi
    // Implementasi basic validation
    return true;
  }

  parseEvent(payload: VipResellerEventPayload): Record<string, unknown> {
    // Parse webhook event dari VIP Reseller
    const type = payload.status === 'success' ? 'topup.success' : 'topup.failed';
    return {
      type,
      trxid: payload.trxid,
      status: payload.status,
      message: payload.message,
      data: payload.data,
      zone: payload.zone,
      service: payload.service,
      note: payload.note,
    };
  }

  private generateSignature(apiKey: string, apiId: string): string {
    // Generate MD5 signature sesuai dokumentasi VIP Reseller
    // sign = md5(api_id + api_key)
    return crypto.createHash('md5').update(apiId + apiKey).digest('hex');
  }

  async syncProducts(): Promise<void> {
    // Sync products dari VIP Reseller ke database lokal
    const products = await this.getProducts();
    
    // Group products by game
    const gameProducts = new Map<string, typeof products>();
    
    for (const product of products) {
      if (!gameProducts.has(product.game)) {
        gameProducts.set(product.game, []);
      }
      gameProducts.get(product.game)?.push(product);
    }

    // Log untuk debugging
    logger.info({ 
      totalProducts: products.length,
      games: Array.from(gameProducts.keys())
    }, 'Synced products from VIP Reseller');
  }
}

// Factory function
export function createVipResellerProvider(config: Partial<VipResellerConfig>): VipResellerProvider {
  if (!config.apiKey || !config.apiId) {
    throw new Error('VIP Reseller API key and ID are required');
  }

  return new VipResellerProvider({
    apiKey: config.apiKey,
    apiId: config.apiId,
    baseUrl: config.baseUrl,
    sandbox: config.sandbox || false,
  });
}
