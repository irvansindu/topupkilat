'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search, Package, Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

interface OrderDetail {
  code: string;
  status: string;
  createdAt: string;
  total: number;
  product?: { name: string };
  denomination?: { label: string };
  paidAt?: string;
  successAt?: string;
  errorMessage?: string;
}

export default function OrderLookupPage() {
  const [orderCode, setOrderCode] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/orders?code=${orderCode}&email=${email}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Order tidak ditemukan');
      }

      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'WAITING_PAYMENT':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'PAID':
      case 'PROCESSING':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'SUCCESS':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'FAILED':
      case 'EXPIRED':
      case 'REFUNDED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'PENDING': 'Menunggu Pembayaran',
      'WAITING_PAYMENT': 'Menunggu Pembayaran',
      'PAID': 'Pembayaran Diterima',
      'PROCESSING': 'Sedang Diproses',
      'SUCCESS': 'Berhasil',
      'FAILED': 'Gagal',
      'EXPIRED': 'Kadaluarsa',
      'REFUNDED': 'Dikembalikan',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'WAITING_PAYMENT':
        return 'text-yellow-600 bg-yellow-50';
      case 'PAID':
      case 'PROCESSING':
        return 'text-blue-600 bg-blue-50';
      case 'SUCCESS':
        return 'text-green-600 bg-green-50';
      case 'FAILED':
      case 'EXPIRED':
      case 'REFUNDED':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-950 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Lacak Pesanan</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Helper Info */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Cara Melacak Pesanan
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Masukkan <strong>Kode Pesanan</strong> yang kamu terima (format: TKL2xxxxx)</li>
              <li>• Masukkan <strong>Email</strong> yang kamu gunakan saat checkout</li>
              <li>• Klik tombol &quot;Cari Pesanan&quot; untuk melihat status real-time</li>
            </ul>
          </div>

          {/* Lookup Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Cek Status Pesanan</CardTitle>
              <CardDescription>
                Pantau status transaksi kamu secara real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLookup} className="space-y-4">
                <div>
                  <label htmlFor="orderCode" className="block text-sm font-medium mb-2">
                    Kode Pesanan
                  </label>
                  <input
                    id="orderCode"
                    type="text"
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: TKL2ABC123"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Mencari...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Cari Pesanan
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Details */}
          {order && (
            <Card className="mt-6">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <CardTitle>Detail Pesanan</CardTitle>
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(order.status)} border-2 ${order.status === 'SUCCESS' ? 'border-green-200' : order.status === 'FAILED' || order.status === 'EXPIRED' ? 'border-red-200' : order.status === 'WAITING_PAYMENT' ? 'border-yellow-200' : 'border-blue-200'}`}>
                    {getStatusIcon(order.status)}
                    {getStatusText(order.status)}
                  </div>
                </div>
                <CardDescription className="mt-2">
                  Kode: <span className="font-mono font-semibold text-gray-900 dark:text-white">{order.code}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Kode Pesanan</p>
                    <p className="font-semibold">{order.code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Order</p>
                    <p className="font-semibold">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2">Produk</p>
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      📦
                    </div>
                    <div>
                      <p className="font-semibold">{order.product?.name}</p>
                      <p className="text-sm text-gray-600">{order.denomination?.label}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">Total Pembayaran</p>
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>

                {order.status === 'SUCCESS' && (
                  <div className="border-t pt-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-green-800 font-medium mb-1">
                        ✅ Transaksi Berhasil!
                      </p>
                      <p className="text-sm text-green-600">
                        Top up telah berhasil diproses dan dikirim ke akun tujuan.
                      </p>
                      {order.successAt && (
                        <p className="text-xs text-green-600 mt-2">
                          Selesai pada: {formatDate(order.successAt)}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {order.status === 'WAITING_PAYMENT' && (
                  <div className="border-t pt-4">
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <p className="text-yellow-800 font-medium mb-1">
                        ⏳ Menunggu Pembayaran
                      </p>
                      <p className="text-sm text-yellow-600">
                        Silakan selesaikan pembayaran sebelum pesanan kadaluarsa.
                      </p>
                    </div>
                  </div>
                )}

                {order.status === 'FAILED' && order.errorMessage && (
                  <div className="border-t pt-4">
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-red-800 font-medium mb-1">
                        ❌ Transaksi Gagal
                      </p>
                      <p className="text-sm text-red-600">
                        {order.errorMessage}
                      </p>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-4">Status Timeline</p>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="h-2 w-2 bg-green-500 rounded-full" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Order Dibuat</p>
                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    
                    {order.paidAt && (
                      <div className="flex items-start space-x-3">
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                          <div className="h-2 w-2 bg-green-500 rounded-full" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Pembayaran Diterima</p>
                          <p className="text-xs text-gray-500">{formatDate(order.paidAt)}</p>
                        </div>
                      </div>
                    )}
                    
                    {order.successAt && (
                      <div className="flex items-start space-x-3">
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                          <div className="h-2 w-2 bg-green-500 rounded-full" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Top Up Berhasil</p>
                          <p className="text-xs text-gray-500">{formatDate(order.successAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
