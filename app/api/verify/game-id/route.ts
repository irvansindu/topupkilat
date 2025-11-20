import { NextRequest, NextResponse } from 'next/server';
import { createVipResellerProvider } from '@/lib/topup/vipreseller-provider';
import { z } from 'zod';

const verifySchema = z.object({
  game: z.string(),
  userId: z.string(),
  zoneId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { game, userId, zoneId } = parsed.data;

    // Initialize VIP Reseller provider
    const provider = createVipResellerProvider({
      apiKey: process.env.VIPRESELLER_API_KEY || '',
      apiId: process.env.VIPRESELLER_API_ID || '',
    });

    // Map game slug to VIP Reseller code
    const gameCodeMap: Record<string, string> = {
      'mobile-legends': 'ML',
      'mlbb': 'ML',
      'free-fire': 'FF',
      'ff': 'FF',
      'pubg-mobile': 'PUBGM',
      'pubgm': 'PUBGM',
      'genshin-impact': 'GENSHIN',
      'genshin': 'GENSHIN',
      'valorant': 'VALORANT',
      'call-of-duty-mobile': 'CODM',
      'codm': 'CODM',
    };

    const gameCode = gameCodeMap[game.toLowerCase()];
    
    if (!gameCode) {
      // If using VIP Reseller API is not configured or game not supported,
      // return mock data for testing
      if (!process.env.VIPRESELLER_API_KEY) {
        return NextResponse.json({
          valid: true,
          nickname: `Player_${userId}`,
          message: 'Mock mode: VIP Reseller API not configured',
        });
      }
      
      return NextResponse.json(
        { error: 'Game not supported', game },
        { status: 400 }
      );
    }

    // Get nickname from VIP Reseller
    const nickname = await provider.getNickname(gameCode, userId, zoneId);

    if (!nickname) {
      return NextResponse.json({
        valid: false,
        nickname: null,
        message: 'User ID tidak ditemukan atau salah',
      });
    }

    return NextResponse.json({
      valid: true,
      nickname,
      message: 'User ID valid',
    });

  } catch (error) {
    console.error('Error verifying game ID:', error);
    
    // Return mock data in development
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        valid: true,
        nickname: 'Test Player',
        message: 'Development mode',
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to verify game ID' },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const game = searchParams.get('game');
  const userId = searchParams.get('userId');
  const zoneId = searchParams.get('zoneId');

  if (!game || !userId) {
    return NextResponse.json(
      { error: 'Missing game or userId parameter' },
      { status: 400 }
    );
  }

  // Call POST handler with the same logic
  return POST(
    new NextRequest(request.url, {
      method: 'POST',
      body: JSON.stringify({ game, userId, zoneId }),
    })
  );
}
