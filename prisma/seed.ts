import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.transactionLog.deleteMany();
  await prisma.order.deleteMany();
  await prisma.voucherStock.deleteMany();
  await prisma.denomination.deleteMany();
  await prisma.product.deleteMany();
  await prisma.promo.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.webhookEvent.deleteMany();
  await prisma.configuration.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@topupkilat.example',
      name: 'Admin TopUpKilat',
      passwordHash: adminPassword,
      role: 'ADMIN',
      phone: '081234567890',
    },
  });

  // Create test user
  const userPassword = await bcrypt.hash('user123', 10);
  const testUser = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'Test User',
      passwordHash: userPassword,
      role: 'USER',
      phone: '081234567891',
    },
  });

  console.log('✅ Created users');

  // Create products - Games
  const mlbb = await prisma.product.create({
    data: {
      slug: 'mobile-legends',
      type: 'GAME',
      name: 'Mobile Legends',
      providerKey: 'mlbb',
      iconUrl: '/icons/mlbb.png',
      description: 'Top up diamond Mobile Legends dengan harga termurah',
      instruction: 'Masukkan User ID dan Zone ID yang valid',
      status: 'ACTIVE',
      denominations: {
        create: [
          { label: '50 Diamonds', amountNumeric: 50, priceSell: 15000, costBuy: 14000, feeFlat: 500, sortOrder: 1 },
          { label: '100 Diamonds', amountNumeric: 100, priceSell: 29000, costBuy: 27000, feeFlat: 500, sortOrder: 2 },
          { label: '250 Diamonds', amountNumeric: 250, priceSell: 72000, costBuy: 68000, feeFlat: 1000, sortOrder: 3 },
          { label: '500 Diamonds', amountNumeric: 500, priceSell: 143000, costBuy: 135000, feeFlat: 1500, sortOrder: 4, isPopular: true },
          { label: '1000 Diamonds', amountNumeric: 1000, priceSell: 285000, costBuy: 270000, feeFlat: 2000, sortOrder: 5 },
          { label: 'Weekly Pass', amountNumeric: 1, priceSell: 30000, costBuy: 28000, feeFlat: 500, sortOrder: 6 },
        ],
      },
    },
  });

  const ff = await prisma.product.create({
    data: {
      slug: 'free-fire',
      type: 'GAME',
      name: 'Free Fire',
      providerKey: 'ff',
      iconUrl: '/icons/ff.png',
      description: 'Top up diamond Free Fire instant dan aman',
      instruction: 'Masukkan Player ID Free Fire Anda',
      status: 'ACTIVE',
      denominations: {
        create: [
          { label: '50 Diamonds', amountNumeric: 50, priceSell: 8000, costBuy: 7000, feeFlat: 300, sortOrder: 1 },
          { label: '100 Diamonds', amountNumeric: 100, priceSell: 15000, costBuy: 14000, feeFlat: 300, sortOrder: 2 },
          { label: '310 Diamonds', amountNumeric: 310, priceSell: 45000, costBuy: 42000, feeFlat: 500, sortOrder: 3, isPopular: true },
          { label: '520 Diamonds', amountNumeric: 520, priceSell: 75000, costBuy: 70000, feeFlat: 800, sortOrder: 4 },
          { label: '1060 Diamonds', amountNumeric: 1060, priceSell: 150000, costBuy: 140000, feeFlat: 1500, sortOrder: 5 },
          { label: 'Member Mingguan', amountNumeric: 1, priceSell: 30000, costBuy: 28000, feeFlat: 500, sortOrder: 6 },
        ],
      },
    },
  });

  const pubgm = await prisma.product.create({
    data: {
      slug: 'pubg-mobile',
      type: 'GAME',
      name: 'PUBG Mobile',
      providerKey: 'pubgm',
      iconUrl: '/icons/pubgm.png',
      description: 'Top up UC PUBG Mobile termurah dan tercepat',
      instruction: 'Masukkan User ID PUBG Mobile',
      status: 'ACTIVE',
      denominations: {
        create: [
          { label: '60 UC', amountNumeric: 60, priceSell: 15000, costBuy: 14000, feeFlat: 300, sortOrder: 1 },
          { label: '325 UC', amountNumeric: 325, priceSell: 75000, costBuy: 70000, feeFlat: 800, sortOrder: 2, isPopular: true },
          { label: '660 UC', amountNumeric: 660, priceSell: 150000, costBuy: 140000, feeFlat: 1500, sortOrder: 3 },
          { label: '1800 UC', amountNumeric: 1800, priceSell: 400000, costBuy: 375000, feeFlat: 3000, sortOrder: 4 },
          { label: '3850 UC', amountNumeric: 3850, priceSell: 850000, costBuy: 800000, feeFlat: 5000, sortOrder: 5 },
          { label: 'Royale Pass', amountNumeric: 1, priceSell: 150000, costBuy: 140000, feeFlat: 2000, sortOrder: 6 },
        ],
      },
    },
  });

  const genshin = await prisma.product.create({
    data: {
      slug: 'genshin-impact',
      type: 'GAME',
      name: 'Genshin Impact',
      providerKey: 'genshin',
      iconUrl: '/icons/genshin.png',
      description: 'Top up Genesis Crystal Genshin Impact',
      instruction: 'Masukkan UID Genshin Impact dan pilih server',
      status: 'ACTIVE',
      denominations: {
        create: [
          { label: '60 Genesis Crystal', amountNumeric: 60, priceSell: 16000, costBuy: 15000, feeFlat: 300, sortOrder: 1 },
          { label: '300+30 Genesis Crystal', amountNumeric: 330, priceSell: 79000, costBuy: 75000, feeFlat: 800, sortOrder: 2, isPopular: true },
          { label: '980+110 Genesis Crystal', amountNumeric: 1090, priceSell: 249000, costBuy: 235000, feeFlat: 2000, sortOrder: 3 },
          { label: '1980+260 Genesis Crystal', amountNumeric: 2240, priceSell: 479000, costBuy: 450000, feeFlat: 3500, sortOrder: 4 },
          { label: '3280+600 Genesis Crystal', amountNumeric: 3880, priceSell: 799000, costBuy: 750000, feeFlat: 5000, sortOrder: 5 },
          { label: 'Welkin Moon', amountNumeric: 1, priceSell: 79000, costBuy: 75000, feeFlat: 1000, sortOrder: 6 },
        ],
      },
    },
  });

  // Create products - E-Wallets
  const shopeepay = await prisma.product.create({
    data: {
      slug: 'shopeepay',
      type: 'EWALLET',
      name: 'ShopeePay',
      providerKey: 'shopeepay',
      iconUrl: '/icons/shopeepay.png',
      description: 'Top up saldo ShopeePay instant',
      instruction: 'Masukkan nomor HP yang terdaftar di ShopeePay',
      status: 'ACTIVE',
      denominations: {
        create: [
          { label: 'Rp 10.000', amountNumeric: 10000, priceSell: 10500, costBuy: 10000, feeFlat: 500, sortOrder: 1 },
          { label: 'Rp 20.000', amountNumeric: 20000, priceSell: 20500, costBuy: 20000, feeFlat: 500, sortOrder: 2 },
          { label: 'Rp 50.000', amountNumeric: 50000, priceSell: 50500, costBuy: 50000, feeFlat: 500, sortOrder: 3, isPopular: true },
          { label: 'Rp 100.000', amountNumeric: 100000, priceSell: 100500, costBuy: 100000, feeFlat: 500, sortOrder: 4 },
          { label: 'Rp 200.000', amountNumeric: 200000, priceSell: 200500, costBuy: 200000, feeFlat: 500, sortOrder: 5 },
          { label: 'Rp 500.000', amountNumeric: 500000, priceSell: 500500, costBuy: 500000, feeFlat: 500, sortOrder: 6 },
        ],
      },
    },
  });

  const dana = await prisma.product.create({
    data: {
      slug: 'dana',
      type: 'EWALLET',
      name: 'DANA',
      providerKey: 'dana',
      iconUrl: '/icons/dana.png',
      description: 'Top up saldo DANA mudah dan cepat',
      instruction: 'Masukkan nomor HP yang terdaftar di DANA',
      status: 'ACTIVE',
      denominations: {
        create: [
          { label: 'Rp 10.000', amountNumeric: 10000, priceSell: 10500, costBuy: 10000, feeFlat: 500, sortOrder: 1 },
          { label: 'Rp 20.000', amountNumeric: 20000, priceSell: 20500, costBuy: 20000, feeFlat: 500, sortOrder: 2 },
          { label: 'Rp 50.000', amountNumeric: 50000, priceSell: 50500, costBuy: 50000, feeFlat: 500, sortOrder: 3, isPopular: true },
          { label: 'Rp 100.000', amountNumeric: 100000, priceSell: 100500, costBuy: 100000, feeFlat: 500, sortOrder: 4 },
          { label: 'Rp 200.000', amountNumeric: 200000, priceSell: 200500, costBuy: 200000, feeFlat: 500, sortOrder: 5 },
        ],
      },
    },
  });

  const ovo = await prisma.product.create({
    data: {
      slug: 'ovo',
      type: 'EWALLET',
      name: 'OVO',
      providerKey: 'ovo',
      iconUrl: '/icons/ovo.png',
      description: 'Top up saldo OVO praktis',
      instruction: 'Masukkan nomor HP yang terdaftar di OVO',
      status: 'ACTIVE',
      denominations: {
        create: [
          { label: 'Rp 10.000', amountNumeric: 10000, priceSell: 10500, costBuy: 10000, feeFlat: 500, sortOrder: 1 },
          { label: 'Rp 25.000', amountNumeric: 25000, priceSell: 25500, costBuy: 25000, feeFlat: 500, sortOrder: 2 },
          { label: 'Rp 50.000', amountNumeric: 50000, priceSell: 50500, costBuy: 50000, feeFlat: 500, sortOrder: 3, isPopular: true },
          { label: 'Rp 100.000', amountNumeric: 100000, priceSell: 100500, costBuy: 100000, feeFlat: 500, sortOrder: 4 },
          { label: 'Rp 200.000', amountNumeric: 200000, priceSell: 200500, costBuy: 200000, feeFlat: 500, sortOrder: 5 },
        ],
      },
    },
  });

  const gopay = await prisma.product.create({
    data: {
      slug: 'gopay',
      type: 'EWALLET',
      name: 'GoPay',
      providerKey: 'gopay',
      iconUrl: '/icons/gopay.png',
      description: 'Top up saldo GoPay instant',
      instruction: 'Masukkan nomor HP yang terdaftar di GoPay',
      status: 'ACTIVE',
      denominations: {
        create: [
          { label: 'Rp 10.000', amountNumeric: 10000, priceSell: 10500, costBuy: 10000, feeFlat: 500, sortOrder: 1 },
          { label: 'Rp 25.000', amountNumeric: 25000, priceSell: 25500, costBuy: 25000, feeFlat: 500, sortOrder: 2 },
          { label: 'Rp 50.000', amountNumeric: 50000, priceSell: 50500, costBuy: 50000, feeFlat: 500, sortOrder: 3, isPopular: true },
          { label: 'Rp 100.000', amountNumeric: 100000, priceSell: 100500, costBuy: 100000, feeFlat: 500, sortOrder: 4 },
          { label: 'Rp 150.000', amountNumeric: 150000, priceSell: 150500, costBuy: 150000, feeFlat: 500, sortOrder: 5 },
        ],
      },
    },
  });

  // Create products - Pulsa
  const telkomsel = await prisma.product.create({
    data: {
      slug: 'telkomsel',
      type: 'PULSA',
      name: 'Telkomsel',
      providerKey: 'telkomsel_pulsa',
      iconUrl: '/icons/telkomsel.png',
      description: 'Isi pulsa Telkomsel semua nominal',
      instruction: 'Masukkan nomor Telkomsel yang aktif',
      status: 'ACTIVE',
      denominations: {
        create: [
          { label: 'Pulsa 5.000', amountNumeric: 5000, priceSell: 6000, costBuy: 5500, feeFlat: 300, sortOrder: 1 },
          { label: 'Pulsa 10.000', amountNumeric: 10000, priceSell: 11000, costBuy: 10500, feeFlat: 300, sortOrder: 2 },
          { label: 'Pulsa 25.000', amountNumeric: 25000, priceSell: 26000, costBuy: 25500, feeFlat: 300, sortOrder: 3, isPopular: true },
          { label: 'Pulsa 50.000', amountNumeric: 50000, priceSell: 51000, costBuy: 50500, feeFlat: 300, sortOrder: 4 },
          { label: 'Pulsa 100.000', amountNumeric: 100000, priceSell: 101000, costBuy: 100500, feeFlat: 300, sortOrder: 5 },
        ],
      },
    },
  });

  const indosat = await prisma.product.create({
    data: {
      slug: 'indosat',
      type: 'PULSA',
      name: 'Indosat',
      providerKey: 'indosat_pulsa',
      iconUrl: '/icons/indosat.png',
      description: 'Isi pulsa Indosat IM3 Ooredoo',
      instruction: 'Masukkan nomor Indosat yang aktif',
      status: 'ACTIVE',
      denominations: {
        create: [
          { label: 'Pulsa 5.000', amountNumeric: 5000, priceSell: 6000, costBuy: 5500, feeFlat: 300, sortOrder: 1 },
          { label: 'Pulsa 10.000', amountNumeric: 10000, priceSell: 11000, costBuy: 10500, feeFlat: 300, sortOrder: 2 },
          { label: 'Pulsa 25.000', amountNumeric: 25000, priceSell: 26000, costBuy: 25500, feeFlat: 300, sortOrder: 3, isPopular: true },
          { label: 'Pulsa 50.000', amountNumeric: 50000, priceSell: 51000, costBuy: 50500, feeFlat: 300, sortOrder: 4 },
          { label: 'Pulsa 100.000', amountNumeric: 100000, priceSell: 101000, costBuy: 100500, feeFlat: 300, sortOrder: 5 },
        ],
      },
    },
  });

  // Create products - Data
  const telkomselData = await prisma.product.create({
    data: {
      slug: 'telkomsel-data',
      type: 'DATA',
      name: 'Telkomsel Data',
      providerKey: 'telkomsel_data',
      iconUrl: '/icons/telkomsel.png',
      description: 'Paket data Telkomsel semua kuota',
      instruction: 'Masukkan nomor Telkomsel yang aktif',
      status: 'ACTIVE',
      denominations: {
        create: [
          { label: '1GB 7 Hari', amountNumeric: 1, priceSell: 15000, costBuy: 14000, feeFlat: 500, sortOrder: 1 },
          { label: '2GB 7 Hari', amountNumeric: 2, priceSell: 25000, costBuy: 23500, feeFlat: 500, sortOrder: 2 },
          { label: '5GB 30 Hari', amountNumeric: 5, priceSell: 50000, costBuy: 47000, feeFlat: 800, sortOrder: 3, isPopular: true },
          { label: '10GB 30 Hari', amountNumeric: 10, priceSell: 85000, costBuy: 80000, feeFlat: 1000, sortOrder: 4 },
          { label: '25GB 30 Hari', amountNumeric: 25, priceSell: 150000, costBuy: 140000, feeFlat: 1500, sortOrder: 5 },
          { label: '50GB 30 Hari', amountNumeric: 50, priceSell: 250000, costBuy: 235000, feeFlat: 2000, sortOrder: 6 },
        ],
      },
    },
  });

  console.log('✅ Created products');

  // Create sample voucher stock for testing
  await prisma.voucherStock.createMany({
    data: [
      { productId: mlbb.id, code: 'MLBB-TEST-001', status: 'AVAILABLE' },
      { productId: mlbb.id, code: 'MLBB-TEST-002', status: 'AVAILABLE' },
      { productId: ff.id, code: 'FF-TEST-001', status: 'AVAILABLE' },
      { productId: ff.id, code: 'FF-TEST-002', status: 'AVAILABLE' },
    ],
  });

  console.log('✅ Created voucher stock');

  // Create promos
  const now = new Date();
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  await prisma.promo.createMany({
    data: [
      {
        code: 'WELCOME10',
        discountType: 'PERCENT',
        value: 10,
        maxDiscount: 10000,
        minPurchase: 50000,
        startAt: now,
        endAt: nextMonth,
        usageLimit: 1000,
      },
      {
        code: 'FLASH5K',
        discountType: 'FLAT',
        value: 5000,
        minPurchase: 100000,
        startAt: now,
        endAt: nextMonth,
        usageLimit: 500,
      },
    ],
  });

  console.log('✅ Created promos');

  // Create configurations
  await prisma.configuration.createMany({
    data: [
      {
        key: 'maintenance_mode',
        value: JSON.stringify({ enabled: false, message: '' }),
      },
      {
        key: 'payment_settings',
        value: JSON.stringify({
          providers: ['mock', 'xendit', 'midtrans'],
          default: 'mock',
        }),
      },
      {
        key: 'topup_settings',
        value: JSON.stringify({
          providers: ['mock', 'aggregator'],
          default: 'mock',
        }),
      },
    ],
  });

  console.log('✅ Created configurations');

  console.log(`
🎉 Seed completed successfully!

Test Accounts:
--------------
Admin: admin@topupkilat.example / admin123
User: user@example.com / user123

Products Created:
----------------
- ${await prisma.product.count()} products
- ${await prisma.denomination.count()} denominations
- ${await prisma.voucherStock.count()} voucher stocks
- ${await prisma.promo.count()} promos
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
