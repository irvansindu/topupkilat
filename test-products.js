require('dotenv').config();
const crypto = require('crypto');

console.log('\n🔍 Testing Product Fetch from VIP-Reseller\n');

const apiKey = process.env.VIPRESELLER_API_KEY;
const apiId = process.env.VIPRESELLER_API_ID;

if (!apiKey || !apiId) {
  console.error('❌ API credentials not found');
  process.exit(1);
}

const signature = crypto.createHash('md5').update(apiId + apiKey).digest('hex');

async function fetchProducts() {
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
      console.log(`✅ Found ${result.data.length} products\n`);
      
      // Group by game and count only popular games
      const popularGames = ['Mobile Legends', 'Free Fire', 'PUBG Mobile', 'Genshin Impact', 'Valorant'];
      const filteredProducts = result.data.filter(item => 
        popularGames.some(game => item.game.includes(game))
      );
      
      console.log(`📦 Popular games: ${filteredProducts.length} products\n`);
      
      // Show some Mobile Legends products
      const mlProducts = result.data.filter(item => item.game.includes('Mobile Legends'));
      console.log(`Mobile Legends products: ${mlProducts.length}\n`);
      
      if (mlProducts.length > 0) {
        console.log('Sample ML products:');
        mlProducts.slice(0, 5).forEach(item => {
          console.log(`- [${item.code}] ${item.name} - Rp ${item.price?.special || item.price?.basic}`);
        });
      }
      
      return true;
    } else {
      console.log('❌ Failed:', result.message);
      return false;
    }
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

fetchProducts();
