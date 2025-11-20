import crypto from 'crypto';

interface VipResellerProfileData {
  full_name: string;
  username: string;
  balance: number;
  point: number;
  level: string;
  registered: string;
}

interface VipResellerProfileResponse {
  result: boolean;
  data?: VipResellerProfileData;
  message: string;
}

function generateSignature(apiId: string, apiKey: string): string {
  return crypto.createHash('md5').update(apiId + apiKey).digest('hex');
}

export async function getVipResellerProfile(): Promise<VipResellerProfileResponse> {
  const apiKey = process.env.VIPRESELLER_API_KEY;
  const apiId = process.env.VIPRESELLER_API_ID;

  if (!apiKey || !apiId) {
    return {
      result: false,
      message: 'VIPRESELLER_API_KEY or VIPRESELLER_API_ID is not configured',
    };
  }

  try {
    const sign = generateSignature(apiId, apiKey);

    const params = new URLSearchParams();
    params.append('key', apiKey);
    params.append('sign', sign);

    const response = await fetch('https://vip-reseller.co.id/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const json = (await response.json()) as VipResellerProfileResponse;
    return json;
  } catch (error) {
    console.error('Error fetching VIP Reseller profile:', error);
    return {
      result: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
