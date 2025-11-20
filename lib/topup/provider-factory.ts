import {
  TopupProvider,
  TopupProviderConfig,
  TopupTarget,
  FulfillParams,
} from '../types';
import { MockProvider } from './mock-provider';
import { AggregatorProvider } from './aggregator-provider';
import { createVipResellerProvider } from './vipreseller-provider';

type ExtendedProviderConfig = TopupProviderConfig & {
  apiId?: string;
};

export class TopupProviderFactory {
  static create(provider: string, config: ExtendedProviderConfig): TopupProvider {
    switch (provider.toLowerCase()) {
      case 'mock':
        return new MockProvider(config);
      case 'aggregator':
        return new AggregatorProvider(config);
      case 'vipreseller':
      case 'vip-reseller':
        // VIP Reseller needs special adapter to conform to TopupProvider interface
        const vipProvider = createVipResellerProvider({
          apiKey: config.apiKey || process.env.VIPRESELLER_API_KEY || '',
          apiId: config.apiId || process.env.VIPRESELLER_API_ID || '',
          baseUrl: config.baseUrl,
          sandbox: config.sandbox,
        });
        
        // Wrap VIP Reseller provider to match TopupProvider interface
        return {
          verifyTarget: async (product: string, target: TopupTarget) => {
            const nickname = await vipProvider.getNickname(
              product,
              target.uid || target.phone || '',
              target.zoneId
            );
            return {
              valid: nickname !== null,
              displayName: nickname || undefined,
            };
          },
          fulfill: async (params: FulfillParams) => {
            const response = await vipProvider.fulfill({
              orderId: params.orderId,
              product: params.product,
              denomination: params.denomination,
              target: {
                userId: params.target.uid,
                zoneId: params.target.zoneId,
                phone: params.target.phone,
              },
              customerEmail: params.customerEmail,
              customerPhone: params.customerPhone,
            });
            
            return {
              providerOrderId: response.providerOrderId || '',
              status: response.status === 'success' ? 'success' : 
                     response.status === 'processing' ? 'processing' : 
                     response.status === 'failed' ? 'failed' : 'pending',
              message: response.message,
              voucherCode: response.voucherCode,
            };
          },
          getStatus: async (providerOrderId: string) => {
            const status = await vipProvider.checkStatus(providerOrderId);
            return {
              providerOrderId,
              status: status.status === 'success' ? 'success' :
                     status.status === 'processing' ? 'processing' :
                     status.status === 'failed' ? 'failed' : 'pending',
              message: status.message,
            };
          },
        } as TopupProvider;
        
      default:
        throw new Error(`Unknown topup provider: ${provider}`);
    }
  }
}
