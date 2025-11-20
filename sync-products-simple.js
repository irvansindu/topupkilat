require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function syncProducts() {
  console.log('\n📦 Syncing Products from VIP-Reseller to Database\n');
  
  const apiKey = process.env.VIPRESELLER_API_KEY;
  const apiId = process.env.VIPRESELLER_API_ID;
  
  if (!apiKey || !apiId) {
    console.error('❌ API credentials not found');
    process.exit(1);
  }
  
  const signature = crypto.createHash('md5').update(apiId + apiKey).digest('hex');
  
  // Fetch products from VIP Reseller
  console.log('🔄 Fetching products from VIP-Reseller...');
  
  const params = new URLSearchParams();
  params.append('key', apiKey);
  params.append('sign', signature);
  params.append('type', 'services');
  params.append('filter_type', 'game');
  
  try {
    const response = await fetch('https://vip-reseller.co.id/api/game-feature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    
    const result = await response.json();
    
    if (!result.result || !result.data) {
      console.error('❌ Failed to fetch products');
      return;
    }
    
    console.log(`✅ Found ${result.data.length} products from VIP-Reseller\n`);
    
    // Filter only Mobile Legends products for testing
    const mlProducts = result.data.filter(item => 
      item.game.includes('Mobile Legends') && 
      item.status === 'available'
    );
    
    console.log(`🎮 Processing ${mlProducts.length} Mobile Legends products\n`);
    
    // Check if Mobile Legends product exists
    let mlProduct = await prisma.product.findUnique({
      where: { slug: 'mobile-legends-vip' },
    });
    
    if (!mlProduct) {
      // Create Mobile Legends product
      console.log('📝 Creating Mobile Legends product...');
      mlProduct = await prisma.product.create({
        data: {
          slug: 'mobile-legends-vip',
          type: 'GAME',
          name: 'Mobile Legends (VIP Reseller)',
          providerKey: 'MLBR',
          iconUrl: '/icons/mlbb.png',
          description: 'Top up diamond Mobile Legends dari VIP-Reseller',
          instruction: 'Masukkan User ID dan Zone ID yang valid',
          status: 'ACTIVE',
        },
      });
      console.log('✅ Product created');
    } else {
      console.log('✅ Product already exists');
    }
    
    // Sync denominations (limit to first 20 for testing)
    console.log('\n🔄 Syncing denominations...');
    
    const denomsToSync = mlProducts.slice(0, 20);
    let created = 0;
    let updated = 0;
    
    for (const item of denomsToSync) {
      // Check if denomination exists
      const existing = await prisma.denomination.findFirst({
        where: {
          productId: mlProduct.id,
          code: item.code,
        },
      });
      
      if (!existing) {
        // Create new denomination
        await prisma.denomination.create({
          data: {
            productId: mlProduct.id,
            code: item.code,
            label: item.name,
            amountNumeric: extractAmount(item.name),
            priceSell: item.price.special || item.price.basic,
            costBuy: Math.floor((item.price.special || item.price.basic) * 0.95),
            feeFlat: 0,
            feePct: 0,
            sortOrder: 0,
          },
        });
        created++;
      } else {
        // Update price if changed
        const newPrice = item.price.special || item.price.basic;
        if (existing.priceSell !== newPrice) {
          await prisma.denomination.update({
            where: { id: existing.id },
            data: {
              priceSell: newPrice,
              costBuy: Math.floor(newPrice * 0.95),
            },
          });
          updated++;
        }
      }
    }
    
    console.log(`\n✅ Sync complete!`);
    console.log(`  - Created: ${created} denominations`);
    console.log(`  - Updated: ${updated} denominations`);
    
    // Show some synced products
    const synced = await prisma.denomination.findMany({
      where: { productId: mlProduct.id },
      take: 5,
      orderBy: { priceSell: 'asc' },
    });
    
    console.log('\n📋 Sample denominations in database:');
    synced.forEach(d => {
      console.log(`  - ${d.label}: Rp ${d.priceSell.toLocaleString('id-ID')}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function extractAmount(label) {
  const match = label.match(/(\d+)\s*Diamonds?/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 1;
}

syncProducts();
