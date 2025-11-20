'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, Shield, Clock, Star } from 'lucide-react';

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

// Game slug mapping
const gameMapping: Record<string, string> = {
  'mlbb': 'mobile-legends-vip',
  'mobile-legends': 'mobile-legends-vip',
  'ff': 'free-fire-vip',
  'free-fire': 'free-fire-vip',
  'pubgm': 'pubg-mobile-vip',
  'pubg-mobile': 'pubg-mobile-vip',
  'genshin': 'genshin-impact-vip',
  'genshin-impact': 'genshin-impact-vip',
  'valorant': 'valorant-vip',
  'codm': 'call-of-duty-vip',
  'call-of-duty': 'call-of-duty-vip',
};

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const gameSlug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedDenom, setSelectedDenom] = useState<string | null>(null);
  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [nickname, setNickname] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Map common game slugs to database slugs
        const dbSlug = gameMapping[gameSlug] || gameSlug;
        
        // Fetch product from database
        const response = await fetch(`/api/products/${dbSlug}`);
        if (!response.ok) {
          // If not found, try mock data
          setProduct(getMockProduct(gameSlug));
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        // Use mock data as fallback
        setProduct(getMockProduct(gameSlug));
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [gameSlug]);

  const getMockProduct = (slug: string): Product => {
    const mockProducts: Record<string, Product> = {
      'mlbb': {
        id: '1',
        slug: 'mobile-legends',
        name: 'Mobile Legends',
        description: 'Top up Diamond Mobile Legends murah dan instant!',
        instruction: 'Masukkan User ID dan Zone ID yang valid. Contoh: User ID: 12345678, Zone ID: 2685',
        iconUrl: '/icons/mlbb.png',
        denominations: [
          { id: '1', label: '55 Diamonds', amountNumeric: 55, priceSell: 10729, isPopular: false },
          { id: '2', label: '86 Diamonds', amountNumeric: 86, priceSell: 17041, isPopular: false },
          { id: '3', label: '172 Diamonds', amountNumeric: 172, priceSell: 33818, isPopular: true },
          { id: '4', label: '257 Diamonds', amountNumeric: 257, priceSell: 50454, isPopular: false },
          { id: '5', label: '344 Diamonds', amountNumeric: 344, priceSell: 67545, isPopular: false },
        ],
      },
      'ff': {
        id: '2',
        slug: 'free-fire',
        name: 'Free Fire',
        description: 'Top up Diamond Free Fire termurah se-Indonesia!',
        instruction: 'Masukkan Player ID Free Fire Anda',
        iconUrl: '/icons/ff.png',
        denominations: [
          { id: '1', label: '5 Diamonds', amountNumeric: 5, priceSell: 759, isPopular: false },
          { id: '2', label: '10 Diamonds', amountNumeric: 10, priceSell: 1467, isPopular: false },
          { id: '3', label: '50 Diamonds', amountNumeric: 50, priceSell: 7182, isPopular: true },
          { id: '4', label: '100 Diamonds', amountNumeric: 100, priceSell: 14363, isPopular: false },
          { id: '5', label: '310 Diamonds', amountNumeric: 310, priceSell: 45045, isPopular: false },
        ],
      },
      'pubgm': {
        id: '3',
        slug: 'pubg-mobile',
        name: 'PUBG Mobile',
        description: 'Top up UC PUBG Mobile dengan harga terbaik!',
        instruction: 'Masukkan User ID PUBG Mobile',
        iconUrl: '/icons/pubgm.png',
        denominations: [
          { id: '1', label: '60 UC', amountNumeric: 60, priceSell: 14589, isPopular: false },
          { id: '2', label: '325 UC', amountNumeric: 325, priceSell: 73626, isPopular: true },
          { id: '3', label: '660 UC', amountNumeric: 660, priceSell: 147252, isPopular: false },
          { id: '4', label: '1800 UC', amountNumeric: 1800, priceSell: 398000, isPopular: false },
        ],
      },
    };
    
    return mockProducts[slug] || mockProducts['mlbb'];
  };

  const verifyNickname = async () => {
    if (!userId) return;
    
    setVerifying(true);
    try {
      const response = await fetch('/api/verify/game-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: gameSlug,
          userId,
          zoneId,
        }),
      });
      
      const data = await response.json();
      if (data.valid && data.nickname) {
        setNickname(data.nickname);
      } else {
        setNickname('');
      }
    } catch (error) {
      console.error('Error verifying nickname:', error);
    } finally {
      setVerifying(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    if (!userId || !selectedDenom) {
      alert('Silakan lengkapi User ID dan pilih nominal');
      return;
    }
    
    // Store checkout data
    const checkoutData = {
      productId: product?.id,
      denominationId: selectedDenom,
      userId,
      zoneId,
      nickname,
    };
    
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product tidak ditemukan</h1>
          <Link href="/topup/game">
            <Button>Kembali ke Katalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-950 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/topup/game">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Top Up Instant & Aman</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: User Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <h2 className="ml-3 text-lg font-semibold">Masukkan Data Akun</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      User ID
                    </label>
                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      onBlur={verifyNickname}
                      placeholder="Masukkan User ID"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {gameSlug === 'mlbb' || gameSlug === 'mobile-legends' ? (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Zone ID
                      </label>
                      <input
                        type="text"
                        value={zoneId}
                        onChange={(e) => setZoneId(e.target.value)}
                        onBlur={verifyNickname}
                        placeholder="Masukkan Zone ID"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ) : null}
                  
                  {verifying && (
                    <p className="text-sm text-blue-600">Verifying nickname...</p>
                  )}
                  
                  {nickname && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        ✅ Nickname: <strong>{nickname}</strong>
                      </p>
                    </div>
                  )}
                  
                  {product.instruction && (
                    <p className="text-sm text-gray-600">{product.instruction}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Select Denomination */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <h2 className="ml-3 text-lg font-semibold">Pilih Nominal</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {product.denominations.map((denom) => (
                    <button
                      key={denom.id}
                      onClick={() => setSelectedDenom(denom.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedDenom === denom.id
                          ? 'border-blue-600 bg-blue-50 dark:bg-slate-800'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {denom.isPopular && (
                        <span className="inline-block px-2 py-1 text-xs bg-orange-500 text-white rounded-full mb-2">
                          Populer
                        </span>
                      )}
                      <p className="font-semibold text-sm">{denom.label}</p>
                      <p className="text-blue-600 font-bold mt-1">
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
                    <span className="text-gray-600">Produk</span>
                    <span className="font-medium">{product.name}</span>
                  </div>
                  
                  {selectedDenom && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Item</span>
                      <span className="font-medium">
                        {product.denominations.find(d => d.id === selectedDenom)?.label}
                      </span>
                    </div>
                  )}
                  
                  {userId && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">User ID</span>
                      <span className="font-medium">{userId}</span>
                    </div>
                  )}
                  
                  {zoneId && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Zone ID</span>
                      <span className="font-medium">{zoneId}</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-xl text-blue-600">
                      {selectedDenom 
                        ? formatPrice(product.denominations.find(d => d.id === selectedDenom)?.priceSell || 0)
                        : 'Rp 0'}
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={!userId || !selectedDenom}
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
