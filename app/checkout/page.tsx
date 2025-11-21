'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Building2, Wallet, QrCode, Copy, CheckCircle } from 'lucide-react';

interface CheckoutData {
  productId?: string;
  denominationId?: string;
  productName?: string;
  denominationLabel?: string;
  amount?: number;
  type?: string;
  userId?: string;
  zoneId?: string;
  nickname?: string;
  email?: string;
  phone?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  fee: number;
  description?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderCode, setOrderCode] = useState('');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'qris',
      name: 'QRIS',
      category: 'Instant Payment',
      icon: <QrCode className="h-5 w-5" />,
      fee: 0,
      description: 'Bayar dengan QRIS dari aplikasi apapun'
    },
    {
      id: 'gopay',
      name: 'GoPay',
      category: 'E-Wallet',
      icon: <Wallet className="h-5 w-5" />,
      fee: 1000,
      description: 'Bayar langsung dari aplikasi Gojek'
    },
    {
      id: 'ovo',
      name: 'OVO',
      category: 'E-Wallet',
      icon: <Wallet className="h-5 w-5" />,
      fee: 1000,
      description: 'Bayar dengan OVO Points atau OVO Cash'
    },
    {
      id: 'dana',
      name: 'DANA',
      category: 'E-Wallet',
      icon: <Wallet className="h-5 w-5" />,
      fee: 1000,
      description: 'Bayar dengan saldo DANA'
    },
    {
      id: 'shopeepay',
      name: 'ShopeePay',
      category: 'E-Wallet',
      icon: <Wallet className="h-5 w-5" />,
      fee: 1000,
      description: 'Bayar dengan ShopeePay'
    },
    {
      id: 'bca',
      name: 'BCA Virtual Account',
      category: 'Bank Transfer',
      icon: <Building2 className="h-5 w-5" />,
      fee: 4000,
      description: 'Transfer via ATM, Mobile, atau Internet Banking'
    },
    {
      id: 'mandiri',
      name: 'Mandiri Virtual Account',
      category: 'Bank Transfer',
      icon: <Building2 className="h-5 w-5" />,
      fee: 4000,
      description: 'Transfer via ATM, Mobile, atau Internet Banking'
    },
    {
      id: 'bni',
      name: 'BNI Virtual Account',
      category: 'Bank Transfer',
      icon: <Building2 className="h-5 w-5" />,
      fee: 4000,
      description: 'Transfer via ATM, Mobile, atau Internet Banking'
    },
  ];

  useEffect(() => {
    // Load checkout data from sessionStorage
    const loadCheckoutData = () => {
      const data = sessionStorage.getItem('checkoutData');
      if (data) {
        const parsed = JSON.parse(data);
        setCheckoutData(parsed);
        setCustomerEmail(parsed.email || '');
        setCustomerPhone(parsed.phone || '');
      } else {
        // No checkout data, redirect to home
        router.push('/');
      }
    };
    
    // Run asynchronously to avoid synchronous setState
    const timer = setTimeout(loadCheckoutData, 0);
    return () => clearTimeout(timer);
  }, [router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateTotal = () => {
    const basePrice = checkoutData?.amount ?? 0;
    const paymentFee = paymentMethods.find(p => p.id === selectedPayment)?.fee || 0;
    return basePrice + paymentFee;
  };

  const handlePayment = async () => {
    if (!selectedPayment || !customerEmail || !agreeTerms) {
      alert('Silakan lengkapi semua data dan pilih metode pembayaran');
      return;
    }

    setProcessing(true);
    
    try {
      if (!checkoutData?.productId || !checkoutData?.denominationId) {
        alert('Data produk tidak lengkap. Silakan ulangi dari halaman produk.');
        setProcessing(false);
        return;
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: checkoutData.productId,
          denominationId: checkoutData.denominationId,
          target: {
            uid: checkoutData.userId,
            zoneId: checkoutData.zoneId,
            phone: checkoutData.phone,
          },
          contactEmail: customerEmail,
          contactWhatsapp: customerPhone || checkoutData.phone || '',
          paymentMethod: selectedPayment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error || 'Gagal membuat pesanan. Silakan coba lagi.';
        alert(message);
        setProcessing(false);
        return;
      }

      const data = await response.json();
      const order = data.order;

      if (!order || !order.paymentUrl) {
        alert('Gagal mendapatkan URL pembayaran. Silakan coba lagi.');
        setProcessing(false);
        return;
      }

      sessionStorage.removeItem('checkoutData');

      window.location.href = order.paymentUrl as string;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.');
      setProcessing(false);
    }
  };

  const copyOrderCode = () => {
    navigator.clipboard.writeText(orderCode);
    alert('Order code copied!');
  };

  // Success state
  if (orderCode) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Pesanan Berhasil!</h2>
            <p className="text-gray-600 mb-6">
              Pesanan Anda telah berhasil dibuat. Silakan lakukan pembayaran.
            </p>
            
            <div className="bg-gray-100 dark:bg-slate-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Kode Pesanan</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xl font-bold">{orderCode}</span>
                <Button size="sm" variant="ghost" onClick={copyOrderCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link href={`/order/lookup?code=${orderCode}`}>
                <Button className="w-full">
                  Lihat Status Pesanan
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!checkoutData) {
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
      <div className="bg-white dark:bg-slate-950 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Methods & Contact */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Bukti pembayaran akan dikirim ke email ini
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Opsional, untuk notifikasi status pesanan
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Instant Payment', 'E-Wallet', 'Bank Transfer'].map(category => (
                    <div key={category}>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">{category}</h3>
                      <div className="grid gap-2">
                        {paymentMethods
                          .filter(p => p.category === category)
                          .map(payment => (
                            <button
                              key={payment.id}
                              onClick={() => setSelectedPayment(payment.id)}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${
                                selectedPayment === payment.id
                                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  {payment.icon}
                                  <div>
                                    <p className="font-medium">{payment.name}</p>
                                    {payment.description && (
                                      <p className="text-xs text-gray-500">{payment.description}</p>
                                    )}
                                  </div>
                                </div>
                                {payment.fee > 0 && (
                                  <span className="text-xs text-gray-500">
                                    +{formatPrice(payment.fee)}
                                  </span>
                                )}
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Terms */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Saya setuju dengan{' '}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Syarat & Ketentuan
                </Link>{' '}
                dan{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Kebijakan Privasi
                </Link>
              </label>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {checkoutData?.productId && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Produk</span>
                      <span className="font-medium">
                        {checkoutData.productName || 'Top Up'}
                      </span>
                    </div>
                  )}

                  {checkoutData?.denominationLabel && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Nominal</span>
                      <span className="font-medium">
                        {checkoutData.denominationLabel}
                      </span>
                    </div>
                  )}

                  {checkoutData?.phone && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {checkoutData.type === 'social' ? 'Target' : 'Nomor'}
                      </span>
                      <span className="font-medium">
                        {checkoutData.phone}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(checkoutData?.amount ?? 0)}</span>
                  </div>
                  
                  {selectedPayment && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Biaya Payment</span>
                      <span>
                        {formatPrice(paymentMethods.find(p => p.id === selectedPayment)?.fee || 0)}
                      </span>
                    </div>
                  )}
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-xl text-blue-600">
                        {formatPrice(calculateTotal())}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  size="lg"
                  onClick={handlePayment}
                  disabled={!selectedPayment || !customerEmail || !agreeTerms || processing}
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Bayar Sekarang
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-center text-gray-500 mt-4">
                  Pembayaran diproses secara aman dan terenkripsi
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
