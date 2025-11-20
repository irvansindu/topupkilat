'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, Shield, Clock, Star, Mail, Phone } from 'lucide-react';

interface Denomination {
  id: string;
  code?: string;
  label: string;
  amountNumeric: number;
  priceSell: number;
  isPopular?: boolean;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  instruction?: string;
  iconUrl?: string;
  denominations: Denomination[];
}

export default function StreamingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const streamingSlug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedDenom, setSelectedDenom] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Try to fetch from database
        const response = await fetch(`/api/products/${streamingSlug}`);
        if (!response.ok) {
          // Use mock data as fallback
          setProduct(getMockProduct(streamingSlug));
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(getMockProduct(streamingSlug));
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [streamingSlug]);

  const getMockProduct = (slug: string): Product => {
    const mockProducts: Record<string, Product> = {
      'netflix': {
        id: '1',
        slug: 'netflix',
        name: 'Netflix Premium',
        description: 'Streaming film & series tanpa batas',
        instruction: 'Masukkan email Netflix Anda. Kami akan mengirimkan voucher ke email tersebut.',
        iconUrl: '/icons/netflix.png',
        denominations: [
          { id: '1', label: 'Mobile 1 Bulan', amountNumeric: 1, priceSell: 54000, isPopular: false },
          { id: '2', label: 'Basic 1 Bulan', amountNumeric: 1, priceSell: 120000, isPopular: false },
          { id: '3', label: 'Standard 1 Bulan', amountNumeric: 1, priceSell: 165000, isPopular: true },
          { id: '4', label: 'Premium 1 Bulan', amountNumeric: 1, priceSell: 195000, isPopular: false },
        ],
      },
      'spotify': {
        id: '2',
        slug: 'spotify',
        name: 'Spotify Premium',
        description: 'Dengarkan musik tanpa iklan',
        instruction: 'Masukkan email Spotify Anda untuk aktivasi premium.',
        iconUrl: '/icons/spotify.png',
        denominations: [
          { id: '1', label: 'Individual 1 Bulan', amountNumeric: 1, priceSell: 55000, isPopular: true },
          { id: '2', label: 'Individual 3 Bulan', amountNumeric: 3, priceSell: 160000, isPopular: false },
          { id: '3', label: 'Duo 1 Bulan', amountNumeric: 1, priceSell: 70000, isPopular: false },
          { id: '4', label: 'Family 1 Bulan', amountNumeric: 1, priceSell: 85000, isPopular: false },
        ],
      },
      'youtube-premium': {
        id: '3',
        slug: 'youtube-premium',
        name: 'YouTube Premium',
        description: 'YouTube tanpa iklan + YouTube Music',
        instruction: 'Masukkan email Google yang terhubung dengan YouTube.',
        iconUrl: '/icons/youtube.png',
        denominations: [
          { id: '1', label: 'Student 1 Bulan', amountNumeric: 1, priceSell: 35000, isPopular: false },
          { id: '2', label: 'Individual 1 Bulan', amountNumeric: 1, priceSell: 59000, isPopular: true },
          { id: '3', label: 'Individual 3 Bulan', amountNumeric: 3, priceSell: 170000, isPopular: false },
          { id: '4', label: 'Family 1 Bulan', amountNumeric: 1, priceSell: 89000, isPopular: false },
        ],
      },
      'disney-plus': {
        id: '4',
        slug: 'disney-plus',
        name: 'Disney+ Hotstar',
        description: 'Film Disney, Marvel, Star Wars & lebih',
        instruction: 'Masukkan email atau nomor HP untuk aktivasi.',
        iconUrl: '/icons/disney.png',
        denominations: [
          { id: '1', label: 'Mobile 1 Bulan', amountNumeric: 1, priceSell: 39000, isPopular: false },
          { id: '2', label: 'Basic 1 Bulan', amountNumeric: 1, priceSell: 69000, isPopular: true },
          { id: '3', label: 'Premium 1 Bulan', amountNumeric: 1, priceSell: 99000, isPopular: false },
          { id: '4', label: 'Premium 1 Tahun', amountNumeric: 12, priceSell: 999000, isPopular: false },
        ],
      },
      'vidio': {
        id: '5',
        slug: 'vidio',
        name: 'Vidio Premier',
        description: 'Nonton Liga Inggris, Champions League & film',
        instruction: 'Masukkan email atau nomor HP Vidio Anda.',
        iconUrl: '/icons/vidio.png',
        denominations: [
          { id: '1', label: 'Premier Platinum 1 Bulan', amountNumeric: 1, priceSell: 79000, isPopular: true },
          { id: '2', label: 'Premier Platinum 3 Bulan', amountNumeric: 3, priceSell: 229000, isPopular: false },
          { id: '3', label: 'Premier Diamond 1 Bulan', amountNumeric: 1, priceSell: 109000, isPopular: false },
          { id: '4', label: 'Premier Platinum 1 Tahun', amountNumeric: 12, priceSell: 679000, isPopular: false },
        ],
      },
      'wetv': {
        id: '6',
        slug: 'wetv',
        name: 'WeTV VIP',
        description: 'Nonton drama Asia & anime tanpa iklan',
        instruction: 'Masukkan email atau nomor HP WeTV Anda.',
        iconUrl: '/icons/wetv.png',
        denominations: [
          { id: '1', label: 'VIP 1 Bulan', amountNumeric: 1, priceSell: 49000, isPopular: true },
          { id: '2', label: 'VIP 3 Bulan', amountNumeric: 3, priceSell: 139000, isPopular: false },
          { id: '3', label: 'VIP 1 Tahun', amountNumeric: 12, priceSell: 399000, isPopular: false },
        ],
      },
    };
    
    return mockProducts[slug] || mockProducts['netflix'];
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getIcon = (slug: string) => {
    const icons: Record<string, string> = {
      'netflix': '🎬',
      'spotify': '🎵',
      'youtube': '📺',
      'disney': '🏰',
      'vidio': '⚽',
      'wetv': '🎭',
    };
    
    for (const [key, icon] of Object.entries(icons)) {
      if (slug.includes(key)) return icon;
    }
    return '📺';
  };

  const handleCheckout = () => {
    if (!email || !selectedDenom) {
      alert('Silakan lengkapi email dan pilih paket berlangganan');
      return;
    }
    const selected = product?.denominations.find(d => d.id === selectedDenom);

    // Store checkout data
    const checkoutData = {
      productId: product?.id,
      productName: product?.name,
      denominationId: selectedDenom,
      denominationLabel: selected?.label,
      amount: selected?.priceSell,
      email,
      phone,
      type: 'streaming',
    };
    
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service tidak ditemukan</h1>
          <Link href="/topup/streaming">
            <Button>Kembali ke Katalog Streaming</Button>
          </Link>
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
            <Link href="/topup/streaming">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <span className="text-4xl">{getIcon(product.slug)}</span>
              <div>
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <p className="text-sm opacity-90">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Account Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <h2 className="ml-3 text-lg font-semibold">Informasi Akun</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Nomor HP (Opsional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08123456789"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  {product.instruction && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">ℹ️ {product.instruction}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Select Package */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <h2 className="ml-3 text-lg font-semibold">Pilih Paket Berlangganan</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-3">
                  {product.denominations.map((denom) => (
                    <button
                      key={denom.id}
                      onClick={() => setSelectedDenom(denom.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedDenom === denom.id
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{denom.label}</p>
                          {denom.isPopular && (
                            <span className="inline-block px-2 py-1 text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full mt-1">
                              Terpopuler
                            </span>
                          )}
                        </div>
                        <p className="text-purple-600 font-bold">
                          {formatPrice(denom.priceSell)}
                        </p>
                      </div>
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
                    <span className="text-gray-600">Service</span>
                    <span className="font-medium">{product.name}</span>
                  </div>
                  
                  {selectedDenom && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Paket</span>
                      <span className="font-medium">
                        {product.denominations.find(d => d.id === selectedDenom)?.label}
                      </span>
                    </div>
                  )}
                  
                  {email && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Email</span>
                      <span className="font-medium text-xs">{email}</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-xl text-purple-600">
                      {selectedDenom 
                        ? formatPrice(product.denominations.find(d => d.id === selectedDenom)?.priceSell || 0)
                        : 'Rp 0'}
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={!email || !selectedDenom}
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
                    Aktivasi 1-5 Menit
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
