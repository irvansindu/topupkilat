import { NextResponse } from 'next/server';
import { getVipResellerProfile } from '@/lib/topup/vipreseller-profile';

export async function GET() {
  const profile = await getVipResellerProfile();

  if (!profile.result || !profile.data) {
    return NextResponse.json(
      {
        provider: 'vipreseller',
        result: false,
        message: profile.message || 'Failed to fetch VIP Reseller profile',
        profile: null,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    provider: 'vipreseller',
    result: true,
    message: profile.message,
    profile: profile.data,
  });
}
