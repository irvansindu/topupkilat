import crypto from 'crypto';

interface VipResellerPrepaidConfig {
  apiKey: string;
  apiId: string;
  baseUrl?: string;
}

interface PrepaidOrderRequest {
  type: 'order';
  service: string; // Product code
  data_no: string; // Phone number or customer number
}

interface PrepaidStatusRequest {
  type: 'status';
  trxid?: string;
  limit?: number;
}

interface PrepaidServiceRequest {
  type: 'services';
  filter_type?: 'type' | 'brand';
  filter_value?: string;
}

interface PrepaidOrderResponse {
  result: boolean;
  data?: {
    trxid: string;
    data: string;
    code: string;
    service: string;
    status: 'waiting' | 'process' | 'success' | 'error' | 'partial';
    note: string;
    balance: number;
    price: number;
  };
  message: string;
}

interface PrepaidStatusResponse {
  result: boolean;
  data?: Array<{
    trxid: string;
    data: string;
    code: string;
    service: string;
    status: 'waiting' | 'process' | 'success' | 'error' | 'partial';
    note: string;
    price: number;
  }>;
  message: string;
}

interface PrepaidService {
  brand: string;
  code: string;
  name: string;
  note: string;
  price: {
    basic: number;
    premium: number;
    special: number;
  };
  status: 'available' | 'empty' | 'gangguan';
  multi_trx: boolean;
  maintenance: string;
  category: string;
  prepost: 'prepaid' | 'postpaid';
  type: string;
}

interface PrepaidServiceResponse {
  result: boolean;
  data?: PrepaidService[];
  message: string;
}

export class VipResellerPrepaidProvider {
  private config: VipResellerPrepaidConfig;
  private baseUrl: string;

  constructor(config: VipResellerPrepaidConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://vip-reseller.co.id';
  }

  private generateSignature(apiKey: string, apiId: string): string {
    return crypto.createHash('md5').update(apiId + apiKey).digest('hex');
  }

  /**
   * Order prepaid product (pulsa, paket data, token PLN, etc)
   */
  async orderPrepaid(productCode: string, phoneNumber: string): Promise<PrepaidOrderResponse> {
    try {
      const signature = this.generateSignature(this.config.apiKey, this.config.apiId);
      
      const params = new URLSearchParams();
      params.append('key', this.config.apiKey);
      params.append('sign', signature);
      params.append('type', 'order');
      params.append('service', productCode);
      params.append('data_no', phoneNumber);

      const response = await fetch(`${this.baseUrl}/api/prepaid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const result = await response.json() as PrepaidOrderResponse;
      return result;
    } catch (error) {
      console.error('Error ordering prepaid:', error);
      return {
        result: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check prepaid order status
   */
  async checkPrepaidStatus(trxid?: string, limit: number = 10): Promise<PrepaidStatusResponse> {
    try {
      const signature = this.generateSignature(this.config.apiKey, this.config.apiId);
      
      const params = new URLSearchParams();
      params.append('key', this.config.apiKey);
      params.append('sign', signature);
      params.append('type', 'status');
      
      if (trxid) {
        params.append('trxid', trxid);
      }
      params.append('limit', limit.toString());

      const response = await fetch(`${this.baseUrl}/api/prepaid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const result = await response.json() as PrepaidStatusResponse;
      return result;
    } catch (error) {
      console.error('Error checking prepaid status:', error);
      return {
        result: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get available prepaid services/products
   */
  async getPrepaidServices(filterType?: 'type' | 'brand', filterValue?: string): Promise<PrepaidServiceResponse> {
    try {
      const signature = this.generateSignature(this.config.apiKey, this.config.apiId);
      
      const params = new URLSearchParams();
      params.append('key', this.config.apiKey);
      params.append('sign', signature);
      params.append('type', 'services');
      
      if (filterType && filterValue) {
        params.append('filter_type', filterType);
        params.append('filter_value', filterValue);
      }

      const response = await fetch(`${this.baseUrl}/api/prepaid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const result = await response.json() as PrepaidServiceResponse;
      return result;
    } catch (error) {
      console.error('Error getting prepaid services:', error);
      return {
        result: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get pulsa products by operator
   */
  async getPulsaByOperator(operator: string): Promise<PrepaidService[]> {
    const response = await this.getPrepaidServices('brand', operator);
    if (!response.result || !response.data) {
      return [];
    }
    
    // Filter only pulsa products
    return response.data.filter(item => 
      item.type === 'pulsa-reguler' && 
      item.status === 'available'
    );
  }

  /**
   * Get data package products by operator
   */
  async getDataPackagesByOperator(operator: string): Promise<PrepaidService[]> {
    const response = await this.getPrepaidServices('brand', operator);
    if (!response.result || !response.data) {
      return [];
    }
    
    // Filter only data package products
    return response.data.filter(item => 
      item.type === 'paket-internet' && 
      item.status === 'available'
    );
  }

  /**
   * Get PLN token products
   */
  async getPLNTokenProducts(): Promise<PrepaidService[]> {
    const response = await this.getPrepaidServices('type', 'pln');
    if (!response.result || !response.data) {
      return [];
    }
    
    return response.data.filter(item => 
      item.status === 'available' &&
      item.category.toLowerCase().includes('pln')
    );
  }

  /**
   * Get e-money/e-wallet top up products
   */
  async getEMoneyProducts(): Promise<PrepaidService[]> {
    const response = await this.getPrepaidServices('type', 'e-money');
    if (!response.result || !response.data) {
      return [];
    }
    
    return response.data.filter(item => 
      item.status === 'available'
    );
  }

  /**
   * Get all available operators
   */
  async getAvailableOperators(): Promise<string[]> {
    const response = await this.getPrepaidServices();
    if (!response.result || !response.data) {
      return [];
    }
    
    // Extract unique brands/operators
    const operators = new Set<string>();
    response.data.forEach(item => {
      if (item.brand && item.brand !== '') {
        operators.add(item.brand);
      }
    });
    
    return Array.from(operators).sort();
  }

  /**
   * Detect operator from phone number
   */
  detectOperator(phoneNumber: string): string | null {
    // Remove country code if present
    const number = phoneNumber.replace(/^(\+62|62|0)/, '');
    const prefix = number.substring(0, 4);
    
    // Indonesian operator prefixes
    const operatorPrefixes: Record<string, string[]> = {
      'Telkomsel': ['0811', '0812', '0813', '0821', '0822', '0823', '0851', '0852', '0853'],
      'Indosat': ['0814', '0815', '0816', '0855', '0856', '0857', '0858'],
      'XL': ['0817', '0818', '0819', '0859', '0877', '0878'],
      'Axis': ['0831', '0832', '0833', '0838'],
      'Three': ['0895', '0896', '0897', '0898', '0899'],
      'Smartfren': ['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888', '0889'],
      'By.U': ['0851', '0852', '0853'],
    };
    
    for (const [operator, prefixes] of Object.entries(operatorPrefixes)) {
      if (prefixes.some(p => ('0' + number).startsWith(p))) {
        return operator;
      }
    }
    
    return null;
  }
}

// Export singleton instance
export const vipResellerPrepaid = new VipResellerPrepaidProvider({
  apiKey: process.env.VIPRESELLER_API_KEY || '',
  apiId: process.env.VIPRESELLER_API_ID || '',
});
