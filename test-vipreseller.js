require('dotenv').config();
const crypto = require('crypto');

console.log('\n🔍 Testing VIP-Reseller API Connection\n');
console.log('=======================================\n');

const apiKey = process.env.VIPRESELLER_API_KEY;
const apiId = process.env.VIPRESELLER_API_ID;

if (!apiKey || !apiId) {
  console.error('❌ VIPRESELLER_API_KEY or VIPRESELLER_API_ID not found in .env');
  process.exit(1);
}

console.log(`✅ API Key: ${apiKey.substring(0, 10)}...`);
console.log(`✅ API ID: ${apiId}\n`);

// Generate signature
const signature = crypto.createHash('md5').update(apiId + apiKey).digest('hex');
console.log(`📝 Generated Signature: ${signature}\n`);

// Test 1: Get Profile/Balance
async function testProfile() {
  console.log('📊 Testing Get Profile/Balance...');
  
  try {
    const response = await fetch('https://vip-reseller.co.id/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: apiKey,
        sign: signature,
        type: 'profile',
      }),
    });

    const result = await response.json();
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (result.result) {
      console.log(`\n✅ API Connection successful!`);
      console.log(`💰 Balance: Rp ${result.data?.balance || 0}`);
      console.log(`👤 Username: ${result.data?.username || 'N/A'}`);
    } else {
      console.log(`\n❌ API Error: ${result.message}`);
    }
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

// Test 2: Get Services/Products
async function testServices() {
  console.log('\n📦 Testing Get Services...');
  
  try {
    const response = await fetch('https://vip-reseller.co.id/api/game-feature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: apiKey,
        sign: signature,
        type: 'services',
        filter_type: 'game',
      }),
    });

    const result = await response.json();
    
    if (result.result && result.data) {
      console.log(`\n✅ Found ${result.data.length} products`);
      
      // Group by game
      const games = {};
      result.data.forEach(item => {
        if (!games[item.game]) {
          games[item.game] = 0;
        }
        games[item.game]++;
      });
      
      console.log('\nProducts by game:');
      Object.entries(games).forEach(([game, count]) => {
        console.log(`  - ${game}: ${count} items`);
      });
      
      // Show sample products
      console.log('\nSample products (first 5):');
      result.data.slice(0, 5).forEach(item => {
        console.log(`  - [${item.code}] ${item.name} - Rp ${item.price.special}`);
      });
    } else {
      console.log(`\n❌ Failed to get products: ${result.message}`);
    }
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

// Test 3: Check specific game nickname (Mobile Legends)
async function testNickname() {
  console.log('\n🎮 Testing Get Nickname (Mobile Legends)...');
  
  try {
    const response = await fetch('https://vip-reseller.co.id/api/game-feature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: apiKey,
        sign: signature,
        type: 'get-nickname',
        code: 'ML', // Mobile Legends code
        data: '12345678', // Test user ID
        data_zone: '2685', // Test zone ID
      }),
    });

    const result = await response.json();
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (result.result) {
      console.log(`\n✅ Nickname check successful`);
      if (result.data?.nickname) {
        console.log(`👤 Nickname: ${result.data.nickname}`);
      }
    } else {
      console.log(`\n⚠️ ${result.message || 'User not found (expected for test ID)'}`);
    }
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

// Run all tests
async function runTests() {
  await testProfile();
  await testServices();
  await testNickname();
  
  console.log('\n=======================================');
  console.log('✨ Testing completed!\n');
}

runTests();
