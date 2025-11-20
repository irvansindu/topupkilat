'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Phone, ChevronRight, Shield, Zap, CreditCard } from 'lucide-react';

interface EWallet {
  id: string;
  slug: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  minAmount: number;
  maxAmount: number;
  denominations: number[];
}

export default function EWalletPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<string>('');

  const ewallets: EWallet[] = [
    {
      id: 'gopay',
      slug: 'gopay',
      name: 'GoPay',
      description: 'Top up saldo GoPay instant',
      color: 'from-blue-500 to-cyan-600',
      icon: '💙',
      minAmount: 10000,
      maxAmount: 10000000,
      denominations: [10000, 20000, 25000, 50000, 100000, 200000, 500000, 1000000],
    },
    {
      id: 'ovo',
      slug: 'ovo',
      name: 'OVO',
      description: 'Isi saldo OVO cepat & mudah',
      color: 'from-purple-500 to-purple-700',
      icon: '💜',
      minAmount: 10000,
      maxAmount: 10000000,
      denominations: [10000, 20000, 25000, 50000, 100000, 200000, 500000, 1000000],
    },
    {
      id: 'dana',
      slug: 'dana',
      name: 'DANA',
      description: 'Top up DANA dengan berbagai metode',
      color: 'from-blue-600 to-blue-800',
      icon: '💰',
      minAmount: 10000,
      maxAmount: 10000000,
      denominations: [10000, 20000, 25000, 50000, 100000, 200000, 500000, 1000000],
    },
    {
      id: 'shopeepay',
      slug: 'shopeepay',
      name: 'ShopeePay',
      description: 'Isi ShopeePay untuk belanja & bayar',
      color: 'from-orange-500 to-red-600',
      icon: '🧡',
      minAmount: 10000,
      maxAmount: 10000000,
      denominations: [10000, 20000, 25000, 50000, 100000, 200000, 500000, 1000000],
    },
    {
      id: 'linkaja',
      slug: 'linkaja',
      name: 'LinkAja',
      description: 'Top up LinkAja mudah & aman',
      color: 'from-red-500 to-red-700',
      icon: '❤️',
      minAmount: 10000,
      maxAmount: 10000000,
      denominations: [10000, 20000, 25000, 50000, 100000, 200000, 500000, 1000000],
    },
    {
      id: 'grab',
      slug: 'grab',
      name: 'GrabPay',
      description: 'Isi saldo Grab untuk transportasi & makanan',
      color: 'from-green-500 to-green-700',
      icon: '💚',
      minAmount: 10000,
      maxAmount: 5000000,
      denominations: [10000, 20000, 25000, 50000, 100000, 200000, 500000],
    },
  ];

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    // Auto-detect e-wallet from phone if registered
    // This would require API integration to check
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">E-Wallet Top Up</h1>
          <p className="text-lg opacity-90">
            Isi saldo e-wallet favorit Anda dengan mudah dan cepat
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Phone Input */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  Nomor HP (Opsional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="tel"
                    placeholder="08123456789"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Masukkan nomor HP yang terdaftar di e-wallet untuk proses lebih cepat
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* E-Wallet Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ewallets.map((wallet) => (
            <Link 
              key={wallet.id}
              href={`/topup/ewallet/${wallet.slug}${phoneNumber ? `?phone=${phoneNumber}` : ''}`}
            >
              <Card className={`hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer h-full ${
                selectedWallet === wallet.id ? 'ring-2 ring-purple-500' : ''
              }`}>
                <div className={`h-32 bg-gradient-to-br ${wallet.color} flex items-center justify-center text-white relative overflow-hidden`}>
                  <div className="text-6xl z-10">{wallet.icon}</div>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{wallet.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {wallet.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Min. Top Up</span>
                      <span className="font-medium">{formatPrice(wallet.minAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Max. Top Up</span>
                      <span className="font-medium">{formatPrice(wallet.maxAmount)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Wallet className="h-3 w-3" />
                      <span>Instant</span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-purple-600">
                      Top Up
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Proses Instant</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Saldo masuk dalam hitungan detik
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">100% Aman</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Transaksi terenkripsi dan terjamin
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Multi Payment</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bayar dengan berbagai metode
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Kenapa Top Up E-Wallet di TopUpKilat?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">✅ Proses Cepat & Otomatis</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sistem kami terintegrasi langsung dengan provider e-wallet untuk proses instant.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">💰 Harga Kompetitif</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Dapatkan harga terbaik tanpa biaya admin tambahan.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🔒 Keamanan Terjamin</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Data Anda aman dengan enkripsi SSL dan sistem keamanan berlapis.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🎁 Bonus & Cashback</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nikmati berbagai promo dan cashback untuk setiap transaksi.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
