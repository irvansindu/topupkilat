'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Zap, CreditCard, Signal, ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  iconUrl?: string;
  providerKey?: string;
  _count?: {
    denominations: number;
  };
}

const operatorColors: Record<string, string> = {
  'telkomsel': 'from-red-500 to-red-700',
  'indosat': 'from-yellow-500 to-yellow-700',
  'xl': 'from-blue-500 to-blue-700',
  'axis': 'from-purple-500 to-purple-700',
  'three': 'from-orange-500 to-orange-700',
  'smartfren': 'from-pink-500 to-pink-700',
  'by.u': 'from-green-500 to-green-700',
  'pln': 'from-yellow-600 to-orange-600',
};

const operatorIcons: Record<string, string> = {
  'telkomsel': '📱',
  'indosat': '📲',
  'xl': '📞',
  'axis': '📡',
  'three': '☎️',
  'smartfren': '📶',
  'by.u': '💬',
  'pln': '⚡',
};

export default function PulsaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [detectedOperator, setDetectedOperator] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'pulsa' | 'data' | 'pln'>('pulsa');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      const type = selectedCategory === 'pln' ? 'PULSA' : selectedCategory.toUpperCase();
      const response = await fetch(`/api/products?type=${type}`);
      
      if (response.ok) {
        const data = await response.json();
        // Filter PLN products if needed
        if (selectedCategory === 'pln') {
          setProducts(data.filter((p: Product) => p.slug.includes('pln')));
        } else {
          setProducts(data.filter((p: Product) => !p.slug.includes('pln')));
        }
      } else {
        // Use mock data
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
    if (selectedCategory === 'pulsa') {
      return [
        {
          id: '1',
          slug: 'pulsa-telkomsel',
          name: 'Pulsa Telkomsel',
          description: 'Isi pulsa Telkomsel 24 jam',
          providerKey: 'telkomsel',
        },
        {
          id: '2',
          slug: 'pulsa-indosat',
          name: 'Pulsa Indosat',
          description: 'Isi pulsa Indosat instant',
          providerKey: 'indosat',
        },
        {
          id: '3',
          slug: 'pulsa-xl',
          name: 'Pulsa XL',
          description: 'Top up pulsa XL cepat',
          providerKey: 'xl',
        },
        {
          id: '4',
          slug: 'pulsa-axis',
          name: 'Pulsa Axis',
          description: 'Isi pulsa Axis murah',
          providerKey: 'axis',
        },
        {
          id: '5',
          slug: 'pulsa-three',
          name: 'Pulsa Three',
          description: 'Top up pulsa Tri instant',
          providerKey: 'three',
        },
        {
          id: '6',
          slug: 'pulsa-smartfren',
          name: 'Pulsa Smartfren',
          description: 'Isi pulsa Smartfren 24/7',
          providerKey: 'smartfren',
        },
      ];
    } else if (selectedCategory === 'data') {
      return [
        {
          id: '1',
          slug: 'data-telkomsel',
          name: 'Paket Data Telkomsel',
          description: 'Kuota internet Telkomsel',
          providerKey: 'telkomsel',
        },
        {
          id: '2',
          slug: 'data-xl',
          name: 'Paket Data XL',
          description: 'Paket internet XL Axiata',
          providerKey: 'xl',
        },
      ];
    } else {
      return [
        {
          id: '1',
          slug: 'pln-token',
          name: 'Token Listrik PLN',
          description: 'Beli token listrik prabayar',
          providerKey: 'pln',
        },
      ];
    }
  };

  const detectOperator = (number: string) => {
    // Remove non-numeric characters
    const cleanNumber = number.replace(/\D/g, '');
    
    // Remove country code if present
    const localNumber = cleanNumber.replace(/^(62|0)/, '');
    
    // Check operator prefixes
    const prefixMap: Record<string, string[]> = {
      'telkomsel': ['811', '812', '813', '821', '822', '823', '851', '852', '853'],
      'indosat': ['814', '815', '816', '855', '856', '857', '858'],
      'xl': ['817', '818', '819', '859', '877', '878'],
      'axis': ['831', '832', '833', '838'],
      'three': ['895', '896', '897', '898', '899'],
      'smartfren': ['881', '882', '883', '884', '885', '886', '887', '888', '889'],
    };
    
    const prefix = localNumber.substring(0, 3);
    
    for (const [operator, prefixes] of Object.entries(prefixMap)) {
      if (prefixes.includes(prefix)) {
        setDetectedOperator(operator);
        return operator;
      }
    }
    
    setDetectedOperator('');
    return '';
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    if (value.length >= 10) {
      detectOperator(value);
    } else {
      setDetectedOperator('');
    }
  };

  const getOperatorColor = (slug: string) => {
    const key = Object.keys(operatorColors).find(k => slug.includes(k));
    return key ? operatorColors[key] : 'from-gray-500 to-gray-700';
  };

  const getOperatorIcon = (slug: string) => {
    const key = Object.keys(operatorIcons).find(k => slug.includes(k));
    return key ? operatorIcons[key] : '📱';
  };

  const categories = [
    { id: 'pulsa', name: 'Pulsa', icon: <Phone className="h-4 w-4" />, count: products.filter(p => p.slug.includes('pulsa')).length },
    { id: 'data', name: 'Paket Data', icon: <Signal className="h-4 w-4" />, count: products.filter(p => p.slug.includes('data')).length },
    { id: 'pln', name: 'Token PLN', icon: <Zap className="h-4 w-4" />, count: products.filter(p => p.slug.includes('pln')).length },
  ];

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">Pulsa & Paket Data</h1>
          <p className="text-lg opacity-90">
            Isi pulsa dan beli paket data dengan harga termurah
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Phone Number Input */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  Nomor HP
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="tel"
                    placeholder="08123456789"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                </div>
                {detectedOperator && (
                  <p className="mt-2 text-sm text-green-600">
                    ✅ Operator terdeteksi: <strong className="capitalize">{detectedOperator}</strong>
                  </p>
                )}
              </div>
              
              {detectedOperator && (
                <div className="flex items-end">
                  <Link href={`/topup/pulsa/${selectedCategory}-${detectedOperator}?phone=${phoneNumber}`}>
                    <Button size="lg" className="px-8">
                      Lanjutkan
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {categories.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat.id as 'pulsa' | 'data' | 'pln')}
              className={`whitespace-nowrap ${
                selectedCategory === cat.id 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : ''
              }`}
            >
              {cat.icon}
              <span className="ml-2">{cat.name}</span>
              {cat.count > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded-full">
                  {cat.count}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Operator Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link 
              key={product.id} 
              href={`/topup/pulsa/${product.slug}${phoneNumber ? `?phone=${phoneNumber}` : ''}`}
            >
              <Card className={`hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer h-full ${
                detectedOperator && product.slug.includes(detectedOperator) 
                  ? 'ring-2 ring-blue-500' 
                  : ''
              }`}>
                <div className={`h-24 bg-gradient-to-br ${getOperatorColor(product.slug)} flex items-center justify-center text-white relative overflow-hidden`}>
                  <div className="text-5xl z-10">{getOperatorIcon(product.slug)}</div>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
                  {detectedOperator && product.slug.includes(detectedOperator) && (
                    <div className="absolute top-2 right-2 bg-white text-blue-600 text-xs px-2 py-1 rounded-full font-semibold">
                      Terdeteksi
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <CreditCard className="h-3 w-3" />
                      <span>Instant</span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-blue-600">
                      Pilih
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Tidak ada produk {selectedCategory} yang tersedia</p>
          </div>
        )}

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Proses Instant</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pulsa & paket data masuk dalam hitungan detik
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Auto Detect</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Operator terdeteksi otomatis dari nomor HP
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Signal className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">All Operator</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mendukung semua operator di Indonesia
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
