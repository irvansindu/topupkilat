const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n🔧 Fixing Supabase connection for migration...\n');

// Baca .env
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

// Parse DATABASE_URL
const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
if (!dbUrlMatch) {
  console.error('❌ DATABASE_URL not found in .env');
  process.exit(1);
}

let dbUrl = dbUrlMatch[1];

// Fix untuk Supabase: ganti pooler port 6543 dengan direct port 5432
if (dbUrl.includes('pooler.supabase.com:6543')) {
  const directUrl = dbUrl.replace('pooler.supabase.com:6543', 'pooler.supabase.com:5432');
  console.log('📝 Using direct connection for migration (port 5432)...\n');
  
  // Set environment variable temporarily
  process.env.DATABASE_URL = directUrl;
  
  try {
    // Run migration dengan direct connection
    console.log('Running migration...\n');
    execSync('npx prisma db push', { 
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: directUrl }
    });
    
    console.log('\n✅ Database schema created successfully!\n');
    
    // Generate client
    console.log('Generating Prisma client...\n');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('\n✅ Prisma client generated!\n');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
} else {
  // Non-Supabase database, jalankan normal
  try {
    execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
    console.log('\n✅ Migration completed!\n');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

console.log('Next step: npm run db:seed');
