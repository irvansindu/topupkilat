const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('\n🚀 Setup VIP Reseller Integration untuk TopUpKilat\n');
console.log('==================================================\n');

// Read existing .env if exists
const envPath = path.join(__dirname, '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ File .env ditemukan, akan di-update...\n');
} else {
  console.log('📝 Membuat file .env baru...\n');
}

// Parse existing env
const envLines = envContent.split('\n');
const envVars = {};

envLines.forEach(line => {
  if (line && !line.startsWith('#') && line.includes('=')) {
    const [key, ...valueParts] = line.split('=');
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

// Update with VIP Reseller config and better defaults
const updates = {
  // Database - keep existing or use Supabase URL
  DATABASE_URL: envVars.DATABASE_URL || 'postgresql://postgres.atrtsxagmhhbraxqyzpe:[YOUR-PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres',
  
  // Redis (optional)
  REDIS_URL: envVars.REDIS_URL || 'redis://localhost:6379',
  
  // Auth - generate secure key if not exists
  AUTH_SECRET: envVars.AUTH_SECRET || crypto.randomBytes(32).toString('hex'),
  NEXTAUTH_URL: 'http://localhost:3001',
  
  // Payment Provider - use mock for testing
  PAYMENT_PROVIDER: 'mock',
  PAYMENT_API_KEY: 'mock-payment-api-key',
  PAYMENT_WEBHOOK_SECRET: 'mock-webhook-secret-' + crypto.randomBytes(8).toString('hex'),
  
  // Change to VIP Reseller provider
  TOPUP_PROVIDER: 'vipreseller',
  
  // VIP Reseller Demo/Test Credentials (for testing only)
  // Note: These are dummy values - you need real credentials from vip-reseller.co.id
  VIPRESELLER_API_KEY: 'demo-api-key-register-at-vipreseller',
  VIPRESELLER_API_ID: 'demo-api-id-12345',
  
  // Application settings
  APP_BASE_URL: 'http://localhost:3001',
  APP_NAME: 'TopUpKilat',
  SUPPORT_EMAIL: 'support@topupkilat.example',
  CS_WHATSAPP: '+62-812-3456-7890',
  
  // Admin API Key for sync products
  ADMIN_API_KEY: crypto.randomBytes(16).toString('hex'),
  
  // Encryption
  ENCRYPTION_KEY: envVars.ENCRYPTION_KEY || crypto.randomBytes(16).toString('hex'),
  
  // Development
  NODE_ENV: 'development',
};

// Build new .env content
let newEnvContent = '';

// Add header
newEnvContent += '# TopUpKilat Environment Configuration\n';
newEnvContent += '# Generated: ' + new Date().toISOString() + '\n\n';

// Group configs
const groups = {
  'Database': ['DATABASE_URL'],
  'Redis (Optional)': ['REDIS_URL'],
  'Authentication': ['AUTH_SECRET', 'NEXTAUTH_URL'],
  'Payment Gateway': ['PAYMENT_PROVIDER', 'PAYMENT_API_KEY', 'PAYMENT_WEBHOOK_SECRET'],
  'Top Up Provider': ['TOPUP_PROVIDER'],
  'VIP Reseller API': ['VIPRESELLER_API_KEY', 'VIPRESELLER_API_ID'],
  'Application': ['APP_BASE_URL', 'APP_NAME', 'SUPPORT_EMAIL', 'CS_WHATSAPP', 'ADMIN_API_KEY'],
  'Security': ['ENCRYPTION_KEY'],
  'Environment': ['NODE_ENV'],
};

Object.entries(groups).forEach(([groupName, keys]) => {
  newEnvContent += `# ${groupName}\n`;
  keys.forEach(key => {
    if (updates[key] !== undefined) {
      newEnvContent += `${key}=${updates[key]}\n`;
    }
  });
  newEnvContent += '\n';
});

// Write .env file
fs.writeFileSync(envPath, newEnvContent.trim() + '\n', 'utf8');

console.log('✅ File .env berhasil di-update!\n');
console.log('==================================================\n');
console.log('📋 Konfigurasi yang di-setup:\n');
console.log('1. ✅ Database URL (Supabase/PostgreSQL)');
console.log('2. ✅ Auth Secret (generated securely)');
console.log('3. ✅ Payment Provider (Mock mode)');
console.log('4. ✅ VIP Reseller Provider (configured)');
console.log('5. ✅ Admin API Key (untuk sync products)\n');
console.log('==================================================\n');
console.log('⚠️  PENTING:\n');
console.log('1. VIP Reseller API Key masih menggunakan demo/dummy');
console.log('   👉 Daftar di https://vip-reseller.co.id');
console.log('   👉 Dapatkan API Key & ID dari halaman Profile');
console.log('   👉 Update VIPRESELLER_API_KEY dan VIPRESELLER_API_ID\n');
console.log('2. Database URL masih perlu password Supabase');
console.log('   👉 Jika belum punya, gunakan PostgreSQL lokal');
console.log('   👉 Atau daftar Supabase gratis di supabase.com\n');
console.log('==================================================\n');
console.log('🎯 Next Steps:\n');
console.log('1. Restart server: npm run dev');
console.log('2. Buka: http://localhost:3001');
console.log('3. Untuk sync products (setelah dapat API key real):');
console.log('   curl http://localhost:3001/api/sync-products\n');
console.log('Admin API Key: ' + updates.ADMIN_API_KEY);
console.log('(Simpan ini untuk akses admin endpoints)\n');
