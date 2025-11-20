require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

// Use direct connection for Supabase
let dbUrl = process.env.DATABASE_URL;
if (dbUrl && dbUrl.includes('pooler.supabase.com:6543')) {
  dbUrl = dbUrl.replace(':6543', ':5432');
}
process.env.DATABASE_URL = dbUrl;

const prisma = new PrismaClient();

async function addStreamingProducts() {
  console.log('📺 Adding Streaming Products to Database\n');
  
  try {
    // Netflix
    let netflix = await prisma.product.findUnique({
      where: { slug: 'netflix' },
    });
    
    if (!netflix) {
      netflix = await prisma.product.create({
        data: {
          slug: 'netflix',
          type: 'STREAMING',
          name: 'Netflix Premium',
          providerKey: 'netflix',
          iconUrl: '/icons/netflix.png',
          description: 'Berlangganan Netflix Premium dengan harga terbaik',
          instruction: 'Masukkan email Netflix Anda',
          status: 'ACTIVE',
          denominations: {
            create: [
              { label: 'Mobile 1 Bulan', amountNumeric: 1, priceSell: 54000, costBuy: 50000, feeFlat: 1000 },
              { label: 'Basic 1 Bulan', amountNumeric: 1, priceSell: 120000, costBuy: 115000, feeFlat: 1000 },
              { label: 'Standard 1 Bulan', amountNumeric: 1, priceSell: 165000, costBuy: 160000, feeFlat: 1000, isPopular: true },
              { label: 'Premium 1 Bulan', amountNumeric: 1, priceSell: 195000, costBuy: 190000, feeFlat: 1000 },
            ],
          },
        },
      });
      console.log('✅ Created Netflix');
    }
    
    // Spotify
    let spotify = await prisma.product.findUnique({
      where: { slug: 'spotify' },
    });
    
    if (!spotify) {
      spotify = await prisma.product.create({
        data: {
          slug: 'spotify',
          type: 'STREAMING',
          name: 'Spotify Premium',
          providerKey: 'spotify',
          iconUrl: '/icons/spotify.png',
          description: 'Berlangganan Spotify Premium tanpa iklan',
          instruction: 'Masukkan email Spotify Anda',
          status: 'ACTIVE',
          denominations: {
            create: [
              { label: 'Individual 1 Bulan', amountNumeric: 1, priceSell: 55000, costBuy: 52000, feeFlat: 500, isPopular: true },
              { label: 'Individual 3 Bulan', amountNumeric: 3, priceSell: 160000, costBuy: 155000, feeFlat: 1000 },
              { label: 'Duo 1 Bulan', amountNumeric: 1, priceSell: 70000, costBuy: 67000, feeFlat: 500 },
              { label: 'Family 1 Bulan', amountNumeric: 1, priceSell: 85000, costBuy: 82000, feeFlat: 500 },
            ],
          },
        },
      });
      console.log('✅ Created Spotify');
    }
    
    // YouTube Premium
    let youtube = await prisma.product.findUnique({
      where: { slug: 'youtube-premium' },
    });
    
    if (!youtube) {
      youtube = await prisma.product.create({
        data: {
          slug: 'youtube-premium',
          type: 'STREAMING',
          name: 'YouTube Premium',
          providerKey: 'youtube',
          iconUrl: '/icons/youtube.png',
          description: 'YouTube tanpa iklan + YouTube Music',
          instruction: 'Masukkan email Google Anda',
          status: 'ACTIVE',
          denominations: {
            create: [
              { label: 'Individual 1 Bulan', amountNumeric: 1, priceSell: 59000, costBuy: 56000, feeFlat: 500, isPopular: true },
              { label: 'Individual 3 Bulan', amountNumeric: 3, priceSell: 170000, costBuy: 165000, feeFlat: 1000 },
              { label: 'Family 1 Bulan', amountNumeric: 1, priceSell: 89000, costBuy: 86000, feeFlat: 500 },
              { label: 'Student 1 Bulan', amountNumeric: 1, priceSell: 35000, costBuy: 33000, feeFlat: 500 },
            ],
          },
        },
      });
      console.log('✅ Created YouTube Premium');
    }
    
    // Disney+ Hotstar
    let disney = await prisma.product.findUnique({
      where: { slug: 'disney-plus' },
    });
    
    if (!disney) {
      disney = await prisma.product.create({
        data: {
          slug: 'disney-plus',
          type: 'STREAMING',
          name: 'Disney+ Hotstar',
          providerKey: 'disney',
          iconUrl: '/icons/disney.png',
          description: 'Streaming film Disney, Marvel, Star Wars & lebih',
          instruction: 'Masukkan email atau nomor HP',
          status: 'ACTIVE',
          denominations: {
            create: [
              { label: 'Mobile 1 Bulan', amountNumeric: 1, priceSell: 39000, costBuy: 37000, feeFlat: 500 },
              { label: 'Basic 1 Bulan', amountNumeric: 1, priceSell: 69000, costBuy: 66000, feeFlat: 500, isPopular: true },
              { label: 'Premium 1 Bulan', amountNumeric: 1, priceSell: 99000, costBuy: 96000, feeFlat: 500 },
              { label: 'Premium 1 Tahun', amountNumeric: 12, priceSell: 999000, costBuy: 970000, feeFlat: 2000 },
            ],
          },
        },
      });
      console.log('✅ Created Disney+ Hotstar');
    }
    
    // Vidio Premier
    let vidio = await prisma.product.findUnique({
      where: { slug: 'vidio' },
    });
    
    if (!vidio) {
      vidio = await prisma.product.create({
        data: {
          slug: 'vidio',
          type: 'STREAMING',
          name: 'Vidio Premier',
          providerKey: 'vidio',
          iconUrl: '/icons/vidio.png',
          description: 'Nonton Liga Inggris, Champions League & film',
          instruction: 'Masukkan email atau nomor HP Vidio',
          status: 'ACTIVE',
          denominations: {
            create: [
              { label: 'Premier Platinum 1 Bulan', amountNumeric: 1, priceSell: 79000, costBuy: 76000, feeFlat: 500, isPopular: true },
              { label: 'Premier Platinum 3 Bulan', amountNumeric: 3, priceSell: 229000, costBuy: 224000, feeFlat: 1000 },
              { label: 'Premier Platinum 1 Tahun', amountNumeric: 12, priceSell: 679000, costBuy: 660000, feeFlat: 2000 },
              { label: 'Premier Diamond 1 Bulan', amountNumeric: 1, priceSell: 109000, costBuy: 105000, feeFlat: 500 },
            ],
          },
        },
      });
      console.log('✅ Created Vidio Premier');
    }
    
    // WeTV VIP
    let wetv = await prisma.product.findUnique({
      where: { slug: 'wetv' },
    });
    
    if (!wetv) {
      wetv = await prisma.product.create({
        data: {
          slug: 'wetv',
          type: 'STREAMING',
          name: 'WeTV VIP',
          providerKey: 'wetv',
          iconUrl: '/icons/wetv.png',
          description: 'Nonton drama Asia & anime tanpa iklan',
          instruction: 'Masukkan email atau nomor HP WeTV',
          status: 'ACTIVE',
          denominations: {
            create: [
              { label: 'VIP 1 Bulan', amountNumeric: 1, priceSell: 49000, costBuy: 47000, feeFlat: 500, isPopular: true },
              { label: 'VIP 3 Bulan', amountNumeric: 3, priceSell: 139000, costBuy: 135000, feeFlat: 1000 },
              { label: 'VIP 1 Tahun', amountNumeric: 12, priceSell: 399000, costBuy: 390000, feeFlat: 2000 },
            ],
          },
        },
      });
      console.log('✅ Created WeTV VIP');
    }
    
    console.log('\n✅ Streaming products added successfully!\n');
    
    // Show all streaming products
    const allStreaming = await prisma.product.findMany({
      where: { type: 'STREAMING' },
      include: {
        denominations: {
          orderBy: { priceSell: 'asc' },
          take: 3,
        },
      },
    });
    
    console.log('📺 Streaming Products in Database:\n');
    allStreaming.forEach(p => {
      console.log(`${p.name} (/${p.slug}):`);
      p.denominations.forEach(d => {
        console.log(`  - ${d.label}: Rp ${d.priceSell.toLocaleString('id-ID')}`);
      });
      console.log('');
    });
    
    console.log('🎉 Visit http://localhost:3000/topup/streaming to see all streaming products!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addStreamingProducts();
