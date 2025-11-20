import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TopUpKilat - Top Up Game & E-Wallet Tercepat",
  description: "Top up game favorit dan e-wallet dalam hitungan menit. Bayar via QRIS, e-wallet, atau transfer bank. Harga transparan, proses otomatis!",
  keywords: "top up game, top up ml, top up ff, top up pubg, top up genshin, e-wallet, shopeepay, dana, ovo, gopay",
  authors: [{ name: "TopUpKilat" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://topupkilat.example",
    title: "TopUpKilat - Top Up Game & E-Wallet Tercepat",
    description: "Top up game favorit dan e-wallet dalam hitungan menit",
    siteName: "TopUpKilat",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <div className="relative min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
