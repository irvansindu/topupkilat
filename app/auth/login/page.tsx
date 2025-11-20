'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Lock, ArrowLeft, LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (response?.error) {
        alert(response.error || "Gagal login. Periksa email dan password.");
        setLoading(false);
        return;
      }

      router.push("/");
    } catch (err) {
      console.error("NextAuth login error", err);
      alert("Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center px-4">
      <div className="absolute top-4 left-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-slate-200">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kembali
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-md bg-slate-900/80 border-slate-800 text-slate-100 shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Masuk ke TopUpKilat</CardTitle>
          <p className="text-sm text-slate-400">
            Kelola pesanan dan riwayat transaksi Anda dengan mudah.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="rounded border-slate-600 bg-slate-900" />
                <label htmlFor="remember">Ingat saya</label>
              </div>
              <button
                type="button"
                className="text-blue-400 hover:underline"
                onClick={() => alert('Fitur lupa password belum diimplementasikan.')}
              >
                Lupa password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Memproses...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Masuk
                </>
              )}
            </Button>

            <p className="text-center text-xs text-slate-400 mt-4">
              Belum punya akun?{' '}
              <Link href="/auth/register" className="text-blue-400 hover:underline">
                Daftar sekarang
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
