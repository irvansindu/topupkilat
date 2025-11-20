'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Star, Clock, Play, Music, Tv, Film } from 'lucide-react';

interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  iconUrl?: string;
  _count?: {
    denominations: number;
  };
}

export default function StreamingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreamingProducts();
  }, []);

  const fetchStreamingProducts = async () => {
    try {
      const response = await fetch('/api/products?type=STREAMING');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        // Use mock data as fallback
        setProducts(getMockProducts());
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(getMockProducts());
    } finally {
      setLoading(false);
    }
  };

  const getMockProducts = (): Product[] => {
    return [
      {
        id: '1',
        slug: 'netflix',
        name: 'Netflix Premium',
        description: 'Berlangganan Netflix Premium dengan harga terbaik',
        iconUrl: '/icons/netflix.png',
      },
      {
        id: '2',
        slug: 'spotify',
        name: 'Spotify Premium',
        description: 'Berlangganan Spotify Premium tanpa iklan',
        iconUrl: '/icons/spotify.png',
      },
      {
        id: '3',
        slug: 'youtube-premium',
        name: 'YouTube Premium',
        description: 'YouTube tanpa iklan + YouTube Music',
        iconUrl: '/icons/youtube.png',
      },
      {
        id: '4',
        slug: 'disney-plus',
        name: 'Disney+ Hotstar',
        description: 'Streaming film Disney, Marvel, Star Wars & lebih',
        iconUrl: '/icons/disney.png',
      },
      {
        id: '5',
        slug: 'vidio',
        name: 'Vidio Premier',
        description: 'Nonton Liga Inggris, Champions League & film',
        iconUrl: '/icons/vidio.png',
      },
      {
        id: '6',
        slug: 'wetv',
        name: 'WeTV VIP',
        description: 'Nonton drama Asia & anime tanpa iklan',
        iconUrl: '/icons/wetv.png',
      },
    ];
  };

  const categories = [
    { id: 'all', name: 'Semua', icon: <Tv className="h-4 w-4" /> },
    { id: 'video', name: 'Video Streaming', icon: <Play className="h-4 w-4" /> },
    { id: 'music', name: 'Music Streaming', icon: <Music className="h-4 w-4" /> },
    { id: 'sports', name: 'Sports & Live', icon: <Film className="h-4 w-4" /> },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    
    // Category filtering logic
    if (selectedCategory === 'music') {
      return matchesSearch && (product.slug.includes('spotify') || product.slug.includes('youtube'));
    }
    if (selectedCategory === 'sports') {
      return matchesSearch && product.slug.includes('vidio');
    }
    if (selectedCategory === 'video') {
      return matchesSearch && !product.slug.includes('spotify');
    }
    
    return matchesSearch;
  });

  const getIcon = (slug: string) => {
    // Return emoji/icon based on service
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

  const getGradient = (slug: string) => {
    const gradients: Record<string, string> = {
      'netflix': 'from-red-500 to-red-700',
      'spotify': 'from-green-500 to-green-700',
      'youtube': 'from-red-500 to-pink-600',
      'disney': 'from-blue-600 to-purple-600',
      'vidio': 'from-purple-600 to-pink-600',
      'wetv': 'from-orange-500 to-red-600',
    };
    
    for (const [key, gradient] of Object.entries(gradients)) {
      if (slug.includes(key)) return gradient;
    }
    return 'from-gray-600 to-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading streaming services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">Streaming Services</h1>
          <p className="text-lg opacity-90">
            Berlangganan layanan streaming favorit dengan harga terbaik
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Cari layanan streaming..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap ${
                  selectedCategory === cat.id 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : ''
                }`}
              >
                {cat.icon}
                <span className="ml-2">{cat.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/topup/streaming/${product.slug}`}>
              <Card className="hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer h-full">
                <div className={`h-32 bg-gradient-to-br ${getGradient(product.slug)} flex items-center justify-center text-white relative overflow-hidden`}>
                  <div className="text-6xl z-10">{getIcon(product.slug)}</div>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        4.9
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Instant
                      </span>
                    </div>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Pilih Paket
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Tidak ada layanan streaming yang ditemukan</p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4"
            >
              Reset Filter
            </Button>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-slate-800 py-12 mt-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Kenapa Beli di TopUpKilat?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold mb-2">Harga Termurah</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Dapatkan harga terbaik untuk semua layanan streaming
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-2">Proses Instant</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Aktivasi langganan dalam hitungan menit
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="font-semibold mb-2">100% Aman</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pembayaran aman dengan berbagai metode
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
