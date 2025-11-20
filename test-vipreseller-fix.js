require('dotenv').config();
const crypto = require('crypto');

console.log('\n🔍 Testing VIP-Reseller API Connection (Fixed)\n');
console.log('=======================================\n');

const apiKey = process.env.VIPRESELLER_API_KEY;
const apiId = process.env.VIPRESELLER_API_ID;

if (!apiKey || !apiId) {
  console.error('❌ VIPRESELLER_API_KEY or VIPRESELLER_API_ID not found in .env');
  process.exit(1);
}

console.log(`✅ API Key: ${apiKey.substring(0, 10)}...`);
console.log(`✅ API ID: ${apiId}\n`);

// Generate signature: md5(api_id + api_key)
const signature = crypto.createHash('md5').update(apiId + apiKey).digest('hex');
console.log(`📝 Generated Signature: ${signature}\n`);

// Test with form-encoded data instead of JSON
async function testWithFormData() {
  console.log('🔄 Testing with form-encoded data...\n');
  
  const FormData = require('form-data');
  const form = new FormData();
  form.append('key', apiKey);
  form.append('sign', signature);
  form.append('type', 'profile');
  
  try {
    const response = await fetch('https://vip-reseller.co.id/api/profile', {
      method: 'POST',
      body: form,
    });
    
    const result = await response.json();
    console.log('Profile Response:', JSON.stringify(result, null, 2));
    
    if (result.result) {
      console.log(`\n✅ API Connection successful!`);
      console.log(`💰 Balance: Rp ${result.data?.balance || 0}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Test with URLSearchParams
async function testWithURLEncoded() {
  console.log('\n🔄 Testing with URL-encoded data...\n');
  
  const params = new URLSearchParams();
  params.append('key', apiKey);
  params.append('sign', signature);
  params.append('type', 'profile');
  
  try {
    const response = await fetch('https://vip-reseller.co.id/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    
    const result = await response.json();
    console.log('Profile Response:', JSON.stringify(result, null, 2));
    
    if (result.result) {
      console.log(`\n✅ API Connection successful!`);
      console.log(`💰 Balance: Rp ${result.data?.balance || 0}`);
      console.log(`👤 Username: ${result.data?.username || 'N/A'}`);
    } else {
      console.log(`\n⚠️ ${result.message}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Test game services with URL encoded
async function testServicesURLEncoded() {
  console.log('\n📦 Testing Get Services (URL-encoded)...\n');
  
  const params = new URLSearchParams();
  params.append('key', apiKey);
  params.append('sign', signature);
  params.append('type', 'services');
  params.append('filter_type', 'game');
  
  try {
    const response = await fetch('https://vip-reseller.co.id/api/game-feature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    
    const result = await response.json();
    
    if (result.result && result.data) {
      console.log(`✅ Found ${result.data.length} products`);
      
      // Group by game
      const games = {};
      result.data.forEach(item => {
        if (!games[item.game]) {
          games[item.game] = 0;
        }
        games[item.game]++;
      });
      
      console.log('\nProducts by game:');
      const gameList = Object.entries(games).slice(0, 10);
      gameList.forEach(([game, count]) => {
        console.log(`  - ${game}: ${count} items`);
      });
      
      if (Object.keys(games).length > 10) {
        console.log(`  ... and ${Object.keys(games).length - 10} more games`);
      }
      
      // Show sample products
      console.log('\nSample products (first 5):');
      result.data.slice(0, 5).forEach(item => {
        console.log(`  - [${item.code}] ${item.name}`);
        console.log(`    Price: Rp ${item.price?.special || item.price?.basic || 'N/A'}`);
        console.log(`    Status: ${item.status}`);
      });
      
      return true;
    } else {
      console.log(`❌ Failed: ${result.message}`);
      return false;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  // Try URL-encoded format (most common for APIs)
  await testWithURLEncoded();
  
  // Test services
  const servicesWork = await testServicesURLEncoded();
  
  if (!servicesWork) {
    console.log('\n⚠️ Trying with form-data instead...');
    await testWithFormData();
  }
  
  console.log('\n=======================================');
  console.log('✨ Testing completed!\n');
  
  if (servicesWork) {
    console.log('✅ API integration is working!');
    console.log('📝 You can now sync products by visiting:');
    console.log('   http://localhost:3000/api/sync-products\n');
  } else {
    console.log('⚠️ API connection issues detected.');
    console.log('Please check:');
    console.log('1. API Key and API ID are correct');
    console.log('2. Your account is active at vip-reseller.co.id');
    console.log('3. You have sufficient balance\n');
  }
}

runTests();
