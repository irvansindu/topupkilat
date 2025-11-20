# TopUpKilat - Production-Ready Game & E-Wallet Top Up Marketplace

🚀 **Production-ready marketplace untuk top up game, e-wallet, pulsa & data dengan sistem pembayaran otomatis, antrian pemrosesan, dan keamanan tingkat enterprise.**

## 🎯 Fitur Utama

### Untuk Pengguna
- ✅ Top up game populer (Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, dll)
- ✅ Top up e-wallet (ShopeePay, DANA, OVO, GoPay, LinkAja)
- ✅ Isi pulsa & paket data (Telkomsel, Indosat, XL, Tri, Smartfren)
- ✅ Multiple payment methods (QRIS, Bank Transfer, E-Wallet)
- ✅ Real-time order tracking dengan status update
- ✅ Promo code support dengan validasi otomatis
- ✅ Mobile-first responsive design

### Untuk Admin
- 🔐 Dashboard admin dengan RBAC & 2FA
- 📊 Monitoring semua transaksi real-time
- 🔄 Retry mechanism untuk transaksi gagal
- 📦 Manajemen stok voucher
- 💰 Pengaturan harga & margin dinamis
- 📝 Log audit & deteksi fraud dasar
- ⚙️ Konfigurasi payment gateway & provider

## 🧱 Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Prisma ORM
- **Database**: PostgreSQL
- **Queue**: Redis + BullMQ
- **Auth**: NextAuth.js dengan RBAC & 2FA TOTP
- **Payment**: Modular adapter system (Mock, Xendit, Midtrans)
- **Container**: Docker & Docker Compose

## 📁 Struktur Proyek

```
topupkilat/
├── app/
│   ├── (public)/          # Halaman publik
│   ├── api/               # API routes
│   │   ├── orders/
│   │   ├── webhooks/
│   │   └── verify/
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Admin dashboard
│   └── topup/            # Product catalogs
├── components/
│   └── ui/               # Reusable UI components
├── lib/
│   ├── payment/          # Payment gateway adapters
│   ├── topup/           # Topup provider adapters
│   ├── queue/           # Queue configuration
│   └── utils.ts         # Utility functions
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed data
├── workers/             # Background job processors
├── public/              # Static assets
└── docker-compose.yml   # Container orchestration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL (jika tidak menggunakan Docker)
- Redis (jika tidak menggunakan Docker)

### 1. Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd topupkilat

# Install dependencies
npm install

# Setup environment variables
cp env.example .env
# Edit .env dengan konfigurasi Anda
```

### 2. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database dengan data sample
npx prisma db seed
```

### 3. Run Development

```bash
# Jalankan PostgreSQL & Redis (jika belum ada)
docker-compose up -d postgres redis

# Jalankan development server
npm run dev

# Buka http://localhost:3000
```

### 4. Run Production dengan Docker

```bash
# Build dan jalankan semua services
docker-compose up -d

# Aplikasi akan berjalan di http://localhost:3000
```

## 📝 Environment Variables

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/topupkilat

# Redis
REDIS_URL=redis://localhost:6379

# Auth
AUTH_SECRET=your-secret-key-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Payment Provider
PAYMENT_PROVIDER=mock|xendit|midtrans
PAYMENT_API_KEY=your-payment-api-key
PAYMENT_WEBHOOK_SECRET=your-webhook-secret

# Topup Provider
TOPUP_PROVIDER=mock|aggregator
TOPUP_API_KEY=your-topup-api-key
TOPUP_API_SECRET=your-topup-api-secret

# Application
APP_BASE_URL=http://localhost:3000
APP_NAME=TopUpKilat
```

## 🧪 Test Accounts

Setelah menjalankan seed:

- **Admin**: admin@topupkilat.example / admin123
- **User**: user@example.com / user123

## 🔐 Security Features

- ✅ CSRF Protection
- ✅ Rate Limiting
- ✅ Input validation dengan Zod
- ✅ HMAC signature verification untuk webhooks
- ✅ Idempotency keys untuk prevent duplicate
- ✅ 2FA untuk admin accounts
- ✅ Encrypted sensitive data storage
- ✅ SQL injection protection via Prisma ORM
- ✅ XSS protection dengan React

## 🔄 API Endpoints

### Public API
- `POST /api/orders` - Create new order
- `GET /api/orders?code=xxx&email=xxx` - Get order status
- `POST /api/verify/game-id` - Verify game account
- `GET /api/orders/{code}/pay` - Get payment URL/QR

### Webhook Endpoints
- `POST /api/webhooks/payment` - Payment gateway callback
- `POST /api/webhooks/provider` - Topup provider callback

### Admin API (Protected)
- `GET /api/admin/orders` - List all orders
- `POST /api/admin/orders/{id}/retry` - Retry failed order
- `GET /api/admin/products` - List products
- `PUT /api/admin/products/{id}` - Update product

## 🧮 Pricing Engine

Harga dihitung server-side dengan formula:
```
Total = Base Price + Flat Fee + (Percentage Fee × Base Price) - Promo Discount
```

## 📊 Queue Jobs

BullMQ workers memproses:
- `fulfill-topup` - Proses top up setelah payment
- `payment-webhook` - Process payment callbacks
- `send-notification` - Kirim email/WhatsApp
- `refund-order` - Process refunds

## 🏗️ Arsitektur

```
User → Next.js Frontend → API Routes → Database
                ↓
        Payment Gateway
                ↓
        Webhook Handler → Queue → Worker
                                    ↓
                            Topup Provider
```

## 📱 Responsive Design

- Mobile-first approach
- PWA-ready
- Dark mode support
- Optimized for Indonesian market

## 🚢 Deployment

### Vercel (Recommended untuk Next.js)
```bash
vercel deploy
```

### Docker
```bash
docker build -t topupkilat .
docker run -p 3000:3000 topupkilat
```

### VPS dengan PM2
```bash
npm run build
pm2 start npm --name "topupkilat" -- start
```

## 📈 Monitoring

- Health check: `/api/health`
- Metrics: Integrate dengan Prometheus/Grafana
- Logs: Structured logging dengan Pino
- Error tracking: Sentry integration ready

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - lihat LICENSE file

## 💬 Support

- Email: support@topupkilat.example
- WhatsApp: +62-xxx-xxxx-xxxx
- Documentation: /docs

## 🎯 Roadmap

- [ ] Multi-language support (EN, ID)
- [ ] Mobile app (React Native)
- [ ] Webhook retry dengan exponential backoff
- [ ] Advanced fraud detection dengan ML
- [ ] Affiliate system
- [ ] Loyalty program
- [ ] Live chat support
- [ ] Analytics dashboard

## ⚠️ Production Checklist

Sebelum deploy ke production:

- [ ] Ganti semua secret keys
- [ ] Setup proper SSL/TLS
- [ ] Configure rate limiting
- [ ] Setup monitoring & alerts
- [ ] Database backups
- [ ] Load testing
- [ ] Security audit
- [ ] GDPR/privacy compliance
- [ ] Terms of Service & Privacy Policy

---

Built with ❤️ for the Indonesian gaming community
