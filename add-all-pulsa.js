require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

// Use direct connection for Supabase
let dbUrl = process.env.DATABASE_URL;
if (dbUrl && dbUrl.includes('pooler.supabase.com:6543')) {
  dbUrl = dbUrl.replace(':6543', ':5432');
}
process.env.DATABASE_URL = dbUrl;

const prisma = new PrismaClient();

async function addAllPulsaProducts() {
  console.log('📱 Adding All Pulsa & Data Products to Database\n');
  console.log('=======================================\n');
  
  try {
    // Define all operators
    const operators = [
      {
        name: 'Telkomsel',
        slug: 'telkomsel',
        color: 'red',
        prefixes: ['0811', '0812', '0813', '0821', '0822', '0823', '0851', '0852', '0853'],
      },
      {
        name: 'Indosat',
        slug: 'indosat',
        color: 'yellow',
        prefixes: ['0814', '0815', '0816', '0855', '0856', '0857', '0858'],
      },
      {
        name: 'XL',
        slug: 'xl',
        color: 'blue',
        prefixes: ['0817', '0818', '0819', '0859', '0877', '0878'],
      },
      {
        name: 'Axis',
        slug: 'axis',
        color: 'purple',
        prefixes: ['0831', '0832', '0833', '0838'],
      },
      {
        name: 'Three',
        slug: 'three',
        color: 'orange',
        prefixes: ['0895', '0896', '0897', '0898', '0899'],
      },
      {
        name: 'Smartfren',
        slug: 'smartfren',
        color: 'pink',
        prefixes: ['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888', '0889'],
      },
      {
        name: 'By.U',
        slug: 'byu',
        color: 'green',
        prefixes: ['0851', '0852', '0853'], // Shares with Telkomsel
      },
    ];

    // Common pulsa denominations
    const pulsaDenominations = [
      { amount: 5000, price: 6500 },
      { amount: 10000, price: 11500 },
      { amount: 15000, price: 16000 },
      { amount: 20000, price: 21000 },
      { amount: 25000, price: 26000 },
      { amount: 50000, price: 51000 },
      { amount: 100000, price: 100000 },
      { amount: 150000, price: 150000 },
      { amount: 200000, price: 199000 },
      { amount: 300000, price: 298000 },
      { amount: 500000, price: 495000 },
      { amount: 1000000, price: 990000 },
    ];

    // Common data packages
    const dataPackages = [
      { name: 'Data 1GB 7 Hari', amount: 1, price: 10000 },
      { name: 'Data 2GB 7 Hari', amount: 2, price: 18000 },
      { name: 'Data 3GB 30 Hari', amount: 3, price: 25000 },
      { name: 'Data 5GB 30 Hari', amount: 5, price: 40000 },
      { name: 'Data 8GB 30 Hari', amount: 8, price: 60000 },
      { name: 'Data 10GB 30 Hari', amount: 10, price: 75000 },
      { name: 'Data 15GB 30 Hari', amount: 15, price: 100000 },
      { name: 'Data 20GB 30 Hari', amount: 20, price: 125000 },
      { name: 'Data 25GB 30 Hari', amount: 25, price: 150000 },
      { name: 'Data 50GB 30 Hari', amount: 50, price: 250000 },
      { name: 'Unlimited 30 Hari', amount: 999, price: 350000 },
    ];

    for (const operator of operators) {
      console.log(`\n📱 Processing ${operator.name}...`);
      
      // Create/Update Pulsa Product
      const pulsaSlug = `pulsa-${operator.slug}`;
      let pulsaProduct = await prisma.product.findUnique({
        where: { slug: pulsaSlug },
      });
      
      if (!pulsaProduct) {
        pulsaProduct = await prisma.product.create({
          data: {
            slug: pulsaSlug,
            type: 'PULSA',
            name: `Pulsa ${operator.name}`,
            providerKey: operator.slug.toUpperCase(),
            iconUrl: `/icons/${operator.slug}.png`,
            description: `Isi pulsa ${operator.name} instant 24 jam`,
            instruction: 'Masukkan nomor HP yang akan diisi pulsa',
            status: 'ACTIVE',
          },
        });
        console.log(`  ✅ Created: Pulsa ${operator.name}`);
      } else {
        console.log(`  ✅ Exists: Pulsa ${operator.name}`);
      }
      
      // Add pulsa denominations
      let pulsaCreated = 0;
      for (const denom of pulsaDenominations) {
        const existing = await prisma.denomination.findFirst({
          where: {
            productId: pulsaProduct.id,
            amountNumeric: denom.amount,
          },
        });
        
        if (!existing) {
          await prisma.denomination.create({
            data: {
              productId: pulsaProduct.id,
              code: `${operator.slug.toUpperCase()}${denom.amount}`,
              label: `Pulsa ${denom.amount.toLocaleString('id-ID')}`,
              amountNumeric: denom.amount,
              priceSell: denom.price,
              costBuy: Math.floor(denom.price * 0.97),
              feeFlat: 0,
              feePct: 0,
              sortOrder: pulsaDenominations.indexOf(denom),
              isPopular: [25000, 50000, 100000].includes(denom.amount),
            },
          });
          pulsaCreated++;
        }
      }
      console.log(`    - Added ${pulsaCreated} pulsa denominations`);
      
      // Create/Update Data Product
      const dataSlug = `data-${operator.slug}`;
      let dataProduct = await prisma.product.findUnique({
        where: { slug: dataSlug },
      });
      
      if (!dataProduct) {
        dataProduct = await prisma.product.create({
          data: {
            slug: dataSlug,
            type: 'DATA',
            name: `Paket Data ${operator.name}`,
            providerKey: `${operator.slug.toUpperCase()}-DATA`,
            iconUrl: `/icons/${operator.slug}.png`,
            description: `Paket internet ${operator.name} dengan kuota besar`,
            instruction: 'Masukkan nomor HP untuk paket data',
            status: 'ACTIVE',
          },
        });
        console.log(`  ✅ Created: Paket Data ${operator.name}`);
      } else {
        console.log(`  ✅ Exists: Paket Data ${operator.name}`);
      }
      
      // Add data packages
      let dataCreated = 0;
      for (const pkg of dataPackages) {
        const existing = await prisma.denomination.findFirst({
          where: {
            productId: dataProduct.id,
            label: pkg.name,
          },
        });
        
        if (!existing) {
          await prisma.denomination.create({
            data: {
              productId: dataProduct.id,
              code: `${operator.slug.toUpperCase()}-DATA-${pkg.amount}GB`,
              label: pkg.name,
              amountNumeric: pkg.amount,
              priceSell: pkg.price,
              costBuy: Math.floor(pkg.price * 0.95),
              feeFlat: 0,
              feePct: 0,
              sortOrder: dataPackages.indexOf(pkg),
              isPopular: [3, 5, 10].includes(pkg.amount),
            },
          });
          dataCreated++;
        }
      }
      console.log(`    - Added ${dataCreated} data packages`);
    }
    
    // Also ensure PLN Token exists
    console.log('\n⚡ Processing PLN Token...');
    
    let plnProduct = await prisma.product.findUnique({
      where: { slug: 'pln-token' },
    });
    
    if (!plnProduct) {
      plnProduct = await prisma.product.create({
        data: {
          slug: 'pln-token',
          type: 'PULSA',
          name: 'Token Listrik PLN',
          providerKey: 'PLN',
          iconUrl: '/icons/pln.png',
          description: 'Beli token listrik PLN prabayar',
          instruction: 'Masukkan nomor meter/ID pelanggan PLN (11-12 digit)',
          status: 'ACTIVE',
        },
      });
      console.log('  ✅ Created: Token PLN');
    } else {
      console.log('  ✅ Exists: Token PLN');
    }
    
    // Add PLN denominations
    const plnDenominations = [
      { amount: 20000, price: 22500 },
      { amount: 50000, price: 52500 },
      { amount: 100000, price: 102500 },
      { amount: 200000, price: 202500 },
      { amount: 500000, price: 502500 },
      { amount: 1000000, price: 1002500 },
    ];
    
    let plnCreated = 0;
    for (const denom of plnDenominations) {
      const existing = await prisma.denomination.findFirst({
        where: {
          productId: plnProduct.id,
          amountNumeric: denom.amount,
        },
      });
      
      if (!existing) {
        await prisma.denomination.create({
          data: {
            productId: plnProduct.id,
            code: `PLN${denom.amount}`,
            label: `Token ${denom.amount.toLocaleString('id-ID')}`,
            amountNumeric: denom.amount,
            priceSell: denom.price,
            costBuy: Math.floor(denom.price * 0.98),
            feeFlat: 0,
            feePct: 0,
            sortOrder: plnDenominations.indexOf(denom),
            isPopular: [50000, 100000, 200000].includes(denom.amount),
          },
        });
        plnCreated++;
      }
    }
    console.log(`    - Added ${plnCreated} PLN denominations`);
    
    console.log('\n=======================================');
    console.log('✅ All Pulsa & Data Products Added!\n');
    
    // Show summary
    const allProducts = await prisma.product.findMany({
      where: { 
        type: { in: ['PULSA', 'DATA'] },
      },
      include: {
        _count: {
          select: { denominations: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    
    console.log('📊 Products in Database:\n');
    allProducts.forEach(p => {
      console.log(`${p.name}: ${p._count.denominations} items`);
    });
    
    console.log('\n🎉 Visit http://localhost:3000/topup/pulsa to see all products!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addAllPulsaProducts();
