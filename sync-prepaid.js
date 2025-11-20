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

async function syncPrepaidProducts() {
  console.log('📱 Syncing Prepaid Products (Pulsa & Data) from VIP-Reseller\n');
  console.log('=======================================\n');
  
  const apiKey = process.env.VIPRESELLER_API_KEY;
  const apiId = process.env.VIPRESELLER_API_ID;
  
  if (!apiKey || !apiId) {
    console.error('❌ API credentials not found');
    process.exit(1);
  }
  
  const signature = crypto.createHash('md5').update(apiId + apiKey).digest('hex');
  
  // Fetch prepaid services from VIP Reseller
  console.log('🔄 Fetching prepaid services from VIP-Reseller...');
  
  const params = new URLSearchParams();
  params.append('key', apiKey);
  params.append('sign', signature);
  params.append('type', 'services');
  
  try {
    const response = await fetch('https://vip-reseller.co.id/api/prepaid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    
    const result = await response.json();
    
    if (!result.result || !result.data) {
      console.error('❌ Failed to fetch prepaid services:', result.message);
      return;
    }
    
    console.log(`✅ Found ${result.data.length} prepaid services from VIP-Reseller\n`);
    
    // Group products by type and brand
    const pulsaProducts = {};
    const dataProducts = {};
    const plnProducts = [];
    const emoneyProducts = {};
    
    result.data.forEach(item => {
      if (item.status !== 'available') return;
      
      // Pulsa products
      if (item.type === 'pulsa-reguler' || item.category === 'Pulsa') {
        if (!pulsaProducts[item.brand]) {
          pulsaProducts[item.brand] = [];
        }
        pulsaProducts[item.brand].push(item);
      }
      
      // Data package products
      if (item.type === 'paket-internet' || item.category.includes('Internet')) {
        if (!dataProducts[item.brand]) {
          dataProducts[item.brand] = [];
        }
        dataProducts[item.brand].push(item);
      }
      
      // PLN Token
      if (item.brand === 'PLN' || item.category.includes('PLN')) {
        plnProducts.push(item);
      }
      
      // E-Money/E-Wallet
      if (item.type === 'e-money' || item.category.includes('E-Money')) {
        const brand = item.brand || 'E-Money';
        if (!emoneyProducts[brand]) {
          emoneyProducts[brand] = [];
        }
        emoneyProducts[brand].push(item);
      }
    });
    
    console.log('📊 Product Summary:');
    console.log(`  - Pulsa: ${Object.keys(pulsaProducts).length} operators`);
    console.log(`  - Data Packages: ${Object.keys(dataProducts).length} operators`);
    console.log(`  - PLN Token: ${plnProducts.length} products`);
    console.log(`  - E-Money: ${Object.keys(emoneyProducts).length} providers\n`);
    
    // Process Pulsa products
    console.log('💳 Processing Pulsa Products...\n');
    
    const popularOperators = ['Telkomsel', 'Indosat', 'XL', 'Axis', 'Three', 'Smartfren'];
    
    for (const operator of popularOperators) {
      if (!pulsaProducts[operator]) continue;
      
      const products = pulsaProducts[operator];
      console.log(`📱 ${operator}: ${products.length} products`);
      
      // Create/update product
      const slug = `pulsa-${operator.toLowerCase().replace(/\s+/g, '-')}`;
      let product = await prisma.product.findUnique({
        where: { slug },
      });
      
      if (!product) {
        product = await prisma.product.create({
          data: {
            slug,
            type: 'PULSA',
            name: `Pulsa ${operator}`,
            providerKey: operator,
            iconUrl: `/icons/${operator.toLowerCase()}.png`,
            description: `Isi pulsa ${operator} instant 24 jam`,
            instruction: 'Masukkan nomor HP yang akan diisi pulsa',
            status: 'ACTIVE',
          },
        });
        console.log(`  ✅ Created product: ${product.name}`);
      } else {
        console.log(`  ✅ Product exists: ${product.name}`);
      }
      
      // Sync denominations (limit to popular amounts)
      const popularAmounts = [5000, 10000, 15000, 20000, 25000, 50000, 100000, 150000, 200000];
      let created = 0;
      let updated = 0;
      
      for (const item of products) {
        // Extract amount from name
        const amountMatch = item.name.match(/(\d+)(?:\.(\d+))?/);
        if (!amountMatch) continue;
        
        const amount = parseInt(amountMatch[1] + (amountMatch[2] || '000'));
        if (!popularAmounts.includes(amount)) continue;
        
        const existing = await prisma.denomination.findFirst({
          where: {
            productId: product.id,
            code: item.code,
          },
        });
        
        const price = item.price?.special || item.price?.premium || item.price?.basic || 0;
        
        if (!existing && price > 0) {
          await prisma.denomination.create({
            data: {
              productId: product.id,
              code: item.code,
              label: `Pulsa ${amount.toLocaleString('id-ID')}`,
              amountNumeric: amount,
              priceSell: price,
              costBuy: Math.floor(price * 0.98),
              feeFlat: 0,
              feePct: 0,
              sortOrder: popularAmounts.indexOf(amount),
              isPopular: [25000, 50000, 100000].includes(amount),
            },
          });
          created++;
        } else if (existing && existing.priceSell !== price && price > 0) {
          await prisma.denomination.update({
            where: { id: existing.id },
            data: {
              priceSell: price,
              costBuy: Math.floor(price * 0.98),
            },
          });
          updated++;
        }
      }
      
      console.log(`  📝 Created: ${created}, Updated: ${updated}\n`);
    }
    
    // Process Data Package products
    console.log('📶 Processing Data Package Products...\n');
    
    for (const operator of popularOperators) {
      if (!dataProducts[operator]) continue;
      
      const products = dataProducts[operator];
      console.log(`📱 ${operator} Data: ${products.length} products`);
      
      // Create/update product
      const slug = `data-${operator.toLowerCase().replace(/\s+/g, '-')}`;
      let product = await prisma.product.findUnique({
        where: { slug },
      });
      
      if (!product) {
        product = await prisma.product.create({
          data: {
            slug,
            type: 'DATA',
            name: `Paket Data ${operator}`,
            providerKey: `${operator}-DATA`,
            iconUrl: `/icons/${operator.toLowerCase()}.png`,
            description: `Paket internet ${operator} dengan kuota besar`,
            instruction: 'Masukkan nomor HP untuk paket data',
            status: 'ACTIVE',
          },
        });
        console.log(`  ✅ Created product: ${product.name}`);
      } else {
        console.log(`  ✅ Product exists: ${product.name}`);
      }
      
      // Sync top 10 data packages
      const topPackages = products
        .filter(p => p.price?.special || p.price?.premium || p.price?.basic)
        .sort((a, b) => {
          const priceA = a.price?.special || a.price?.premium || a.price?.basic || 0;
          const priceB = b.price?.special || b.price?.premium || b.price?.basic || 0;
          return priceA - priceB;
        })
        .slice(0, 10);
      
      let created = 0;
      let updated = 0;
      
      for (const item of topPackages) {
        const existing = await prisma.denomination.findFirst({
          where: {
            productId: product.id,
            code: item.code,
          },
        });
        
        const price = item.price?.special || item.price?.premium || item.price?.basic || 0;
        
        if (!existing && price > 0) {
          await prisma.denomination.create({
            data: {
              productId: product.id,
              code: item.code,
              label: item.name.replace(operator, '').trim(),
              amountNumeric: 1, // Data packages don't have numeric amounts
              priceSell: price,
              costBuy: Math.floor(price * 0.97),
              feeFlat: 0,
              feePct: 0,
              sortOrder: 0,
              isPopular: item.name.includes('GB') && price < 100000,
            },
          });
          created++;
        } else if (existing && existing.priceSell !== price && price > 0) {
          await prisma.denomination.update({
            where: { id: existing.id },
            data: {
              priceSell: price,
              costBuy: Math.floor(price * 0.97),
            },
          });
          updated++;
        }
      }
      
      console.log(`  📝 Created: ${created}, Updated: ${updated}\n`);
    }
    
    // Process PLN Token
    if (plnProducts.length > 0) {
      console.log('⚡ Processing PLN Token Products...\n');
      
      let plnProduct = await prisma.product.findUnique({
        where: { slug: 'pln-token' },
      });
      
      if (!plnProduct) {
        plnProduct = await prisma.product.create({
          data: {
            slug: 'pln-token',
            type: 'PULSA', // Using PULSA type for PLN
            name: 'Token Listrik PLN',
            providerKey: 'PLN',
            iconUrl: '/icons/pln.png',
            description: 'Beli token listrik PLN prabayar',
            instruction: 'Masukkan nomor meter/ID pelanggan PLN',
            status: 'ACTIVE',
          },
        });
        console.log(`✅ Created PLN Token product`);
      }
      
      // Add popular PLN denominations
      const plnAmounts = [20000, 50000, 100000, 200000, 500000, 1000000];
      
      for (const amount of plnAmounts) {
        const plnItem = plnProducts.find(p => 
          p.name.includes(amount.toString()) || 
          p.code.includes(amount.toString())
        );
        
        if (!plnItem) continue;
        
        const existing = await prisma.denomination.findFirst({
          where: {
            productId: plnProduct.id,
            amountNumeric: amount,
          },
        });
        
        const price = plnItem.price?.special || plnItem.price?.premium || plnItem.price?.basic || amount + 2500;
        
        if (!existing) {
          await prisma.denomination.create({
            data: {
              productId: plnProduct.id,
              code: plnItem.code || `PLN${amount}`,
              label: `Token ${amount.toLocaleString('id-ID')}`,
              amountNumeric: amount,
              priceSell: price,
              costBuy: Math.floor(price * 0.98),
              feeFlat: 0,
              feePct: 0,
              sortOrder: plnAmounts.indexOf(amount),
              isPopular: [50000, 100000, 200000].includes(amount),
            },
          });
        }
      }
      
      console.log(`✅ PLN Token products synced\n`);
    }
    
    console.log('=======================================');
    console.log('✅ Prepaid Products Sync Complete!\n');
    
    // Show summary
    const allPrepaid = await prisma.product.findMany({
      where: { 
        type: { in: ['PULSA', 'DATA'] },
      },
      include: {
        denominations: {
          take: 3,
          orderBy: { priceSell: 'asc' },
        },
      },
    });
    
    console.log('📱 Prepaid Products in Database:\n');
    allPrepaid.forEach(p => {
      console.log(`${p.name} (/${p.slug}):`);
      p.denominations.forEach(d => {
        console.log(`  - ${d.label}: Rp ${d.priceSell.toLocaleString('id-ID')}`);
      });
      console.log('');
    });
    
    console.log('🎉 Visit http://localhost:3000/topup/pulsa to see prepaid products!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

syncPrepaidProducts();
