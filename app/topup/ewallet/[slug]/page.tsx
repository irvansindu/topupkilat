'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, ShoppingCart, Shield, Clock, Star } from 'lucide-react';

interface Denomination {
  id: string;
  label: string;
  amountNumeric: number;
  priceSell: number;
  isPopular?: boolean;
}

interface EWalletProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  instruction: string;
  icon: string;
  denominations: Denomination[];
}

export default function EWalletDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<EWalletProduct | null>(null);
  const [selectedDenom, setSelectedDenom] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  function getMockProduct(targetSlug: string): EWalletProduct {
    const base: Record<string, EWalletProduct> = {
      gopay: {
        id: 'gopay',
        slug: 'gopay',
        name: 'GoPay',
        description: 'Top up saldo GoPay instant 24 jam',
        instruction: 'Masukkan nomor HP yang terdaftar di aplikasi Gojek.',
        icon: '💙',
        denominations: [
          { id: '1', label: 'Rp 10.000', amountNumeric: 10000, priceSell: 10500, isPopular: false },
          { id: '2', label: 'Rp 25.000', amountNumeric: 25000, priceSell: 25500, isPopular: true },
          { id: '3', label: 'Rp 50.000', amountNumeric: 50000, priceSell: 50500, isPopular: true },
          { id: '4', label: 'Rp 100.000', amountNumeric: 100000, priceSell: 100500, isPopular: true },
          { id: '5', label: 'Rp 200.000', amountNumeric: 200000, priceSell: 200500, isPopular: false },
        ],
      },
      ovo: {
        id: 'ovo',
        slug: 'ovo',
        name: 'OVO',
        description: 'Isi saldo OVO cepat & mudah',
        instruction: 'Masukkan nomor HP yang terdaftar di OVO.',
        icon: '💜',
        denominations: [
          { id: '1', label: 'Rp 10.000', amountNumeric: 10000, priceSell: 10500, isPopular: false },
          { id: '2', label: 'Rp 25.000', amountNumeric: 25000, priceSell: 25500, isPopular: true },
          { id: '3', label: 'Rp 50.000', amountNumeric: 50000, priceSell: 50500, isPopular: true },
          { id: '4', label: 'Rp 100.000', amountNumeric: 100000, priceSell: 100500, isPopular: true },
        ],
      },
      dana: {
        id: 'dana',
        slug: 'dana',
        name: 'DANA',
        description: 'Top up saldo DANA dengan berbagai metode pembayaran',
        instruction: 'Masukkan nomor HP akun DANA Anda.',
        icon: '💰',
        denominations: [
          { id: '1', label: 'Rp 10.000', amountNumeric: 10000, priceSell: 10500, isPopular: false },
          { id: '2', label: 'Rp 20.000', amountNumeric: 20000, priceSell: 20500, isPopular: false },
          { id: '3', label: 'Rp 50.000', amountNumeric: 50000, priceSell: 50500, isPopular: true },
          { id: '4', label: 'Rp 100.000', amountNumeric: 100000, priceSell: 100500, isPopular: true },
        ],
      },
      shopeepay: {
        id: 'shopeepay',
        slug: 'shopeepay',
        name: 'ShopeePay',
        description: 'Isi saldo ShopeePay untuk belanja & bayar tagihan',
        instruction: 'Masukkan nomor HP yang terdaftar di Shopee.',
        icon: '🧡',
        denominations: [
          { id: '1', label: 'Rp 10.000', amountNumeric: 10000, priceSell: 10500, isPopular: false },
          { id: '2', label: 'Rp 25.000', amountNumeric: 25000, priceSell: 25500, isPopular: true },
          { id: '3', label: 'Rp 50.000', amountNumeric: 50000, priceSell: 50500, isPopular: true },
          { id: '4', label: 'Rp 100.000', amountNumeric: 100000, priceSell: 100500, isPopular: true },
        ],
      },
      linkaja: {
        id: 'linkaja',
        slug: 'linkaja',
        name: 'LinkAja',
        description: 'Top up LinkAja mudah & aman',
        instruction: 'Masukkan nomor HP akun LinkAja Anda.',
        icon: '❤️',
        denominations: [
          { id: '1', label: 'Rp 10.000', amountNumeric: 10000, priceSell: 10500, isPopular: false },
          { id: '2', label: 'Rp 25.000', amountNumeric: 25000, priceSell: 25500, isPopular: true },
          { id: '3', label: 'Rp 50.000', amountNumeric: 50000, priceSell: 50500, isPopular: true },
        ],
      },
      grab: {
        id: 'grab',
        slug: 'grab',
        name: 'GrabPay',
        description: 'Isi saldo Grab untuk transportasi & makanan',
        instruction: 'Masukkan nomor HP yang terdaftar di aplikasi Grab.',
        icon: '💚',
        denominations: [
          { id: '1', label: 'Rp 20.000', amountNumeric: 20000, priceSell: 20500, isPopular: false },
          { id: '2', label: 'Rp 50.000', amountNumeric: 50000, priceSell: 50500, isPopular: true },
          { id: '3', label: 'Rp 100.000', amountNumeric: 100000, priceSell: 100500, isPopular: true },
        ],
      },
    };

    return base[targetSlug] || base['gopay'];
  }

  function validatePhoneNumber(value: string) {
    const clean = value.replace(/\D/g, '');
    setIsValid(clean.length >= 10 && clean.length <= 13);
  }

  function handlePhoneChange(value: string) {
    setPhoneNumber(value);
    validatePhoneNumber(value);
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  }

  function handleCheckout() {
    if (!phoneNumber || !selectedDenom || !isValid || !product) {
      alert('Silakan isi nomor HP yang valid dan pilih nominal top up');
      return;
    }

    const selected = product.denominations.find(d => d.id === selectedDenom);

    const checkoutData = {
      productId: product.id,
      productName: `Top Up ${product.name}`,
      denominationId: selectedDenom,
      denominationLabel: selected?.label,
      amount: selected?.priceSell,
      phone: phoneNumber,
      type: 'ewallet',
    };

    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    router.push('/checkout');
  }

  useEffect(() => {
    const init = () => {
      // Prefill phone from query param
      const phone = searchParams.get('phone');
      if (phone) {
        setPhoneNumber(phone);
        validatePhoneNumber(phone);
      }

      // For now we use static config (mock) for e-wallet
      setProduct(getMockProduct(slug));
      setLoading(false);
    };

    // Run async to avoid synchronous setState warning
    const timer = setTimeout(init, 0);
    return () => clearTimeout(timer);
  }, [slug, searchParams]);

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/topup/ewallet">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-sm opacity-90">{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Phone Number */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <h2 className="ml-3 text-lg font-semibold">Nomor HP</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Nomor HP (Akun {product.name})
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="08123456789"
                      className="w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {phoneNumber && (
                    <div
                      className={`p-3 rounded-lg border ${
                        isValid
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <p
                        className={`text-sm ${
                          isValid ? 'text-green-800' : 'text-red-800'
                        }`}
                      >
                        {isValid
                          ? 'Nomor HP valid'
                          : 'Nomor HP tidak valid, pastikan 10-13 digit'}
                      </p>
                    </div>
                  )}

                  {product.instruction && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">ℹ️ {product.instruction}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Select Amount */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <h2 className="ml-3 text-lg font-semibold">Pilih Nominal</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {product.denominations.map((denom) => (
                    <button
                      key={denom.id}
                      onClick={() => setSelectedDenom(denom.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-center ${
                        selectedDenom === denom.id
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {denom.isPopular && (
                        <span className="inline-block px-2 py-1 text-xs bg-orange-500 text-white rounded-full mb-2">
                          Populer
                        </span>
                      )}
                      <p className="font-semibold text-sm">{denom.label}</p>
                      <p className="text-purple-600 font-bold mt-1">
                        {formatPrice(denom.priceSell)}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Ringkasan Pesanan</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">E-Wallet</span>
                    <span className="font-medium">{product.name}</span>
                  </div>

                  {selectedDenom && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Nominal</span>
                      <span className="font-medium">
                        {product.denominations.find((d) => d.id === selectedDenom)?.label}
                      </span>
                    </div>
                  )}

                  {phoneNumber && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Nomor HP</span>
                      <span className="font-medium">{phoneNumber}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-xl text-purple-600">
                      {selectedDenom
                        ? formatPrice(
                            product.denominations.find((d) => d.id === selectedDenom)?.priceSell || 0
                          )
                        : 'Rp 0'}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={!phoneNumber || !selectedDenom || !isValid}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Lanjut ke Pembayaran
                </Button>

                <div className="mt-6 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield className="h-4 w-4 mr-2 text-green-600" />
                    Pembayaran 100% Aman
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-blue-600" />
                    Proses 1-5 Menit
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    Terpercaya sejak 2020
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
