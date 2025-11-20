import {
  TopupProvider,
  TopupProviderConfig,
  TopupTarget,
  VerifyTargetResult,
  FulfillParams,
  FulfillResult,
  TopupStatus,
} from '../types';

export class AggregatorProvider implements TopupProvider {
  private config: TopupProviderConfig;
  private baseUrl: string;

  constructor(config: TopupProviderConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api.aggregator.example';
  }

  async verifyTarget(product: string, target: TopupTarget): Promise<VerifyTargetResult> {
    // TODO: Implement actual API call to aggregator
    // This is a stub implementation
    
    try {
      // Example API request structure
      const requestBody = {
        product_code: product,
        customer_id: target.uid || target.phone,
        zone_id: target.zoneId,
      };

      // Stub response
      return {
        valid: true,
        displayName: 'Customer',
      };
    } catch (error) {
      return {
        valid: false,
        error: 'Verification failed',
      };
    }
  }

  async fulfill(params: FulfillParams): Promise<FulfillResult> {
    // TODO: Implement actual API call to aggregator
    
    try {
      const requestBody = {
        product_code: params.product,
        customer_id: params.target.uid || params.target.phone,
        zone_id: params.target.zoneId,
        amount: params.denomination,
        ref_id: params.orderId,
        callback_url: `${process.env.APP_BASE_URL}/api/webhooks/provider`,
      };

      // Stub response
      return {
        providerOrderId: 'agg_order_stub',
        status: 'processing',
        message: 'Order is being processed',
      };
    } catch (error) {
      return {
        providerOrderId: '',
        status: 'failed',
        message: 'Failed to process order',
      };
    }
  }

  async getStatus(providerOrderId: string): Promise<TopupStatus> {
    // TODO: Implement actual API call to check status
    
    return {
      providerOrderId,
      status: 'processing',
      message: 'Order is still being processed',
    };
  }

  private getAuthHeaders(): Record<string, string> {
    return {
      'X-API-Key': this.config.apiKey,
      'X-API-Secret': this.config.apiSecret || '',
      'Content-Type': 'application/json',
    };
  }
}
