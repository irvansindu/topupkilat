require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

// Use direct connection for Supabase
let dbUrl = process.env.DATABASE_URL;
if (dbUrl && dbUrl.includes('pooler.supabase.com:6543')) {
  dbUrl = dbUrl.replace(':6543', ':5432');
  console.log('📝 Using direct database connection for Supabase\n');
}
process.env.DATABASE_URL = dbUrl;

const prisma = new PrismaClient();

async function syncStreamingProducts() {
  console.log('📺 Syncing Streaming Products from VIP-Reseller\n');
  console.log('=======================================\n');
  
  const apiKey = process.env.VIPRESELLER_API_KEY;
  const apiId = process.env.VIPRESELLER_API_ID;
  
  if (!apiKey || !apiId) {
    console.error('❌ API credentials not found');
    process.exit(1);
  }
  
  const signature = crypto.createHash('md5').update(apiId + apiKey).digest('hex');
  
  // Fetch ALL products from VIP Reseller
  console.log('🔄 Fetching products from VIP-Reseller...');
  
  const params = new URLSearchParams();
  params.append('key', apiKey);
  params.append('sign', signature);
  params.append('type', 'services');
  params.append('filter_type', 'game'); // This includes all digital products
  
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
    
    // Filter streaming products
    const streamingKeywords = [
      'Netflix', 'Spotify', 'YouTube', 'Disney', 'HBO', 
      'Vidio', 'WeTV', 'Viu', 'IQIYI', 'Apple', 'Amazon',
      'Hulu', 'Crunchyroll', 'Steam', 'Google Play'
    ];
    
    const streamingProducts = {};
    
    result.data.forEach(item => {
      if (item.status === 'available') {
        for (const keyword of streamingKeywords) {
          if (item.game.toLowerCase().includes(keyword.toLowerCase())) {
            if (!streamingProducts[item.game]) {
              streamingProducts[item.game] = [];
            }
            streamingProducts[item.game].push(item);
            break;
          }
        }
      }
    });
    
    console.log(`📊 Found ${Object.keys(streamingProducts).length} streaming services\n`);
    
    // Show what we found
    console.log('🎬 Streaming Services Found:');
    Object.keys(streamingProducts).forEach(service => {
      console.log(`  - ${service}: ${streamingProducts[service].length} products`);
    });
    console.log('');
    
    // Process streaming products
    const streamingServices = [
      { key: 'Netflix', slug: 'netflix', name: 'Netflix Premium' },
      { key: 'Spotify', slug: 'spotify', name: 'Spotify Premium' },
      { key: 'YouTube', slug: 'youtube-premium', name: 'YouTube Premium' },
      { key: 'Disney', slug: 'disney-plus', name: 'Disney+ Hotstar' },
      { key: 'Vidio', slug: 'vidio', name: 'Vidio Premier' },
      { key: 'WeTV', slug: 'wetv', name: 'WeTV VIP' },
      { key: 'Steam', slug: 'steam-wallet', name: 'Steam Wallet' },
      { key: 'Google Play', slug: 'google-play', name: 'Google Play Gift Card' },
    ];
    
    const syncResults = [];
    
    for (const serviceInfo of streamingServices) {
      // Find products for this service
      const serviceKey = Object.keys(streamingProducts).find(k => 
        k.toLowerCase().includes(serviceInfo.key.toLowerCase())
      );
      
      if (!serviceKey || !streamingProducts[serviceKey]) {
        console.log(`⚠️  No products found for ${serviceInfo.name}`);
        continue;
      }
      
      const products = streamingProducts[serviceKey];
      console.log(`\n📺 Processing ${serviceInfo.name}: ${products.length} products`);
      
      // Check/Create product
      let product = await prisma.product.findUnique({
        where: { slug: serviceInfo.slug },
      });
      
      if (!product) {
        product = await prisma.product.create({
          data: {
            slug: serviceInfo.slug,
            type: 'STREAMING',
            name: serviceInfo.name,
            providerKey: products[0].code.split('-')[0],
            iconUrl: `/icons/${serviceInfo.slug}.png`,
            description: `Berlangganan ${serviceInfo.name} dengan harga terbaik`,
            instruction: 'Masukkan email atau nomor HP yang terdaftar',
            status: 'ACTIVE',
          },
        });
        console.log(`  ✅ Created product: ${product.name}`);
      } else {
        console.log(`  ✅ Product exists: ${product.name}`);
      }
      
      // Sync denominations (limit to 10 per service)
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
              amountNumeric: extractDuration(item.name),
              priceSell: price,
              costBuy: Math.floor(price * 0.95),
              feeFlat: 0,
              feePct: 0,
              sortOrder: 0,
              isPopular: item.name.includes('1 Month') || item.name.includes('1 Bulan'),
            },
          });
          created++;
          console.log(`    + ${item.name}: Rp ${price.toLocaleString('id-ID')}`);
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
        service: serviceInfo.name,
        created,
        updated,
        total: denomsToSync.length,
      });
      
      console.log(`  📝 Created: ${created}, Updated: ${updated}`);
    }
    
    // Also check for E-Wallet top up
    console.log('\n💳 Processing E-Wallet Products...');
    
    const ewalletServices = [
      { key: 'GoPay', slug: 'gopay-vip', name: 'GoPay' },
      { key: 'OVO', slug: 'ovo-vip', name: 'OVO' },
      { key: 'DANA', slug: 'dana-vip', name: 'DANA' },
      { key: 'ShopeePay', slug: 'shopeepay-vip', name: 'ShopeePay' },
    ];
    
    for (const walletInfo of ewalletServices) {
      const walletProducts = result.data.filter(item => 
        item.game.toLowerCase().includes(walletInfo.key.toLowerCase()) &&
        item.status === 'available'
      );
      
      if (walletProducts.length === 0) continue;
      
      console.log(`  💰 ${walletInfo.name}: ${walletProducts.length} products found`);
      
      // Create/update e-wallet product
      let product = await prisma.product.findUnique({
        where: { slug: walletInfo.slug },
      });
      
      if (!product) {
        product = await prisma.product.create({
          data: {
            slug: walletInfo.slug,
            type: 'EWALLET',
            name: `${walletInfo.name} (VIP)`,
            providerKey: walletProducts[0].code.split('-')[0],
            iconUrl: `/icons/${walletInfo.slug.split('-')[0]}.png`,
            description: `Top up saldo ${walletInfo.name} instant`,
            instruction: 'Masukkan nomor HP yang terdaftar',
            status: 'ACTIVE',
          },
        });
        console.log(`    ✅ Created: ${product.name}`);
      }
    }
    
    console.log('\n=======================================');
    console.log('✅ Streaming Products Sync Complete!\n');
    
    console.log('📊 Summary:');
    syncResults.forEach(r => {
      console.log(`  - ${r.service}: ${r.created} created, ${r.updated} updated`);
    });
    
    // Show all streaming products in database
    const allStreaming = await prisma.product.findMany({
      where: { type: 'STREAMING' },
      include: {
        denominations: {
          take: 3,
          orderBy: { priceSell: 'asc' },
        },
      },
    });
    
    console.log('\n📺 Streaming Products in Database:');
    allStreaming.forEach(p => {
      console.log(`\n  ${p.name} (${p.slug}):`);
      p.denominations.forEach(d => {
        console.log(`    - ${d.label}: Rp ${d.priceSell.toLocaleString('id-ID')}`);
      });
      if (p.denominations.length === 0) {
        console.log('    (No denominations yet)');
      }
    });
    
    console.log('\n🎉 Streaming products ready at http://localhost:3000/topup/streaming');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

function extractDuration(label) {
  // Extract duration in months
  const patterns = [
    /(\d+)\s*Month/i,
    /(\d+)\s*Bulan/i,
    /(\d+)\s*Tahun/i,
    /(\d+)\s*Year/i,
    /(\d+)\s*Hari/i,
    /(\d+)\s*Day/i,
  ];
  
  for (const pattern of patterns) {
    const match = label.match(pattern);
    if (match) {
      let duration = parseInt(match[1], 10);
      // Convert year to months
      if (label.toLowerCase().includes('year') || label.toLowerCase().includes('tahun')) {
        duration = duration * 12;
      }
      // Convert days to months (approximate)
      if (label.toLowerCase().includes('day') || label.toLowerCase().includes('hari')) {
        duration = Math.round(duration / 30);
      }
      return duration;
    }
  }
  
  // For gift cards or wallet, extract amount
  const amountMatch = label.match(/(\d+)(?:\.(\d+))?/);
  if (amountMatch) {
    return parseInt(amountMatch[1], 10);
  }
  
  return 1; // Default to 1 month
}

syncStreamingProducts();
