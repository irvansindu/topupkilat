import { NextRequest, NextResponse } from 'next/server';
import { createVipResellerProvider } from '@/lib/topup/vipreseller-provider';
import { prisma } from '@/lib/prisma';
import { ProductType } from '@prisma/client';

const logger = {
  warn: (...args: unknown[]) => console.warn('[sync-products]', ...args),
  error: (...args: unknown[]) => console.error('[sync-products]', ...args),
};

// Map VIP Reseller game names to our product types
const gameTypeMap: Record<string, ProductType> = {
  'mobile legends': ProductType.GAME,
  'free fire': ProductType.GAME,
  'pubg mobile': ProductType.GAME,
  'genshin impact': ProductType.GAME,
  'valorant': ProductType.GAME,
  'honkai': ProductType.GAME,
  'call of duty': ProductType.GAME,
  'netflix': 'STREAMING' as ProductType,
  'spotify': 'STREAMING' as ProductType,
  'youtube': 'STREAMING' as ProductType,
  'disney': 'STREAMING' as ProductType,
  'vidio': 'STREAMING' as ProductType,
};

export async function GET(request: NextRequest) {
  try {
    // Check for admin auth (simplified for demo)
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.ADMIN_API_KEY && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize VIP Reseller provider
    const provider = createVipResellerProvider({
      apiKey: process.env.VIPRESELLER_API_KEY || '',
      apiId: process.env.VIPRESELLER_API_ID || '',
    });

    // Fetch products from VIP Reseller
    const products = await provider.getProducts();
    
    if (!products || products.length === 0) {
      return NextResponse.json({ 
        message: 'No products found from VIP Reseller',
        note: 'Make sure VIPRESELLER_API_KEY and VIPRESELLER_API_ID are configured'
      }, { status: 200 });
    }

    // Group products by game
    const gameProducts = new Map<string, typeof products>();
    
    for (const product of products) {
      if (!gameProducts.has(product.game)) {
        gameProducts.set(product.game, []);
      }
      gameProducts.get(product.game)?.push(product);
    }

    // Sync to database
    const syncedProducts = [];
    
    for (const [gameName, items] of gameProducts.entries()) {
      const gameNameLower = gameName.toLowerCase();
      const productType = Object.keys(gameTypeMap).find(key => 
        gameNameLower.includes(key)
      );
      
      if (!productType) {
        logger.warn({ gameName }, 'Unknown game type, skipping');
        continue;
      }

      // Create or update product
      const slug = gameName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const existingProduct = await prisma.product.findUnique({
        where: { slug },
      });

      let product;
      
      if (!existingProduct) {
        // Create new product
        product = await prisma.product.create({
          data: {
            slug,
            type: gameTypeMap[productType],
            name: gameName,
            providerKey: items[0].code.split('-')[0], // Extract provider key from code
            iconUrl: `/icons/${slug}.png`,
            description: `Top up ${gameName} dengan harga termurah`,
            instruction: gameName.toLowerCase().includes('mobile legends') 
              ? 'Masukkan User ID dan Zone ID'
              : 'Masukkan User ID atau nomor HP',
            status: 'ACTIVE',
          },
        });
      } else {
        product = existingProduct;
      }

      // Sync denominations
      for (const item of items) {
        const existingDenom = await prisma.denomination.findFirst({
          where: {
            productId: product.id,
            label: item.name,
          },
        });

        if (!existingDenom) {
          await prisma.denomination.create({
            data: {
              productId: product.id,
              label: item.name,
              amountNumeric: extractAmount(item.name),
              priceSell: item.price,
              costBuy: Math.floor(item.price * 0.95), // Assume 5% margin
              feeFlat: 0,
              feePct: 0,
              sortOrder: 0,
            },
          });
        } else {
          // Update price if changed
          if (existingDenom.priceSell !== item.price) {
            await prisma.denomination.update({
              where: { id: existingDenom.id },
              data: {
                priceSell: item.price,
                costBuy: Math.floor(item.price * 0.95),
              },
            });
          }
        }
      }

      syncedProducts.push({
        name: gameName,
        items: items.length,
      });
    }

    return NextResponse.json({
      message: 'Products synced successfully',
      synced: syncedProducts,
      total: products.length,
      games: Array.from(gameProducts.keys()),
    });
    
  } catch (error) {
    logger.error({ error }, 'Error syncing products from VIP Reseller');
    return NextResponse.json(
      { error: 'Failed to sync products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function extractAmount(label: string): number {
  // Extract numeric amount from label like "100 Diamonds" or "Rp 50.000"
  const match = label.match(/(\d+(?:\.\d+)?)/);
  if (match) {
    return parseInt(match[1].replace(/\./g, ''), 10);
  }
  return 1; // Default to 1 if no number found
}
