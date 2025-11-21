'use client';

import Link from 'next/link';
import { useSearchParams, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface OrderStatusResponse {
  order?: {
    code: string;
    status: string;
    contactEmail: string;
    total: number;
  };
  error?: string;
}

export default function OrderSuccessPage() {
  const params = useParams<{ code: string }>();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderStatusResponse['order'] | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const email = searchParams.get('email');
        if (!email) {
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/orders?code=${encodeURIComponent(params.code)}&email=${encodeURIComponent(email)}`);
        const data: OrderStatusResponse = await res.json();

        if (!res.ok || data.error) {
          setError(data.error || 'Gagal mengambil data pesanan');
        } else {
          setOrder(data.order ?? null);
        }
      } catch {
        setError('Terjadi kesalahan saat mengambil data pesanan');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.code, searchParams]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <Card className="max-w-lg w-full bg-slate-900 border-slate-800">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-emerald-400" />
          </div>
          <CardTitle className="text-2xl mb-1">Pembayaran Berhasil</CardTitle>
          <p className="text-sm text-slate-400">
            Terima kasih, pesanan kamu sedang diproses. Detail akan dikirim ke email yang kamu gunakan saat checkout.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && (
            <p className="text-sm text-slate-400 text-center">Mengambil data pesanan...</p>
          )}

          {error && !loading && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          {order && !loading && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Kode Pesanan</span>
                <span className="font-mono font-semibold">{order.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="font-semibold">{order.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total</span>
                <span className="font-semibold">Rp {order.total.toLocaleString('id-ID')}</span>
              </div>
            </div>
          )}

          <div className="pt-4 space-y-3">
            <Link href={`/order/lookup?code=${encodeURIComponent(params.code)}`}>
              <Button className="w-full">Lihat Status Pesanan</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full border-slate-700 text-slate-100">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
