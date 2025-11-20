'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, ShoppingCart, Shield, Clock, Star, CheckCircle } from 'lucide-react';

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

export default function PulsaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productSlug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedDenom, setSelectedDenom] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Get phone number from URL params
    const phone = searchParams.get('phone');
    if (phone) {
      setPhoneNumber(phone);

      // Inline validation logic to avoid extra dependencies
      const cleanPhone = phone.replace(/\D/g, '');
      const isPLN = productSlug.includes('pln');

      if (isPLN) {
        setIsValid(cleanPhone.length >= 11 && cleanPhone.length <= 12);
      } else {
        setIsValid(cleanPhone.length >= 10 && cleanPhone.length <= 13);
      }
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productSlug}`);
        if (!response.ok) {
          // Use mock data as fallback
          setProduct(getMockProduct(productSlug));
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(getMockProduct(productSlug));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug, searchParams]);

  const getMockProduct = (slug: string): Product => {
    const isPulsa = slug.includes('pulsa');
    const isPLN = slug.includes('pln');
    
    if (isPLN) {
      return {
        id: '1',
        slug: 'pln-token',
        name: 'Token Listrik PLN',
        description: 'Beli token listrik PLN prabayar instant',
        instruction: 'Masukkan nomor meter/ID pelanggan PLN (11-12 digit)',
        iconUrl: '/icons/pln.png',
        denominations: [
          { id: '1', label: 'Token 20.000', amountNumeric: 20000, priceSell: 22500, isPopular: false },
          { id: '2', label: 'Token 50.000', amountNumeric: 50000, priceSell: 52500, isPopular: true },
          { id: '3', label: 'Token 100.000', amountNumeric: 100000, priceSell: 102500, isPopular: true },
          { id: '4', label: 'Token 200.000', amountNumeric: 200000, priceSell: 202500, isPopular: false },
          { id: '5', label: 'Token 500.000', amountNumeric: 500000, priceSell: 502500, isPopular: false },
          { id: '6', label: 'Token 1.000.000', amountNumeric: 1000000, priceSell: 1002500, isPopular: false },
        ],
      };
    }
    
    const operator = slug.split('-').pop() || 'xl';
    const operatorName = operator.charAt(0).toUpperCase() + operator.slice(1);
    
    if (isPulsa) {
      return {
        id: '1',
        slug,
        name: `Pulsa ${operatorName}`,
        description: `Isi pulsa ${operatorName} instant 24 jam`,
        instruction: 'Masukkan nomor HP yang akan diisi pulsa (10-13 digit)',
        iconUrl: `/icons/${operator}.png`,
        denominations: [
          { id: '1', label: 'Pulsa 5.000', amountNumeric: 5000, priceSell: 6105, isPopular: false },
          { id: '2', label: 'Pulsa 10.000', amountNumeric: 10000, priceSell: 10982, isPopular: false },
          { id: '3', label: 'Pulsa 15.000', amountNumeric: 15000, priceSell: 15156, isPopular: false },
          { id: '4', label: 'Pulsa 20.000', amountNumeric: 20000, priceSell: 20850, isPopular: false },
          { id: '5', label: 'Pulsa 25.000', amountNumeric: 25000, priceSell: 25850, isPopular: true },
          { id: '6', label: 'Pulsa 50.000', amountNumeric: 50000, priceSell: 50850, isPopular: true },
          { id: '7', label: 'Pulsa 100.000', amountNumeric: 100000, priceSell: 99850, isPopular: true },
        ],
      };
    } else {
      return {
        id: '1',
        slug,
        name: `Paket Data ${operatorName}`,
        description: `Paket internet ${operatorName} dengan kuota besar`,
        instruction: 'Masukkan nomor HP untuk paket data',
        iconUrl: `/icons/${operator}.png`,
        denominations: [
          { id: '1', label: 'Data 1GB 30 Hari', amountNumeric: 1, priceSell: 7570, isPopular: false },
          { id: '2', label: 'Data 2GB 30 Hari', amountNumeric: 2, priceSell: 15000, isPopular: true },
          { id: '3', label: 'Data 3GB 30 Hari', amountNumeric: 3, priceSell: 22000, isPopular: false },
          { id: '4', label: 'Data 5GB 30 Hari', amountNumeric: 5, priceSell: 35000, isPopular: true },
          { id: '5', label: 'Data 10GB 30 Hari', amountNumeric: 10, priceSell: 65000, isPopular: false },
        ],
      };
    }
  };

  const validatePhoneNumber = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const isPLN = productSlug.includes('pln');
    
    if (isPLN) {
      // PLN meter number validation (11-12 digits)
      setIsValid(cleanPhone.length >= 11 && cleanPhone.length <= 12);
    } else {
      // Phone number validation (10-13 digits)
      setIsValid(cleanPhone.length >= 10 && cleanPhone.length <= 13);
    }
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    validatePhoneNumber(value);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    if (!phoneNumber || !selectedDenom || !isValid) {
      alert('Silakan lengkapi nomor dan pilih nominal');
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
      phone: phoneNumber,
      type: productSlug.includes('pln') ? 'pln' : productSlug.includes('pulsa') ? 'pulsa' : 'data',
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
          <h1 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h1>
          <Link href="/topup/pulsa">
            <Button>Kembali ke Katalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPLN = productSlug.includes('pln');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/topup/pulsa">
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
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <h2 className="ml-3 text-lg font-semibold">
                    {isPLN ? 'Nomor Meter PLN' : 'Nomor HP'}
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      {isPLN ? 'ID Pelanggan / Nomor Meter' : 'Nomor HP'}
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder={isPLN ? '12345678901' : '08123456789'}
                      className="w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {phoneNumber && (
                    <div className={`p-3 rounded-lg border ${
                      isValid 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <p className={`text-sm ${
                        isValid ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {isValid ? (
                          <>
                            <CheckCircle className="inline h-4 w-4 mr-1" />
                            {isPLN ? 'Nomor meter valid' : 'Nomor HP valid'}
                          </>
                        ) : (
                          <>❌ {product.instruction}</>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Select Amount */}
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
                      className={`p-4 rounded-lg border-2 transition-all text-center ${
                        selectedDenom === denom.id
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
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
                      <span className="text-gray-600">Nominal</span>
                      <span className="font-medium">
                        {product.denominations.find(d => d.id === selectedDenom)?.label}
                      </span>
                    </div>
                  )}
                  
                  {phoneNumber && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {isPLN ? 'Nomor Meter' : 'Nomor HP'}
                      </span>
                      <span className="font-medium">{phoneNumber}</span>
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
                    Proses 1-5 Detik
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
