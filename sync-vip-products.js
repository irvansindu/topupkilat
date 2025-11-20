require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

// Use direct connection (port 5432) instead of pooled (port 6543) for Supabase
let dbUrl = process.env.DATABASE_URL;
if (dbUrl && dbUrl.includes('pooler.supabase.com:6543')) {
  dbUrl = dbUrl.replace(':6543', ':5432');
  console.log('📝 Using direct database connection for Supabase\n');
}

// Override DATABASE_URL for Prisma
process.env.DATABASE_URL = dbUrl;

const prisma = new PrismaClient();

async function syncProducts() {
  console.log('📦 Syncing Products from VIP-Reseller to Database\n');
  console.log('=======================================\n');
  
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
    
    // Group products by game
    const gameProducts = {};
    result.data.forEach(item => {
      if (item.status === 'available') {
        if (!gameProducts[item.game]) {
          gameProducts[item.game] = [];
        }
        gameProducts[item.game].push(item);
      }
    });
    
    console.log(`📊 Found ${Object.keys(gameProducts).length} games\n`);
    
    // Process only popular games
    const popularGames = [
      { key: 'Mobile Legends', slug: 'mobile-legends-vip', type: 'GAME' },
      { key: 'Free Fire', slug: 'free-fire-vip', type: 'GAME' },
      { key: 'PUBG Mobile', slug: 'pubg-mobile-vip', type: 'GAME' },
      { key: 'Genshin Impact', slug: 'genshin-impact-vip', type: 'GAME' },
      { key: 'Valorant', slug: 'valorant-vip', type: 'GAME' },
      { key: 'Call of Duty', slug: 'call-of-duty-vip', type: 'GAME' },
    ];
    
    const syncResults = [];
    
    for (const gameInfo of popularGames) {
      // Find products for this game
      const gameKey = Object.keys(gameProducts).find(k => k.includes(gameInfo.key));
      if (!gameKey) continue;
      
      const products = gameProducts[gameKey];
      console.log(`\n🎮 Processing ${gameInfo.key}: ${products.length} products`);
      
      // Check/Create product
      let product = await prisma.product.findUnique({
        where: { slug: gameInfo.slug },
      });
      
      if (!product) {
        product = await prisma.product.create({
          data: {
            slug: gameInfo.slug,
            type: gameInfo.type,
            name: `${gameInfo.key} (VIP)`,
            providerKey: products[0].code.split('-')[0],
            iconUrl: `/icons/${gameInfo.slug.split('-')[0]}.png`,
            description: `Top up ${gameInfo.key} dari VIP-Reseller`,
            instruction: gameInfo.key.includes('Mobile Legends') 
              ? 'Masukkan User ID dan Zone ID'
              : 'Masukkan User ID atau nomor',
            status: 'ACTIVE',
          },
        });
        console.log(`  ✅ Created product: ${product.name}`);
      } else {
        console.log(`  ✅ Product exists: ${product.name}`);
      }
      
      // Sync denominations (limit to 10 per game for testing)
      const denomsToSync = products.slice(0, 10);
      let created = 0;
      let updated = 0;
      
      for (const item of denomsToSync) {
        const existing = await prisma.denomination.findFirst({
          where: {
            productId: product.id,
            code: item.code,
          },
        });
        
        const price = item.price?.special || item.price?.basic || 0;
        
        if (!existing && price > 0) {
          await prisma.denomination.create({
            data: {
              productId: product.id,
              code: item.code,
              label: item.name,
              amountNumeric: extractAmount(item.name),
              priceSell: price,
              costBuy: Math.floor(price * 0.95),
              feeFlat: 0,
              feePct: 0,
              sortOrder: 0,
            },
          });
          created++;
        } else if (existing && existing.priceSell !== price && price > 0) {
          await prisma.denomination.update({
            where: { id: existing.id },
            data: {
              priceSell: price,
              costBuy: Math.floor(price * 0.95),
            },
          });
          updated++;
        }
      }
      
      syncResults.push({
        game: gameInfo.key,
        created,
        updated,
        total: denomsToSync.length,
      });
      
      console.log(`  📝 Created: ${created}, Updated: ${updated}`);
    }
    
    console.log('\n=======================================');
    console.log('✅ Sync Complete!\n');
    
    console.log('📊 Summary:');
    syncResults.forEach(r => {
      console.log(`  - ${r.game}: ${r.created} created, ${r.updated} updated`);
    });
    
    // Show sample products
    const sampleProducts = await prisma.product.findMany({
      where: { slug: { endsWith: '-vip' } },
      include: {
        denominations: {
          take: 3,
          orderBy: { priceSell: 'asc' },
        },
      },
    });
    
    console.log('\n📦 Sample Products in Database:');
    sampleProducts.forEach(p => {
      console.log(`\n  ${p.name}:`);
      p.denominations.forEach(d => {
        console.log(`    - ${d.label}: Rp ${d.priceSell.toLocaleString('id-ID')}`);
      });
    });
    
    console.log('\n🎉 You can now visit http://localhost:3000 to see the products!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('prepared statement')) {
      console.log('\n💡 Tip: This error is due to Supabase pooled connection.');
      console.log('   Try using direct connection (port 5432) instead of pooled (port 6543)');
    }
  } finally {
    await prisma.$disconnect();
  }
}

function extractAmount(label) {
  const match = label.match(/(\d+)\s*(Diamonds?|UC|Genesis|Tokens?|Credits?|Points?|GB)/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  // For streaming services, return 1 month as default
  if (label.toLowerCase().includes('month') || label.toLowerCase().includes('bulan')) {
    return 1;
  }
  return 1;
}

syncProducts();
