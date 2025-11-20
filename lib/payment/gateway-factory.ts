import { PaymentGateway, PaymentGatewayConfig } from '../types';
import { MockGateway } from './mock-gateway';
import { XenditGateway } from './xendit-gateway';
import { MidtransGateway } from './midtrans-gateway';

export class PaymentGatewayFactory {
  static create(provider: string, config: PaymentGatewayConfig): PaymentGateway {
    switch (provider.toLowerCase()) {
      case 'mock':
        return new MockGateway(config);
      case 'xendit':
        return new XenditGateway(config);
      case 'midtrans':
        return new MidtransGateway(config);
      default:
        throw new Error(`Unsupported payment provider: ${provider}`);
    }
  }
}
