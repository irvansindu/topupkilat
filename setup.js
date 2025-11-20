const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('\n🚀 TopUpKilat Setup Wizard\n');
console.log('================================\n');

async function setup() {
  console.log('Pilih opsi database:\n');
  console.log('1. PostgreSQL Lokal (localhost)');
  console.log('2. Supabase (Cloud PostgreSQL Gratis)');
  console.log('3. Neon (Cloud PostgreSQL Gratis)');
  console.log('4. Custom PostgreSQL URL\n');
  
  const dbChoice = await question('Pilih (1-4): ');
  
  let databaseUrl = '';
  
  switch(dbChoice.trim()) {
    case '1':
      const dbName = await question('Nama database (default: topupkilat): ') || 'topupkilat';
      const dbUser = await question('Username PostgreSQL (default: postgres): ') || 'postgres';
      const dbPass = await question('Password PostgreSQL: ');
      const dbPort = await question('Port (default: 5432): ') || '5432';
      databaseUrl = `postgresql://${dbUser}:${dbPass}@localhost:${dbPort}/${dbName}`;
      break;
      
    case '2':
      console.log('\n📝 Cara mendapatkan Supabase URL:');
      console.log('1. Daftar/login di https://supabase.com');
      console.log('2. Buat project baru (gratis)');
      console.log('3. Pergi ke Settings > Database');
      console.log('4. Copy "Connection string" dari bagian "Connection Pooling"\n');
      databaseUrl = await question('Paste Supabase connection string: ');
      break;
      
    case '3':
      console.log('\n📝 Cara mendapatkan Neon URL:');
      console.log('1. Daftar/login di https://neon.tech');
      console.log('2. Buat database baru (gratis)');
      console.log('3. Copy connection string dari dashboard\n');
      databaseUrl = await question('Paste Neon connection string: ');
      break;
      
    case '4':
      databaseUrl = await question('Masukkan PostgreSQL URL lengkap: ');
      break;
      
    default:
      console.log('Pilihan tidak valid. Menggunakan default.');
      databaseUrl = 'postgresql://postgres:password@localhost:5432/topupkilat';
  }
  
  // Generate secure secrets
  const authSecret = crypto.randomBytes(32).toString('hex');
  const encryptionKey = crypto.randomBytes(16).toString('hex');
  
  // Buat .env content
  const envContent = `# Database
DATABASE_URL=${databaseUrl}

# Redis (optional untuk development)
REDIS_URL=redis://localhost:6379

# Auth (generated securely)
AUTH_SECRET=${authSecret}
NEXTAUTH_URL=http://localhost:3000

# Payment Provider (mock untuk development)
PAYMENT_PROVIDER=mock
PAYMENT_API_KEY=mock-payment-api-key
PAYMENT_WEBHOOK_SECRET=mock-webhook-secret-${crypto.randomBytes(8).toString('hex')}

# Topup Provider (mock untuk development)
TOPUP_PROVIDER=mock
TOPUP_API_KEY=mock-topup-api-key
TOPUP_API_SECRET=mock-topup-api-secret-${crypto.randomBytes(8).toString('hex')}

# Application
APP_BASE_URL=http://localhost:3000
APP_NAME=TopUpKilat
SUPPORT_EMAIL=support@topupkilat.example
CS_WHATSAPP=+62-812-3456-7890

# Encryption
ENCRYPTION_KEY=${encryptionKey}

# Development
NODE_ENV=development
`;
  
  // Tulis ke .env
  const envPath = path.join(__dirname, '.env');
  fs.writeFileSync(envPath, envContent, 'utf8');
  
  console.log('\n✅ File .env berhasil dibuat!\n');
  console.log('================================\n');
  console.log('Langkah selanjutnya:\n');
  console.log('1. Restart server (Ctrl+C lalu npm run dev)');
  console.log('2. Jalankan: npx prisma migrate dev --name init');
  console.log('3. Jalankan: npm run db:seed');
  console.log('4. Buka http://localhost:3000\n');
  console.log('Test accounts:');
  console.log('Admin: admin@topupkilat.example / admin123');
  console.log('User: user@example.com / user123\n');
  
  rl.close();
}

setup().catch(console.error);
