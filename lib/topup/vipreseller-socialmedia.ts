import crypto from 'crypto';

interface VipResellerSocialMediaConfig {
  apiKey: string;
  apiId: string;
  baseUrl?: string;
}

interface SocialMediaOrderRequest {
  service: string; // Service ID
  quantity: number;
  target: string; // Username, URL, or email
}

interface SocialMediaOrderResponse {
  result: boolean;
  data?: {
    trxid: string;
    data: string;
    service: string;
    quantity: number;
    status: 'waiting' | 'processing' | 'success' | 'error' | 'partial';
    note: string;
    balance: number;
    price: number;
  };
  message: string;
}

interface SocialMediaStatusResponse {
  result: boolean;
  data?: Array<{
    trxid: string;
    data: string;
    service: string;
    quantity: number;
    status: 'waiting' | 'processing' | 'success' | 'error' | 'partial';
    remain: number;
    count: number;
    note: string;
    price: number;
  }>;
  message: string;
}

interface SocialMediaService {
  category: string;
  id: string;
  max: number;
  min: number;
  name: string;
  note: string;
  price: {
    basic: number;
    premium: number;
    special: number;
  };
  status: 'available' | 'empty' | 'gangguan';
}

interface SocialMediaServiceResponse {
  result: boolean;
  data?: SocialMediaService[];
  message: string;
}

export class VipResellerSocialMediaProvider {
  private config: VipResellerSocialMediaConfig;
  private baseUrl: string;

  constructor(config: VipResellerSocialMediaConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://vip-reseller.co.id';
  }

  private generateSignature(apiKey: string, apiId: string): string {
    return crypto.createHash('md5').update(apiId + apiKey).digest('hex');
  }

  /**
   * Order social media service (followers, likes, views, etc)
   */
  async orderSocialMedia(serviceId: string, quantity: number, target: string): Promise<SocialMediaOrderResponse> {
    try {
      const signature = this.generateSignature(this.config.apiKey, this.config.apiId);
      
      const params = new URLSearchParams();
      params.append('key', this.config.apiKey);
      params.append('sign', signature);
      params.append('type', 'order');
      params.append('service', serviceId);
      params.append('quantity', quantity.toString());
      params.append('target', target);

      const response = await fetch(`${this.baseUrl}/api/social-media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const result = await response.json() as SocialMediaOrderResponse;
      return result;
    } catch (error) {
      console.error('Error ordering social media service:', error);
      return {
        result: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check social media order status
   */
  async checkSocialMediaStatus(trxid?: string, limit: number = 10): Promise<SocialMediaStatusResponse> {
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

      const response = await fetch(`${this.baseUrl}/api/social-media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const result = await response.json() as SocialMediaStatusResponse;
      return result;
    } catch (error) {
      console.error('Error checking social media status:', error);
      return {
        result: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get available social media services
   */
  async getSocialMediaServices(filterCategory?: string): Promise<SocialMediaServiceResponse> {
    try {
      const signature = this.generateSignature(this.config.apiKey, this.config.apiId);
      
      const params = new URLSearchParams();
      params.append('key', this.config.apiKey);
      params.append('sign', signature);
      params.append('type', 'services');
      
      if (filterCategory) {
        params.append('filter_type', 'category');
        params.append('filter_value', filterCategory);
      }

      const response = await fetch(`${this.baseUrl}/api/social-media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const result = await response.json() as SocialMediaServiceResponse;
      return result;
    } catch (error) {
      console.error('Error getting social media services:', error);
      return {
        result: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get Instagram services
   */
  async getInstagramServices(): Promise<SocialMediaService[]> {
    const response = await this.getSocialMediaServices();
    if (!response.result || !response.data) {
      return [];
    }
    
    return response.data.filter(item => 
      item.category.toLowerCase().includes('instagram') && 
      item.status === 'available'
    );
  }

  /**
   * Get TikTok services
   */
  async getTikTokServices(): Promise<SocialMediaService[]> {
    const response = await this.getSocialMediaServices();
    if (!response.result || !response.data) {
      return [];
    }
    
    return response.data.filter(item => 
      item.category.toLowerCase().includes('tiktok') && 
      item.status === 'available'
    );
  }

  /**
   * Get YouTube services
   */
  async getYouTubeServices(): Promise<SocialMediaService[]> {
    const response = await this.getSocialMediaServices();
    if (!response.result || !response.data) {
      return [];
    }
    
    return response.data.filter(item => 
      item.category.toLowerCase().includes('youtube') && 
      item.status === 'available'
    );
  }

  /**
   * Get Facebook services
   */
  async getFacebookServices(): Promise<SocialMediaService[]> {
    const response = await this.getSocialMediaServices();
    if (!response.result || !response.data) {
      return [];
    }
    
    return response.data.filter(item => 
      item.category.toLowerCase().includes('facebook') && 
      item.status === 'available'
    );
  }

  /**
   * Get Twitter/X services
   */
  async getTwitterServices(): Promise<SocialMediaService[]> {
    const response = await this.getSocialMediaServices();
    if (!response.result || !response.data) {
      return [];
    }
    
    return response.data.filter(item => 
      (item.category.toLowerCase().includes('twitter') || 
       item.category.toLowerCase().includes('x ')) && 
      item.status === 'available'
    );
  }

  /**
   * Get all available categories
   */
  async getAvailableCategories(): Promise<string[]> {
    const response = await this.getSocialMediaServices();
    if (!response.result || !response.data) {
      return [];
    }
    
    const categories = new Set<string>();
    response.data.forEach(item => {
      if (item.category && item.status === 'available') {
        categories.add(item.category);
      }
    });
    
    return Array.from(categories).sort();
  }

  /**
   * Get popular services
   */
  async getPopularServices(): Promise<SocialMediaService[]> {
    const response = await this.getSocialMediaServices();
    if (!response.result || !response.data) {
      return [];
    }
    
    // Filter popular services based on common keywords
    const popularKeywords = [
      'followers', 'likes', 'views', 'subscribers',
      'real', 'high quality', 'instant', 'fast'
    ];
    
    return response.data
      .filter(item => {
        const nameLower = item.name.toLowerCase();
        return item.status === 'available' && 
               popularKeywords.some(keyword => nameLower.includes(keyword));
      })
      .sort((a, b) => {
        // Sort by price (cheapest first)
        const priceA = a.price.special || a.price.premium || a.price.basic;
        const priceB = b.price.special || b.price.premium || b.price.basic;
        return priceA - priceB;
      })
      .slice(0, 20); // Return top 20 popular services
  }
}

// Export singleton instance
export const vipResellerSocialMedia = new VipResellerSocialMediaProvider({
  apiKey: process.env.VIPRESELLER_API_KEY || '',
  apiId: process.env.VIPRESELLER_API_ID || '',
});
