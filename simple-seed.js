const { execSync } = require('child_process');

console.log('📦 Installing @prisma/client locally...');
execSync('npm install @prisma/client', { stdio: 'inherit' });

console.log('🔄 Generating Prisma Client...');
execSync('npx prisma generate', { stdio: 'inherit' });

// Now require after generating
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// For Prisma 7.0, pass undefined when using default config
const prisma = new PrismaClient();

async function seed() {
  console.log('\n🌱 Starting database seed...\n');

  try {
    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@topupkilat.example',
        name: 'Admin TopUpKilat',
        passwordHash: await bcrypt.hash('admin123', 10),
        role: 'ADMIN',
        phone: '081234567890',
      },
    });
    console.log('✅ Created admin user:', admin.email);

    // Create test user  
    const user = await prisma.user.create({
      data: {
        email: 'user@example.com',
        name: 'Test User',
        passwordHash: await bcrypt.hash('user123', 10),
        role: 'USER',
        phone: '081234567891',
      },
    });
    console.log('✅ Created test user:', user.email);

    // Create Mobile Legends product
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
            { 
              label: '50 Diamonds', 
              amountNumeric: 50, 
              priceSell: 15000, 
              costBuy: 14000, 
              feeFlat: 500, 
              sortOrder: 1 
            },
            { 
              label: '100 Diamonds', 
              amountNumeric: 100, 
              priceSell: 29000, 
              costBuy: 27000, 
              feeFlat: 500, 
              sortOrder: 2 
            },
          ],
        },
      },
      include: {
        denominations: true,
      },
    });
    console.log(`✅ Created product: ${mlbb.name} with ${mlbb.denominations.length} denominations`);

    // Create promo
    const promo = await prisma.promo.create({
      data: {
        code: 'WELCOME10',
        discountType: 'PERCENT',
        value: 10,
        maxDiscount: 10000,
        minPurchase: 50000,
        startAt: new Date(),
        endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        usageLimit: 1000,
      },
    });
    console.log('✅ Created promo:', promo.code);

    console.log('\n🎉 Seed completed successfully!\n');
    console.log('Test Accounts:');
    console.log('--------------');
    console.log('Admin: admin@topupkilat.example / admin123');
    console.log('User: user@example.com / user123\n');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
