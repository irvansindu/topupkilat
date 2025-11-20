'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, RefreshCw, AlertTriangle, User, Shield } from 'lucide-react';

interface ProviderProfile {
  full_name: string;
  username: string;
  balance: number;
  point: number;
  level: string;
  registered: string;
}

interface ApiResponse {
  provider: string;
  result: boolean;
  message: string;
  profile: ProviderProfile | null;
}

export default function ProviderAdminPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/provider/profile');
      const json = (await res.json()) as ApiResponse;
      if (!res.ok || !json.result) {
        setError(json.message || 'Gagal mengambil profile provider');
      }
      setData(json);
    } catch (err) {
      console.error('Error loading provider profile', err);
      setError('Terjadi kesalahan saat memuat data provider');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Monitoring Provider</h1>
            <p className="text-xs text-slate-400">Status akun VIP-Reseller untuk TopUpKilat</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-slate-600 text-slate-100"
            onClick={fetchProfile}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {error && (
          <Card className="border-red-500/60 bg-red-950/40">
            <CardContent className="flex items-start gap-3 p-4">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-200">Terjadi kesalahan</p>
                <p className="text-xs text-red-200/80">{error}</p>
                <p className="text-xs text-red-200/60 mt-2">
                  Pastikan IP server sudah di-whitelist di VIP-Reseller dan API KEY / ID benar.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Saldo */}
          <Card className="bg-slate-900/80 border-slate-800 col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo VIP-Reseller</CardTitle>
              <Wallet className="h-5 w-5 text-emerald-400" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 w-32 bg-slate-800 animate-pulse rounded" />
              ) : (
                <p className="text-2xl font-bold text-emerald-400">
                  {data?.profile ? formatCurrency(data.profile.balance) : '-'}
                </p>
              )}
              <p className="text-xs text-slate-400 mt-2">
                Gunakan saldo ini untuk memproses semua pesanan topup di TopUpKilat.
              </p>
            </CardContent>
          </Card>

          {/* Info Akun */}
          <Card className="bg-slate-900/80 border-slate-800 col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Info Akun</CardTitle>
              <User className="h-5 w-5 text-sky-400" />
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Nama</span>
                <span className="font-medium">
                  {data?.profile?.full_name || '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Username</span>
                <span className="font-mono text-xs">
                  {data?.profile?.username || '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Level</span>
                <span className="font-medium">
                  {data?.profile?.level || '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Poin</span>
                <span className="font-medium">
                  {data?.profile?.point ?? '-'}
                </span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-slate-800 mt-2">
                <span className="text-slate-500">Terdaftar sejak</span>
                <span className="text-slate-300">
                  {data?.profile?.registered || '-'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Status Integrasi */}
          <Card className="bg-slate-900/80 border-slate-800 col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status Integrasi</CardTitle>
              <Shield className="h-5 w-5 text-violet-400" />
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-slate-300">
              <p>
                Provider: <span className="font-semibold">VIP-Reseller</span>
              </p>
              <p>
                Hasil terakhir: {data?.result ? (
                  <span className="text-emerald-400 font-semibold">OK</span>
                ) : (
                  <span className="text-red-400 font-semibold">GAGAL</span>
                )}
              </p>
              <p className="text-slate-400">
                Pesan: <span className="text-slate-200">{data?.message || '-'}</span>
              </p>
              <p className="text-slate-500 mt-2">
                Tips: Pastikan IP server sudah di-whitelist di dashboard VIP-Reseller dan API key/ID
                disalin dengan benar ke file <code>.env</code>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
