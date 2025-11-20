const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

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
          { label: 'Rp 50.000', amountNumeric: 50000, priceSell: 50500, costBuy: 50000, feeFlat: 500, sortOrder: 2, isPopular: true },
          { label: 'Rp 100.000', amountNumeric: 100000, priceSell: 100500, costBuy: 100000, feeFlat: 500, sortOrder: 3 },
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
          { label: 'Pulsa 10.000', amountNumeric: 10000, priceSell: 11000, costBuy: 10500, feeFlat: 300, sortOrder: 1 },
          { label: 'Pulsa 25.000', amountNumeric: 25000, priceSell: 26000, costBuy: 25500, feeFlat: 300, sortOrder: 2, isPopular: true },
          { label: 'Pulsa 50.000', amountNumeric: 50000, priceSell: 51000, costBuy: 50500, feeFlat: 300, sortOrder: 3 },
        ],
      },
    },
  });

  console.log('✅ Created products');

  // Create sample voucher stock
  await prisma.voucherStock.createMany({
    data: [
      { productId: mlbb.id, code: 'MLBB-TEST-001', status: 'AVAILABLE' },
      { productId: mlbb.id, code: 'MLBB-TEST-002', status: 'AVAILABLE' },
      { productId: ff.id, code: 'FF-TEST-001', status: 'AVAILABLE' },
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
