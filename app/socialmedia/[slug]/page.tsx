'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, Shield, Clock, Star, User, Link2 } from 'lucide-react';

interface ServiceOption {
  id: string;
  name: string;
  description: string;
  min: number;
  max: number;
  pricePer1000: number; // harga per 1000 unit
  isPopular?: boolean;
}

interface SocialProduct {
  id: string;
  slug: string;
  platform: string;
  name: string;
  targetLabel: string;
  targetPlaceholder: string;
  note?: string;
  services: ServiceOption[];
}

export default function SocialMediaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<SocialProduct | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(100);
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Untuk sekarang pakai mock config per platform
    setProduct(getMockProduct(slug));
    setSelectedServiceId(getMockProduct(slug).services[0]?.id || null);
    setLoading(false);
  }, [slug]);

  const getMockProduct = (platformSlug: string): SocialProduct => {
    const base: Record<string, SocialProduct> = {
      instagram: {
        id: 'instagram',
        slug: 'instagram',
        platform: 'Instagram',
        name: 'Instagram Boost',
        targetLabel: 'Username Instagram',
        targetPlaceholder: 'contoh: @akun_anda',
        note: 'Pastikan akun tidak di-private agar proses berjalan lancar.',
        services: [
          {
            id: 'ig-followers',
            name: 'Real Followers Indonesia',
            description: 'Followers real, drop minim, proses cepat',
            min: 100,
            max: 100000,
            pricePer1000: 25000,
            isPopular: true,
          },
          {
            id: 'ig-likes',
            name: 'Post Likes Indonesia',
            description: 'Likes untuk 1 postingan, kualitas tinggi',
            min: 100,
            max: 50000,
            pricePer1000: 15000,
          },
          {
            id: 'ig-views',
            name: 'Reels / Video Views',
            description: 'View video / reels, cocok untuk boosting konten',
            min: 1000,
            max: 500000,
            pricePer1000: 8000,
          },
        ],
      },
      tiktok: {
        id: 'tiktok',
        slug: 'tiktok',
        platform: 'TikTok',
        name: 'TikTok Boost',
        targetLabel: 'Link Video TikTok',
        targetPlaceholder: 'https://www.tiktok.com/@username/video/...',
        note: 'Gunakan link video publik, bukan private.',
        services: [
          {
            id: 'tt-views',
            name: 'Video Views',
            description: 'Views cepat untuk video TikTok',
            min: 1000,
            max: 1000000,
            pricePer1000: 5000,
            isPopular: true,
          },
          {
            id: 'tt-likes',
            name: 'Video Likes',
            description: 'Likes berkualitas, mix worldwide',
            min: 100,
            max: 200000,
            pricePer1000: 18000,
          },
        ],
      },
      youtube: {
        id: 'youtube',
        slug: 'youtube',
        platform: 'YouTube',
        name: 'YouTube Boost',
        targetLabel: 'Link Video / Channel',
        targetPlaceholder: 'https://www.youtube.com/watch?v=...',
        note: 'Untuk subscribers gunakan link channel, untuk views gunakan link video.',
        services: [
          {
            id: 'yt-views',
            name: 'Video Views',
            description: 'Views retention bagus, aman untuk channel',
            min: 1000,
            max: 500000,
            pricePer1000: 12000,
            isPopular: true,
          },
          {
            id: 'yt-subs',
            name: 'Channel Subscribers',
            description: 'Subscribers real human mix, non-drop garansi 30 hari',
            min: 100,
            max: 50000,
            pricePer1000: 80000,
          },
        ],
      },
    };

    return base[platformSlug] || base['instagram'];
  };

  const selectedService = product?.services.find((s) => s.id === selectedServiceId) || null;

  const clampQuantity = (raw: number) => {
    if (!selectedService) return raw;
    if (raw < selectedService.min) return selectedService.min;
    if (raw > selectedService.max) return selectedService.max;
    return raw;
  };

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value.replace(/\D/g, ''), 10) || 0;
    setQuantity(clampQuantity(num));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateTotal = () => {
    if (!selectedService) return 0;
    const unit = selectedService.pricePer1000 / 1000; // price per 1 unit
    return Math.round(unit * quantity);
  };

  const handleCheckout = () => {
    if (!product || !selectedService) {
      alert('Silakan pilih layanan terlebih dahulu');
      return;
    }
    if (!target.trim()) {
      alert('Silakan isi target (username / link)');
      return;
    }
    if (quantity < selectedService.min || quantity > selectedService.max) {
      alert(`Quantity minimal ${selectedService.min} dan maksimal ${selectedService.max}`);
      return;
    }

    const total = calculateTotal();

    const checkoutData = {
      productId: product.id,
      productName: `${product.platform} - ${selectedService.name}`,
      denominationId: selectedService.id,
      denominationLabel: `${selectedService.name} x ${quantity.toLocaleString('id-ID')}`,
      amount: total,
      phone: target, // akan ditampilkan sebagai Target di checkout
      type: 'social',
    };

    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    router.push('/checkout');
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/socialmedia">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{product.platform} Booster</h1>
              <p className="text-sm opacity-90">Pilih layanan dan target untuk meningkatkan akun {product.platform}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Target */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <h2 className="ml-3 text-lg font-semibold">Data Target</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {product.platform === 'Instagram' || product.platform === 'Twitter' || product.platform === 'TikTok' ? (
                        <User className="inline h-4 w-4 mr-1" />
                      ) : (
                        <Link2 className="inline h-4 w-4 mr-1" />
                      )}
                      {product.targetLabel}
                    </label>
                    <input
                      type="text"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      placeholder={product.targetPlaceholder}
                      className="w-full px-4 py-3 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {product.note && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">ℹ️ {product.note}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Layanan & Quantity */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <h2 className="ml-3 text-lg font-semibold">Pilih Layanan & Jumlah</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {product.services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => {
                        setSelectedServiceId(service.id);
                        setQuantity(clampQuantity(quantity || service.min));
                      }}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedServiceId === service.id
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {service.isPopular && (
                        <span className="inline-block px-2 py-1 text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full mb-2">
                          Terpopuler
                        </span>
                      )}
                      <p className="font-semibold text-sm mb-1">{service.name}</p>
                      <p className="text-xs text-gray-500 mb-2">{service.description}</p>
                      <p className="text-xs text-gray-500">
                        Min {service.min.toLocaleString('id-ID')} • Max {service.max.toLocaleString('id-ID')}
                      </p>
                      <p className="text-xs text-purple-600 font-medium mt-1">
                        {formatPrice(service.pricePer1000)} / 1000
                      </p>
                    </button>
                  ))}
                </div>

                {selectedService && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium">
                      Jumlah ({selectedService.min.toLocaleString('id-ID')} - {selectedService.max.toLocaleString('id-ID')})
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 max-w-xs"
                    />
                    <p className="text-xs text-gray-500">
                      Total akan dihitung otomatis berdasarkan jumlah yang diinput.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Ringkasan Pesanan</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Platform</span>
                    <span className="font-medium">{product.platform}</span>
                  </div>

                  {selectedService && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Layanan</span>
                      <span className="font-medium text-right">
                        {selectedService.name}
                      </span>
                    </div>
                  )}

                  {quantity > 0 && selectedService && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Jumlah</span>
                      <span className="font-medium">{quantity.toLocaleString('id-ID')}</span>
                    </div>
                  )}

                  {target && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Target</span>
                      <span className="font-medium text-xs max-w-[180px] text-right break-words">
                        {target}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-xl text-purple-600">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={!selectedService || !target || quantity <= 0}
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
                    Proses 0-1 Jam
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    Banyak digunakan oleh creator & online shop
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
