# Integrasi VIP-Reseller API ke TopUpKilat

## 📝 Tentang VIP-Reseller

VIP-Reseller (https://vip-reseller.co.id) adalah platform H2H (Host to Host) untuk produk digital termasuk:
- **Top Up Game**: Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, dll
- **Streaming**: Netflix, Spotify, YouTube Premium, Disney+, dll
- **E-Wallet**: GoPay, OVO, DANA, ShopeePay, dll
- **Pulsa & Paket Data**: Semua operator Indonesia

## 🚀 Setup Integrasi

### 1. Daftar Akun VIP-Reseller

1. Kunjungi https://vip-reseller.co.id
2. Daftar sebagai reseller
3. Dapatkan API credentials:
   - **API Key**: Dapat dilihat di halaman Profile
   - **API ID**: Dapat dilihat di halaman Profile

### 2. Konfigurasi Environment Variables

Edit file `.env` dan tambahkan:

```env
# Ganti dengan provider vipreseller
TOPUP_PROVIDER=vipreseller

# VIP Reseller API Credentials
VIPRESELLER_API_KEY=your-api-key-here
VIPRESELLER_API_ID=your-api-id-here
```

### 3. Test Koneksi API

```bash
# Test fetch products dari VIP Reseller
curl http://localhost:3001/api/sync-products

# Test verify game nickname
curl -X POST http://localhost:3001/api/verify/game-id \
  -H "Content-Type: application/json" \
  -d '{"game":"mobile-legends","userId":"12345678","zoneId":"2685"}'
```

## 📚 API Endpoints yang Tersedia

### 1. Order Top Up Game/Streaming

**Endpoint**: `POST /api/orders`

```json
{
  "productId": "product-id-from-db",
  "denominationId": "denomination-id",
  "target": {
    "userId": "12345678",
    "zoneId": "2685"
  },
  "email": "customer@example.com",
  "whatsapp": "081234567890"
}
```

### 2. Check Nickname Game

**Endpoint**: `POST /api/verify/game-id`

```json
{
  "game": "mobile-legends",
  "userId": "12345678", 
  "zoneId": "2685"
}
```

**Response**:
```json
{
  "valid": true,
  "nickname": "PlayerName",
  "message": "User ID valid"
}
```

### 3. Sync Products dari VIP Reseller

**Endpoint**: `GET /api/sync-products`

Endpoint ini akan:
1. Fetch semua produk dari VIP Reseller
2. Sync ke database lokal
3. Update harga jika ada perubahan

**Response**:
```json
{
  "message": "Products synced successfully",
  "synced": [
    { "name": "Mobile Legends", "items": 25 },
    { "name": "Free Fire", "items": 15 }
  ],
  "total": 150,
  "games": ["Mobile Legends", "Free Fire", "PUBG Mobile"]
}
```

## 🔄 Flow Transaksi

1. **Customer Order**:
   - Customer pilih produk & nominal
   - Verify game ID (optional)
   - Create order & payment

2. **Payment Success**:
   - Payment gateway callback
   - Queue fulfill topup job

3. **Process Top Up**:
   - Worker ambil job dari queue
   - Call VIP Reseller API untuk fulfill
   - Update order status

4. **Check Status**:
   - Periodic check untuk order processing
   - Update status jika completed

## 🎮 Game yang Didukung

### Mobile Games
- Mobile Legends (ML/MLBB)
- Free Fire (FF)
- PUBG Mobile (PUBGM)
- Call of Duty Mobile (CODM)
- Arena of Valor (AOV)
- League of Legends: Wild Rift
- Genshin Impact
- Honkai Impact/Star Rail

### PC Games
- Valorant
- League of Legends
- Steam Wallet
- Garena Shells

### Streaming Services
- Netflix
- Spotify Premium
- YouTube Premium
- Disney+ Hotstar
- Vidio Premier
- WeTV VIP

## 🔧 Troubleshooting

### Error: "Authentication failed"
- Pastikan API Key dan API ID sudah benar
- Check saldo di VIP Reseller

### Error: "Product not found"
- Run sync products: `GET /api/sync-products`
- Pastikan produk aktif di VIP Reseller

### Error: "User ID not found"
- Pastikan format User ID benar
- Untuk ML: perlu User ID + Zone ID
- Untuk FF: hanya Player ID

## 📊 Monitoring

### Check Order Status
```typescript
// Check order status dari VIP Reseller
const provider = createVipResellerProvider(config);
const status = await provider.checkStatus('VIP-TRX-ID');
```

### Check Balance
```typescript
const balance = await provider.getBalance();
console.log(`Saldo: Rp ${balance.balance}`);
```

## 💰 Pricing & Margin

Harga dari VIP Reseller sudah termasuk fee mereka. Anda bisa tambahkan margin:

```typescript
// Pricing calculation
const vipPrice = 100000;  // Harga dari VIP Reseller
const margin = 0.05;      // 5% margin
const sellPrice = Math.ceil(vipPrice * (1 + margin));
```

## 🔐 Security

1. **API Credentials**: Simpan di environment variables, jangan hardcode
2. **Webhook Validation**: VIP Reseller belum provide webhook signature
3. **Rate Limiting**: Implement rate limiting untuk prevent abuse
4. **Idempotency**: Gunakan idempotency key untuk prevent duplicate order

## 📞 Support

- **VIP Reseller Support**: https://vip-reseller.co.id/page/contact
- **WhatsApp**: Check di website mereka
- **Telegram**: @vipreseller_support (example)

## 🚦 Status Codes

| Status | Description |
|--------|------------|
| `waiting` | Order diterima, menunggu proses |
| `process` | Sedang diproses |
| `success` | Berhasil |
| `error` | Gagal, check note untuk detail |
| `partial` | Sebagian berhasil (untuk bulk order) |

## 📈 Best Practices

1. **Sync Products Daily**: Jalankan sync products setiap hari untuk update harga
2. **Handle Errors Gracefully**: Always provide fallback untuk customer
3. **Log Everything**: Log semua transaksi untuk audit trail
4. **Monitor Balance**: Set alert jika saldo < threshold
5. **Test in Sandbox**: Test dulu dengan amount kecil sebelum production

## 🔗 Useful Links

- API Documentation: https://vip-reseller.co.id/page/api/game-feature
- Product List: https://vip-reseller.co.id/page/product
- Monitoring: https://vip-reseller.co.id/page/monitoring/game-feature
- Check Region MLBB: https://vip-reseller.co.id/page/stalk-ml

---

**Note**: Pastikan untuk test integrasi dengan amount kecil dulu sebelum go live ke production!
