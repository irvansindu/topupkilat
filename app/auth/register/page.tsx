"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Lock, UserPlus, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Password dan konfirmasi password tidak sama");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const json = (await res.json()) as { error?: string; success?: boolean };

      if (!res.ok || !json.success) {
        alert(json.error || "Gagal registrasi.");
        setLoading(false);
        return;
      }

      alert("Registrasi berhasil. Silakan login.");

      router.push("/auth/login");
    } catch (err) {
      console.error("Register error", err);
      alert("Terjadi kesalahan saat registrasi.");
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
          <CardTitle className="text-2xl font-bold">Daftar Akun Baru</CardTitle>
          <p className="text-sm text-slate-400">
            Buat akun untuk menyimpan riwayat pesanan dan memudahkan checkout.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              <div>
                <label className="block text-sm font-medium mb-1">Konfirmasi Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
                  <UserPlus className="h-4 w-4 mr-2" />
                  Daftar
                </>
              )}
            </Button>

            <p className="text-center text-xs text-slate-400 mt-4">
              Sudah punya akun?{' '}
              <Link href="/auth/login" className="text-blue-400 hover:underline">
                Masuk di sini
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
