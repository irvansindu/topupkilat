// Generate secure random secret for AUTH_SECRET
const crypto = require('crypto');

const secret = crypto.randomBytes(32).toString('hex');
console.log('\n=================================');
console.log('Generated AUTH_SECRET:');
console.log(secret);
console.log('=================================\n');
console.log('Copy nilai di atas ke file .env Anda untuk AUTH_SECRET');
