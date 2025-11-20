"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Email atau password salah.",
  AccessDenied: "Akses ditolak. Pastikan akun Anda memiliki izin yang benar.",
  Configuration: "Konfigurasi NextAuth belum benar (cek AUTH_SECRET, URL, atau provider).",
  Default: "Terjadi kesalahan saat memproses permintaan Anda.",
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorKey = searchParams.get("error") ?? "Default";
  const message = ERROR_MESSAGES[errorKey] || ERROR_MESSAGES.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 text-slate-100">
      <Card className="w-full max-w-md bg-slate-900/80 border-slate-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Login Gagal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-slate-300">{message}</p>
          <p className="text-[10px] text-slate-500 mt-2">Kode error: {errorKey}</p>
          <div className="flex flex-col gap-2 mt-3">
            <Button onClick={() => router.push("/auth/login")}>Kembali ke Halaman Login</Button>
            <Button variant="outline" asChild>
              <Link href="/">Kembali ke Beranda</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 text-slate-100">
          <p>Memuat...</p>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
